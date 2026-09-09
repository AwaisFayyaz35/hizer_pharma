/**
 * GET /sitemap.xml  (Vercel rewrites /sitemap.xml -> /api/sitemap)
 *
 * Serves a live XML sitemap generated from the production database:
 *   - homepage, shop listing, about
 *   - every ACTIVE product at /product/<id>
 *
 * Product URLs are read from MongoDB via the existing backend model/connection
 * helper — nothing is hardcoded. Same import style as api/index.mjs.
 *
 * The whole DB step is bounded by DB_BUDGET_MS: if the database is slow or cold
 * we still return a valid sitemap (static routes) quickly, so Google's sitemap
 * fetcher never times out. The CDN then caches the full result (s-maxage).
 */
import { connectDB } from "../Hi-Zer-Pharma-Nutraceutical backend/src/config/db.js";
import Product from "../Hi-Zer-Pharma-Nutraceutical backend/src/models/Product.js";

const FALLBACK_ORIGIN = "https://www.hi-zerpharmaceutical.com";
const DB_BUDGET_MS = 7000;

function resolveOrigin(req) {
  const fromEnv = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  return host ? `${proto}://${host}` : FALLBACK_ORIGIN;
}

function xmlEscape(value) {
  return String(value).replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c],
  );
}

function renderUrlset(urls) {
  const items = urls
    .map((u) => {
      let s = "  <url>\n";
      s += `    <loc>${xmlEscape(u.loc)}</loc>\n`;
      if (u.lastmod) s += `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n`;
      if (u.changefreq) s += `    <changefreq>${u.changefreq}</changefreq>\n`;
      if (u.priority) s += `    <priority>${u.priority}</priority>\n`;
      s += "  </url>";
      return s;
    })
    .join("\n");
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    items +
    "\n</urlset>\n"
  );
}

async function getProductUrls(origin) {
  await connectDB();
  const products = await Product.find({ isActive: true })
    .select("_id updatedAt")
    .sort({ updatedAt: -1 })
    .maxTimeMS(DB_BUDGET_MS)
    .lean();
  return products.map((p) => ({
    loc: `${origin}/product/${p._id}`,
    lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
    changefreq: "weekly",
    priority: "0.8",
  }));
}

export default async function handler(req, res) {
  const origin = resolveOrigin(req);
  const staticUrls = [
    { loc: `${origin}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${origin}/shop`, changefreq: "daily", priority: "0.9" },
    { loc: `${origin}/about`, changefreq: "monthly", priority: "0.5" },
  ];

  let productUrls = [];
  let complete = true;
  try {
    productUrls = await Promise.race([
      getProductUrls(origin),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`db budget ${DB_BUDGET_MS}ms exceeded`)),
          DB_BUDGET_MS,
        ),
      ),
    ]);
  } catch (err) {
    // Fail soft: still return valid XML (never HTML / a 500 page) so Search
    // Console does not reject the sitemap.
    complete = false;
    console.error("[sitemap] product lookup skipped:", err.message);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  // Cache the full result for an hour at the CDN; if we had to fall back to the
  // static routes, cache only briefly so the full list is picked up soon.
  res.setHeader(
    "Cache-Control",
    complete
      ? "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
      : "public, max-age=0, s-maxage=60",
  );
  res.end(renderUrlset([...staticUrls, ...productUrls]));
}

/**
 * GET /sitemap.xml  (Vercel rewrites /sitemap.xml -> /api/sitemap)
 *
 * Serves a live XML sitemap generated from the production database:
 *   - homepage, shop listing, about
 *   - every ACTIVE product at /product/<id>
 *
 * Product URLs are read from MongoDB via the existing backend model/connection
 * helper — nothing is hardcoded. Same import style as api/index.mjs.
 */
import { connectDB } from "../Hi-Zer-Pharma-Nutraceutical backend/src/config/db.js";
import Product from "../Hi-Zer-Pharma-Nutraceutical backend/src/models/Product.js";

const FALLBACK_ORIGIN = "https://www.hi-zerpharmaceutical.com";

function resolveOrigin(req) {
  const fromEnv = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  return host ? `${proto}://${host}` : FALLBACK_ORIGIN;
}

function xmlEscape(value) {
  return String(value).replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
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

export default async function handler(req, res) {
  const origin = resolveOrigin(req);
  const staticUrls = [
    { loc: `${origin}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${origin}/shop`, changefreq: "daily", priority: "0.9" },
    { loc: `${origin}/about`, changefreq: "monthly", priority: "0.5" },
  ];

  try {
    await connectDB();
    const products = await Product.find({ isActive: true })
      .select("_id updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const productUrls = products.map((p) => ({
      loc: `${origin}/product/${p._id}`,
      lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
      changefreq: "weekly",
      priority: "0.8",
    }));

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.end(renderUrlset([...staticUrls, ...productUrls]));
  } catch (err) {
    // Fail soft: still return valid XML (never HTML / a 500 page) so Search
    // Console does not reject the sitemap.
    console.error("[sitemap] generation failed:", err);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.end(renderUrlset(staticUrls));
  }
}

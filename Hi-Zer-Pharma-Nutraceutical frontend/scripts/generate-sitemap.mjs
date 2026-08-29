/**
 * Generates public/sitemap.xml from the LIVE product database.
 *
 * Runs automatically before every `npm run build` (see package.json).
 * Product URLs are never hardcoded — they are pulled from the same
 * `/api/products` endpoint the storefront uses.
 *
 * Config (all optional, via environment variables):
 *   VITE_SITE_URL        Public production origin used for every <loc>.
 *                        Default: https://www.hi-zerpharmaceutical.com
 *   SITEMAP_API_BASE     Backend origin to read products from at build time.
 *                        Falls back to VITE_API_BASE_URL, then http://localhost:5000
 *
 * If the API cannot be reached the build still succeeds: a sitemap with just
 * the static public routes is written and a warning is printed.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_FILE = resolve(__dirname, "../public/sitemap.xml");

const SITE_URL = (process.env.VITE_SITE_URL || "https://www.hi-zerpharmaceutical.com").replace(/\/+$/, "");
const API_BASE = (
  process.env.SITEMAP_API_BASE ||
  process.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/+$/, "");

const STATIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/shop", priority: "0.9", changefreq: "daily" },
  { path: "/about", priority: "0.5", changefreq: "monthly" },
];

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}

async function fetchAllProducts() {
  const all = [];
  let page = 1;
  let pages = 1;
  do {
    const url = `${API_BASE}/api/products?limit=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
    const body = await res.json();
    const data = body?.data ?? {};
    for (const p of data.items ?? []) all.push(p);
    pages = data.pages ?? 1;
    page += 1;
  } while (page <= pages);
  return all;
}

function buildXml(urls) {
  const body = urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${xmlEscape(u.loc)}</loc>\n` +
        (u.lastmod ? `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n` : "") +
        (u.changefreq ? `    <changefreq>${u.changefreq}</changefreq>\n` : "") +
        (u.priority ? `    <priority>${u.priority}</priority>\n` : "") +
        `  </url>`
    )
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${body}\n` +
    `</urlset>\n`
  );
}

async function main() {
  const urls = STATIC_ROUTES.map((r) => ({
    loc: `${SITE_URL}${r.path}`,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  let productCount = 0;
  try {
    const products = await fetchAllProducts();
    for (const p of products) {
      const id = p._id || p.id;
      if (!id) continue;
      urls.push({
        loc: `${SITE_URL}/product/${id}`,
        lastmod: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
        changefreq: "weekly",
        priority: "0.8",
      });
      productCount += 1;
    }
    console.log(`[sitemap] ${productCount} product URL(s) from ${API_BASE}/api/products`);
  } catch (err) {
    console.warn(
      `[sitemap] WARNING: could not read products from ${API_BASE} (${err.message}).\n` +
      `[sitemap] Writing a sitemap with static routes only. Set SITEMAP_API_BASE / VITE_API_BASE_URL ` +
      `to your backend origin so product pages are included.`
    );
  }

  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, buildXml(urls), "utf8");
  console.log(`[sitemap] wrote ${OUT_FILE} (${urls.length} URL(s), site ${SITE_URL})`);
}

main().catch((err) => {
  console.error("[sitemap] failed:", err);
  process.exit(1);
});

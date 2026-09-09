/**
 * GET /product/:id   (Vercel rewrites /product/:id -> /api/product-page?id=:id)
 *
 * Server-renders real SEO tags into the SPA's index.html shell BEFORE any
 * JavaScript runs, so Googlebot sees — on its first, non-rendered pass — a
 * correct <title>, meta description, a SELF-referencing <link rel="canonical">,
 * Open Graph tags and Product JSON-LD.
 *
 * Why this exists: the static shell (frontend/index.html) hard-codes
 *   <link rel="canonical" href="https://www.hi-zerpharmaceutical.com/">
 * so without this function every product URL inherits the homepage canonical
 * and Google folds it into the homepage instead of indexing it. seo.ts only
 * fixes the tags in the browser, which is too late / unreliable for indexing.
 *
 * The React app still boots and takes over exactly as before — this only
 * rewrites the contents of <head>. New products are picked up automatically:
 * nothing here is hardcoded and there is no build step.
 *
 * Fail-soft: missing/malformed id or a confirmed-missing product -> 404 + the
 * untouched shell; a slow/unavailable DB -> 200 + untouched shell (never a
 * wrong canonical); no shell at all -> 503 so the crawler retries.
 */
import fs from "node:fs";
import path from "node:path";
import { connectDB } from "../Hi-Zer-Pharma-Nutraceutical backend/src/config/db.js";
import Product from "../Hi-Zer-Pharma-Nutraceutical backend/src/models/Product.js";

const FALLBACK_ORIGIN = "https://www.hi-zerpharmaceutical.com";
const SITE_NAME = "Hi-Zer Pharmaceutical";
const DB_BUDGET_MS = 2500;
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function resolveOrigin(req) {
  const fromEnv = process.env.SITE_URL || process.env.PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  return host ? `${proto}://${host}` : FALLBACK_ORIGIN;
}

function getId(req) {
  if (req.query && req.query.id) return String(req.query.id).trim();
  try {
    const u = new URL(req.url, "http://x");
    return (
      u.searchParams.get("id") ||
      u.pathname.replace(/^\/product\//, "").split("/")[0] ||
      ""
    ).trim();
  } catch {
    return "";
  }
}

// --- shell (index.html) loading ------------------------------------------------

let cachedShell = null;

async function loadShell(origin) {
  if (cachedShell) return cachedShell;

  // Primary: the built shell bundled with this function (see vercel.json
  // functions.includeFiles). Always exactly the deployed HTML.
  const candidates = [
    path.join(process.cwd(), "Hi-Zer-Pharma-Nutraceutical frontend", "dist", "index.html"),
    path.join(process.cwd(), "dist", "index.html"),
    "/var/task/Hi-Zer-Pharma-Nutraceutical frontend/dist/index.html",
  ];
  for (const p of candidates) {
    try {
      const html = fs.readFileSync(p, "utf8");
      if (html.includes('id="root"')) {
        cachedShell = html;
        return html;
      }
    } catch {
      /* try next */
    }
  }

  // Fallback: fetch our own static index.html through the SPA catch-all.
  try {
    const res = await fetch(`${origin}/index.html`, { headers: { "x-prerender": "1" } });
    if (res.ok) {
      const html = await res.text();
      if (html.includes('id="root"')) {
        cachedShell = html;
        return html;
      }
    }
  } catch {
    /* ignore */
  }

  return null;
}

// --- head injection ----------------------------------------------------------

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildDescription(p, categoryName) {
  const context = [categoryName, p.subcategory].filter(Boolean).join(" \u00b7 ");
  return [
    context
      ? `${p.name} (${context}) from ${SITE_NAME}.`
      : `${p.name} from ${SITE_NAME}.`,
    (p.description || "").trim(),
    p.dosage ? `Recommended dosage: ${p.dosage}.` : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function injectHead(shell, { title, description, canonical, image, jsonLd }) {
  const html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "")
    .replace(/<meta\s+name="robots"[^>]*>/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>/i, "")
    .replace(/<meta\s+property="og:(?:title|description|url|image|type|site_name)"[^>]*>/gi, "");

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    `<meta property="og:type" content="product" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    image ? `<meta property="og:image" content="${esc(image)}" />` : "",
    // id matches the one ProductDetailPage looks for, so the client removes
    // this on hydration instead of appending a second JSON-LD block.
    `<script type="application/ld+json" id="product-schema">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");

  return html.replace(/<\/head>/i, `    ${tags}\n  </head>`);
}

// --- handler ---------------------------------------------------------------

export default async function handler(req, res) {
  const origin = resolveOrigin(req);
  const id = getId(req);

  const shell = await loadShell(origin);
  if (!shell) {
    res.statusCode = 503;
    res.setHeader("Retry-After", "3600");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Temporarily unavailable");
  }

  const sendShell = (status, sMaxAge) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", `public, max-age=0, s-maxage=${sMaxAge}`);
    return res.end(shell);
  };

  // Malformed id can never be a real product page.
  if (!OBJECT_ID_RE.test(id)) return sendShell(404, 60);

  let product = null;
  let dbFailed = false;
  try {
    product = await Promise.race([
      (async () => {
        await connectDB();
        return Product.findOne({ _id: id, isActive: true })
          .populate("category", "name")
          .select(
            "name description subcategory price discountPrice dosage stock images category updatedAt",
          )
          .maxTimeMS(DB_BUDGET_MS)
          .lean();
      })(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("db budget exceeded")), DB_BUDGET_MS),
      ),
    ]);
  } catch (err) {
    dbFailed = true;
    console.error("[product-page] lookup failed:", err.message);
  }

  // DB answered and there is no such active product -> honest 404.
  if (!dbFailed && !product) return sendShell(404, 60);

  // DB slow/unavailable -> serve the plain shell, let the client render it.
  // Short CDN cache so the full version is picked up soon.
  if (dbFailed || !product) return sendShell(200, 30);

  const canonical = `${origin}/product/${product._id}`;
  const categoryName =
    product.category && typeof product.category === "object"
      ? product.category.name || ""
      : typeof product.category === "string"
        ? product.category
        : "";
  const title = `${product.name} | ${SITE_NAME}`;
  const description = buildDescription(product, categoryName);
  const image = product.images && product.images[0] ? product.images[0].url : "";
  const price = product.discountPrice ?? product.price;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: (product.description || "").trim(),
    ...(image ? { image: [image] } : {}),
    url: canonical,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "PKR",
      price: Number(price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const html = injectHead(shell, { title, description, canonical, image, jsonLd });

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  );
  return res.end(html);
}

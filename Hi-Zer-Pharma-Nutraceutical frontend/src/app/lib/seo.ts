/**
 * Minimal runtime <head> management for the storefront SPA.
 *
 * Keeps <title>, <meta name="description"> and <link rel="canonical"> in sync
 * with the page the user (or Googlebot) is viewing. No dependency, no redesign —
 * just enough for search engines to identify and index each public page.
 */

export const SITE_URL = (
  (import.meta.env.VITE_SITE_URL as string | undefined) ||
  "https://www.hi-zerpharmaceutical.com"
).replace(/\/+$/, "");

export const SITE_NAME = "Hi-Zer Pharmaceutical";

function upsertMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export interface PageSeo {
  /** Full <title> text. */
  title: string;
  /** Meta description (trimmed to ~160 chars). */
  description?: string;
  /** Absolute path of the canonical URL, e.g. "/product/123". */
  canonicalPath: string;
}

export function setPageSeo({ title, description, canonicalPath }: PageSeo) {
  const canonical = `${SITE_URL}${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;

  document.title = title;
  upsertCanonical(canonical);
  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);

  if (description) {
    const clean = description.replace(/\s+/g, " ").trim().slice(0, 160);
    upsertMeta('meta[name="description"]', "name", "description", clean);
    upsertMeta('meta[property="og:description"]', "property", "og:description", clean);
  }
}

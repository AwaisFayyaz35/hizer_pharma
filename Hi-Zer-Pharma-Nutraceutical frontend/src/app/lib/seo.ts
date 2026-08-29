/**
 * Minimal runtime <head> management for the storefront SPA.
 *
 * Keeps <title>, <meta name="description">, <meta name="robots"> and
 * <link rel="canonical"> in sync with the page being viewed (by a user or by
 * Googlebot, which executes this JS before indexing). No dependency, no redesign.
 *
 * Public storefront pages call setPageSeo() -> robots "index, follow".
 * Admin / login pages call setNoIndex()   -> robots "noindex, nofollow".
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

/** Force the robots directive. Public pages -> "index, follow". */
export function setRobots(content: "index, follow" | "noindex, nofollow") {
  upsertMeta('meta[name="robots"]', "name", "robots", content);
}

/** Mark the current (non-public) view as non-indexable. */
export function setNoIndex() {
  setRobots("noindex, nofollow");
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
  // Public pages are always indexable — re-assert it in case the previous
  // client-side route (e.g. an admin page) had switched this to noindex.
  setRobots("index, follow");
  upsertCanonical(canonical);
  upsertMeta('meta[property="og:title"]', "property", "og:title", title);
  upsertMeta('meta[property="og:url"]', "property", "og:url", canonical);

  if (description) {
    const clean = description.replace(/\s+/g, " ").trim().slice(0, 160);
    upsertMeta('meta[name="description"]', "name", "description", clean);
    upsertMeta('meta[property="og:description"]', "property", "og:description", clean);
  }
}

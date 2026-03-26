/**
 * Dynamic sitemap generator — /api/sitemap
 *
 * This route generates the sitemap programmatically so that new blog posts
 * added to blogs.json are automatically reflected without a manual XML edit.
 *
 * Usage: point next.config.ts rewrites to serve this at /sitemap.xml,
 * OR deploy the static public/sitemap.xml and regenerate on each build.
 *
 * To wire it up via rewrites, add to next.config.ts:
 *
 *   async rewrites() {
 *     return [{ source: '/sitemap.xml', destination: '/api/sitemap' }];
 *   }
 */

import type { NextApiRequest, NextApiResponse } from "next";
import blogsData from "@/data/blogs/blogs.json";

const BASE_URL = "https://www.skillscout.dev";

const STATIC_PAGES: { path: string; lastmod: string }[] = [
  { path: "/",                          lastmod: "2026-03-26" },
  { path: "/pricing",                   lastmod: "2026-03-26" },
  { path: "/about",                     lastmod: "2026-03-26" },
  { path: "/contact",                   lastmod: "2026-03-26" },
  { path: "/resources",                 lastmod: "2026-03-26" },
  { path: "/legal/privacy-policy",      lastmod: "2026-03-26" },
  { path: "/legal/terms-of-service",    lastmod: "2026-03-26" },
  { path: "/legal/refund-policy",       lastmod: "2026-03-26" },
];

function formatDate(raw: string | null | undefined): string {
  if (!raw) return new Date().toISOString().split("T")[0];
  try {
    return new Date(raw).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

function buildUrl(loc: string, lastmod: string): string {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  const staticEntries = STATIC_PAGES.map(({ path, lastmod }) =>
    buildUrl(`${BASE_URL}${path}`, lastmod)
  );

  const blogEntries = (blogsData as Array<{ slug: string; publishedAt?: string | null; updatedAt?: string | null }>).map(
    (blog) => {
      const loc = `${BASE_URL}/resources/blog/${blog.slug}`;
      const lastmod = formatDate(blog.updatedAt ?? blog.publishedAt);
      return buildUrl(loc, lastmod);
    }
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "",
    "  <!-- Core marketing pages -->",
    ...staticEntries.slice(0, 5),
    "",
    "  <!-- Blog posts -->",
    ...blogEntries,
    "",
    "  <!-- Legal pages -->",
    ...staticEntries.slice(5),
    "",
    "</urlset>",
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=3600");
  res.status(200).send(xml);
}

import type { NextApiRequest, NextApiResponse } from "next";
import blogsData from "@/data/blogs/blogs.json";

const BASE_URL = "https://www.skillscout.dev";

function isTruthy(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function getTriggerSecret(req: NextApiRequest): string | undefined {
  // Accept secret only via header — never from query params, which appear in server access logs.
  const headerSecret = req.headers["x-indexnow-secret"];
  if (typeof headerSecret === "string" && headerSecret.length > 0)
    return headerSecret;
  return undefined;
}

function getUrlsToSubmit(): string[] {
  const staticUrls = [
    "/",
    "/pricing",
    "/about",
    "/contact",
    "/resources",
    "/legal/privacy-policy",
    "/legal/terms-of-service",
    "/legal/refund-policy",
  ].map((p) => `${BASE_URL}${p}`);

  const blogUrls = (blogsData as Array<{ slug: string }>).map(
    (b) => `${BASE_URL}/resources/blog/${b.slug}`,
  );

  return [...staticUrls, ...blogUrls];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "GET") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const triggerSecret = getTriggerSecret(req);
  const expectedSecret = process.env.INDEXNOW_TRIGGER_SECRET;
  if (!isTruthy(expectedSecret) || triggerSecret !== expectedSecret) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const key = process.env.INDEXNOW_KEY;
  if (!isTruthy(key)) {
    return res
      .status(500)
      .json({ ok: false, error: "INDEXNOW_KEY is not set" });
  }

  const urls = getUrlsToSubmit();

  // IndexNow spec: keyLocation must point to https://<host>/<key>.txt
  const payload = {
    host: "www.skillscout.dev",
    key,
    keyLocation: `${BASE_URL}/${key}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch("https://www.bing.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    if (!response.ok) {
      return res.status(502).json({
        ok: false,
        error: `IndexNow failed: ${response.status}`,
        details: text.slice(0, 2000),
      });
    }

    return res.status(200).json({
      ok: true,
      submitted: urls.length,
      response: text.slice(0, 2000),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "IndexNow request failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}

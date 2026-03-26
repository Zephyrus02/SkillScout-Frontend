# IndexNow setup (Bing)

This project includes a protected endpoint that can ping IndexNow:

- `GET|POST /api/indexnow?secret=...`

It requires two environment variables in Vercel:

- `INDEXNOW_KEY`
- `INDEXNOW_TRIGGER_SECRET`

## 1) Verify your site in Bing Webmaster Tools

1. Open Bing Webmaster Tools.
2. Add your site: `https://www.skillscout.dev/`
3. Complete verification (DNS / HTML file / meta tag).

## 2) Create an IndexNow key

1. Generate a random key (32+ chars).
2. Set it in Vercel as `INDEXNOW_KEY`.

The key file must be reachable at:

- `https://www.skillscout.dev/<INDEXNOW_KEY>.txt`

This repo serves it automatically using `frontend/middleware.ts` (no manual public file needed).

## 3) Configure the trigger secret

1. Generate a random secret (32+ chars).
2. Set it in Vercel as `INDEXNOW_TRIGGER_SECRET`.

## 4) Triggering IndexNow

### Option A (recommended): Vercel Cron

In Vercel → Project → Cron Jobs, schedule a daily ping:

- URL: `https://www.skillscout.dev/api/indexnow?secret=<INDEXNOW_TRIGGER_SECRET>`

### Option B: Manual on-demand ping

Hit the same URL in your browser (or via curl) whenever you publish content.

## Notes

- The endpoint currently submits core marketing URLs + all blog URLs from `frontend/data/blogs/blogs.json`.
- If you later add a dynamic sitemap rewrite and want to submit only `sitemap.xml`, we can switch the payload to just submit the sitemap URL or only recently changed URLs.

[![Netlify Status](https://api.netlify.com/api/v1/badges/91fa9c69-c625-4ad2-b704-b3cbf3894652/deploy-status)](https://app.netlify.com/projects/mytinylink/deploys)

# White‑Label URL Shortener (Next.js + TypeScript)

Configurable, brandable URL shortener built with Next.js, TypeScript, TailwindCSS, and MongoDB. This codebase is structured for white‑label deployments and is kept live as a demo to showcase engineering practices and product thinking for portfolio purposes.
> White‑label contract: All branding, features, and infrastructure options are centralized in `src/lib/config.ts` and can be overridden by environment variables. No brand values should be hardcoded in components.



## Highlights
- One‑file white‑label config with env overrides: `src/lib/config.ts`
- Clean validations, URL sanitization, and domain/TLD blocking
- Optional interstitial redirect page with countdown and ad slots
- Optional Redis‑backed rate limiting (Upstash)
- Minimal analytics event pipeline (toggleable)
- MongoDB for durable storage
- Production‑ready Next.js App Router structure

## Tech Stack
- Next.js (App Router), React, TypeScript
- TailwindCSS + Radix UI
- MongoDB (native driver)
- Upstash Redis (optional) for rate limiting
- Jest + ts-jest for unit tests

## White‑Label Configuration
Single source of truth lives in `src/lib/config.ts`. Priority of values:
1) Environment variables (highest)
2) Static defaults in `config.ts`
What you can brand/configure:
- Brand: name, domain, URL, titles, description, slogan
- URL behavior: short path prefix (default `/s`), lengths, slug rules
- Features: interstitial redirect page, timer, analytics toggle, rate limiting
- Content: homepage features/benefits
- Footer/social/contact
- Theme colors/gradients
- Google Ads settings (optional)

See `docs/configuration.md` for a full reference of fields and environment variables.
## Environment Variables

Required
- MONGODB_URI
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_APP_DOMAIN
- NEXT_PUBLIC_APP_URL


Optional (enable features when present)
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (rate limiting)
- RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS
- SHORT_URL_LENGTH
- REDIRECT_PAGE_ENABLED, REDIRECT_PAGE_TIMER_DURATION, REDIRECT_PAGE_SHOW_ONLY_AFTER_X_ACCESSES
- ENABLE_ANALYTICS
- NEXT_PUBLIC_GOOGLE_ADS_ENABLED, NEXT_PUBLIC_GOOGLE_ADS_SCRIPT_ENABLED, NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
- NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_PRIMARY, NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_SECONDARY, NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_BANNER
- NEXT_PUBLIC_GOOGLE_ADS_HOMEPAGE
- SUPPORT_EMAIL
- NEXT_PUBLIC_GITHUB_PAGE (adds a footer link)

## Quick Start (Local)
1) Create a `.env.local` at the repo root with the required variables. Example:

```powershell
$env:MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>/?retryWrites=true&w=majority" 
$env:NEXT_PUBLIC_APP_NAME="MyShortener"
$env:NEXT_PUBLIC_APP_DOMAIN="myshortener.com"
$env:NEXT_PUBLIC_APP_URL="https://myshortener.com"
```

2) Install and run
```powershell
npm install
npm run dev
```

3) Open the app
```text
http://localhost:3000
```

Notes
- Node 18+ is recommended for modern Next.js.
- If you set `url.shortUrlPath` in config (e.g., `/go`), middleware rewrites traffic to the canonical `/s` route automatically.

## How to White‑Label
- Edit `src/lib/config.ts` with your brand defaults (safe to keep env‑overridable).
- Set required env vars in your environment or hosting provider.
- Optional: update `content.features` and `content.benefits` for your messaging.
- Optional: set `NEXT_PUBLIC_GITHUB_PAGE` to expose a “View Source on Github” footer link.
- Optional: enable `googleAdsConfig` and provide IDs to show AdSense on the interstitial page/home.

## API Endpoints
All endpoints are rate‑limited when Redis is configured. Content type must be `application/json` for POSTs.

- POST `/api/shorten`
	- Body: `{ url: string; customUrl?: string }`
	- Response: `{ originalUrl, shortUrl, shortId }`
	- Errors: 400 (validation), 409 (custom slug taken), 415 (content type), 413 (payload), 500

- POST `/api/urls/[shortId]/click`
	- Increments click count for analytics/UI use
	- Response: `{ success: true, clicks: number }` or 404 if not found

- POST `/api/analytics`
	- No‑op unless `features.analytics.enabled` is true
	- Body: event payload; stored via `trackEvent`

Redirect route
- GET `/<shortPath>/<shortId>` (default `/s/:shortId`)
	- If interstitial is disabled or `accesses <= showOnlyAfterXAccesses`, performs immediate redirect and increments `clicks`.
	- Otherwise renders a countdown page (and can render ads if enabled), then redirects.

## Data Model (MongoDB)

Collection: `urls`
- `shortId: string`
- `originalUrl: string`
- `createdAt: Date`
- `clicks: number`
- `accesses: number` (incremented on page view to control interstitial behavior)

## Security & Abuse Prevention

- Strict URL validation with protocol enforcement and hostname checks
- Blocks private networks, suspicious keywords, and maintainable domain/TLD deny lists
- CSRF protection on the shorten API via Origin checks
- Optional Redis rate limiting middleware across API and redirect routes
- Server‑only error logging; user‑friendly messages client‑side

## Testing
Run unit tests

```powershell
npm test
```

Tests live under `src/__tests__/` and use Jest + ts‑jest. Add tests for validation, API endpoints, and rate limiting as you extend features.

## Deployment

This is a standard Next.js App Router project and deploys well on Vercel or any Node host.

General steps
1) Set environment variables in your host (at minimum the four required ones).
2) Build and start

```powershell
npm run build
npm start
```

Optional
- Provide Upstash Redis credentials to enable rate limiting in production.
- Customize `url.shortUrlPath` (e.g., `/go`) without code changes—middleware handles rewrites.
- Toggle the interstitial redirect page or analytics via envs.

## Project Structure (excerpt)

- `src/app` — Next.js routes (App Router), API endpoints, and pages
- `src/components` — UI components (Radix UI + Tailwind)
- `src/lib` — Core logic: config, Mongo, validation, analytics
- `src/__tests__` — Unit tests
- `docs/` — Additional docs like configuration reference

## Portfolio & Demo Notes

This repository is presented as a portfolio piece and live demo. It’s designed to be cloned and re‑branded for personal or client demos. For production, ensure:
- Proper domain, SSL, and hosting setup
- Environment variables configured per environment
- Rate limiting enabled (recommended)
- Additional logging/monitoring as needed

## Attribution

If you use this as a base, a small credit or GitHub star is appreciated. Enjoy building!

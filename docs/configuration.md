# Configuration Reference

This project is white-label and driven by a single source of truth: `src/lib/config.ts`.

Priority of values:
1) Environment variables (highest priority)
2) Static values in `config.ts`

Notes:
- Optional fields can be left empty to disable related UI/functionality.
- For booleans controlled by env, use string values "true" or "false" as indicated.
- Middleware rewrites requests so you can customize the short URL path without changing routes.

---

## Infrastructure

- infrastructure.database.uri
  - What: MongoDB connection string (required).
  - Env: MONGODB_URI

- infrastructure.redis.url / infrastructure.redis.token
  - What: Upstash Redis REST credentials (optional). If both are set, rate limiting is enabled.
  - Env: UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN

## Brand

- brand.name
  - What: Product/brand name displayed in header, footer, and metadata.
  - Env: NEXT_PUBLIC_APP_NAME

- brand.domain
  - What: Public domain shown in UI (e.g., custom slug prefix).
  - Env: NEXT_PUBLIC_APP_DOMAIN

- brand.url
  - What: Absolute site URL used for metadata and validation (prevents shortening own links).
  - Env: NEXT_PUBLIC_APP_URL

- brand.title
  - What: Short title/descriptor used with the brand name (hero/metadata).

- brand.description
  - What: Marketing description used in hero/metadata.

- brand.slogan
  - What: Tagline rendered in the footer.

## SEO

- seo.title / seo.description
  - What: Default SEO meta. (Keywords are most used; title/description can be leveraged as needed.)

- seo.keywords
  - What: Keywords array injected into metadata.

## URL

- url.shortUrlPath
  - What: Path prefix for short links (default "/s").
  - Notes: Middleware rewrites requests to internal "/s" route when customized.

- url.maxLength
  - What: Optional global maximum URL length (not actively enforced; see features.shortening.maxUrlLength).

## Features

- features.shortening.maxUrlLength
  - What: Maximum allowed target URL length; enforced by validation.

- features.shortening.shortUrlLength
  - What: Number of characters generated for random short IDs.

- features.shortening.minSlugLength / maxSlugLength
  - What: Allowed length range for custom slugs.

- features.redirectPage.enabled
  - What: Toggles the interstitial page (timer/ads) before redirect.
  - Env: REDIRECT_PAGE_ENABLED ("true"/"false")

- features.redirectPage.timerDuration
  - What: Countdown duration on the interstitial page (seconds).
  - Env: REDIRECT_PAGE_TIMER_DURATION

- features.redirectPage.showOnlyAfterXAccesses
  - What: Show interstitial only after a link has been accessed at least this many times; otherwise redirect directly.
  - Env: REDIRECT_PAGE_SHOW_ONLY_AFTER_X_ACCESSES

- features.analytics.enabled
  - What: Enables analytics collection (API gated by this flag).
  - Env: ENABLE_ANALYTICS ("true"/"false")

- features.rateLimit.requests / windowMs
  - What: Rate limiting window configuration applied by middleware when Redis is configured.
  - Env: RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS

## Content (Optional UI copy)

- content.features[]
  - What: Feature cards list on the homepage.

- content.benefits[]
  - What: Benefits list on the homepage.

## Footer & Social

- footer.sections
  - What: Footer link groups (company/resources/legal). Empty groups are hidden.
  - Resources GitHub link: Set NEXT_PUBLIC_GITHUB_PAGE to include a "View Source on Github" link automatically.

- social.twitter / facebook / instagram / linkedin
  - What: Social links; empty values hide icons.

## Contact

- contact.email
  - What: Contact email used in legal pages.
  - Env: SUPPORT_EMAIL

## Theme (Optional)

- theme.colors / theme.gradients
  - What: Theming values available for UI styling.

---

## Google Ads Configuration

Export: `googleAdsConfig` in `src/lib/config.ts`.

- googleAdsConfig.enabled
  - What: Master toggle for ads in UI and script loading.
  - Env: NEXT_PUBLIC_GOOGLE_ADS_ENABLED ("true"/"false")

- googleAdsConfig.enabledScript
  - What: Controls whether to load the AdSense script.
  - Env: NEXT_PUBLIC_GOOGLE_ADS_SCRIPT_ENABLED ("true"/"false")

- googleAdsConfig.clientId
  - What: AdSense client ID (e.g., ca-pub-XXXXXXXXXXXXXXX).
  - Env: NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID

- googleAdsConfig.adSlots.redirectPage.primary / secondary / banner
  - What: Slot IDs for the interstitial page placements.
  - Env: NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_PRIMARY / _SECONDARY / _BANNER

- googleAdsConfig.adSlots.homepage
  - What: Slot ID for homepage placement.
  - Env: NEXT_PUBLIC_GOOGLE_ADS_HOMEPAGE

- googleAdsConfig.displayRules
  - What: Responsiveness hints (currently informational; wire up as needed).

---

## Environment Variables Summary

Required
- MONGODB_URI
- NEXT_PUBLIC_APP_NAME
- NEXT_PUBLIC_APP_DOMAIN
- NEXT_PUBLIC_APP_URL

Optional (by feature)
- SUPPORT_EMAIL
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (enable rate limiting)
- RATE_LIMIT_REQUESTS, RATE_LIMIT_WINDOW_MS
- SHORT_URL_LENGTH
- REDIRECT_PAGE_ENABLED, REDIRECT_PAGE_TIMER_DURATION, REDIRECT_PAGE_SHOW_ONLY_AFTER_X_ACCESSES
- ENABLE_ANALYTICS
- NEXT_PUBLIC_GOOGLE_ADS_ENABLED, NEXT_PUBLIC_GOOGLE_ADS_SCRIPT_ENABLED, NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID
- NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_PRIMARY, NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_SECONDARY, NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_BANNER
- NEXT_PUBLIC_GOOGLE_ADS_HOMEPAGE
- NEXT_PUBLIC_GITHUB_PAGE (shows a GitHub link in Footer > Resources when set)

---

## Tips
- Leave social/contact values empty to hide their UI.
- Changing `url.shortUrlPath` does not require code changes; middleware handles rewrites.
- To disable analytics entirely, set ENABLE_ANALYTICS to "false".
- To disable rate limiting, omit Redis envs or set them empty.
- Ads require both `googleAdsConfig.enabled` and a valid `clientId` (and slot IDs) to render.

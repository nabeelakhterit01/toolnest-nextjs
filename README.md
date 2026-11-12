# ToolNest — Next.js Tool Website

A custom Next.js 15 + React 19 tool website, with 22 working browser-side utilities, responsive UI, blog admin CMS, SEO routes, sitemap and robots configuration.

## Local development

1. Install Node.js 20.9+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and replace secrets with strong unique values (24+ chars for SESSION_SECRET, 12+ chars for ADMIN_PASSWORD).
4. Run `npm run dev` and visit http://localhost:3000.
5. Open `/admin` to sign in and create blog drafts.

## Production / Hostinger Node.js

- Requires **Node.js hosting capable of running a persistent Next.js server** (not static-only hosting).
- Set the environment variables on Hostinger: `ADMIN_PASSWORD`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL=https://your-domain.example`, `BLOG_DATA_DIR=/absolute/path/to/persistent/writable/data`.
- Build with `npm ci && npm run build`; run `npm run start` on the port configured by the host.
- Enable HTTPS and keep the blog data directory outside public web root.
- **Back up `posts.json` frequently**; the simple JSON CMS is suitable for one admin on a single persistent server, not serverless/multi-instance deployment. For scale, migrate CMS to PostgreSQL.
- Do not use public production domain until contact details, privacy policy, host logging practices, and legal copy have been reviewed and updated.

## Current tool coverage

22 real tools (8 image, 5 text, 7 developer/security, 2 calculators). All processing occurs locally in browser. No background remover or PDF tools are claimed as functional yet. No advertising or analytics scripts are installed.

## Testing checklist

- Run `npm run build`.
- Test image conversion with JPEG, PNG and WebP; verify downloaded MIME types, dimensions, transparency handling, large file errors and quality changes.
- Test text utilities with Unicode and malformed inputs.
- Test admin wrong-password, login, draft, publish, edit, delete and logout.
- Test `/sitemap.xml`, `/robots.txt`, canonical URLs, mobile layout, keyboard navigation and 404s.
- Confirm persistent blog data survives server restart/redeploy.

## Security / launch limitations

- Before public launch, add login rate limiting, password rotation, automated backups, monitoring and persistent storage permissions.
- Admin writes are password-protected and session cookie is HTTP-only, SameSite strict, signed with HMAC. For multiple admins, migrate to an auth provider and database.
- No fake content or filler blog posts are seeded. SEO descriptions on tool pages are starter copy and should be expanded with useful original guidance.
- AdSense approval is not guaranteed; privacy disclosures and consent requirements depend on eventual ad/analytics configuration.

# ToolNest — Technical SEO and keyword map (13 Nov 2026)

## Scope and evidence
Reviewed repository files: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/tools/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `lib/tools.ts` and `lib/editorial-posts.ts`. This is a code-level audit, **not** a verified live crawl or a Search Console audit. Live DNS/HTTP verification was unavailable from the execution environment. Google Keyword Planner/Ahrefs/Semrush volume and difficulty metrics were not available. Do not label these terms high-volume or low-competition without validation.

## Confirmed code-level findings
- Canonical base points to https://toolnestweb.com in the root metadata.
- Dynamic tool pages specify a canonical URL per slug and have server-rendered H1, breadcrumbs and WebApplication JSON-LD.
- Tool categories have distinct landing pages and links to individual tools.
- robots.txt allows public pages, disallows /admin and /api/, and references the production sitemap.
- Dynamic sitemap includes category pages, public tool pages and published blog slugs.
- **Content quality issue:** many tool pages reuse identical explanatory sections and generic FAQs; first eight priority pages now use original task-specific guidance from `lib/seo-content.ts`.
- **Potential index bloat:** new tool routes should remain unlisted until functionality and content have been reviewed. Do not generate near-duplicate keyword-variant pages.
- **Blog review needed:** editorial articles require individual fact-checking, working-link checks, originality review and appropriate update dates; do not publish bulk unreviewed drafts.
- **Search Console evidence missing:** indexing reasons, selected canonical, crawl status and impressions cannot be confirmed from repository code alone.
- **Performance:** reported 100/100 desktop/mobile by site owner, not independently verified here. Preserve this during changes.

## Keyword-to-URL map (intent hypotheses; volumes unverified)
| Priority | Canonical target | Primary keyword candidate | Secondary keyword candidates | Intent | Unique content |
| --- | --- | --- | --- | --- | --- |
| P1 | /tools/image-compressor | compress image online | reduce image file size; compress JPG online; compress PNG online | Task | Quality tradeoffs, workflow, limits |
| P1 | /tools/jpg-to-webp | JPG to WebP converter | convert JPEG to WebP; JPG to WebP online | Task | Format tradeoffs, conversion steps |
| P1 | /tools/png-to-jpg | PNG to JPG converter | convert PNG to JPEG; PNG to JPG online | Task | Transparency and quality |
| P1 | /tools/pdf-merge | merge PDF online | combine PDF files; PDF merger online | Task | Ordering, page count, limitations |
| P1 | /tools/pdf-split | split PDF online | extract PDF pages; split PDF pages | Task | Range examples and extraction |
| P1 | /tools/word-counter | word counter online | count words in text; character and word counter | Task | Counting rules and writing use |
| P1 | /tools/json-formatter | JSON formatter online | format JSON; JSON beautifier; JSON validator | Task | Valid JSON examples and common errors |
| P1 | /tools/password-generator | strong password generator | random password generator; secure password generator | Task | Uniqueness, storage, MFA |
| P2 | /category/image | free online image tools | image converter tools; resize images online | Browse | Category overview |
| P2 | /category/pdf | free online PDF tools | merge and split PDF tools | Browse | PDF workflow overview |
| P2 | /category/text | free online text tools | word and character tools | Browse | Writing workflows |
| P2 | /category/developer | free developer tools online | JSON and encoding utilities | Browse | Developer workflows |

## Next steps
1. Confirm build succeeds, inspect rendered canonical/title/H1 and JSON-LD on each P1 page.
2. Crawl live site to verify 200 responses, no unintended redirects, robots and sitemap consistency, internal links and noindex behavior.
3. Validate search demand and competition using Search Console queries, Google Trends, Keyword Planner or another measured dataset; update this map with actual numbers and SERP intent.
4. Test all public tools before adding more to sitemap. Correct or unlist failures.
5. Review all blog content for factual accuracy, originality, intent, screenshots/examples and links. Consolidate overlapping guides rather than mass-publishing.
6. Review Search Console indexing reasons (Discovered/Crawled — currently not indexed, duplicate/canonical, soft 404, blocked) before changing indexing directives.
7. Recheck Core Web Vitals after release.

## Content standard
One primary search intent per canonical page. Write for task completion, not keyword density. Provide accurate instructions, an original worked example, format limitations and only FAQs users genuinely need. Never fabricate performance claims, upload/privacy claims, search-volume numbers or hands-on testing.

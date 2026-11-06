# Metal Roof Central — project context for Claude

This file is read automatically by Claude Code. It replaces the chat history that
built the site (chat history lives only on the machine where it happened). Keep it
current: when a decision changes, edit this file in the same commit.

## The business
- **Metal Roof Central, LLC** — owner Ryan J. Morse. A Florida **distributor** of designer
  modular metal roofing (BTR Systems products). It does **not install**; installs are done by
  state-certified roofing contractors.
- Audience: homeowners buying a roof *before* it is needed (aesthetics, preparedness, upgrade),
  long-term-investment homeowners, and contractors.
- Tone and design: high-end luxury. Black, platinum, one measured red.
- Contact (already public on the site): metalroofcentral@gmail.com, +1 (321) 290-6242.

## Rules the client/owner has set (do not undo)
- **One-page site.** Never add separate pages or a multi-page nav.
- **Distribution only.** The training program was removed entirely; don't reintroduce it.
- No newsletter for now. No third-party integrations.
- The owner has **verified all product claims** and has **permission to use the BTR photos**.
  Product photography/specs are courtesy of BTR Systems (credited in the collection note).
- Roof tune-ups are offered in **Brevard County, FL** only. Pricing today: $599 (≤3,000 sq ft),
  $699 (3,000–5,000), $899 (5,000–9,000), site visit for larger.
- The client intake PDF is private. It is git-ignored and must never be committed.
- Never put passwords, API keys or client logins in this repo or in chat. Use the team password manager.

## Stack and layout
Plain HTML/CSS/JS, no build step, no Node needed.
- `public/index.html` — the whole site (hero, collection gallery, performance, plan ahead,
  roof care, about, FAQ, contact), plus SEO/AEO in `<head>`.
- `public/css/style.css`, `public/js/main.js`
- `public/llms.txt`, `robots.txt`, `sitemap.xml`, `404.html`, icons, `og-cover.png`
- `public/images/products/` (BTR photos), `images/swatches/`, `images/logo*.png`
- `wrangler.jsonc` (Pages: `pages_build_output_dir: ./public`) and `worker/wrangler.jsonc`
  (Worker static assets pointing at `../public`).
- Fonts: Cormorant Garamond (display) + Jost (body). Palette tokens are in `:root` in `style.css`.
- Local preview: run `serve.ps1` (serves `public/` at http://localhost:8532).

## Things that must stay in sync (easy to miss)
- **Prices** live in four places: the pricing table, the FAQ answer in the page, the FAQPage
  JSON-LD in `<head>`, and the Offer in the Store JSON-LD — plus `llms.txt`. Change all of them.
- **FAQ**: the visible FAQ text must match the FAQPage JSON-LD exactly.
- **Product list/specs/colors**: gallery panels, `hasOfferCatalog` JSON-LD, and `llms.txt`.
- **Domain**: canonical, `og:url`, `og:image`, JSON-LD `url`, `robots.txt`, `sitemap.xml` and
  `llms.txt` all use `https://www.metalroofcentral.com/` (www is the canonical address).

## Behaviours worth knowing before editing
- **Motion**: a head script adds `html.motion` only if the visitor allows motion and
  IntersectionObserver exists. Scroll reveals (`.reveal` → `.in`), hero entrance and
  smooth scroll all respect `prefers-reduced-motion`.
- **Collection gallery** (`.expander` / `.xp`): on desktop the open panel is a clear photo above a
  solid text strip (nothing sits over the image — the owner rejected text-on-photo cards).
  At ≤1200px it becomes a vertical accordion and `sizePanels()` in `main.js` sizes the open
  panel to photo + strip. Hover uses `mousemove` (not `mouseenter`) so scrolling doesn't pop panels open.
- **Accessibility**: target WCAG AA (4.5:1 normal text, 3:1 large). Text on photos needs a solid
  or measured backing. Keep the skip link, `aria-expanded` on gallery tabs, alt text on photos.
- **Header height** is the CSS variable `--header-h` (88px); scroll offsets use it.
- Logo art was supplied on pure black; the site uses transparent PNGs in `public/images/`.

## Deployment
- GitHub repo `vwagner-RYVA/Metal-Roof-Central`, branch `main`. Every push to `main` deploys
  automatically — **pushing to `main` publishes the live site**.
- Cloudflare: Worker `metal-roof-central` (Workers Builds, root directory `worker`) and a Pages
  project `metal-roof-central.pages.dev`. Live URL today: https://metal-roof-central.pages.dev
- Prefer a branch + pull request for anything non-trivial; check the Cloudflare Pages preview link on the pull request before merging.

## Status / open items
- **Custom domain live (2026-11-06)**: https://www.metalroofcentral.com (canonical) and
  https://metalroofcentral.com both serve the site. Registered at Namecheap with nameservers
  pointed to Cloudflare (`matt.ns` / `ziggy.ns`); the zone is in the Vanessawagner@ryvawebservices.com
  Cloudflare account. Both hostnames are custom domains on the Worker `metal-roof-central`
  (Worker URL: metal-roof-central.ryvawebservices.workers.dev). The Namecheap parking A/CNAME
  records were deleted; the Namecheap email-forwarding MX/TXT records were kept on purpose.
  Optional follow-ups: a Cloudflare Redirect Rule sending the bare domain to www, and removing
  the now-unused Namecheap "Redirect Domain" row.
- Parked by the owner (not forgotten): higher-resolution BTR photos, BTR PDFs/catalog links,
  missing Blizzard/Polar spec details, a formal photo credit line, extra fine print.
- Hero/OG share image: `og-cover.png` is built from the logo; replace if the brand art changes.

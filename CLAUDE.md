<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Reelly website

Marketing site for reelly.io, migrated 1:1 from Webflow to Next.js (App Router) for hosting on Vercel.

Structure
- Every Webflow page is a route in `src/app/<url>/page.tsx` (same URLs as the old site).
- A page is a list of section components in `src/app/<url>/_sections/` — edit text and markup there.
- Blocks shared by many pages (navbars, footer…) live in `src/components/webflow/`.
- Styles: the original Webflow stylesheet is `public/legacy/webflow.css`, page custom CSS is in `public/legacy/css/`. Tailwind utilities are available for new work (no preflight, so Webflow styles are untouched).
- Images, fonts and videos from the Webflow CDN are in `public/cdn/`.
- `src/components/LegacyWebflow.tsx` runs the original Webflow runtime (interactions, sliders, dropdowns, forms) and the site's integrations: GTM, Mixpanel, Meta Pixel, Wized, Finsweet. (Weglot was removed: the site is English only.) Each page lists its scripts in the `page.scripts` array; custom code from Webflow is in `public/legacy/js/inline-*.js`.

Migration rules
- Keep class names when editing Webflow markup; webflow.css and the interactions depend on them.
- When a section is rebuilt as a clean React component, remove the scripts it no longer needs from that page's `scripts` list.
- Use plain `<a>` links between legacy pages (the Webflow runtime needs a full page load).
- The product app (sign in/up) is a separate site: soft.reelly.io.

Forms
- Webflow forms are intercepted by `src/lib/formBridge.ts` and posted to `src/app/api/forms/route.ts`, which forwards them server-to-server to the Reelly Integrations service (`POST /webhooks/website`, repo "Reelly Integrations & Automatiosation", module `integrations/website_kommo.py`). That service creates the Kommo CRM lead; which pipeline/stage each form lands in is the `ROUTES` table there, keyed by the form's `data-name`. No Zapier.
- Env vars: `INTEGRATIONS_URL` (service base URL) and `INTEGRATIONS_WEBHOOK_SECRET` (= `WEBSITE_WEBHOOK_SECRET` on the service).
- A new form needs a unique `data-name` and a route in `ROUTES`; unknown forms still arrive in Kommo (Support / Incoming request, tag `site form: <name>`).
- Memberstack forms (`data-ms-form`) are not touched.
- The developer landing (`/for-developer`) is a standalone page: `public/brm/index.html` + `public/brm/img/`, served by a rewrite in `next.config.ts`. Its two forms post to `/api/forms` as "BRM demo call" and "BRM free listing" (fall back to a mailto to info@reelly.ai if that fails).
- All other developer URLs (brm-for-developer, colsulting, consulting, white-label…) 301 to `/for-developer`.
- Its header (between `<!-- SITE HEADER` and `<!-- /SITE HEADER -->` in `public/brm/index.html`) is a copy of `src/components/webflow/Navbar.tsx` with the home page header styles, in a shadow root so webflow.css and the landing CSS stay apart; a small script there replaces the Webflow runtime (dropdowns, mobile menu). The right-hand buttons are "List project free" (#list) and "Book a demo call" (#demo). When the site menu changes, update this copy too.

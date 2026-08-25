@AGENTS.md

# ALTR — Full Project Reference

Drop this file (and the rest of this repo) into a fresh Claude Code session and it should be able to pick up
exactly where things left off with zero prior context. This is the single source of truth — read it before
touching anything.

Research-grade peptide e-commerce site. Next.js 16 (App Router) + TypeScript + Tailwind v4. Frontend is fully
built; backend (WooCommerce) integration is in progress — see "Checkout / WooCommerce status" below, that's the
most important unfinished thing.

**Repo:** https://github.com/Nikola0803/altr.git (branch `master`)
**Local path:** `C:\Users\PC\Desktop\ALTR\altr-site`
**Dev server:** `npm run dev` (runs on port 3010 via the `altr-dev` entry in `.claude/launch.json`, which lives
in the parent `ben softver` directory alongside sibling projects — do not touch that file's other entries)
**Deploy:** Vercel, auto-deploys from `master` on push
**Push:** `git add . && git commit -m "..." && git push origin master`, or double-click `push-to-github.bat`

## Who this is for / brand rules — read before writing any copy

- **Name:** ALTR — tagline "THE STANDARD. NOT THE MARKUP." (primary) / "Change your state." (secondary/meta).
- **Category:** Research-use-only (RUO) peptides. **Never** write human-use, medical, treatment, dosing, or
  weight-loss claims. Copy stays in "independent testing / batch documentation / research use" language only.
- **No HGH, no HCG, no "growth hormone" wording anywhere — hard rule, not a preference.** The client explicitly
  does not want ALTR associated with HGH/HCG (black-market territory; a named competitor built their whole brand
  on it and ALTR deliberately does not). This means: never add HGH or HCG as products, no "growth hormone"
  category, and no product copy that spells out "growth hormone" even for legitimate GH-axis secretagogues
  (GHRP-2/6, Hexarelin, Ipamorelin, CJC-1295 variants, IGF-1 variants, MGF/PEG-MGF, AOD-9604, Tesamorelin,
  Sermorelin) — those live in the plain `peptides` category and use neutral words like "secretagogue" or
  "pathway research" instead. Before adding any new product, check it isn't HGH/HCG and that its description
  doesn't say "growth hormone."
- **Positioning:** premium, restrained, "luxury biotech" — not bodybuilding/supplement-store, not clinical/cold.
  North star when unsure: remove rather than add.
- **No discount-theater**: no discount codes, no countdown timers, no fake urgency banners on the storefront
  itself. (Popups/upsells with real discounts are fine and already built — see below — the rule is against
  manufactured scarcity, not against promotions generally.)
- **Full brand kit source (colors/logo/tone/packaging):** `C:\Users\PC\Desktop\ALTR_Brand_Kit.pdf`

### Design tokens (`src/app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| `ivory` | `#F4F0E7` | primary background |
| `ivory-soft` | `#FAF8F3` | secondary panels |
| `sage` | `#687767` | primary brand color, buttons |
| `sage-deep` | `#536252` | header/footer/dark bands, button hover |
| `sage-light` | `#97A494` | accents on dark bg |
| `sage-mist` | `#E7E9E2` | light tint, active pills |
| `sage-forest` / `charcoal` | `#10130F` | near-black, deepest dark sections / body text |
| `stone` | `#D8D3C9` | borders/dividers |
| `soft-gray` | `#777970` | secondary/muted body text |

- Display/headings: **Space Grotesk** (`--font-space-grotesk`, `.font-display`, `-0.03em` tracking globally).
  Body: **Inter**. Accent/italic: **Instrument Serif** (`.font-accent`). Icons: Remix Icon via CDN `<link>` in
  `layout.tsx` (`<i className="ri-*-line">`), not an npm package.
- Buttons: `rounded-md` (never pills). Primary `bg-sage-deep text-ivory hover:bg-charcoal`. See
  `src/components/ui/Button.tsx` (`Button` / `ButtonLink`).
- Content panels/images: `rounded-lg`. Literal circles/pill-toggles: `rounded-full`.
- `.hero-spin` (rotating verification badge) is a deliberate `prefers-reduced-motion` exception — always
  animates. Same treatment applied to `.trust-marquee` (homepage scrolling trust badges). Every other animation
  respects reduced-motion normally.

## Architecture map

- `src/lib/types.ts` — `Product` type, shaped to mirror the WooCommerce REST product resource (id, slug, sku,
  price, stock_status, meta_data-style fields) so swapping mock data for a real API is an adapter, not a
  rewrite. Has `wooProductId?: number` — **required per-product before checkout can charge for the right item**,
  currently unset on everything (see WooCommerce status below).
- `src/lib/products.ts` — the catalog (60 products) + `getProducts` / `getFeaturedProducts` / `getProductBySlug`
  / `getRelatedProducts` / `categories`.
- `src/lib/coa.ts` — real Certificate of Analysis data (25 products, 35 lab reports) sourced from the client's
  own local WooCommerce dev site, matched to this catalog by product name. PDFs live in `public/coa/`.
- `src/lib/quiz-content.ts` — the "find your protocol" quiz's goal→subgoal→product-pick data, **and**
  `getProductGoalSlugs(slug)`, the single source of truth for the 6 research-category taxonomy used identically
  by the quiz, the shop mega menu, and Lab Results' category filter pills. If you add a new category anywhere,
  add it here first.
- `src/lib/upsells.ts` — cart/checkout/PDP upsell config (`getCartUpsellProducts`), mirrors the CMS plugin's
  planned `/altr/v1/upsells` endpoint shape.
- `src/lib/popups.ts` — admin-configurable popup/offer config, mirrors the CMS plugin's `altr_popup` CPT shape.
  Currently has one seeded example: a 10-minute countdown 50%-off GHK-Cu offer on `/checkout`.
- `src/lib/journal.ts` — blog/journal post data (6 real RUO-compliant articles).
- `src/lib/cart-context.tsx` — client-side cart (`CartProvider`/`useCart`), persists to `localStorage`
  (`altr-cart-v1`), drives the `CartDrawer` open state.
- `src/lib/woocommerce.ts` — the real integration layer: `isWooCommerceConfigured()` and `createWooOrder()`.
  See "Checkout / WooCommerce status" below — this is the load-bearing unfinished piece.
- `src/app/api/checkout/route.ts` — server route that calls `createWooOrder` (keeps API keys server-side).

### Pages
`/`, `/shop`, `/shop/[slug]`, `/checkout`, `/lab-results`, `/science`, `/journal`, `/journal/[slug]`, `/quiz`,
`/about`, `/faq`, `/contact`, `/legal/privacy`, `/legal/terms`, `/legal/shipping`, `/legal/returns`.

### Layout/global components (all wired into `src/app/layout.tsx`, in this order)
`AgeGate` → `AnnouncementBar` → `Header` (contains `ShopMegaMenu` + `SearchOverlay`) → page content → `Footer` →
`CartDrawer` → `QuizPopup` → `PopupManager` → `RecentPurchaseToast`.

- **`AgeGate`** — full-screen 21+ / RUO consent gate before the site is browsable. Single guest-consent path only
  (no sign-in/register — ALTR has no account system). 30-day localStorage grant (`altr_gate_access`).
- **`ShopMegaMenu`** — hover-triggered dropdown off the "Shop" nav link (desktop only), 6 category columns using
  the quiz's taxonomy, each linking straight to a real PDP.
- **`SearchOverlay`** — full product search (name/category/sku/description), triggered from the header search
  icon on both mobile and desktop.
- **`CartDrawer`** — real slide-out cart (not just a badge): line items, qty controls, remove, free-shipping
  progress, "frequently added together" upsell rail (`lib/upsells.ts`).
- **`QuizPopup`** — floating "Not sure what you need?" launcher, bottom-right, deep-links to `/quiz`.
- **`PopupManager`** — plays back whatever's active in `lib/popups.ts` (trigger: page-load/timed/scroll/
  exit-intent, one per page per session via `sessionStorage`).
- **`RecentPurchaseToast`** — bottom-left social-proof toast, cycles real products with Canadian buyer/city
  examples (Toronto ON, Vancouver BC, etc. — illustrative, not a live order feed).
- **`PdfViewerModal`** (`components/ui/`) — in-page PDF popup (iframe-based) used everywhere a COA is viewed
  (Lab Results list, PDP Lab Report tab, ProductCard) instead of opening a new tab.

## Product catalog rules

**Only add a product if you have a real photo for it.** Products without a photo were deliberately removed from
an earlier catalog version. If asked to add one without an image, use `ProductVisual`
(`src/components/ui/ProductVisual.tsx`) — a branded-label SVG placeholder matching the real photo style — and
ask whether to use that or wait for a real photo.

Real photos live in `public/images/products/`, filename = slug minus dosage (e.g. `bpc-157.jpg` for
`bpc-157-10mg`). 60 products currently, all with real photography (14 original `.jpg` shots + 46 `.png` label
renders added 2026-08-23). Only two categories exist: `peptides`, `ancillaries`.

**Prices, purity %, ratings, review counts are placeholder mock data** — flagged repeatedly throughout the
build, not real. Same for testimonials (`src/lib/content.ts`) and homepage stats ("150+ Researchers", "4.9/5").
Swap for real data before this goes fully live, or be upfront with customers that it's illustrative.

**COA data is real** (`src/lib/coa.ts`) — 25 of the 60 products have genuine downloaded lab reports (PDFs in
`public/coa/`), matched by product name from the client's own local WooCommerce dev install. The other 35
products don't have COAs yet; their PDP Lab Report tab falls back to old mock batch info with a note. If given
more real COA HTML/PDFs later, follow the same pattern: download PDFs to `public/coa/`, add entries to
`lib/coa.ts` matched by slug.

## Checkout / WooCommerce status — READ THIS FIRST if asked to "finish checkout"

Checkout UI is fully built (`/checkout`, `src/app/api/checkout/route.ts`, `src/lib/woocommerce.ts`) but **cannot
place real orders yet**. Current blocker, in order:

1. **`.env.local` has real WooCommerce REST API credentials** (`WORDPRESS_URL=https://headless.altrpeptides.com`,
   `WOOCOMMERCE_CONSUMER_KEY`, `WOOCOMMERCE_CONSUMER_SECRET`) — gitignored, already in place, do not need to ask
   the user for these again unless they've been rotated.
2. **The entire `headless.altrpeptides.com` domain is behind HTTP Basic Auth at the nginx level** — every
   request, including the bare WP REST API root, returns `401` with `WWW-Authenticate: Basic realm="Restricted"`
   before WordPress even processes it. This is a completely separate lock from the WooCommerce API keys and
   blocks everything. Confirmed via `curl -I https://headless.altrpeptides.com/`. **This needs to be resolved by
   the client (remove the Basic Auth staging gate, or provide the Basic Auth username/password) before the
   WooCommerce keys can even be tested.**
3. Once past #2: verify the WooCommerce keys actually work (`GET /wp-json/wc/v3/products`), then **map every one
   of the 60 catalog products to its real WooCommerce `product_id`** by SKU/slug, and set `wooProductId` on each
   `Product` entry in `src/lib/products.ts`. `createWooOrder()` in `lib/woocommerce.ts` deliberately throws a
   clear per-line error listing which products are missing this mapping, rather than silently placing a wrong
   order — don't work around that check, fix the mapping instead.
4. The checkout flow itself (once #1-#3 are done): creates a `pending` WooCommerce order via REST API, then
   redirects the customer to WooCommerce's own hosted "pay for order" page so WooCommerce/Stripe handles the
   actual charge — this app never touches card details directly. That architecture is finished and correct, it
   just needs a live, reachable store with mapped product IDs to actually run against.

**Never claim checkout is "connected" or fake a success state.** If asked to verify it, hit `/api/checkout`
directly and confirm it still returns the honest `501 store_not_connected` (or whatever the current real
blocker is) rather than assuming it works because the code looks right.

## CMS plugin (separate project, not deployed)

`C:\Users\PC\Desktop\ALTR\altr-cms-plugin\` — a WordPress plugin meant to eventually be the single source of
truth for this frontend's content (products, COAs, page copy, popups/upsells), consumed headlessly via a
`/altr/v1/*` REST API. It's a **separate git repo with no remote** (local commits only) and **has never been
activated on a real WordPress site** — it's built but unverified. Custom Post Types: `altr_product`, `altr_coa`,
`altr_content`, `altr_popup`. Has one-click importers for products/COAs (idempotent), an admin "Cart Upsells"
config screen, and REST endpoints matching `lib/upsells.ts` / `lib/popups.ts` / `lib/coa.ts`'s shapes exactly so
swapping the frontend from mock data to a live fetch is meant to be a small change per file, not a rewrite. If
picking this up: the natural next step is installing it on a real WP site (possibly `headless.altrpeptides.com`
once the Basic Auth issue is sorted) and testing activation.

## Legal pages

`/legal/privacy`, `/legal/terms`, `/legal/shipping`, `/legal/returns` — adapted from a competitor's real policy
templates (client provided the source text and asked to swap branding), all wired into the footer and the age
gate's terms link. Two factual adjustments already made versus the source templates: shipping availability says
"Canada and the United States" (matches the checkout country selector) not "Canada only", and the crypto-payment
reimbursement clause was dropped since this checkout doesn't accept crypto. If the client's actual policies
differ from what's live, treat these as a first draft, not final legal copy — they haven't been reviewed by a
lawyer.

## Known gaps / explicitly not built

- **No real checkout** — see WooCommerce status above, this is the big one.
- **No account/login system** — footer's "Account" link is intentionally inert text, not a bug.
- **CMS plugin not connected** — frontend still reads mock data from `src/lib/`.
- Contact form and newsletter form are UI-only — `// TODO` marks where to wire a real email provider.
- 35 of 60 products don't have real COAs yet (see catalog rules above).
- Homepage stats and testimonials are illustrative, not real.

## Common gotchas

- **Turbopack dev-server staleness**: after large edits, the dev server sometimes shows stale "module not
  found" / prop-type errors that reference code that no longer exists. Fix: `rm -rf .next`, restart the dev
  server, and open a **fresh browser tab** — a dead HMR WebSocket on an old tab is a frequent culprit, not
  actually a code bug. Always re-verify the error is real by re-reading the current source before debugging it.
- **`useSearchParams()` needs a `<Suspense>` boundary** for static prerendering — caused a real Vercel build
  failure once (`/shop`). Verify Vercel-affecting changes with an actual `npm run build`, not just `next dev`.
- **`overflow-x: hidden` on `<body>` breaks `position: sticky`** — setting only `overflow-x` (not `overflow-y`)
  on an element forces the browser to compute `overflow-y: auto`, turning `body` into a second scroll container
  that conflicts with `html`'s and silently breaks sticky positioning for descendants (broke the PDP's sticky
  product image once). Keep `overflow-x: hidden` on `html` only, never also on `body`.
- **`prefers-reduced-motion` may be enabled in the test browser** — if an animation looks static during
  verification, check `getComputedStyle(el).animationName` before assuming it's broken; it may just be
  correctly respecting the preference.
- This session's headless browser tooling **cannot render visible/composited frames** (screenshots reliably
  fail with "Browser pane is not displayed"), which also means CSS animation timelines don't visibly tick
  forward in tests — verify motion/animation work via computed-style checks (`animationName`, `transform`
  matrix deltas over real elapsed time via `setTimeout`), not by trying to eyeball a screenshot.

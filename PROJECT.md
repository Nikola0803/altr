# ALTR — Project Reference

Research-grade peptide e-commerce site. Next.js 16 (App Router) + TypeScript + Tailwind v4. No backend yet — all
product/content data is mocked in `src/lib/`, structured to swap for a real API later.

**Repo:** https://github.com/Nikola0803/altr.git (branch `master`)
**Local path:** `C:\Users\PC\Desktop\ALTR\altr-site`
**Dev server:** `npm run dev` (port 3010 via `.claude/launch.json` in the parent `ben softver` dir — see below)
**Deploy:** Vercel (auto-deploys from `master` on push)
**Push script:** double-click `push-to-github.bat` in the project root, or `git add . && git commit -m "..." && git push origin master`

## Brand

- **Name:** ALTR — tagline "THE STANDARD. NOT THE MARKUP." (hero) / "Change your state." (secondary/meta)
- **Category:** Research-use-only (RUO) peptides. **Never** make human-use, medical, treatment, or weight-loss
  claims — copy must stay in "independent testing / batch documentation / research use" language.
- **Positioning:** Premium, restrained, "luxury biotech" — not a bodybuilding/supplement-store aesthetic, not
  clinical/cold. North star: when in doubt, remove rather than add.
- **Full brand kit source:** `C:\Users\PC\Desktop\ALTR_Brand_Kit.pdf` (colors, logo rules, tone of voice, packaging)

### Colors (`src/app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| `ivory` | `#F4F0E7` | primary background |
| `ivory-soft` | `#FAF8F3` | secondary panels |
| `sage` | `#687767` | primary brand color, buttons |
| `sage-deep` | `#536252` | header/footer/dark bands, button hover |
| `sage-light` | `#97A494` | accents on dark bg |
| `sage-mist` | `#E7E9E2` | light tint, active pills |
| `sage-forest` | `#10130F` | near-black, deepest dark sections |
| `charcoal` | `#10130F` | body text, near-black bg |
| `stone` | `#D8D3C9` | borders/dividers |
| `soft-gray` | `#777970` | secondary/muted body text |

### Typography
- Display/headings: **Space Grotesk** (`--font-space-grotesk`, `.font-display`, `-0.03em` tracking globally)
- Body: **Inter** (`--font-inter`)
- Accent/italic emphasis: **Instrument Serif** (`--font-accent`, `.font-accent`)
- Icons: Remix Icon via CDN link in `layout.tsx` (`<i className="ri-*-line">`)

### Design system rules
- Buttons: `rounded-md` (not pills), primary = `bg-sage-deep text-ivory hover:bg-charcoal`, secondary = `border
  border-sage text-sage-deep`. See `src/components/ui/Button.tsx`.
- Content panels/images: `rounded-lg`. Literal circles and pill-toggles: `rounded-full`.
- No discount codes / countdown timers / fake urgency (removed a "12 people bought this" banner and a discount
  popup deliberately — brand kit explicitly forbids this).

## Architecture

- `src/lib/types.ts` — `Product` type, shaped to mirror WooCommerce REST fields (so swapping to a real API later
  is an adapter, not a rewrite).
- `src/lib/products.ts` — mock catalog + `getProducts`/`getFeaturedProducts`/`getProductBySlug`/`getRelatedProducts`.
- `src/lib/woocommerce.ts` — placeholder/notes for the future real WooCommerce REST or WPGraphQL integration.
- `src/lib/cart-context.tsx` — client-side cart state (badge count only, no real checkout yet).
- `src/components/home/*` — homepage sections, rendered in order from `src/app/page.tsx`.
- `src/components/product/*` — `ProductCard` (grid card, has hover-video), `PackSelector` (1pc/10pc toggle).
- `src/components/layout/*` — `Header`, `Footer`, `AnnouncementBar`, `NewsletterForm`, `CartToast`.
- Pages: `/`, `/shop`, `/shop/[slug]`, `/faq`, `/contact`, `/lab-results`, `/science`, `/journal`, `/about`.

## Product catalog — IMPORTANT

**Only add a product to `products.ts` if you have a real photo for it.** Products without a photo were
deliberately removed from the catalog (see git history: "Remove products without real photography"). If asked to
add a product without an image, use the `ProductVisual` SVG placeholder (`src/components/ui/ProductVisual.tsx`) —
it renders a branded label (ALTR wordmark, name, dosage, RESEARCH USE ONLY, sage band) matching the real photo
style, so ask whether to use that or wait for a photo.

Real product photos live in `public/images/products/` — filename convention is the product slug minus dosage,
e.g. `bpc-157.jpg`, `retatrutide.jpg`. Wired via the optional `image` field on `Product`.

Currently 59 products, all with real photography (13 original `.jpg` shots + 46 `.png` label renders added
2026-08-23). Categories: `peptides`, `ancillaries` (GHK-Cu, AHK-Cu, Glutathione, NAD+, Bacteriostatic Water) —
that's it, only two categories.

**Prices, purity %, ratings, review counts are all placeholder mock data** — flagged repeatedly, not real.
Same for testimonials (`src/lib/content.ts`) and the "150+ Researchers" / "4.9/5" stats — swap for real data
before this goes fully live, or be upfront with customers that it's illustrative.

**No HGH, no HCG, no "growth hormone" language anywhere on the site — this is a hard brand rule, not a
preference.** HGH/HCG are explicitly excluded from the catalog because they're black-market territory the client
wants zero association with (a competitor built their whole brand on it — ALTR deliberately does not). This
covers: no HGH/HCG product listings, no "growth hormone" category, and no product copy that spells out "growth
hormone" even for legitimate GH-axis secretagogues (GHRP-2/6, Hexarelin, Ipamorelin, CJC-1295, IGF-1 variants,
MGF/PEG-MGF, AOD-9604) — those stay in the `peptides` category and their descriptions use neutral terms like
"secretagogue" instead. If asked to add a new product, check it isn't HGH/HCG and that its description doesn't
say "growth hormone" before adding it.

## Media assets

- `public/videos/hero-water-2.mp4` — homepage hero background (real ALTR-labeled vials, water/droplets)
- `public/videos/standard-vial.mp4` — "The ALTR Standard" section, left side
- `public/videos/product-hover.mp4` — plays on product-card hover (crossfades over the static image)
- `public/images/products/*.jpg` — real product photography
- `public/images/science/*.jpg` — the 3 Science-section article images

## Known gaps / not-yet-built

- **No real checkout** — cart is a client-side badge counter only, no WooCommerce/Stripe integration.
- **No CMS/backend** — everything is hardcoded mock data in `src/lib/`.
- **`/journal`** is a "coming soon" placeholder — no article system exists.
- **Contact form and newsletter form** are UI-only — `// TODO` comments mark where to wire a real email provider.
- **"View COA" / "View Lab Results" links** go to `/lab-results` but don't deep-link to a specific batch's actual
  PDF/report — there's no real COA document system yet.
- Footer's Account/Orders/Returns and Terms/Privacy links are inert (no pages exist for them yet).

## Common gotchas hit this session

- **Turbopack dev-server staleness**: after large file edits, the dev server sometimes shows stale
  "module not found" errors that aren't real. Fix: `rm -rf .next` and restart the dev server (or open a fresh
  browser tab — sometimes it's just a dead HMR WebSocket on an old tab, not a server issue at all).
- **`useSearchParams()` requires a `<Suspense>` boundary** for static prerendering (caused a real Vercel build
  failure on `/shop` once — see `src/app/shop/page.tsx`). Always verify Vercel-affecting changes with an actual
  `npm run build`, not just `next dev` or `tsc --noEmit` — dev mode doesn't catch this class of error.
- **`prefers-reduced-motion`**: most animations respect it (accessibility best practice). The hero's rotating
  verification badge (`.hero-spin` in `globals.css`) is a deliberate exception — always spins regardless, per
  explicit request.

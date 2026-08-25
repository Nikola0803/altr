/**
 * Popup/offer configuration — mirrors the ALTR CMS plugin's `altr_popup`
 * CPT and `/altr/v1/popups/active` endpoint shape (see
 * altr-cms-plugin/includes/meta-boxes-popup.php + upsells.php pattern) so
 * swapping this mock for a live fetch later is a one-line change, not a
 * rewrite. Prices/discount are computed off the real catalog in
 * lib/products.ts at render time — never hardcoded here — so this can
 * never drift from the actual product price.
 */

export type PopupTrigger = "page-load" | "exit-intent" | "timed" | "scroll";

export interface PopupConfig {
  id: string;
  active: boolean;
  trigger: PopupTrigger;
  delaySeconds?: number;
  scrollPercent?: number;
  /** Empty array = show on every page. */
  pages: string[];
  badgeLabel: string;
  headline: string;
  body: string;
  /** Real product slug from lib/products.ts — price/name/image always pulled live from there. */
  productSlug: string;
  discountPercent: number;
  countdownMinutes: number;
  trustBadges: string[];
}

export const popups: PopupConfig[] = [
  {
    id: "checkout-ghk-cu-offer",
    active: true,
    trigger: "timed",
    delaySeconds: 6,
    pages: ["/checkout"],
    badgeLabel: "⚡ Limited Time — Checkout Offer",
    headline: "Complete Your Protocol — 50% Off GHK-Cu",
    body: "Pairs perfectly with what's in your cart. Add a GHK-Cu 50mg vial in the next 10 minutes and take 50% off — applied automatically, stacks with any active code.",
    productSlug: "ghk-cu-50mg",
    discountPercent: 50,
    countdownMinutes: 10,
    trustBadges: ["COA on file", "Third-party tested", "Ships from Canada"],
  },
];

/** One popup per page per session — first active match wins so multiple never stack. */
export function getActivePopupForPage(pathname: string) {
  return popups.find((p) => p.active && (p.pages.length === 0 || p.pages.includes(pathname))) ?? null;
}

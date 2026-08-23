import { getProductBySlug } from "./products";

/**
 * Cart upsell configuration — shaped to mirror the ALTR CMS plugin's
 * `/altr/v1/upsells` endpoint (admin picks headline + product slugs in the
 * plugin's Cart Upsells screen). Mock here until the frontend is wired to
 * the live plugin REST API; see `getCartUpsellProducts`.
 */
export interface UpsellConfig {
  headline: string;
  slugs: string[];
}

export const upsellConfig: UpsellConfig = {
  headline: "Frequently added together",
  slugs: ["bacteriostatic-water-10ml", "ghk-cu-50mg", "nad-plus-500mg", "bpc-157-10mg"],
};

export function getCartUpsellProducts(excludeProductIds: string[], limit = 4) {
  const products = upsellConfig.slugs.map((slug) => getProductBySlug(slug)).filter((p): p is NonNullable<typeof p> => !!p);
  return products.filter((p) => !excludeProductIds.includes(p.id)).slice(0, limit);
}

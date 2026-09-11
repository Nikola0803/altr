"use client";

import { Bundle } from "@/lib/types";
import { bundleSavePercent } from "@/lib/bundles";
import { useCart } from "@/lib/cart-context";

export function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart } = useCart();
  const savePercent = bundleSavePercent(bundle);

  function handleAddToCart() {
    // Synthetic Product just for the cart line -- bundles are their own
    // concept (duration-based, not dose-based) so they don't carry the
    // peptide-specific fields (purity/batch/etc).
    addToCart(
      {
        id: `bundle-${bundle.slug}`,
        slug: bundle.slug,
        sku: bundle.slug,
        name: bundle.name,
        category: "peptides",
        categoryLabel: bundle.category,
        price: bundle.price,
        rating: 5,
        reviewCount: 0,
        inStock: true,
        shortDescription: bundle.tagline,
        description: bundle.tagline,
        storage: "",
      },
      1,
      bundle.price,
      bundle.duration
    );
  }

  return (
    <div className="flex flex-col rounded-lg border border-stone bg-white p-6">
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-sage-deep">{bundle.category}</span>
      <h3 className="mt-1.5 font-display text-xl font-bold text-charcoal">{bundle.tagline}</h3>
      <p className="mt-0.5 text-sm text-charcoal/50">{bundle.name}</p>

      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.15em] text-charcoal/40">
        <i className="ri-calendar-line text-sage-deep" /> {bundle.duration}
      </div>

      <div className="mt-4 flex items-baseline gap-2 border-t border-stone pt-4">
        <span className="font-display text-2xl font-bold text-charcoal">
          ${bundle.price.toFixed(2)} <span className="text-xs font-normal text-charcoal/40">CAD</span>
        </span>
        <span className="text-sm text-charcoal/40 line-through">${bundle.compareAtPrice.toFixed(2)}</span>
        <span className="ml-auto rounded-full bg-sage-mist px-2 py-0.5 text-[10px] font-semibold text-sage-deep">
          Save {savePercent}%
        </span>
      </div>

      {bundle.comingSoon ? (
        <button
          type="button"
          disabled
          className="mt-5 w-full rounded-md bg-stone py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-charcoal/40"
        >
          Coming Soon
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-5 w-full rounded-md bg-sage-deep py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory transition hover:bg-charcoal"
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}

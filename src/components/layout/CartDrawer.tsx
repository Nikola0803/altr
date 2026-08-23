"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { getCartUpsellProducts } from "@/lib/upsells";
import { ButtonLink } from "@/components/ui/Button";

const SHIPPING_THRESHOLD = 400;

export function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, removeLine, updateQty, addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const shippingRemaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);
  const cartProductIds = lines.map((l) => l.product.id);
  const upsells = getCartUpsellProducts(cartProductIds);

  function handleCheckout() {
    closeCart();
    router.push("/checkout");
  }

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-charcoal/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[95] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone px-5 py-4">
          <h2 className="font-display text-lg font-bold text-charcoal">
            Your Cart {lines.length > 0 && <span className="text-charcoal/40">({lines.reduce((s, l) => s + l.qty, 0)})</span>}
          </h2>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="flex h-9 w-9 items-center justify-center rounded-full text-charcoal/60 transition hover:bg-ivory-soft hover:text-charcoal">
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <i className="ri-shopping-bag-line text-4xl text-charcoal/20" />
            <p className="text-sm text-charcoal/50">Your cart is empty.</p>
            <ButtonLink href="/shop" size="md" onClick={closeCart}>
              Shop Products
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="mb-5 rounded-lg border border-stone bg-ivory-soft p-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-charcoal">Free shipping</span>
                  <span className="font-bold text-sage-deep">{shippingRemaining > 0 ? `$${shippingRemaining.toFixed(0)} away` : "Unlocked"}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-stone">
                  <div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
                </div>
              </div>

              <ul className="space-y-4">
                {lines.map((line) => (
                  <li key={`${line.product.id}-${line.packLabel}`} className="flex gap-3">
                    <Link href={`/shop/${line.product.slug}`} onClick={closeCart} className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ivory-soft">
                      {line.product.image && (
                        <Image src={line.product.image} alt={line.product.name} width={160} height={160} className="h-full w-full object-cover" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/shop/${line.product.slug}`} onClick={closeCart} className="text-sm font-medium text-charcoal hover:opacity-70">
                          {line.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeLine(line.product.id, line.packLabel)}
                          aria-label="Remove item"
                          className="shrink-0 text-charcoal/30 transition hover:text-charcoal"
                        >
                          <i className="ri-close-line" />
                        </button>
                      </div>
                      <span className="text-xs text-charcoal/50">{line.packLabel}</span>
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border border-stone">
                          <button
                            type="button"
                            onClick={() => updateQty(line.product.id, line.packLabel, line.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center text-charcoal/60 transition hover:bg-ivory-soft"
                            aria-label="Decrease quantity"
                          >
                            <i className="ri-subtract-line text-xs" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold text-charcoal">{line.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(line.product.id, line.packLabel, line.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center text-charcoal/60 transition hover:bg-ivory-soft"
                            aria-label="Increase quantity"
                          >
                            <i className="ri-add-line text-xs" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-charcoal">${(line.qty * line.unitPrice).toFixed(2)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {upsells.length > 0 && (
                <div className="mt-8 border-t border-stone pt-5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/50">Frequently added together</p>
                  <div className="space-y-3">
                    {upsells.map((product) => (
                      <div key={product.id} className="flex items-center gap-3 rounded-lg border border-stone bg-ivory-soft p-2.5">
                        <Link href={`/shop/${product.slug}`} onClick={closeCart} className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-ivory">
                          {product.image && <Image src={product.image} alt={product.name} width={96} height={96} className="h-full w-full object-cover" />}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-charcoal/50">${product.price.toFixed(2)} CAD</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addToCart(product, 1, product.price, "1 PCS", { silent: true })}
                          className="shrink-0 rounded-md border border-charcoal px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-charcoal transition hover:bg-charcoal hover:text-ivory"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-stone px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-charcoal/60">Subtotal</span>
                <span className="font-display text-lg font-bold text-charcoal">${subtotal.toFixed(2)} CAD</span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full rounded-md bg-sage-deep py-3.5 text-sm font-bold uppercase tracking-wide text-ivory transition hover:bg-charcoal"
              >
                Checkout
              </button>
              <button type="button" onClick={closeCart} className="mt-3 w-full text-center text-xs font-medium text-charcoal/50 transition hover:text-charcoal">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

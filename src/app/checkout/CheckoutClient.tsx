"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getCartUpsellProducts } from "@/lib/upsells";

const SHIPPING_THRESHOLD = 400;
const FLAT_SHIPPING = 15;
const FEATURED_DISCOUNT = 25;
const SECONDARY_DISCOUNT = 10;

export function CheckoutClient() {
  const { lines, subtotal, addToCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const shipping = subtotal >= SHIPPING_THRESHOLD || lines.length === 0 ? 0 : FLAT_SHIPPING;
  const total = subtotal + shipping;
  const shippingRemaining = Math.max(0, SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / SHIPPING_THRESHOLD) * 100);

  const cartProductIds = lines.map((l) => l.product.id);
  const upsells = getCartUpsellProducts(cartProductIds, 4);
  const [featured, ...secondary] = upsells;

  function quickAdd(product: (typeof upsells)[number], discountPercent: number) {
    const salePrice = product.price * (1 - discountPercent / 100);
    addToCart(product, 1, salePrice, `${discountPercent}% Off`, { silent: true });
    setAddedIds((ids) => [...ids, product.id]);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const customer = {
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address1: String(formData.get("address1") || ""),
      address2: String(formData.get("address2") || ""),
      city: String(formData.get("city") || ""),
      province: String(formData.get("province") || ""),
      postcode: String(formData.get("postcode") || ""),
      country: String(formData.get("country") || "CA"),
    };

    const checkoutLines = lines.map((l) => ({
      product: { id: l.product.id, sku: l.product.sku, name: l.product.name, wooProductId: l.product.wooProductId },
      qty: l.qty,
      unitPrice: l.unitPrice,
    }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: checkoutLines, customer }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong placing your order.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.payUrl;
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <section className="mx-auto max-w-[600px] px-4 py-24 text-center md:px-8">
        <i className="ri-shopping-bag-line text-4xl text-charcoal/20" />
        <h1 className="mt-4 font-display text-2xl font-bold text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-sm text-charcoal/50">Add a few products before checking out.</p>
        <Link href="/shop" className="mt-6 inline-block rounded-md bg-sage-deep px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-ivory transition hover:bg-charcoal">
          Shop Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 md:px-8 md:py-16">
      <h1 className="mb-8 font-display text-2xl font-bold text-charcoal md:text-3xl">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Contact</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" required />
              <Field label="Last name" name="lastName" required />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" required />
              <Field label="Phone" name="phone" type="tel" />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Shipping address</h2>
            <div className="space-y-4">
              <Field label="Address" name="address1" required />
              <Field label="Apartment, suite, etc. (optional)" name="address2" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="City" name="city" required />
                <Field label="Province" name="province" required />
                <Field label="Postal code" name="postcode" required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-charcoal">Country</label>
                <select name="country" defaultValue="CA" className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-sage-deep">
                  <option value="CA">Canada</option>
                  <option value="US">United States</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Couldn&apos;t place your order</p>
              <p className="mt-1">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-sage-deep py-4 text-sm font-bold uppercase tracking-wide text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : `Continue to Payment — $${total.toFixed(2)}`}
          </button>
          <p className="text-center text-xs text-charcoal/40">You&apos;ll enter payment details on the next step.</p>
        </form>

        <div className="h-fit rounded-lg border border-stone bg-ivory-soft p-6">
          {shippingRemaining > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium text-charcoal/60">
                Spend <span className="font-semibold text-sage-deep">${shippingRemaining.toFixed(2)}</span> more for
                free shipping
              </p>
              <div className="h-1.5 overflow-hidden rounded-full bg-stone">
                <div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${shippingProgress}%` }} />
              </div>
            </div>
          )}

          <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-charcoal/70">Order Summary</h2>
          <ul className="space-y-4">
            {lines.map((line) => (
              <li key={`${line.product.id}-${line.packLabel}`} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-ivory">
                  {line.product.image && <Image src={line.product.image} alt={line.product.name} width={112} height={112} className="h-full w-full object-cover" />}
                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] font-semibold text-ivory">
                    {line.qty}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{line.product.name}</p>
                  <p className="text-xs text-charcoal/50">{line.packLabel}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-charcoal">${(line.qty * line.unitPrice).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          {featured && !addedIds.includes(featured.id) && (
            <div className="mt-6 rounded-lg border border-sage-deep/30 bg-sage-mist/40 p-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-sage-deep">
                Add {featured.name.split(/\s\d/)[0]} — {FEATURED_DISCOUNT}% off today only
              </p>
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-ivory">
                  {featured.image && <Image src={featured.image} alt={featured.name} width={112} height={112} className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-charcoal">{featured.name}</p>
                  <p className="text-xs">
                    <span className="text-charcoal/40 line-through">${featured.price.toFixed(2)}</span>{" "}
                    <span className="font-semibold text-sage-deep">
                      ${(featured.price * (1 - FEATURED_DISCOUNT / 100)).toFixed(2)}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => quickAdd(featured, FEATURED_DISCOUNT)}
                  className="shrink-0 rounded-md bg-sage-deep px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-ivory transition hover:bg-charcoal"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2 border-t border-stone pt-4 text-sm">
            <div className="flex justify-between text-charcoal/60">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-charcoal/60">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-stone pt-2 text-base font-bold text-charcoal">
              <span>Total</span>
              <span>${total.toFixed(2)} CAD</span>
            </div>
          </div>

          {secondary.length > 0 && (
            <div className="mt-6 border-t border-stone pt-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-charcoal/50">Researchers Also Add</p>
              <div className="space-y-2.5">
                {secondary.map((up) => {
                  const added = addedIds.includes(up.id);
                  const salePrice = up.price * (1 - SECONDARY_DISCOUNT / 100);
                  return (
                    <div key={up.id} className="flex items-center gap-3 rounded-md border border-stone bg-ivory p-2.5">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-ivory-soft">
                        {up.image && <Image src={up.image} alt={up.name} width={80} height={80} className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-charcoal">{up.name}</p>
                        <p className="text-xs">
                          <span className="text-charcoal/40 line-through">${up.price.toFixed(2)}</span>{" "}
                          <span className="font-semibold text-sage-deep">${salePrice.toFixed(2)}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={added}
                        onClick={() => quickAdd(up, SECONDARY_DISCOUNT)}
                        className="shrink-0 rounded-full bg-sage-mist px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sage-deep transition hover:bg-sage-deep hover:text-ivory disabled:cursor-default disabled:opacity-50"
                      >
                        {added ? "Added" : `Add — ${SECONDARY_DISCOUNT}% off`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-charcoal">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-stone bg-ivory px-4 py-2.5 text-sm outline-none transition focus:border-sage-deep"
      />
    </div>
  );
}

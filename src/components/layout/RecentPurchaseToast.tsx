"use client";

/**
 * Floating "recent purchase" social-proof toast, bottom-left. Cycles
 * through real catalog products; buyer name, city, and "N minutes ago"
 * are illustrative examples (Canadian markets, matching ALTR's
 * Canada-wide shipping / CAD pricing), not a live feed of real orders —
 * same convention used for testimonials and review counts elsewhere on
 * the site (see PROJECT.md's "placeholder mock data" note).
 */

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { getProducts } from "@/lib/products";

const SAMPLE_BUYERS = [
  { name: "Jordan K.", city: "Toronto, ON" },
  { name: "Maria S.", city: "Vancouver, BC" },
  { name: "David L.", city: "Calgary, AB" },
  { name: "Priya R.", city: "Montreal, QC" },
  { name: "Chris T.", city: "Ottawa, ON" },
  { name: "Sarah M.", city: "Winnipeg, MB" },
  { name: "Alex D.", city: "Halifax, NS" },
];

const MINUTES_AGO = [12, 27, 41, 58, 6, 33, 19];

const SHOW_MS = 7000;
const GAP_MS = 9000;
const FIRST_DELAY_MS = 5000;

export function RecentPurchaseToast() {
  const products = useMemo(() => getProducts().filter((p) => p.image).slice(0, 10), []);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [stopped, setStopped] = useState(false);

  useEffect(() => {
    if (stopped || products.length === 0) return;

    let showTimer: number;
    let hideTimer: number;

    const cycle = () => {
      setVisible(true);
      hideTimer = window.setTimeout(() => {
        setVisible(false);
        showTimer = window.setTimeout(() => {
          setIndex((i) => (i + 1) % products.length);
          cycle();
        }, GAP_MS);
      }, SHOW_MS);
    };

    const first = window.setTimeout(cycle, FIRST_DELAY_MS);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [stopped, products.length]);

  if (stopped || products.length === 0) return null;

  const product = products[index];
  const buyer = SAMPLE_BUYERS[index % SAMPLE_BUYERS.length];
  const minutesAgo = MINUTES_AGO[index % MINUTES_AGO.length];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 top-[100px] z-40 transition-all duration-500 ease-out sm:inset-x-auto sm:bottom-6 sm:left-6 sm:top-auto sm:w-[min(18rem,calc(100vw-7rem))] ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0 sm:translate-y-2"
      }`}
    >
      <div className="relative flex items-center gap-3 rounded-xl border border-stone bg-ivory/95 p-3 pr-8 shadow-lg backdrop-blur-sm">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-ivory-soft">
          {product.image && <Image src={product.image} alt={product.name} width={112} height={112} className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-charcoal/50">
            <span className="font-semibold text-charcoal/80">{buyer.name}</span>
            <span> · {buyer.city}</span>
          </p>
          <p className="mt-0.5 truncate font-display text-sm font-semibold text-charcoal">{product.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium text-sage-deep">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage-deep/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-deep" />
            </span>
            Purchased {minutesAgo} minutes ago
          </p>
        </div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setStopped(true)}
          className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full text-charcoal/40 transition hover:bg-ivory-soft hover:text-charcoal"
        >
          <i className="ri-close-line text-xs" />
        </button>
      </div>
    </div>
  );
}

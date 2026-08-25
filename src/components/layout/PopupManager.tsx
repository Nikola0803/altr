"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { getActivePopupForPage, PopupConfig } from "@/lib/popups";
import { getProductBySlug } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

const SEEN_KEY_PREFIX = "altr_popup_seen_";

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Site-wide popup renderer, driven entirely by lib/popups.ts (which mirrors
 * the CMS plugin's Popups & Offers screen — admin picks trigger/copy/
 * product/discount/countdown there; this component just plays it back).
 * Dismissed once per session per popup id so it doesn't nag on every
 * navigation.
 */
export function PopupManager() {
  const pathname = usePathname();
  const { addToCart } = useCart();
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<PopupConfig | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    setVisible(false);
    setClaimed(false);
    const popup = getActivePopupForPage(pathname);
    setConfig(popup);
    if (!popup) return;

    try {
      if (sessionStorage.getItem(SEEN_KEY_PREFIX + popup.id)) return;
    } catch {
      /* ignore */
    }

    function show() {
      setSecondsLeft(popup!.countdownMinutes * 60);
      setVisible(true);
    }

    if (popup.trigger === "page-load") {
      show();
      return;
    }

    if (popup.trigger === "timed") {
      const t = window.setTimeout(show, (popup.delaySeconds ?? 5) * 1000);
      return () => window.clearTimeout(t);
    }

    if (popup.trigger === "scroll") {
      const threshold = popup.scrollPercent ?? 50;
      const onScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= threshold) {
          show();
          window.removeEventListener("scroll", onScroll);
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    if (popup.trigger === "exit-intent") {
      const onLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          show();
          document.removeEventListener("mouseleave", onLeave);
        }
      };
      document.addEventListener("mouseleave", onLeave);
      return () => document.removeEventListener("mouseleave", onLeave);
    }
  }, [pathname]);

  // Live countdown while the popup is open.
  useEffect(() => {
    if (!visible || claimed) return;
    if (secondsLeft <= 0) {
      dismiss();
      return;
    }
    const t = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [visible, secondsLeft, claimed]);

  function dismiss() {
    if (config) {
      try {
        sessionStorage.setItem(SEEN_KEY_PREFIX + config.id, "1");
      } catch {
        /* ignore */
      }
    }
    setVisible(false);
  }

  function handleClaim() {
    if (!config) return;
    const product = getProductBySlug(config.productSlug);
    if (!product) return;
    const salePrice = product.price * (1 - config.discountPercent / 100);
    addToCart(product, 1, salePrice, `${config.discountPercent}% Off Offer`);
    setClaimed(true);
    try {
      sessionStorage.setItem(SEEN_KEY_PREFIX + config.id, "1");
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setVisible(false), 900);
  }

  if (!visible || !config) return null;

  const product = getProductBySlug(config.productSlug);
  if (!product) return null;

  const salePrice = product.price * (1 - config.discountPercent / 100);

  return (
    <div className="fixed inset-0 z-[130] flex items-end justify-center bg-charcoal/60 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={dismiss}>
      <div
        className="w-full overflow-hidden rounded-t-2xl border border-stone bg-ivory sm:max-w-sm sm:rounded-2xl"
        style={{ boxShadow: "0 40px 90px -30px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between bg-sage-deep px-5 py-2.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ivory">{config.badgeLabel}</span>
          <button type="button" onClick={dismiss} aria-label="Close" className="text-lg leading-none text-ivory/80 transition hover:text-ivory">
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-ivory-soft">
              {product.image && <Image src={product.image} alt={product.name} width={160} height={160} className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold leading-snug text-charcoal">{config.headline}</h3>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{config.body}</p>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-sm text-charcoal/40 line-through">${product.price.toFixed(2)}</span>
            <span className="font-display text-2xl font-bold text-sage-deep">${salePrice.toFixed(2)}</span>
            <span className="rounded-full bg-sage-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage-deep">
              Save ${(product.price - salePrice).toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-md border border-stone bg-ivory-soft px-3 py-2">
            <span className="text-[11px] font-medium uppercase tracking-wide text-charcoal/50">Time Remaining</span>
            <span className="font-mono text-sm font-bold text-charcoal">{formatCountdown(secondsLeft)}</span>
          </div>

          <button
            type="button"
            onClick={handleClaim}
            disabled={claimed}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-sage-deep text-sm font-bold uppercase tracking-wide text-ivory transition hover:bg-charcoal disabled:cursor-default disabled:bg-sage"
          >
            {claimed ? "Added to Cart" : `Add ${product.name.split(/\s\d/)[0]} & Save ${config.discountPercent}% →`}
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {config.trustBadges.map((b) => (
              <span key={b} className="flex items-center gap-1 text-[11px] text-charcoal/50">
                <i className="ri-checkbox-circle-line text-sage-deep" /> {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

/**
 * AgeGate: research-access wall shown before the site is browsable.
 *
 * Single consent step (age 21+ confirmation + RUO terms) — no sign-in/
 * register tabs, since ALTR has no account/auth system (cart is
 * client-only; checkout hands off to WooCommerce's own hosted payment
 * page). If accounts get built later, this is the natural place to add
 * Sign In / Create Account tabs alongside the guest path.
 *
 * Access is remembered in localStorage for 30 days. Children render
 * underneath the overlay (good for SEO, no layout shift); body scroll is
 * locked until access is granted.
 */

import { useEffect, useRef, useState } from "react";

const ACCESS_KEY = "altr_gate_access";
const ACCESS_TTL_DAYS = 30;
const MIN_AGE = 21;

const TRUST_POINTS = ["≥99% Tested Purity", "Independent Third-Party Testing", "Batch-Level COAs Published"];

export function AgeGate({ children }: { children: React.ReactNode }) {
  const [granted, setGranted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeEmail, setAgreeEmail] = useState(true);
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(ACCESS_KEY);
      if (raw) {
        const { ts } = JSON.parse(raw) as { ts: number };
        if (Date.now() - ts < ACCESS_TTL_DAYS * 864e5) {
          setGranted(true);
        }
      }
    } catch {
      /* ignore */
    }
    setChecking(false);
  }, []);

  useEffect(() => {
    if (checking || granted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [checking, granted]);

  useEffect(() => {
    if (!checking && !granted) setTimeout(() => checkboxRef.current?.focus(), 80);
  }, [checking, granted]);

  const shake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  function handleEnter() {
    if (!agreeTerms) {
      setError(`You must confirm you are ${MIN_AGE}+ and agree to the research-only terms.`);
      shake();
      return;
    }
    try {
      window.localStorage.setItem(ACCESS_KEY, JSON.stringify({ ts: Date.now(), marketing: agreeEmail }));
    } catch {
      /* ignore */
    }
    setGranted(true);
  }

  if (granted || checking) {
    return (
      <>
        {children}
        {checking && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-charcoal" aria-hidden>
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone border-t-sage" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {children}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto p-4"
        style={{ background: "rgba(16,19,15,0.92)", backdropFilter: "blur(10px)" }}
      >
        <div
          className="flex w-full overflow-hidden rounded-xl border border-stone/40"
          style={{
            maxWidth: 900,
            maxHeight: "94vh",
            boxShadow: "0 40px 120px rgba(0,0,0,0.6)",
            animation: shaking ? "gate-shake 0.6s cubic-bezier(.36,.07,.19,.97)" : undefined,
          }}
        >
          {/* Left brand panel */}
          <div className="relative hidden w-[340px] shrink-0 flex-col justify-between overflow-hidden bg-charcoal p-9 md:flex">
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/hero-vial.jpg" alt="" className="h-full w-full object-cover opacity-40" />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to bottom, rgba(16,19,15,0.6) 0%, rgba(16,19,15,0.25) 45%, rgba(16,19,15,0.95) 100%)" }}
              />
            </div>

            <div className="relative z-10">
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/50">Verified Research Access</p>
              <p className="font-display text-2xl font-medium tracking-[0.28em] text-ivory">ALTR</p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">Research Peptides</p>
            </div>

            <div className="relative z-10 my-6 flex flex-col gap-2.5">
              {TRUST_POINTS.map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <i className="ri-checkbox-circle-fill text-sage-light" />
                  <span className="text-[12px] font-medium text-white/70">{t}</span>
                </div>
              ))}
            </div>

            <p className="relative z-10 text-[11px] leading-relaxed text-white/40">
              The Standard. Not the markup.
            </p>
          </div>

          {/* Right panel */}
          <div className="flex flex-1 flex-col overflow-y-auto bg-ivory" style={{ maxHeight: "94vh" }}>
            <div className="flex flex-1 flex-col gap-4 p-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-charcoal">Confirm research access</h2>
                <p className="mt-1 text-[13px] text-charcoal/60">
                  You must be {MIN_AGE}+ and agree to our research-only terms to browse.
                </p>
              </div>

              <div className="mt-1 rounded-lg border border-stone bg-ivory-soft p-4">
                <div className="mb-2 flex items-center gap-2">
                  <i className="ri-shield-check-line text-sage-deep" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sage-deep">Research Use Only</p>
                </div>
                <p className="mb-1 text-[12px] leading-relaxed text-charcoal/60">
                  By using this site you acknowledge that all products and information are provided for
                  laboratory research purposes only and are not intended for human consumption or medical use.
                </p>
                <p className="mb-3 text-[12px] font-medium text-charcoal/80">
                  You must be {MIN_AGE} years of age or older to use this website.
                </p>

                <label className="mb-3 flex cursor-pointer items-start gap-3">
                  <input
                    ref={checkboxRef}
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      setError("");
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sage-deep"
                  />
                  <span className="text-[12px] font-medium leading-snug text-charcoal/80">
                    I confirm I am {MIN_AGE} or older and agree to the{" "}
                    <a href="/legal/terms" className="text-sage-deep hover:underline">
                      research-only terms
                    </a>
                    .
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={agreeEmail}
                    onChange={(e) => setAgreeEmail(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-sage-deep"
                  />
                  <span className="text-[12px] leading-snug text-charcoal/50">
                    Yes, I&apos;d like to receive occasional research updates from ALTR. I may unsubscribe at any time.
                  </span>
                </label>
              </div>

              {error && (
                <p className="flex items-center gap-1.5 text-[12px] font-medium text-red-600">
                  <i className="ri-error-warning-line shrink-0 text-sm" />
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleEnter}
                className="mt-1 h-12 w-full rounded-md bg-sage-deep text-[13px] font-semibold uppercase tracking-widest text-ivory transition hover:bg-charcoal"
              >
                Enter Site
              </button>
            </div>

            <div className="border-t border-stone bg-ivory-soft px-8 py-4">
              <p className="mb-0.5 font-display text-[12px] tracking-wide text-charcoal">ALTR — The Standard. Not the markup.</p>
              <p className="text-[11px] leading-relaxed text-charcoal/50">
                Access to product information is restricted to verified researchers who confirm the
                research-only terms above.
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes gate-shake {
            0%,100% { transform: translateX(0); }
            15% { transform: translateX(-9px); }
            30% { transform: translateX(9px); }
            45% { transform: translateX(-6px); }
            60% { transform: translateX(6px); }
            75% { transform: translateX(-3px); }
            90% { transform: translateX(3px); }
          }
        `}</style>
      </div>
    </>
  );
}

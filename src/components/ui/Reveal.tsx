"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered fade-up reveal (opacity 0->1, translateY 16px->0,
 * 650ms, no bounce/spin/parallax). A single IntersectionObserver per
 * instance; `stagger` cascades child reveal via CSS transition-delay (see
 * .reveal-stagger > * in globals.css) instead of observing every child
 * individually.
 */
export function Reveal({
  children,
  className = "",
  stagger = false,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${stagger ? "reveal-stagger" : ""} ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

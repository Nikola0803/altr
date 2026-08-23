"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts } from "@/lib/products";

export function SearchOverlay({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const products = useMemo(() => getProducts(), []);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [products, query]);

  function goToAllResults(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div onClick={onClose} className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />

      <div className="relative mx-auto mt-0 max-h-full w-full max-w-2xl overflow-y-auto bg-ivory px-4 pb-8 pt-24 shadow-2xl md:mt-[10vh] md:rounded-lg md:pt-6">
        <form onSubmit={goToAllResults} className="relative">
          <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, compounds, categories..."
            className="w-full rounded-md border border-stone bg-ivory-soft py-3.5 pl-12 pr-12 text-base outline-none transition focus:border-sage-deep"
          />
          <button type="button" onClick={onClose} aria-label="Close search" className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/50 transition hover:bg-stone/40 hover:text-charcoal">
            <i className="ri-close-line" />
          </button>
        </form>

        {query.trim() && (
          <div className="mt-6">
            {results.length > 0 ? (
              <>
                <ul className="divide-y divide-stone">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link href={`/shop/${product.slug}`} onClick={onClose} className="flex items-center gap-4 py-3 transition hover:opacity-70">
                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-ivory-soft">
                          {product.image && <Image src={product.image} alt={product.name} width={112} height={112} className="h-full w-full object-cover" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-charcoal/50">{product.categoryLabel}</p>
                        </div>
                        <span className="shrink-0 text-sm font-semibold text-charcoal">${product.price.toFixed(2)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={goToAllResults}
                  className="mt-4 w-full rounded-md border border-stone py-3 text-xs font-semibold uppercase tracking-wide text-charcoal/70 transition hover:border-sage-deep hover:text-sage-deep"
                >
                  View all results for &ldquo;{query.trim()}&rdquo;
                </button>
              </>
            ) : (
              <p className="py-8 text-center text-sm text-charcoal/50">No products found for &ldquo;{query.trim()}&rdquo;.</p>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="mt-6">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-charcoal/40">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["BPC-157", "Retatrutide", "Semaglutide", "NAD+", "Tirzepatide"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-stone px-4 py-2 text-xs text-charcoal/70 transition hover:border-sage-deep hover:text-sage-deep"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

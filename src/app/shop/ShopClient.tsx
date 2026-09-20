"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function ShopClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) setQuery(searchFromUrl);
  }, [searchParams]);

  const filtered = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }, [products, query]);

  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">Products</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Every ALTR product is rigorously lab tested, with multiple samples sent for every batch to ensure
            consistency, accuracy and complete transparency.
          </p>
          <div className="relative mx-auto mt-8 max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-md border border-white/20 bg-white/10 py-3 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-white/50 focus:border-white/50"
            />
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-14 md:px-8 md:py-20">
        <p className="mb-6 text-sm text-charcoal/50">Showing {filtered.length} products</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}

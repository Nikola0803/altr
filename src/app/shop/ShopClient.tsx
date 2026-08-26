"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { QUIZ_GOALS, getProductGoalSlugs } from "@/lib/quiz-content";

const BLEND_SLUGS = ["wolverine-stack-20mg", "glow-70mg", "klow-80mg", "cjc-1295-without-dac-ipamorelin-10mg"];

type Format = "single" | "blend" | "ancillary";

function getFormat(p: Product): Format {
  if (p.category === "ancillaries") return "ancillary";
  if (BLEND_SLUGS.includes(p.slug)) return "blend";
  return "single";
}

const FORMATS: { value: Format; label: string }[] = [
  { value: "single", label: "Single Vial" },
  { value: "blend", label: "Blend" },
  { value: "ancillary", label: "Ancillary" },
];

export function ShopClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [format, setFormat] = useState<Format | null>(null);
  const [sortAZ, setSortAZ] = useState(false);
  const [openPanel, setOpenPanel] = useState<"category" | "format" | null>(null);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) setQuery(searchFromUrl);
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl === "ancillaries") setFormat("ancillary");
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = products;
    if (goal) list = list.filter((p) => getProductGoalSlugs(p.slug).includes(goal));
    if (format) list = list.filter((p) => getFormat(p) === format);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }
    if (sortAZ) list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, goal, format, query, sortAZ]);

  function resetAll() {
    setGoal(null);
    setFormat(null);
    setSortAZ(false);
    setOpenPanel(null);
  }

  const goalLabel = goal ? QUIZ_GOALS.find((g) => g.slug === goal)?.label : null;
  const formatLabel = format ? FORMATS.find((f) => f.value === format)?.label : null;

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

      <section className="sticky top-[90px] z-40 border-b border-stone bg-ivory/95 backdrop-blur-sm md:top-[100px]">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="relative flex items-center gap-2 overflow-x-auto py-4 md:gap-3">
            <button
              type="button"
              onClick={resetAll}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:px-5 ${
                !goal && !format && !sortAZ ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
              }`}
            >
              All
            </button>

            {/* Shop by Category */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpenPanel((p) => (p === "category" ? null : "category"))}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:px-5 ${
                  goal ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
                }`}
              >
                {goalLabel ?? "Shop by Category"}
                <i className={`ri-arrow-down-s-line transition-transform ${openPanel === "category" ? "rotate-180" : ""}`} />
              </button>
              {openPanel === "category" && (
                <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border border-stone bg-ivory p-2 shadow-xl">
                  {QUIZ_GOALS.map((g) => (
                    <button
                      key={g.slug}
                      type="button"
                      onClick={() => {
                        setGoal(g.slug);
                        setOpenPanel(null);
                      }}
                      className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                        goal === g.slug ? "bg-sage-mist text-sage-deep font-semibold" : "text-charcoal/70 hover:bg-ivory-soft"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shop by Format */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setOpenPanel((p) => (p === "format" ? null : "format"))}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:px-5 ${
                  format ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
                }`}
              >
                {formatLabel ?? "Shop by Format"}
                <i className={`ri-arrow-down-s-line transition-transform ${openPanel === "format" ? "rotate-180" : ""}`} />
              </button>
              {openPanel === "format" && (
                <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-stone bg-ivory p-2 shadow-xl">
                  {FORMATS.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => {
                        setFormat(f.value);
                        setOpenPanel(null);
                      }}
                      className={`block w-full rounded-md px-3 py-2 text-left text-sm transition ${
                        format === f.value ? "bg-sage-mist text-sage-deep font-semibold" : "text-charcoal/70 hover:bg-ivory-soft"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSortAZ((v) => !v)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:px-5 ${
                sortAZ ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
              }`}
            >
              A–Z
            </button>

            <button
              type="button"
              onClick={() => {
                setFormat("blend");
                setOpenPanel(null);
              }}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition md:px-5 ${
                format === "blend" ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
              }`}
            >
              Bundles
            </button>
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

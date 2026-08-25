"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProductCoas } from "@/lib/coa";
import { QUIZ_GOALS, getProductGoalSlugs } from "@/lib/quiz-content";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

const WHY_POINTS = [
  "HPLC purity analysis with quantification",
  "Mass spectrometry / endotoxin screening for identity and safety",
  "Independent labs, no financial stake in the result",
  "Reports published per batch, not reused across future stock",
];

const PROTOCOL = [
  ["1", "Sample Collection", "Multiple vials randomly selected from each batch"],
  ["2", "Lab Analysis", "HPLC and endotoxin/heavy-metal testing at independent facilities"],
  ["3", "Report Publishing", "Results linked to batch numbers on this page"],
  ["4", "Customer Verification", "Match your vial batch number to the published report"],
];

export function LabResultsClient() {
  const coas = useMemo(() => getAllProductCoas(), []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [viewing, setViewing] = useState<{ url: string; title: string } | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const productSlug = searchParams.get("product");
    if (!productSlug) return;
    const match = coas.find((c) => c.slug === productSlug);
    if (match) setQuery(match.displayName);
  }, [searchParams, coas]);

  const totalReports = coas.reduce((sum, c) => sum + c.labs.length, 0);
  const avgPurity = coas.reduce((sum, c) => sum + parseFloat(c.topPurity), 0) / coas.length;
  const sample = coas[0];

  const filtered = coas.filter((c) => {
    if (category !== "all" && !getProductGoalSlugs(c.slug).includes(category)) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.displayName.toLowerCase().includes(q) ||
      c.composition.toLowerCase().includes(q) ||
      c.labs.some((l) => l.batch.toLowerCase().includes(q) || l.labName.toLowerCase().includes(q))
    );
  });

  const STATS: [string, string][] = [
    [String(coas.length), "Compounds on File"],
    [`${totalReports}+`, "Lab Reports"],
    [`${avgPurity.toFixed(1)}%`, "Avg. Purity"],
    ["US / CA", "Independent Labs"],
  ];

  return (
    <>
      {/* Hero */}
      <section className="bg-sage-deep py-16 text-white md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sage-light">
                <i className="ri-shield-check-line" /> Third-Party Verified
              </div>
              <h1 className="font-display text-4xl font-bold leading-[1.02] md:text-5xl lg:text-6xl">
                Every batch, documented.
                <br />
                Nothing left to trust blindly.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
                Each compound is independently tested by third-party labs in Canada and the US using HPLC-UV,
                with the certificate published here before it ever ships.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {STATS.map(([value, label]) => (
                  <div key={label}>
                    <div className="font-display text-2xl font-bold md:text-3xl">{value}</div>
                    <div className="mt-1 text-[11px] uppercase tracking-wide text-white/50">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {sample && (
              <div className="rounded-xl border border-white/15 bg-charcoal/40 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Sample Record</p>
                  <span className="flex items-center gap-1 rounded-full bg-sage-light/20 px-2 py-0.5 text-[10px] font-semibold text-sage-light">
                    <i className="ri-checkbox-circle-fill" /> Verified
                  </span>
                </div>
                <p className="mt-3 font-display text-lg font-bold">{sample.displayName}</p>
                <p className="text-xs text-white/50">{sample.composition}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs">
                  <div>
                    <p className="text-white/40">Purity</p>
                    <p className="mt-0.5 font-semibold text-sage-light">{sample.labs[0].purity}</p>
                  </div>
                  <div>
                    <p className="text-white/40">Method</p>
                    <p className="mt-0.5 font-semibold">{sample.topMethod}</p>
                  </div>
                  <div>
                    <p className="text-white/40">Batch</p>
                    <p className="mt-0.5 font-mono font-semibold">{sample.labs[0].batch}</p>
                  </div>
                  <div>
                    <p className="text-white/40">Tested</p>
                    <p className="mt-0.5 font-semibold">{sample.labs[0].testedLabel}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-[90px] z-30 border-b border-stone bg-ivory/95 backdrop-blur-sm md:top-[100px]">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                category === "all" ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
              }`}
            >
              All Compounds
            </button>
            {QUIZ_GOALS.map((g) => (
              <button
                key={g.slug}
                type="button"
                onClick={() => setCategory(g.slug)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition ${
                  category === g.slug ? "bg-sage text-white" : "border border-stone bg-ivory-soft text-charcoal/70 hover:bg-stone/40"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search compound or batch #"
              className="w-full rounded-md border border-stone bg-ivory-soft py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sage-deep"
            />
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          </div>
        </div>
      </section>

      {/* List */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-4 text-xs text-charcoal/40">
            {filtered.length} of {coas.length} compounds
          </p>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-charcoal/50">No results found.</p>
          ) : (
            <div className="divide-y divide-stone rounded-lg border border-stone">
              {filtered.map((coa) => (
                <div key={coa.slug} className="flex flex-col gap-3 p-4 transition hover:bg-ivory-soft sm:flex-row sm:items-center sm:gap-6 md:p-5">
                  <div className="flex shrink-0 items-center gap-3 sm:w-56">
                    <span className="shrink-0 rounded-md bg-sage-mist px-2.5 py-1.5 text-center font-display text-sm font-bold text-sage-deep">
                      {coa.topPurity}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold text-charcoal">{coa.displayName}</p>
                      <p className="truncate text-xs text-charcoal/50">{coa.composition}</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {coa.labs.map((lab) => (
                      <div key={lab.pdfUrl} className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/60">
                        <span className="w-32 shrink-0 truncate font-medium text-charcoal/80">{lab.labName}</span>
                        <span className="font-mono">Batch {lab.batch}</span>
                        <span>Tested {lab.testedLabel}</span>
                        <span className="font-semibold text-sage-deep">{lab.purity}</span>
                        <div className="ml-auto flex gap-2">
                          <button
                            type="button"
                            onClick={() => setViewing({ url: lab.pdfUrl, title: `${coa.displayName} — ${lab.labName}` })}
                            className="rounded-full bg-sage-deep px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ivory transition hover:bg-charcoal"
                          >
                            View COA
                          </button>
                          <a
                            href={lab.pdfUrl}
                            download
                            className="rounded-full border border-stone px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-charcoal/70 transition hover:border-sage-deep hover:text-sage-deep"
                          >
                            PDF
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why independent testing */}
      <section className="bg-sage-forest py-20 text-white md:py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 px-4 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">Why independent testing?</h2>
            <p className="mb-6 leading-relaxed text-white/60">
              Independent laboratory analysis is the gold standard for verifying research peptides. Multiple methods
              across multiple labs provide unambiguous verification of purity, identity and safety for every
              compound.
            </p>
            <ul className="space-y-3 text-sm">
              {WHY_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <i className="ri-check-line mt-0.5 text-sage-light" />
                  <span className="text-white/70">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/5 p-8">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/30">
                <i className="ri-flask-line text-2xl text-sage-light" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold">Testing Protocol</h3>
                <p className="text-xs text-white/50">Every batch undergoes rigorous QC</p>
              </div>
            </div>
            <div className="space-y-4">
              {PROTOCOL.map(([num, title, desc]) => (
                <div key={num} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-xs font-bold text-white">{num}</div>
                  <div>
                    <div className="text-sm font-semibold">{title}</div>
                    <div className="text-xs text-white/50">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {viewing && <PdfViewerModal url={viewing.url} title={viewing.title} onClose={() => setViewing(null)} />}
    </>
  );
}

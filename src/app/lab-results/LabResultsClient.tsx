"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAllProductCoas } from "@/lib/coa";

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
  const searchParams = useSearchParams();

  useEffect(() => {
    const productSlug = searchParams.get("product");
    if (!productSlug) return;
    const match = coas.find((c) => c.slug === productSlug);
    if (match) setQuery(match.displayName);
  }, [searchParams, coas]);

  const totalReports = coas.reduce((sum, c) => sum + c.labs.length, 0);
  const avgPurity =
    coas.reduce((sum, c) => sum + parseFloat(c.topPurity), 0) / coas.length;

  const filtered = coas.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.displayName.toLowerCase().includes(q) ||
      c.composition.toLowerCase().includes(q) ||
      c.labs.some((l) => l.batch.toLowerCase().includes(q) || l.labName.toLowerCase().includes(q))
    );
  });

  const STATS: [string, string][] = [
    [String(coas.length), "Products Verified"],
    [`${totalReports}+`, "Lab Reports"],
    [`${avgPurity.toFixed(1)}%`, "Avg. Purity"],
    ["0", "Failed Batches"],
  ];

  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-sage-light">
            <i className="ri-shield-check-line" /> Independent Verification
          </div>
          <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">Lab Results</h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/70 md:text-lg">
            Every batch is independently tested. View purity, method and batch verification for complete
            transparency.
          </p>
        </div>
      </section>

      <section className="border-b border-stone py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 px-4 md:grid-cols-4 md:px-8">
          {STATS.map(([value, label]) => (
            <div key={label} className="p-4 text-center">
              <div className="font-display text-3xl font-bold text-sage-deep md:text-4xl">{value}</div>
              <div className="mt-1 text-sm text-charcoal/50">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h2 className="font-display text-xl font-bold text-charcoal md:text-2xl">Certificates of Analysis</h2>
            <div className="relative w-full sm:w-72">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product, batch or lab..."
                className="w-full rounded-md border border-stone bg-ivory-soft py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-sage-deep"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="py-12 text-center text-sm text-charcoal/50">No results found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filtered.map((coa) => (
                <article key={coa.slug} className="rounded-lg border border-stone bg-ivory-soft p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-charcoal">{coa.displayName}</h3>
                      <p className="mt-0.5 text-xs text-charcoal/50">{coa.composition}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-0.5 rounded-md bg-sage-mist px-3 py-1.5 text-right">
                      <span className="font-display text-sm font-bold text-sage-deep">{coa.topPurity}</span>
                      <span className="text-[9px] uppercase tracking-wide text-sage-deep/70">{coa.topMethod}</span>
                    </div>
                  </div>

                  {coa.verifiedByTwoLabs && (
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-sage-deep">
                      <i className="ri-checkbox-circle-fill" /> Independently verified by two labs
                    </p>
                  )}

                  <div className="mt-4 space-y-3 border-t border-stone pt-4">
                    {coa.labs.map((lab) => (
                      <div key={lab.pdfUrl} className="rounded-md border border-stone bg-ivory p-3.5">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <span className="text-sm font-semibold text-charcoal">{lab.labName}</span>
                          <span className="text-xs text-charcoal/50">{lab.scope}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/60">
                          <span>
                            <strong className="font-semibold text-charcoal">Purity</strong> {lab.purity}
                          </span>
                          <span>Tested {lab.testedLabel}</span>
                          <span className="font-mono text-[11px]">Batch {lab.batch}</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <a
                            href={lab.pdfUrl}
                            target="_blank"
                            rel="noopener"
                            className="flex-1 rounded-md bg-sage-deep py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-ivory transition hover:bg-charcoal"
                          >
                            View COA
                          </a>
                          <a
                            href={lab.pdfUrl}
                            download
                            className="flex-1 rounded-md border border-stone py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-charcoal/70 transition hover:border-sage-deep hover:text-sage-deep"
                          >
                            Download
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

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
    </>
  );
}

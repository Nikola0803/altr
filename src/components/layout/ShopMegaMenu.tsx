import Link from "next/link";

/**
 * Category groupings mirror the quiz's 6 research goals (lib/quiz-content.ts)
 * so the taxonomy stays identical everywhere on the site — a shopper
 * shouldn't see "Growth & Performance" here and "GH-axis" somewhere else.
 */
const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Recovery & Repair",
    links: [
      { label: "BPC-157", href: "/shop/bpc-157-10mg" },
      { label: "TB-500", href: "/shop/tb-500-5mg" },
      { label: "Wolverine Stack", href: "/shop/wolverine-stack-20mg" },
      { label: "KPV", href: "/shop/kpv-10mg" },
    ],
  },
  {
    title: "Longevity & Cellular Health",
    links: [
      { label: "NAD+", href: "/shop/nad-plus-500mg" },
      { label: "Epithalon", href: "/shop/epithalon-10mg" },
      { label: "GHK-Cu", href: "/shop/ghk-cu-50mg" },
      { label: "Thymosin Alpha-1", href: "/shop/thymosin-alpha-1-5mg" },
    ],
  },
  {
    title: "Metabolic & Weight",
    links: [
      { label: "Semaglutide", href: "/shop/semaglutide-5mg" },
      { label: "Tirzepatide", href: "/shop/tirzepatide-10mg" },
      { label: "Retatrutide", href: "/shop/retatrutide-10mg" },
      { label: "AOD-9604", href: "/shop/aod-9604-5mg" },
      { label: "MOTS-C", href: "/shop/mots-c-10mg" },
    ],
  },
  {
    title: "Growth & Performance",
    links: [
      { label: "CJC-1295 + Ipamorelin", href: "/shop/cjc-1295-without-dac-ipamorelin-10mg" },
      { label: "CJC-1295 with DAC", href: "/shop/cjc-1295-with-dac-5mg" },
      { label: "Tesamorelin", href: "/shop/tesamorelin-10mg" },
      { label: "IGF-1 LR3", href: "/shop/igf-1-lr3-1mg" },
      { label: "Sermorelin", href: "/shop/sermorelin-10mg" },
    ],
  },
  {
    title: "Cognition & Mood",
    links: [
      { label: "Semax", href: "/shop/semax-10mg" },
      { label: "Selank", href: "/shop/selank-10mg" },
      { label: "DSIP", href: "/shop/dsip-5mg" },
      { label: "Pinealon", href: "/shop/pinealon-10mg" },
    ],
  },
  {
    title: "Vitality",
    links: [
      { label: "PT-141", href: "/shop/pt-141-10mg" },
      { label: "Kisspeptin-10", href: "/shop/kisspeptin-10-5mg" },
      { label: "MT-2", href: "/shop/mt-2-10mg" },
      { label: "Oxytocin", href: "/shop/oxytocin-5mg" },
    ],
  },
];

export function ShopMegaMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="absolute left-1/2 top-full w-[min(1100px,92vw)] -translate-x-1/2 pt-3">
      <div className="rounded-lg border border-stone bg-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-stone px-8 py-4">
          <p className="text-xs text-charcoal/50">Every listing is HPLC-verified and COA-backed.</p>
          <Link
            href="/shop"
            onClick={onNavigate}
            className="rounded-full bg-sage-deep px-4 py-2 text-xs font-semibold uppercase tracking-wide text-ivory transition hover:bg-charcoal"
          >
            Shop all →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-8 px-8 py-8">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-sage-deep">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onNavigate} className="text-sm text-charcoal/70 transition hover:text-charcoal">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-6 border-t border-stone px-8 py-4">
          <Link href="/shop?category=peptides" onClick={onNavigate} className="text-xs font-medium text-charcoal/60 transition hover:text-sage-deep">
            Bundles →
          </Link>
          <Link href="/quiz" onClick={onNavigate} className="text-xs font-medium text-charcoal/60 transition hover:text-sage-deep">
            Take the quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}

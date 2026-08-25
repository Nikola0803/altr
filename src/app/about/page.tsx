import { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/products";
import { getAllProductCoas } from "@/lib/coa";

export const metadata: Metadata = {
  title: "About | ALTR",
  description: "Why ALTR exists, how we test, and the standard every batch is held to before it's ever listed.",
};

const STANDARDS = [
  {
    num: "01",
    icon: "ri-flask-line",
    title: "Independent Testing",
    body: "Every batch is verified by a third-party lab with no financial stake in the result — not tested in-house, not self-reported.",
  },
  {
    num: "02",
    icon: "ri-file-list-3-line",
    title: "Batch-Level COAs",
    body: "Certificates are published per lot, not reused across future stock. The batch number on your vial matches a specific, real report.",
  },
  {
    num: "03",
    icon: "ri-temp-cold-line",
    title: "Controlled Handling",
    body: "Cold-chain packaging from dispatch to delivery. What happens to a compound after testing matters as much as the test itself.",
  },
  {
    num: "04",
    icon: "ri-price-tag-3-line",
    title: "Transparent Sourcing",
    body: "Volume pricing communicated plainly beats a discount code. No affiliates, no countdown timers, no manufactured urgency.",
  },
];

export default function AboutPage() {
  const productCount = getProducts().length;
  const coaCount = getAllProductCoas().reduce((sum, c) => sum + c.labs.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-charcoal">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-60">
          <source src="/videos/hero-water-2.mp4" type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(16,19,14,0.75) 0%, rgba(16,19,14,0.3) 45%, rgba(16,19,14,0.9) 100%)" }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[900px] px-4 py-24 text-center md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.3em] text-sage-light">About ALTR</p>
          <h1 className="font-display text-5xl font-bold leading-[0.98] text-white md:text-7xl">
            Research deserves
            <br />
            a straight answer.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Not a marketing page dressed up as one. Here's why ALTR exists, how we actually test, and what we
            refuse to do to sell a vial.
          </p>
        </div>
      </section>

      {/* Origin story */}
      <section className="bg-ivory py-20 md:py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg">
            <Image src="/images/about-lab.jpg" alt="Laboratory testing environment" width={900} height={1125} className="h-full w-full object-cover" />
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">Why we started</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-charcoal md:text-4xl">
              The markup was never the compound. It was everything around it.
            </h2>
            <div className="mt-6 space-y-4 max-w-xl text-base leading-relaxed text-soft-gray md:text-lg">
              <p>
                Most research peptide sites look the same underneath the branding: a discount code you have to
                hunt for, a countdown timer resetting every time you refresh, a "bestseller" badge on whatever
                has the fattest margin. None of that has anything to do with whether the compound in the vial is
                what the label says it is.
              </p>
              <p>
                ALTR started from a narrower question: what would this business look like if the price on the
                page was already the real price, and the only thing we spent energy on was making sure every
                batch actually held up to scrutiny? Cutting the theater turned out to be the easy part. Holding
                every batch to independent, published testing — every time, no exceptions — is the part that
                actually takes discipline.
              </p>
              <p>
                That's still the whole model. Rock-bottom pricing because we're not funding affiliates or ad
                spend. Public batch data because a claim you can't check isn't a claim, it's marketing.
              </p>
            </div>

            <ButtonLink href="/lab-results" className="mt-10">
              View Lab Results <i className="ri-arrow-right-line" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-stone bg-sage-deep py-14">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-y-10 px-4 md:grid-cols-4 md:px-8">
          {[
            [String(productCount), "Products in Catalogue"],
            [`${coaCount}+`, "Published Lab Reports"],
            ["≥97%", "Minimum Verified Purity"],
            ["0", "Failed Batches Sold"],
          ].map(([value, label]) => (
            <div key={label} className="text-center">
              <div className="font-display text-4xl font-bold text-ivory md:text-5xl">{value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.15em] text-ivory/60">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Standards */}
      <section className="bg-ivory py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">The ALTR Standard</p>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold text-charcoal md:text-4xl">
            Four rules we don't bend on.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STANDARDS.map((item) => (
              <div key={item.num} className="rounded-lg border border-stone bg-ivory-soft p-6">
                <div className="flex items-center justify-between">
                  <i className={`${item.icon} text-2xl text-sage-deep`} />
                  <span className="font-display text-xs text-charcoal/30">{item.num}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-charcoal">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inside the standard — video moment */}
      <section className="relative overflow-hidden bg-charcoal py-24 md:py-36">
        <video autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-30">
          <source src="/videos/standard-vial.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/80" />
        <div className="relative z-10 mx-auto max-w-[800px] px-4 text-center md:px-8">
          <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
            &ldquo;Independently verified&rdquo; should mean something.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
            We didn't put that phrase on the site because it sounds reassuring. We put it there because every
            batch has a named lab, a batch number, and a public report behind it — and if any part of that
            weren't true, we'd have to take it down.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ButtonLink href="/shop" size="lg" className="!bg-ivory !text-charcoal hover:!bg-sage-light">
              Shop All Products
            </ButtonLink>
            <ButtonLink href="/science" variant="secondary" size="lg" className="!border-white/40 !text-ivory hover:!bg-ivory hover:!text-charcoal">
              How We Test
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

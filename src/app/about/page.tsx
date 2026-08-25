import { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { getProducts } from "@/lib/products";
import { getAllProductCoas } from "@/lib/coa";

export const metadata: Metadata = {
  title: "About | ALTR",
  description: "Why ALTR exists, how we test, and the standard every batch is held to before it's ever listed.",
};

const VALUES = [
  { title: "Documentation over claims.", body: "Anyone can say “high purity.” We’d rather hand you the chromatogram." },
  { title: "Plain pricing over discount theater.", body: "No code to hunt for, no countdown resetting on refresh. The price on the page is the price." },
  { title: "Research-first, not consumer-health.", body: "Written for people who already know what a COA is and want to find theirs fast." },
  { title: "Cold-chain, every shipment.", body: "Temperature-controlled from dispatch to delivery, not just from the lab to our door." },
  { title: "No affiliates, no funded reviews.", body: "Nobody earns a commission for pointing you at a compound." },
  { title: "Batch traceability, indefinitely.", body: "Every report stays published, tied to its lot number, for as long as we sell the product." },
];

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

      {/* What we stand for */}
      <section className="bg-ivory-soft py-20 md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">What We Stand For</p>
          <h2 className="mx-auto max-w-xl text-center font-display text-3xl font-bold text-charcoal md:text-4xl">
            The short version of how we operate.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-lg border border-stone bg-ivory p-6">
                <h3 className="font-display text-base font-bold leading-snug text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{v.body}</p>
              </div>
            ))}
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

      {/* What ALTR is not */}
      <section className="bg-ivory-soft py-20 md:py-32">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">Being clear</p>
            <h2 className="font-display text-3xl font-bold leading-tight text-charcoal md:text-4xl">What ALTR is not.</h2>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-soft-gray md:text-lg">
              ALTR is a research-use-only supplier. Our products are sold strictly for laboratory and research
              purposes — not for human consumption, not for medical use, and not as a treatment for any
              condition. We don&apos;t make therapeutic claims, and we never will.
            </p>
          </div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg lg:order-2">
            <Image src="/images/hero-vial.jpg" alt="ALTR research vial" width={900} height={675} className="h-full w-full object-cover" />
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

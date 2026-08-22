import { ButtonLink } from "@/components/ui/Button";

export function LabResultsPreview() {
  return (
    <section className="bg-charcoal py-20 text-white md:py-32">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:grid-cols-2 md:px-8 lg:gap-24">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Independent Verification</p>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Every batch.
            <br />
            Verified.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            Independent laboratory testing and batch-level documentation for greater transparency.
          </p>
          <ButtonLink href="/lab-results" className="mt-9 !bg-ivory !text-charcoal hover:!bg-sage-light">
            View Lab Results <i className="ri-arrow-right-line" />
          </ButtonLink>
        </div>

        <div className="border border-white/15 p-8 md:p-10">
          <div className="flex items-start justify-between border-b border-white/10 pb-6">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/50">Product</p>
              <p className="mt-1 font-display text-lg font-medium">BPC-157</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-wider text-white/50">Lot</p>
              <p className="mt-1 font-mono text-sm text-white/80">#BPC-2608</p>
            </div>
          </div>

          <div className="flex items-end justify-between py-6">
            <div>
              <p className="font-display text-5xl font-bold text-sage-light">99.2%</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-white/50">Tested Purity</p>
            </div>
            <div className="text-right text-xs text-white/50">
              <p>HPLC</p>
              <p className="mt-1">LC-MS</p>
              <p className="mt-1">Third-Party Laboratory</p>
            </div>
          </div>

          <a href="/lab-results" className="flex items-center justify-between border-t border-white/10 pt-6 text-sm font-medium text-sage-light transition hover:text-white">
            View Lab Results <i className="ri-arrow-right-line" />
          </a>
        </div>
      </div>
    </section>
  );
}

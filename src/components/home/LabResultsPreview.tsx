import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { MolecularMotif } from "@/components/ui/MolecularMotif";
import { BatchVerifyTerminal } from "./BatchVerifyTerminal";

export function LabResultsPreview() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-white md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full opacity-40"
        style={{ background: "radial-gradient(circle, rgba(151,164,148,0.16) 0%, rgba(151,164,148,0) 70%)" }}
      />
      <MolecularMotif
        variant="concentric"
        className="pointer-events-none absolute -right-16 top-1/2 hidden h-[440px] w-[440px] -translate-y-1/2 lg:block"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-14 px-4 md:grid-cols-5 md:px-8 lg:gap-16">
        <Reveal className="md:col-span-2">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            <span className="h-px w-8 bg-white/30" />
            Transparency
          </div>
          <h2 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Every batch.
            <br />
            Verified.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            Every order ships with a Certificate of Analysis for its exact lot. Enter a batch code and pull the real
            result, not a demo.
          </p>
          <ButtonLink href="/lab-results" variant="secondary" size="lg" className="mt-9 !border-white/40 !text-ivory hover:!border-sage-light hover:!bg-transparent hover:!text-sage-light">
            View All Lab Results <i className="ri-arrow-right-line" />
          </ButtonLink>
        </Reveal>

        <Reveal className="md:col-span-3">
          <BatchVerifyTerminal />
        </Reveal>
      </div>
    </section>
  );
}

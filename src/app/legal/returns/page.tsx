import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Refund Policy | ALTR",
  description: "The circumstances under which a return or refund may be considered.",
};

export default function ReturnPolicyPage() {
  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-28">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Return & Refund Policy</h1>
          <p className="mt-4 text-sm text-white/60">Effective Date: August 24, 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <article className="mx-auto max-w-[800px] space-y-8 px-4 text-base leading-relaxed text-charcoal/75 md:px-8">
          <p>
            ALTR (&ldquo;ALTR,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates as a
            precision research-peptide brand. Due to the nature of research products, returns are strictly
            limited. This Return Policy explains the circumstances under which a return may be considered.
          </p>

          <Section title="No General Returns or Refunds">
            <p>
              All sales are final. ALTR does not offer refunds or accept returns once an order has been processed
              or dispatched, except in cases where products arrive damaged or incorrect.
            </p>
          </Section>

          <Section title="Damaged or Incorrect Orders">
            <p>
              If an order arrives damaged or incorrect, customers must notify ALTR within a reasonable timeframe
              after delivery. Supporting documentation, including photographs and order details, may be required
              to review the claim.
            </p>
            <p>If the claim is approved, ALTR may, at its discretion:</p>
            <ul>
              <li>Provide a replacement product, or</li>
              <li>Offer an appropriate resolution based on the specific circumstances</li>
            </ul>
            <p>Unauthorized returns will not be accepted.</p>
          </Section>

          <Section title="Non-Returnable Items">
            <p>
              Products intended for research use are non-returnable once delivered unless confirmed to be damaged
              or incorrect upon receipt. Opened, used, altered, or tampered products are not eligible for return
              under any circumstances.
            </p>
          </Section>

          <Section title="Payment Considerations">
            <p>
              In cases where a resolution involves reimbursement, it will be processed through the original
              payment method where possible. Processing timelines may vary depending on the payment provider.
            </p>
          </Section>

          <Section title="Policy Changes">
            <p>
              ALTR reserves the right to update this Return Policy at any time. Changes will be posted on this
              page with an updated effective date.
            </p>
          </Section>

          <Section title="Contact Information">
            <p>For return-related inquiries, please contact:</p>
            <p>
              ALTR
              <br />
              Toronto, Canada
              <br />
              Email:{" "}
              <a href="mailto:info@altrpeptides.com" className="text-sage-deep hover:underline">
                info@altrpeptides.com
              </a>
            </p>
          </Section>
        </article>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 font-display text-xl font-bold text-charcoal">{title}</h2>
      <div className="space-y-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">{children}</div>
    </div>
  );
}

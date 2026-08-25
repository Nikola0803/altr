import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | ALTR",
  description: "How ALTR processes, ships, and delivers orders.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-28">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Shipping Policy</h1>
          <p className="mt-4 text-sm text-white/60">Effective Date: August 24, 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <article className="mx-auto max-w-[800px] space-y-8 px-4 text-base leading-relaxed text-charcoal/75 md:px-8">
          <p>
            ALTR (&ldquo;ALTR,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) ships orders in a
            controlled and responsible manner to maintain product integrity and meet professional expectations.
            This Shipping Policy explains how orders are processed, shipped, and delivered.
          </p>

          <Section title="Order Processing">
            <p>
              Orders are processed after payment confirmation and order acceptance. Processing times may vary
              depending on product availability, order volume, and verification requirements. Order confirmation
              does not guarantee immediate dispatch. ALTR reserves the right to delay or cancel orders if
              additional review is required.
            </p>
          </Section>

          <Section title="Shipping Methods">
            <p>
              Orders are shipped using trusted logistics providers selected to support reliable handling and
              delivery. Shipping options, costs, and estimated delivery timelines are displayed at checkout and
              may vary by destination.
            </p>
          </Section>

          <Section title="Shipping Timeframes">
            <p>
              Delivery timeframes are estimates only and are not guaranteed. Actual delivery times may be
              affected by factors beyond ALTR&apos;s control, including carrier delays, weather conditions, or
              other logistical factors. ALTR is not responsible for delays caused by third-party carriers or
              external circumstances.
            </p>
          </Section>

          <Section title="Shipping Availability">
            <p>Shipping is currently available within Canada and the United States.</p>
          </Section>

          <Section title="Free Shipping">
            <p>
              Free shipping is offered on qualifying orders over a specified order value. Eligibility and terms
              are displayed at checkout and may change without notice.
            </p>
          </Section>

          <Section title="Order Tracking">
            <p>
              Tracking information is provided when available after dispatch. Tracking updates are managed by
              the shipping carrier and may not reflect real-time status immediately.
            </p>
          </Section>

          <Section title="Risk of Loss">
            <p>
              Risk of loss and responsibility for the shipment transfer to the customer upon dispatch, unless
              otherwise required by applicable law.
            </p>
          </Section>

          <Section title="Incorrect or Incomplete Address">
            <p>
              Customers are responsible for providing accurate and complete shipping information. ALTR is not
              responsible for delivery issues resulting from incorrect or incomplete addresses.
            </p>
          </Section>

          <Section title="Damaged or Lost Shipments">
            <p>
              If an order arrives damaged or is lost in transit, customers should contact ALTR promptly with
              relevant order details. Claims may be subject to carrier investigation and resolution timelines.
            </p>
          </Section>

          <Section title="Contact Information">
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
      <div className="space-y-3">{children}</div>
    </div>
  );
}

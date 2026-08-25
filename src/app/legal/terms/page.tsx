import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ALTR",
  description: "The terms governing access to and use of the ALTR website and related services.",
};

export default function TermsPage() {
  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-28">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Terms & Conditions</h1>
          <p className="mt-4 text-sm text-white/60">Effective Date: August 24, 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <article className="mx-auto max-w-[800px] space-y-8 px-4 text-base leading-relaxed text-charcoal/75 md:px-8">
          <p>
            These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the ALTR website
            and related services. By accessing or using this website, you agree to be bound by these Terms. If you
            do not agree, please do not use the website.
          </p>

          <Section title="1. About ALTR">
            <p>
              ALTR (&ldquo;ALTR,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates as a
              precision research-peptide brand. Products and information provided are intended strictly for
              research use only, within clearly defined scientific and regulatory boundaries.
            </p>
          </Section>

          <Section title="2. Eligibility & Use of Website">
            <p>
              By using this website, you confirm that you are legally permitted to access and use this site in
              your jurisdiction, you are acting in a professional or research-related capacity, and you will not
              use the website or its content for unlawful or unauthorized purposes. ALTR reserves the right to
              restrict access at its discretion.
            </p>
          </Section>

          <Section title="3. Research Use Only">
            <p>
              All products offered by ALTR are intended for research use only. ALTR does not provide medical,
              therapeutic, or diagnostic products, offer usage protocols, dosing guidance, or application
              instructions, or make or imply health, performance, or therapeutic claims. You agree not to use
              ALTR products outside of their intended research scope.
            </p>
          </Section>

          <Section title="4. Product Information & Documentation">
            <p>
              Product descriptions, specifications, and documentation are provided for informational and research
              reference purposes only. While ALTR maintains disciplined standards for accuracy and consistency,
              all information is subject to change without notice. Certificates of Analysis and related
              documentation are provided to support transparency and independent evaluation.
            </p>
          </Section>

          <Section title="5. Orders & Availability">
            <p>
              All orders are subject to acceptance and availability. ALTR reserves the right to refuse or cancel
              orders, limit quantities, or discontinue products without prior notice. Order confirmation does not
              constitute final acceptance until processing is completed.
            </p>
          </Section>

          <Section title="6. Pricing & Payments">
            <p>
              Prices are listed in the applicable currency and may change without notice. Payments are processed
              through secure third-party providers. ALTR does not store full payment card details.
            </p>
          </Section>

          <Section title="7. Shipping & Delivery">
            <p>
              Shipping timelines are estimates and may vary based on location, logistics providers, and
              regulatory considerations. ALTR is not responsible for delays outside its reasonable control. Risk
              of loss transfers upon dispatch unless otherwise required by law. See our{" "}
              <a href="/legal/shipping" className="text-sage-deep hover:underline">
                Shipping Policy
              </a>{" "}
              for details.
            </p>
          </Section>

          <Section title="8. Returns & Refunds">
            <p>
              Due to the nature of research products, returns or refunds may be limited or unavailable once an
              order has been processed or shipped. Any applicable policies will be communicated at the time of
              purchase or inquiry.
            </p>
          </Section>

          <Section title="9. Intellectual Property">
            <p>
              All website content, including text, design, logos, graphics, and documentation, is the
              intellectual property of ALTR or its licensors. Content may not be copied, reproduced, distributed,
              or modified without prior written permission.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, ALTR shall not be liable for any direct, indirect,
              incidental, or consequential damages arising from use or inability to use the website, use or
              misuse of products outside their intended research scope, or reliance on information provided on
              the website. All use is at your own risk.
            </p>
          </Section>

          <Section title="11. Indemnification">
            <p>
              You agree to indemnify and hold harmless ALTR from any claims, damages, or losses arising from your
              misuse of the website, violation of these Terms, or use of products outside their intended purpose.
            </p>
          </Section>

          <Section title="12. Third-Party Links">
            <p>
              The website may include links to third-party sites. ALTR is not responsible for the content,
              accuracy, or practices of external websites.
            </p>
          </Section>

          <Section title="13. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with the laws applicable in the
              jurisdiction where ALTR operates, without regard to conflict of law principles.
            </p>
          </Section>

          <Section title="14. Changes to These Terms">
            <p>
              ALTR may update these Terms from time to time. Changes will be posted on this page with an updated
              effective date. Continued use of the website constitutes acceptance of the revised Terms.
            </p>
          </Section>

          <Section title="15. SMS and Text Message Program">
            <p>
              If you opt in to our SMS program you agree to receive recurring marketing text messages from ALTR
              at the number you provide, including messages sent by autodialer. Consent is not a condition of
              purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe at
              any time, or HELP for help. Mobile carriers are not liable for delayed or undelivered messages. How
              we collect, record and retain SMS consent, and how we handle phone numbers, is described in our{" "}
              <a href="/legal/privacy" className="text-sage-deep hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </Section>

          <Section title="16. Contact Information">
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

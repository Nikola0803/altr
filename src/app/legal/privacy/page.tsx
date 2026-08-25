import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ALTR",
  description: "How ALTR collects, uses, and protects personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-28">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Legal</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-sm text-white/60">Effective Date: August 24, 2026</p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <article className="mx-auto max-w-[800px] space-y-8 px-4 text-base leading-relaxed text-charcoal/75 md:px-8">
          <p>
            ALTR (&ldquo;ALTR,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) respects your
            privacy and is committed to protecting personal information collected through our website and related
            services. This Privacy Policy explains how information is collected, used, stored, and safeguarded.
          </p>

          <Section title="1. Information We Collect">
            <p>We may collect limited personal information when you interact with our website, including:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Billing and shipping information</li>
              <li>Payment-related details (processed securely by third-party providers)</li>
              <li>Communications you send to us</li>
              <li>Technical information such as IP address, browser type, and device data</li>
            </ul>
            <p>We collect only information necessary to operate responsibly and provide our services.</p>
          </Section>

          <Section title="2. How We Use Information">
            <p>Information collected may be used to:</p>
            <ul>
              <li>Process orders and payments</li>
              <li>Communicate regarding inquiries, orders, or support requests</li>
              <li>Provide access to documentation or account-related information</li>
              <li>Improve website functionality and security</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>
            <p>ALTR does not sell, rent, or trade personal information.</p>
          </Section>

          <Section title="3. SMS and Text Message Program">
            <p>
              ALTR operates an optional SMS marketing program. Participation is entirely voluntary and is never
              required in order to buy anything from us.
            </p>
            <p>
              <strong className="font-semibold text-charcoal">How we collect consent.</strong> We only send
              marketing text messages to a phone number when the person who owns that number has given express
              written consent by ticking an unchecked opt-in box on our website and submitting it. The box is
              never pre-ticked, and consent to receive text messages is not a condition of any purchase. Consent
              to receive email does not carry over to SMS, and we do not treat it as though it does.
            </p>
            <p>
              <strong className="font-semibold text-charcoal">What we record as proof of consent.</strong> When
              you opt in we store the phone number, the date and time of the opt-in in UTC, the IP address and
              browser user agent of the device used, the page the consent was given on, and a version identifier
              for the exact consent wording shown to you at that moment. We retain this record for as long as you
              remain subscribed and for at least five years after you opt out, so that we can evidence your
              consent if asked.
            </p>
            <p>
              <strong className="font-semibold text-charcoal">What we send.</strong> Restock and back-in-stock
              alerts, occasional offers, and messages about an order you have placed. Message frequency varies.
              Message and data rates may apply.
            </p>
            <p>
              <strong className="font-semibold text-charcoal">How to opt out.</strong> Reply STOP to any message
              from us to unsubscribe immediately. Reply HELP to any message for assistance, or email{" "}
              <a href="mailto:info@altrpeptides.com" className="text-sage-deep hover:underline">
                info@altrpeptides.com
              </a>
              . Opting out of SMS does not affect your email subscription or your ability to order.
            </p>
            <p>
              <strong className="font-semibold text-charcoal">We do not sell your phone number.</strong> We never
              sell, rent, or trade phone numbers. We do not share phone numbers or SMS consent data with third
              parties for their own marketing. Numbers are shared only with the messaging providers who deliver
              our texts on our behalf, and only for that purpose.
            </p>
            <p>Mobile carriers are not liable for delayed or undelivered messages.</p>
          </Section>

          <Section title="4. Payments">
            <p>
              Payments are processed through secure, third-party payment providers. ALTR does not store full
              payment card details.
            </p>
          </Section>

          <Section title="5. Data Sharing & Disclosure">
            <p>Personal information may be shared only when necessary:</p>
            <ul>
              <li>With service providers who support website operations, payment processing, or logistics</li>
              <li>When required by law, regulation, or legal process</li>
              <li>To protect the rights, security, or integrity of ALTR</li>
            </ul>
            <p>All third parties are expected to handle data responsibly and securely.</p>
          </Section>

          <Section title="6. Data Security">
            <p>
              ALTR implements reasonable administrative, technical, and organizational measures to protect
              personal information against unauthorized access, misuse, or disclosure. While no system can
              guarantee absolute security, we take data protection seriously and act responsibly.
            </p>
          </Section>

          <Section title="7. Cookies & Analytics">
            <p>
              Our website may use cookies or similar technologies to support functionality, performance, and
              basic analytics. These tools help us understand website usage and improve user experience. You may
              manage cookie preferences through your browser settings.
            </p>
          </Section>

          <Section title="8. Data Retention">
            <p>
              Personal information is retained only for as long as necessary to fulfill operational, legal, or
              regulatory purposes. When no longer required, information is securely deleted or anonymized.
            </p>
          </Section>

          <Section title="9. Your Rights">
            <p>Depending on your location, you may have rights to:</p>
            <ul>
              <li>Access or request a copy of your personal information</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of certain personal data</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p>Requests can be submitted using the contact details below.</p>
          </Section>

          <Section title="10. Third-Party Links">
            <p>
              Our website may contain links to third-party websites. ALTR is not responsible for the privacy
              practices or content of external sites. We encourage users to review third-party privacy policies
              independently.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              ALTR may update this Privacy Policy periodically to reflect operational, legal, or regulatory
              changes. Updates will be posted on this page with a revised effective date.
            </p>
          </Section>

          <Section title="12. Contact Information">
            <p>For privacy-related questions or requests, please contact:</p>
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

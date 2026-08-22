import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";

const SHOP_NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/lab-results", label: "Lab Results" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const CUSTOMER_NAV = ["Account", "Orders", "Shipping", "Returns"];
const LEGAL_NAV = ["Research Use Only", "Terms", "Privacy"];

export function Footer() {
  return (
    <footer className="bg-charcoal pb-8 pt-20 text-white md:pt-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Logo tone="ivory" className="text-4xl md:text-5xl" />
        <p className="mt-3 text-sm text-white/50">Research with intention.</p>

        <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/10 pt-12 md:grid-cols-4">
          <FooterColumn title="Shop">
            {SHOP_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-white/60 transition hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Customer">
            {CUSTOMER_NAV.map((label) => (
              <li key={label} className="text-sm text-white/40">
                {label}
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {LEGAL_NAV.map((label) => (
              <li key={label} className="text-sm text-white/40">
                {label}
              </li>
            ))}
          </FooterColumn>

          <NewsletterForm />
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] border-t border-white/10 px-4 pt-8 md:px-8">
        <p className="max-w-2xl text-xs leading-relaxed text-white/40">
          ALTR products are intended strictly for research and laboratory use only. Not for human or veterinary use.
        </p>
        <div className="mt-6 flex flex-col gap-2 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© ALTR {new Date().getFullYear()}. All rights reserved.</span>
          <span>ALTRPEPTIDES.COM</span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-white/40">{title}</p>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

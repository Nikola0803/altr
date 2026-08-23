import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium uppercase tracking-wide transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-sage-deep text-ivory hover:bg-charcoal",
  secondary: "border border-sage text-sage-deep hover:bg-sage-deep hover:text-ivory hover:border-sage-deep",
  dark: "bg-charcoal text-ivory hover:bg-sage-deep",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-3.5 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  onClick,
}: CommonProps & { href: string; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </Link>
  );
}

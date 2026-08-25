interface TrustItem {
  icon: string;
  label: string;
  sublabel?: string;
}

function TrustBadge({ item }: { item: TrustItem }) {
  return (
    <span className="mx-6 inline-flex shrink-0 items-center gap-3 whitespace-nowrap md:mx-8">
      <i className={`${item.icon} text-lg text-white/60`} />
      <span className="text-[11px] uppercase tracking-[0.15em] text-white/70 md:text-xs">{item.label}</span>
    </span>
  );
}

export function TrustIconRow({ items, marquee = false }: { items: TrustItem[]; tone?: "ring" | "plain"; marquee?: boolean }) {
  if (marquee) {
    // Duplicated track scrolling by exactly -50% creates a seamless, endless loop.
    return (
      <section className="overflow-hidden bg-sage-forest py-10 md:py-12">
        <div className="trust-marquee flex w-max">
          {[...items, ...items].map((item, i) => (
            <TrustBadge key={`${item.label}-${i}`} item={item} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-sage-forest py-10 md:py-12">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className={`grid gap-6 ${items.length > 4 ? "grid-cols-2 md:grid-cols-5" : "grid-cols-2 md:grid-cols-4"}`}>
          {items.map((item) => (
            <div key={item.label} className="flex items-center justify-center gap-3 md:justify-start">
              <i className={`${item.icon} text-lg text-white/60`} />
              <span className="whitespace-nowrap text-[11px] uppercase tracking-[0.15em] text-white/70 md:text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

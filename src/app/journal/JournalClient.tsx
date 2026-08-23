"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { JournalPost } from "@/lib/journal";
import { JournalCard } from "@/components/journal/JournalCard";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function JournalClient({ posts }: { posts: JournalPost[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const [active, setActive] = useState("All");

  const [featured, ...rest] = posts;
  const filtered = active === "All" ? rest : rest.filter((p) => p.category === active);
  const showFeatured = active === "All";

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mb-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`rounded-md px-4 py-2 text-xs font-medium uppercase tracking-wide transition ${
                active === cat
                  ? "bg-sage-deep text-ivory"
                  : "border border-stone text-soft-gray hover:border-sage-deep hover:text-sage-deep"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {showFeatured && featured && (
          <Link href={`/journal/${featured.slug}`} className="group mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div className="aspect-[16/11] w-full overflow-hidden rounded-lg bg-sage-mist">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                width={1000}
                height={700}
                sizes="(max-width: 768px) 90vw, 600px"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">
                {featured.category} · Latest
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-charcoal transition group-hover:text-sage-deep md:text-4xl">
                {featured.title}
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-soft-gray">{featured.excerpt}</p>
              <p className="mt-4 text-xs text-soft-gray/80">
                {formatDate(featured.publishedAt)} · {featured.readTime}
              </p>
            </div>
          </Link>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <JournalCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-sm text-soft-gray">No articles in this category yet.</p>
        )}
      </div>
    </section>
  );
}

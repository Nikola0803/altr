import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getJournalPostBySlug, getJournalPosts, getRelatedJournalPosts } from "@/lib/journal";
import { JournalCard } from "@/components/journal/JournalCard";
import { ButtonLink } from "@/components/ui/Button";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function generateStaticParams() {
  return getJournalPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ALTR Journal`,
    description: post.excerpt,
  };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedJournalPosts(slug);

  return (
    <>
      <div className="mx-auto max-w-[1400px] px-4 py-4 md:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-charcoal/50">
          <Link href="/" className="transition hover:text-charcoal">
            Home
          </Link>
          <i className="ri-arrow-right-s-line" />
          <Link href="/journal" className="transition hover:text-charcoal">
            Journal
          </Link>
          <i className="ri-arrow-right-s-line" />
          <span className="font-medium text-charcoal">{post.title}</span>
        </nav>
      </div>

      <article className="mx-auto max-w-[800px] px-4 pb-20 pt-6 md:px-8 md:pb-28 md:pt-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">{post.category}</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-charcoal md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-soft-gray">
          {post.author} · {formatDate(post.publishedAt)} · {post.readTime}
        </p>

        <div className="mt-8 aspect-[16/9] w-full overflow-hidden rounded-lg bg-sage-mist">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={675}
            sizes="(max-width: 800px) 100vw, 800px"
            className="h-full w-full object-cover"
            priority
          />
        </div>

        <div className="mt-10 space-y-5">
          {post.body.map((block, i) =>
            block.type === "h3" ? (
              <h3 key={i} className="pt-4 font-display text-xl font-medium text-charcoal md:text-2xl">
                {block.text}
              </h3>
            ) : (
              <p key={i} className="text-base leading-relaxed text-soft-gray">
                {block.text}
              </p>
            )
          )}
        </div>

        <div className="mt-12 rounded-lg border border-stone bg-ivory-soft p-6 text-center md:p-8">
          <p className="font-display text-lg font-medium text-charcoal md:text-xl">
            Every batch we sell ships with independent, lot-specific testing.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-soft-gray">
            Browse the current catalogue or look up a batch's Certificate of Analysis on the Lab Results page.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/shop" size="md">
              Shop Products
            </ButtonLink>
            <ButtonLink href="/lab-results" variant="secondary" size="md">
              View Lab Results
            </ButtonLink>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-stone bg-ivory py-16 md:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-8">
            <h2 className="mb-8 font-display text-2xl font-bold text-charcoal md:text-3xl">
              More on {post.category.toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <JournalCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

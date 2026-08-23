import Link from "next/link";
import Image from "next/image";
import { JournalPost } from "@/lib/journal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <Link href={`/journal/${post.slug}`} className="group block">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-sage-mist">
        <Image
          src={post.coverImage}
          alt={post.title}
          width={800}
          height={600}
          sizes="(max-width: 768px) 90vw, 420px"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">{post.category}</p>
        <h3 className="mt-2 font-display text-lg font-medium leading-snug text-charcoal transition group-hover:text-sage-deep md:text-xl">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-soft-gray">{post.excerpt}</p>
        <p className="mt-3 text-xs text-soft-gray/80">
          {formatDate(post.publishedAt)} · {post.readTime}
        </p>
      </div>
    </Link>
  );
}

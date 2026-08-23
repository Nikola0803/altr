import { Metadata } from "next";
import { getJournalPosts } from "@/lib/journal";
import { JournalClient } from "./JournalClient";

export const metadata: Metadata = {
  title: "Journal | ALTR",
  description: "Notes on testing methodology, handling, and the research behind the ALTR standard.",
};

export default function JournalPage() {
  const posts = getJournalPosts();

  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-32">
        <div className="mx-auto max-w-[900px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Journal</p>
          <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">Notes from the lab.</h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            Longer-form writing on testing methodology, sourcing, storage discipline, and the research behind the
            ALTR standard.
          </p>
        </div>
      </section>

      <JournalClient posts={posts} />
    </>
  );
}

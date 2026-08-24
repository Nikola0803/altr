"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug } from "@/lib/products";
import {
  QUIZ_GOALS,
  QUIZ_SUBGOALS,
  QUIZ_PRODUCTS,
  QUIZ_LABELS,
  TIER_ORDER,
  MAX_GOALS,
  type Tier,
} from "@/lib/quiz-content";

const STEPS = {
  GOALS: "goals",
  SUBGOAL: "subgoal",
  RESULTS: "results",
} as const;

type Step = (typeof STEPS)[keyof typeof STEPS];

function goalLabel(slug: string) {
  return QUIZ_GOALS.find((g) => g.slug === slug)?.label ?? slug;
}

interface Candidate {
  slug: string;
  tier: Tier;
  text: string;
}

function candidatesFor(key: string, exclude: Set<string>): Candidate[] {
  return Object.entries(QUIZ_PRODUCTS)
    .filter(([slug, p]) => p.variants[key] && !exclude.has(slug))
    .map(([slug, p]) => ({ slug, tier: p.tier, text: p.variants[key] }))
    .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier]);
}

interface GoalResult {
  goalSlug: string;
  subgoalLabel?: string;
  picks: Candidate[];
}

function buildResults(selectedGoals: string[], subgoalAnswers: Record<string, string>): GoalResult[] {
  const used = new Set<string>();
  const results: GoalResult[] = [];

  selectedGoals.forEach((goalSlug) => {
    const subgoal = subgoalAnswers[goalSlug];
    const key = `${goalSlug}:${subgoal}`;
    const candidates = candidatesFor(key, used);
    const picks = candidates.slice(0, 2);
    picks.forEach((p) => used.add(p.slug));
    results.push({
      goalSlug,
      subgoalLabel: QUIZ_SUBGOALS[goalSlug]?.options.find((o) => o.slug === subgoal)?.label,
      picks,
    });
  });

  return results;
}

function ProductLine({ slug, text, badge }: { slug: string; text: string; badge: string }) {
  const product = getProductBySlug(slug);
  if (!product) return null;
  return (
    <Link
      href={`/shop/${slug}`}
      className="group block rounded-lg border border-stone bg-ivory-soft p-4 transition hover:border-sage-deep"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md bg-ivory">
            {product.image && <Image src={product.image} alt={product.name} width={88} height={88} className="h-full w-full object-cover" />}
          </div>
          <span className="truncate font-display text-sm font-medium text-charcoal transition group-hover:text-sage-deep">
            {product.name}
          </span>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-sage-mist px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-sage-deep">
          {badge}
        </span>
      </div>
      {text && <p className="mt-2.5 text-xs leading-relaxed text-charcoal/60">{text}</p>}
    </Link>
  );
}

export function QuizClient() {
  const [step, setStep] = useState<Step>(STEPS.GOALS);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [subgoalIndex, setSubgoalIndex] = useState(0);
  const [subgoalAnswers, setSubgoalAnswers] = useState<Record<string, string>>({});

  const results = useMemo(() => {
    if (step !== STEPS.RESULTS) return null;
    return buildResults(selectedGoals, subgoalAnswers);
  }, [step, selectedGoals, subgoalAnswers]);

  function toggleGoal(slug: string) {
    setSelectedGoals((current) => {
      if (current.includes(slug)) return current.filter((g) => g !== slug);
      if (current.length >= MAX_GOALS) return current;
      return [...current, slug];
    });
  }

  function handleGoalsContinue() {
    if (selectedGoals.length === 0) return;
    setSubgoalIndex(0);
    setSubgoalAnswers({});
    setStep(STEPS.SUBGOAL);
  }

  function answerSubgoal(subgoalSlug: string) {
    const goalSlug = selectedGoals[subgoalIndex];
    const nextAnswers = { ...subgoalAnswers, [goalSlug]: subgoalSlug };
    setSubgoalAnswers(nextAnswers);
    if (subgoalIndex + 1 < selectedGoals.length) {
      setSubgoalIndex(subgoalIndex + 1);
    } else {
      setStep(STEPS.RESULTS);
    }
  }

  function goBack() {
    if (step === STEPS.SUBGOAL) {
      if (subgoalIndex > 0) {
        setSubgoalIndex(subgoalIndex - 1);
      } else {
        setStep(STEPS.GOALS);
      }
    } else if (step === STEPS.RESULTS) {
      setSubgoalIndex(selectedGoals.length - 1);
      setStep(STEPS.SUBGOAL);
    }
  }

  function retake() {
    setStep(STEPS.GOALS);
    setSelectedGoals([]);
    setSubgoalIndex(0);
    setSubgoalAnswers({});
  }

  return (
    <>
      <section className="bg-sage-deep py-20 text-center text-white md:py-32">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-light">Quiz</p>
          <h1 className="mb-4 font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            Find your protocol in under a minute.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-white/70 md:text-lg">
            A couple of quick questions, then a short list of research-first starting points, chosen from what
            you tell us, not a generic bestseller list.
          </p>
        </div>
      </section>

      <section className="bg-ivory py-16 md:py-24">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <div className="rounded-xl border border-stone bg-ivory-soft p-6 md:p-10">
            {step === STEPS.GOALS && (
              <div>
                <h2 className="font-display text-xl font-bold text-charcoal md:text-2xl">
                  What&#39;s your main research focus?
                </h2>
                <p className="mt-2 text-sm text-charcoal/50">Pick up to {MAX_GOALS}.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {QUIZ_GOALS.map((goal) => {
                    const active = selectedGoals.includes(goal.slug);
                    const disabled = !active && selectedGoals.length >= MAX_GOALS;
                    return (
                      <button
                        key={goal.slug}
                        type="button"
                        onClick={() => toggleGoal(goal.slug)}
                        disabled={disabled}
                        className={`rounded-lg border px-4 py-3.5 text-left text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-30 ${
                          active
                            ? "border-sage-deep bg-sage-mist text-charcoal"
                            : "border-stone bg-ivory text-charcoal/70 hover:border-sage-deep/60"
                        }`}
                      >
                        {goal.label}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleGoalsContinue}
                  disabled={selectedGoals.length === 0}
                  className="mt-8 h-12 w-full rounded-md bg-sage-deep text-sm font-semibold uppercase tracking-wide text-ivory transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Continue →
                </button>
              </div>
            )}

            {step === STEPS.SUBGOAL &&
              (() => {
                const goalSlug = selectedGoals[subgoalIndex];
                const config = QUIZ_SUBGOALS[goalSlug];
                if (!config) return null;
                return (
                  <div>
                    <button
                      type="button"
                      onClick={goBack}
                      className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/50 transition hover:text-sage-deep"
                    >
                      <i className="ri-arrow-left-line" /> Back
                    </button>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sage-deep">
                      {goalLabel(goalSlug)} · {subgoalIndex + 1} of {selectedGoals.length}
                    </p>
                    <h2 className="mt-3 font-display text-xl font-bold text-charcoal md:text-2xl">{config.question}</h2>

                    <div className="mt-6 flex flex-col gap-3">
                      {config.options.map((opt) => (
                        <button
                          key={opt.slug}
                          type="button"
                          onClick={() => answerSubgoal(opt.slug)}
                          className="rounded-lg border border-stone bg-ivory px-4 py-3.5 text-left text-sm font-medium text-charcoal/70 transition hover:border-sage-deep hover:text-charcoal"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

            {step === STEPS.RESULTS && results && (
              <div>
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-charcoal/50 transition hover:text-sage-deep"
                >
                  <i className="ri-arrow-left-line" /> Back
                </button>
                <h2 className="font-display text-xl font-bold text-charcoal md:text-2xl">{QUIZ_LABELS.pageHeader}</h2>
                <p className="mt-2 text-sm text-charcoal/50">{QUIZ_LABELS.pageSubheader}</p>

                <div className="mt-8 space-y-8">
                  {results.map((goal) =>
                    goal.picks.length > 0 ? (
                      <div key={goal.goalSlug}>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/50">
                          {goalLabel(goal.goalSlug)} · {goal.subgoalLabel}
                        </p>
                        <div className="space-y-3">
                          {goal.picks.map((pick, i) => (
                            <ProductLine
                              key={pick.slug}
                              slug={pick.slug}
                              text={pick.text}
                              badge={i === 0 ? QUIZ_LABELS.startHere : QUIZ_LABELS.alsoWorthLook}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>

                <p className="mt-10 border-t border-stone pt-6 text-xs leading-relaxed text-charcoal/50">
                  {QUIZ_LABELS.footer}
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={retake}
                    className="h-10 rounded-md border border-stone px-5 text-sm font-medium text-charcoal/70 transition hover:border-sage-deep hover:text-charcoal"
                  >
                    Retake the quiz
                  </button>
                  <Link
                    href="/shop"
                    className="inline-flex h-10 items-center rounded-md bg-sage-deep px-5 text-sm font-semibold text-ivory transition hover:bg-charcoal"
                  >
                    Browse full shop →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-[11px] italic text-charcoal/40">
            For Research Use Only. Not intended for human consumption.
          </p>
        </div>
      </section>
    </>
  );
}

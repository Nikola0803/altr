"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Floating "not sure what you need?" quiz launcher, shown site-wide.
 * Opens a lightweight teaser modal that deep-links into the full
 * interactive quiz at /quiz — the goal-picker → subgoal → results flow
 * needs more room than a popup card.
 */
export function QuizPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-sage-deep px-5 py-3 text-[13px] font-semibold text-ivory shadow-lg transition hover:scale-[1.04] hover:bg-charcoal"
      >
        <i className="ri-questionnaire-line text-[15px]" />
        <span className="hidden sm:inline">Not sure what you need?</span>
        <span className="sm:hidden">Quiz</span>
        <i className="ri-arrow-right-line text-[14px]" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-charcoal/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full rounded-t-2xl border border-stone bg-ivory p-7 sm:max-w-md sm:rounded-2xl"
            style={{ boxShadow: "0 40px 90px -30px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-bold text-charcoal">Find your protocol</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-xl leading-none text-charcoal/50 transition hover:text-charcoal"
              >
                ×
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              Answer a couple of quick questions and we&#39;ll point you toward the right compound or stack. No
              pressure, no upsell.
            </p>

            <Link
              href="/quiz"
              onClick={() => setOpen(false)}
              className="mt-5 flex h-11 items-center justify-center rounded-md bg-sage-deep text-sm font-semibold text-ivory transition hover:bg-charcoal"
            >
              Take the quiz →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

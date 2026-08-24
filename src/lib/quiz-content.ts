/**
 * Quiz copy + recommendation data — same goal → subgoal → picks structure
 * as the Vertalis quiz this was modeled on, remapped to ALTR's actual
 * catalog. RUO framing throughout ("studied for", "researched in the
 * context of") — no dosing advice, no therapeutic claims, and no "growth
 * hormone" wording per the brand's compliance rule (see PROJECT.md) —
 * GH-axis products are framed as secretagogue/pathway research instead.
 */

export interface QuizGoal {
  slug: string;
  label: string;
}

export const QUIZ_GOALS: QuizGoal[] = [
  { slug: "recovery", label: "Recovery & Repair" },
  { slug: "longevity", label: "Longevity & Cellular Health" },
  { slug: "metabolic", label: "Metabolic & Weight" },
  { slug: "performance", label: "Growth & Performance" },
  { slug: "cognition", label: "Cognition & Mood" },
  { slug: "vitality", label: "Vitality" },
];

export const MAX_GOALS = 2;

interface SubgoalOption {
  slug: string;
  label: string;
}

interface SubgoalConfig {
  question: string;
  options: SubgoalOption[];
}

export const QUIZ_SUBGOALS: Record<string, SubgoalConfig> = {
  recovery: {
    question: "Within recovery, what are you most focused on?",
    options: [
      { slug: "injury", label: "A specific injury or joint" },
      { slug: "gut", label: "Gut & digestion" },
      { slug: "general", label: "General, whole-body recovery" },
    ],
  },
  longevity: {
    question: "Within longevity, what are you most focused on?",
    options: [
      { slug: "mitochondria", label: "Cellular energy & mitochondria" },
      { slug: "aging", label: "Overall aging" },
      { slug: "skin", label: "Skin & tissue-remodeling" },
    ],
  },
  metabolic: {
    question: "Within metabolic research, what are you most focused on?",
    options: [
      { slug: "appetite", label: "Appetite & fat loss" },
      { slug: "stubbornfat", label: "General metabolic support / stubborn fat" },
    ],
  },
  performance: {
    question: "Within growth & performance, what are you most focused on?",
    options: [
      { slug: "secretagogue", label: "Natural secretagogue research" },
      { slug: "igf", label: "Direct muscle / IGF pathway" },
    ],
  },
  cognition: {
    question: "Within cognition & mood, what are you most focused on?",
    options: [
      { slug: "focus", label: "Focus & mental clarity" },
      { slug: "stress", label: "Stress & a calm, steady state" },
    ],
  },
  vitality: {
    question: "Within vitality, what are you most focused on?",
    options: [
      { slug: "libido", label: "Libido & sexual health" },
      { slug: "tanning", label: "Tanning & aesthetics" },
      { slug: "connection", label: "Social bonding & connection" },
    ],
  },
};

export type Tier = "beginner" | "mid" | "advanced";

export const TIER_ORDER: Record<Tier, number> = { beginner: 0, mid: 1, advanced: 2 };

interface QuizProduct {
  tier: Tier;
  /** Keyed by `${goalSlug}:${subgoalSlug}` -> copy shown when that combination points here. */
  variants: Record<string, string>;
}

/** Every product the quiz can recommend, keyed by the real slug in lib/products.ts. */
export const QUIZ_PRODUCTS: Record<string, QuizProduct> = {
  "bpc-157-10mg": {
    tier: "beginner",
    variants: {
      "recovery:injury":
        "One of the most-studied compounds in the context of tendon, ligament, and soft-tissue repair. A common first single compound when the focus is one specific area.",
      "recovery:gut":
        "Widely studied around the gut lining and digestive tissue, which is why it comes up first for research focused on digestion rather than injury.",
    },
  },
  "tb-500-5mg": {
    tier: "mid",
    variants: {
      "recovery:injury":
        "Studied for systemic soft-tissue recovery and flexibility. Often researched alongside BPC-157 rather than on its own.",
      "recovery:general":
        "Researched in the context of whole-body soft-tissue recovery, which is why it appears when the focus is broad rather than one spot.",
    },
  },
  "wolverine-stack-20mg": {
    tier: "mid",
    variants: {
      "recovery:injury":
        "Combines BPC-157 and TB-500, the two most-studied repair compounds, in one vial. A common choice when the focus is a specific injury and running them separately isn't necessary.",
      "recovery:general":
        "Pairs the two staple repair compounds, which is why it comes up for broad, all-around recovery research.",
    },
  },
  "kpv-10mg": {
    tier: "mid",
    variants: {
      "recovery:gut": "A short peptide fragment studied in the context of gut inflammation and the digestive tract.",
    },
  },
  "nad-plus-500mg": {
    tier: "beginner",
    variants: {
      "longevity:mitochondria":
        "The most-studied compound in the context of cellular energy and mitochondrial function. The usual first stop here.",
      "longevity:aging":
        "A foundational compound in cellular-energy and aging research, a well-studied place to begin.",
    },
  },
  "thymosin-alpha-1-5mg": {
    tier: "mid",
    variants: {
      "longevity:aging":
        "Studied for immune function and cellular signaling, which is part of why it shows up in aging-focused research.",
    },
  },
  "epithalon-10mg": {
    tier: "mid",
    variants: {
      "longevity:aging": "Studied in the context of aging and cellular lifespan pathways.",
    },
  },
  "ghk-cu-50mg": {
    tier: "beginner",
    variants: {
      "longevity:skin":
        "A copper peptide among the most-studied compounds for skin and tissue-remodeling research. A common starting point on the aesthetics side.",
    },
  },
  "glutathione-1500mg": {
    tier: "beginner",
    variants: {
      "longevity:skin": "An antioxidant tripeptide studied for its role in oxidative stress and cellular health.",
    },
  },
  "semaglutide-5mg": {
    tier: "beginner",
    variants: {
      "metabolic:appetite":
        "The most-studied compound in this area by a wide margin, and the usual starting point for appetite and metabolic research.",
    },
  },
  "tirzepatide-10mg": {
    tier: "mid",
    variants: {
      "metabolic:appetite":
        "A dual-pathway compound studied around appetite and metabolic health, a common next step from single-pathway options.",
    },
  },
  "retatrutide-10mg": {
    tier: "advanced",
    variants: {
      "metabolic:appetite":
        "A newer triple-pathway compound at the frontier of metabolic research. Usually explored once someone's already familiar with the category.",
    },
  },
  "mots-c-10mg": {
    tier: "mid",
    variants: {
      "metabolic:stubbornfat":
        "A mitochondrial-derived peptide studied around energy metabolism and how the body uses fuel.",
      "longevity:mitochondria":
        "A mitochondrial-derived peptide studied around cellular energy, which is why it shows up in longevity research too.",
    },
  },
  "aod-9604-5mg": {
    tier: "beginner",
    variants: {
      "metabolic:stubbornfat":
        "A fragment-based compound studied specifically for its role in lipid metabolism.",
    },
  },
  "5-amino-1mq-50mg": {
    tier: "mid",
    variants: {
      "metabolic:stubbornfat": "An NNMT-inhibitor compound studied around metabolic rate and fat-cell signaling.",
    },
  },
  "tesamorelin-10mg": {
    tier: "mid",
    variants: {
      "performance:secretagogue":
        "A GHRH-analog studied for its role in body composition and secretagogue-pathway research.",
    },
  },
  "cjc-1295-with-dac-5mg": {
    tier: "mid",
    variants: {
      "performance:secretagogue": "A longer-acting GHRH-analog, studied for sustained pathway signaling.",
    },
  },
  "cjc-1295-without-dac-ipamorelin-10mg": {
    tier: "mid",
    variants: {
      "performance:secretagogue":
        "Pairs a GHRH-analog with Ipamorelin, a widely researched combination for this pathway.",
    },
  },
  "ipamorelin-5mg": {
    tier: "beginner",
    variants: {
      "performance:secretagogue": "A selective secretagogue research peptide, often a first single compound in this category.",
    },
  },
  "igf-1-lr3-1mg": {
    tier: "advanced",
    variants: {
      "performance:igf":
        "Studied further down the pathway, at the IGF level directly. Advanced tier, a targeted, later-stage compound.",
    },
  },
  "igf-1-des-2mg": {
    tier: "advanced",
    variants: {
      "performance:igf": "A des(1-3) IGF-1 variant studied for direct, localized pathway research.",
    },
  },
  "semax-10mg": {
    tier: "beginner",
    variants: {
      "cognition:focus": "Studied in the context of focus, mental clarity, and BDNF-signaling research.",
    },
  },
  "selank-10mg": {
    tier: "beginner",
    variants: {
      "cognition:stress": "Researched around stress response and a calm, steady state.",
    },
  },
  "dsip-5mg": {
    tier: "mid",
    variants: {
      "cognition:stress": "A nonapeptide studied in the context of sleep architecture and a settled nervous system.",
    },
  },
  "pt-141-10mg": {
    tier: "beginner",
    variants: {
      "vitality:libido":
        "Among the most-studied compounds in the context of libido and sexual-health research. The usual starting point here.",
    },
  },
  "mt-2-10mg": {
    tier: "beginner",
    variants: {
      "vitality:tanning": "Studied in the context of melanocortin receptor signaling and pigmentation.",
    },
  },
  "oxytocin-5mg": {
    tier: "beginner",
    variants: {
      "vitality:connection": "Studied extensively in social-behavior and neuroendocrine signaling research.",
    },
  },
};

export const QUIZ_LABELS = {
  startHere: "Start here",
  alsoWorthLook: "Also worth a look",
  pageHeader: "Based on what you told us",
  pageSubheader:
    "A short, research-first starting point, not a recommendation. Everything at ALTR is for research use only.",
  footer:
    "These are starting points for your own research, chosen from what you selected. Nothing here is medical or dosing advice.",
};

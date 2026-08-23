export interface JournalBlock {
  type: "p" | "h3";
  text: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  author: string;
  body: JournalBlock[];
}

/**
 * Mock journal/blog data, shaped to mirror a future WordPress REST post
 * object (slug, title, excerpt, content blocks, featured image, date,
 * category taxonomy) so swapping to the ALTR CMS `altr/v1` API later is an
 * adapter, not a rewrite — same pattern as lib/products.ts.
 */
export const journalPosts: JournalPost[] = [
  {
    slug: "reading-a-certificate-of-analysis",
    title: "How to Read a Certificate of Analysis",
    excerpt:
      "A COA is only useful if you know what you're looking at. Here's a plain breakdown of every line on a typical peptide CoA and what it actually tells you.",
    category: "Testing",
    coverImage: "/images/science/testing.jpg",
    publishedAt: "2026-08-12",
    readTime: "6 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "A Certificate of Analysis is the single most important document attached to any research compound, and also the most commonly skimmed past. It exists to answer one question with evidence instead of a claim: is this vial what the label says it is, and how much of it is actually there.",
      },
      { type: "h3", text: "Lot number and traceability" },
      {
        type: "p",
        text: "Every CoA should be tied to a specific lot number, not a general product line. This is what lets a single vial on your bench be traced back to a specific manufacturing and testing event. If a CoA has no lot reference, it isn't describing the vial in front of you — it's describing a product in general, which is a meaningfully weaker claim.",
      },
      { type: "h3", text: "Purity percentage" },
      {
        type: "p",
        text: "Purity is reported as a percentage of the total peak area attributable to the target compound versus everything else in the sample — residual solvents, salts, synthesis byproducts, and related impurities. A number without a method attached (see below) is close to meaningless; the same sample can report differently depending on how it was measured.",
      },
      { type: "h3", text: "Method: HPLC and mass spectrometry" },
      {
        type: "p",
        text: "High-performance liquid chromatography (HPLC) separates and quantifies compounds in a sample — this is where the purity percentage comes from. Mass spectrometry (LC-MS) confirms molecular identity by measuring mass-to-charge ratio, answering a different question: not how much, but is it actually the compound it claims to be. A rigorous CoA reports both, because purity of the wrong compound is not a useful result.",
      },
      { type: "h3", text: "Testing lab and independence" },
      {
        type: "p",
        text: "The most reliable CoAs are issued by a third-party lab with no financial stake in the result — not an internal lab operated by the seller. Look for a named, independent laboratory, and treat self-issued or unnamed 'in-house tested' claims with proportional skepticism.",
      },
      {
        type: "p",
        text: "Every ALTR batch ships with a CoA that includes all of the above: lot number, HPLC purity, LC-MS identity confirmation, and the independent lab that ran the analysis. You can look up any current batch on our Lab Results page.",
      },
    ],
  },
  {
    slug: "hplc-vs-mass-spec",
    title: "HPLC vs. Mass Spectrometry: What Each Test Actually Proves",
    excerpt:
      "Two different instruments, two different questions. Understanding the distinction is the difference between reading a CoA and actually understanding one.",
    category: "Testing",
    coverImage: "/images/science/purity.jpg",
    publishedAt: "2026-08-05",
    readTime: "5 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "It's common to see 'HPLC tested' used as shorthand for 'verified,' but HPLC and mass spectrometry answer genuinely different questions, and a rigorous verification process needs both.",
      },
      { type: "h3", text: "What HPLC measures" },
      {
        type: "p",
        text: "High-performance liquid chromatography separates the components of a sample as they pass through a column, then measures the relative size of each resulting peak. The peak attributed to the target compound, expressed as a percentage of total peak area, becomes the reported purity. HPLC is excellent at quantifying how much of something is present relative to everything else in the vial — but on its own, it assumes you already know what that 'something' is.",
      },
      { type: "h3", text: "What mass spec measures" },
      {
        type: "p",
        text: "Mass spectrometry ionizes a sample and measures the mass-to-charge ratio of the resulting fragments, producing a molecular fingerprint that can be compared against the expected structure of the target compound. This is an identity test, not a quantity test — it answers whether the molecule is actually what it's labeled as, independent of how much of it there is.",
      },
      { type: "h3", text: "Why you need both" },
      {
        type: "p",
        text: "A sample can return a high HPLC purity reading for the wrong compound entirely, if that compound happens to elute at a similar point and no identity confirmation is run. Conversely, a correctly identified compound could still be present at a purity too low to be a meaningful research reagent. Pairing HPLC with LC-MS closes both gaps: one confirms quantity, the other confirms identity.",
      },
      {
        type: "p",
        text: "Every batch we release is run through both. It's slower and more expensive than a single-method process, and it's also the only version of 'tested' that we think is worth putting our name on.",
      },
    ],
  },
  {
    slug: "cold-chain-handling",
    title: "Cold-Chain Handling: Why Storage Discipline Matters",
    excerpt:
      "A perfect CoA means nothing if the compound degrades in transit. Cold-chain handling is where most quality is lost after testing, not before it.",
    category: "Handling",
    coverImage: "/images/about-lab.jpg",
    publishedAt: "2026-07-28",
    readTime: "4 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "Testing happens once. Handling happens continuously, from the moment a batch leaves the lab to the moment it reaches a bench — and it's the stage where quality is most commonly lost after the fact.",
      },
      { type: "h3", text: "Why temperature matters" },
      {
        type: "p",
        text: "Lyophilized (freeze-dried) peptides are relatively stable at room temperature for short periods, but repeated heat exposure — a hot delivery truck, a warm mailbox, a windowsill — accelerates degradation over time. The compound doesn't fail all at once; it degrades incrementally, which is exactly what makes it easy to overlook.",
      },
      { type: "h3", text: "In transit" },
      {
        type: "p",
        text: "We ship with insulated packaging and cold-chain materials sized to the expected transit window, and we track lot-level handling from dispatch to delivery. Discreet packaging and temperature control are not mutually exclusive — both are treated as baseline requirements, not premium add-ons.",
      },
      { type: "h3", text: "On the bench" },
      {
        type: "p",
        text: "Once received, lyophilized vials should be stored at 2–8°C until reconstitution. After reconstitution, most peptides have a materially shorter usable window and should be refrigerated and used within the timeframe specified on that product's storage instructions — not the dry-vial timeframe.",
      },
      {
        type: "p",
        text: "A CoA describes the compound at the moment it was tested. What happens to it afterward is a handling problem, not a testing problem — and it's one we treat as our responsibility, not the courier's.",
      },
    ],
  },
  {
    slug: "reconstitution-basics-for-research",
    title: "Reconstitution Basics for Laboratory Use",
    excerpt:
      "Reconstitution is a simple procedure with a low margin for error. A short, practical rundown of what actually matters.",
    category: "Handling",
    coverImage: "/images/hero-vial.jpg",
    publishedAt: "2026-07-20",
    readTime: "4 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "Reconstitution — converting a lyophilized (freeze-dried) peptide back into solution — is procedurally simple, but a few details determine whether the result is usable or compromised.",
      },
      { type: "h3", text: "Diluent choice" },
      {
        type: "p",
        text: "Bacteriostatic water or sterile water appropriate for laboratory use is standard. The diluent should be added slowly, along the interior wall of the vial rather than directly onto the lyophilized material — a fast, direct stream can shear peptide bonds and reduce the effective concentration of your solution.",
      },
      { type: "h3", text: "Handling the vial" },
      {
        type: "p",
        text: "After adding diluent, let the vial sit rather than shaking it. Gentle swirling is fine once the material has partially dissolved; vigorous agitation introduces unnecessary mechanical stress. Full dissolution can take anywhere from a few minutes to longer depending on the compound and volume.",
      },
      { type: "h3", text: "After reconstitution" },
      {
        type: "p",
        text: "Once in solution, a peptide is meaningfully less stable than in its lyophilized form and should be refrigerated at 2–8°C. Reconstituted solutions should be used within the window specified on that product's storage guidance — for most compounds, this is a matter of weeks, not months, and shorter if the vial has been exposed to light or temperature fluctuation.",
      },
      {
        type: "p",
        text: "None of this is complicated, but all of it is easy to get slightly wrong in a way that quietly degrades your sample rather than failing obviously. Treat reconstitution as a controlled step, not a formality.",
      },
    ],
  },
  {
    slug: "lyophilization-and-stability",
    title: "Lyophilization and Peptide Stability",
    excerpt:
      "Why nearly every research peptide ships freeze-dried, and what that process actually does to a compound's shelf life.",
    category: "Research",
    coverImage: "/images/science/standard.jpg",
    publishedAt: "2026-07-11",
    readTime: "5 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "Lyophilization — freeze-drying — is the default state for nearly every peptide sold for research purposes, and the reason is almost entirely about stability, not convenience.",
      },
      { type: "h3", text: "The process" },
      {
        type: "p",
        text: "The compound is dissolved, frozen, and then placed under vacuum, which causes the frozen water to sublimate directly from solid to vapor without passing through a liquid phase. What remains is a stable, porous solid — the peptide, with the water removed but its structure largely intact.",
      },
      { type: "h3", text: "Why it matters for stability" },
      {
        type: "p",
        text: "Peptide bonds are susceptible to hydrolysis — degradation caused by the presence of water — as well as oxidation and other reactions that proceed far more slowly in a dry, low-temperature state. Removing water dramatically extends shelf life, which is why a lyophilized vial stored correctly can remain stable for a meaningfully longer period than the same compound in solution.",
      },
      { type: "h3", text: "Where stability still depends on you" },
      {
        type: "p",
        text: "Lyophilization buys stability, it doesn't guarantee it indefinitely. Storage temperature, light exposure, and humidity still matter for a dry vial — and matter significantly more once it's reconstituted, since that's the point where the water that lyophilization removed is deliberately added back.",
      },
      {
        type: "p",
        text: "Understanding this is part of why we treat cold-chain handling and reconstitution guidance as seriously as the initial purity testing — a well-tested compound that isn't stored correctly stops being a well-tested compound.",
      },
    ],
  },
  {
    slug: "what-third-party-verification-means",
    title: "What 'Third-Party Verified' Actually Means",
    excerpt:
      "It's one of the most-used phrases in this space, and one of the least defined. Here's what should actually be true before a compound earns that label.",
    category: "Standards",
    coverImage: "/images/products/bpc-157.jpg",
    publishedAt: "2026-06-30",
    readTime: "5 min read",
    author: "ALTR Research Team",
    body: [
      {
        type: "p",
        text: "'Third-party verified' shows up on almost every research-compound listing you'll come across, and it means almost nothing on its own — there's no regulatory standard enforcing what counts. So it's worth being specific about what should actually be true.",
      },
      { type: "h3", text: "No financial relationship with the result" },
      {
        type: "p",
        text: "A genuinely independent lab has no stake in whether a batch passes. It isn't owned by, invested in, or paid on a pass-contingent basis by the seller. The test result should be identical whether it's good news for the seller or bad.",
      },
      { type: "h3", text: "Named, and checkable" },
      {
        type: "p",
        text: "If a lab is doing legitimate independent work, there's usually no reason to hide its identity. Vague references to 'an accredited lab' without naming one are a weaker signal than a named lab whose credentials you could look up yourself.",
      },
      { type: "h3", text: "Batch-specific, not product-line-specific" },
      {
        type: "p",
        text: "Verification of 'the product' in general, run once and reused across every future batch, is a different and much weaker claim than verification of the specific lot in the vial you're holding. Batch-level testing is more expensive and slower to produce — which is part of why it's a meaningful signal when a seller does it consistently.",
      },
      {
        type: "p",
        text: "This is the standard we hold every ALTR batch to: independently tested, by a named lab, per lot, with the resulting CoA published rather than available on request. If any part of that isn't true for a given batch, it isn't listed for sale.",
      },
    ],
  },
];

export function getJournalPosts() {
  return [...journalPosts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getJournalPostBySlug(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}

export function getRelatedJournalPosts(slug: string, limit = 3) {
  const current = getJournalPostBySlug(slug);
  if (!current) return [];
  return journalPosts.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);
}

export function getJournalCategories() {
  return Array.from(new Set(journalPosts.map((p) => p.category)));
}

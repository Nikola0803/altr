/**
 * Shared molecular-graphic decoration used as a subtle, restrained-opacity
 * background accent on dark sections, so the motif reads as one consistent
 * visual system across the page rather than a one-off illustration.
 */
export function MolecularMotif({
  variant,
  className = "",
}: {
  variant: "concentric" | "particles";
  className?: string;
}) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {variant === "concentric" &&
        [80, 60, 40, 20].map((r, i) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={i === 3 ? "#97A494" : "#FFFFFF"} strokeWidth={i === 3 ? 1.5 : 1} opacity={i === 3 ? 0.5 : 0.08 + i * 0.03} />
        ))}
      {variant === "particles" && (
        <>
          <circle cx="100" cy="100" r="74" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.1" />
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const x = 100 + Math.cos(angle) * 74;
            const y = 100 + Math.sin(angle) * 74;
            return <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3 : 1.5} fill={i % 4 === 0 ? "#97A494" : "#FFFFFF"} opacity={i % 4 === 0 ? 0.45 : 0.15} />;
          })}
        </>
      )}
    </svg>
  );
}

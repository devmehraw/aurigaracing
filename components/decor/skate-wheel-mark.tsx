type SkateWheelMarkProps = {
  className?: string
  tone?: "light" | "dark"
}

/**
 * Decorative inline-skate wheel mark (rim + spokes + bearing) used as a subtle
 * corner/background accent across sections. Purely decorative, aria-hidden.
 */
export function SkateWheelMark({ className = "", tone = "light" }: SkateWheelMarkProps) {
  const stroke = tone === "light" ? "currentColor" : "currentColor"
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      style={{ color: stroke }}
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="6" fill="currentColor" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4
        const x1 = 100 + Math.cos(angle) * 24
        const y1 = 100 + Math.sin(angle) * 24
        const x2 = 100 + Math.cos(angle) * 88
        const y2 = 100 + Math.sin(angle) * 88
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="2.5" />
      })}
    </svg>
  )
}

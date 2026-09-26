/* Decorative — every placement sits beside the wordmark, so alt is intentionally empty
   to keep screen readers from announcing the name twice. Fills use theme tokens so the
   mark follows green / blue / maroon / yellow. */
export default function Logo({ className = 'h-8 w-8' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`${className} shrink-0 rounded-md`}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="6" className="fill-emerald-deep" />
      <circle cx="16" cy="16" r="11.5" className="fill-emerald" />
      <path d="M11.6 8.6h8l3.6 3.6v11.2H11.6z" className="fill-ink" />
      <path d="M19.6 8.6v3.6h3.6" className="fill-emerald-deep" />
      <rect x="6.8" y="11" width="11.6" height="6.4" rx="1.2" className="fill-emerald-soft" />
      <text
        x="12.6"
        y="15.6"
        textAnchor="middle"
        className="fill-ink"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="4.8"
        fontWeight="700"
      >
        XLS
      </text>
      <rect x="14.2" y="18.8" width="2.6" height="2.6" rx="0.35" className="fill-emerald" />
      <rect x="17.2" y="18.8" width="2.6" height="2.6" rx="0.35" className="fill-emerald" />
      <rect x="20.2" y="18.8" width="2.6" height="2.6" rx="0.35" className="fill-emerald" />
      <rect x="17.2" y="21.8" width="2.6" height="2.6" rx="0.35" className="fill-emerald" />
      <rect x="20.2" y="21.8" width="2.6" height="2.6" rx="0.35" className="fill-emerald" />
      <rect x="13.4" y="18.2" width="6.2" height="6.2" rx="0.9" className="fill-emerald-deep" />
      <text
        x="16.5"
        y="22.7"
        textAnchor="middle"
        className="fill-txt"
        fontFamily="Space Grotesk, Inter, sans-serif"
        fontSize="4.4"
        fontWeight="700"
      >
        X
      </text>
    </svg>
  )
}

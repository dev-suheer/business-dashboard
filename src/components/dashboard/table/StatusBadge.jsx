const GOOD = 'bg-emerald/12 text-emerald-soft border-emerald/25'
const WARN = 'bg-warn/12 text-warn border-warn/25'
const BAD = 'bg-bad/12 text-bad border-bad/25'
const MUTED = 'bg-panel2 text-mut border-line2'

/* Covers OrderStatus, VarianceClass and MatchState values. Enum values are compared
   literally (OrderStatus is human-cased, the rest snake_case); anything unknown falls
   back to a muted pill. */
const STYLES = {
  Delivered: GOOD,
  'Ready to Pickup': WARN,
  Return: WARN,
  RTO: BAD,
  clean: GOOD,
  overcharge: BAD,
  wrong_rate: BAD,
  promo_absorbed: MUTED,
  matched: GOOD,
  unmatched: BAD,
  prior_period: MUTED,
  later_period: MUTED,
  ambiguous: WARN,
  Excluded: MUTED,
}

export default function StatusBadge({ status, label }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-500 ${
        STYLES[status] ?? MUTED
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label ?? status}
    </span>
  )
}

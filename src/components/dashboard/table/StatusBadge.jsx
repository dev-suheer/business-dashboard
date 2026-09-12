const STYLES = {
  Matched: 'bg-emerald/12 text-emerald-soft border-emerald/25',
  Variance: 'bg-warn/12 text-warn border-warn/25',
  Unmatched: 'bg-bad/12 text-bad border-bad/25',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-500 ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}

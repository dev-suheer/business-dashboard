export default function LegendDot({ color, label, round = false }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-mut">
      <span className={`h-2 w-2 ${round ? 'rounded-full' : 'rounded-sm'} ${color}`} />
      {label}
    </span>
  )
}

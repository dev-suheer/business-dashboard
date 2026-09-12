import Icon from '../common/Icon'

/* Responsive note: the reference used a flat `p-5` / `text-[26px]`, which overflowed the
   two-up mobile grid once the reconciled total reached seven figures. Both step up to the
   reference values at `sm`, so tablet and desktop are unchanged. */
export default function KpiCard({ label, value, delta, positive }) {
  return (
    <div className="rounded-xl border border-line/70 bg-panel/50 p-4 sm:p-5">
      <p className="text-[12px] text-mut">{label}</p>
      <p className="font-mono font-600 text-[20px] sm:text-[26px] mt-2 tracking-tight">{value}</p>
      <p
        className={`text-[11.5px] mt-1 inline-flex items-center gap-1 ${
          positive ? 'text-emerald-soft' : 'text-bad'
        }`}
      >
        <Icon name={positive ? 'trendUp' : 'trendDown'} className="h-3.5 w-3.5" />
        {delta}
      </p>
    </div>
  )
}

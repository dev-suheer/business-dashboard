import Icon from '../common/Icon'

/* Responsive note: the reference used a flat `p-5` / `text-[26px]`, which overflowed the
   two-up mobile grid once the reconciled total reached seven figures. Both step up to the
   reference values at `sm`, so tablet and desktop are unchanged.

   `positive` true/false draws a green/red trend line; leave it undefined for a neutral,
   explanatory note. `accent` marks the headline figure. */
export default function KpiCard({ label, value, delta, positive, accent = false }) {
  const neutral = positive === undefined
  return (
    <div
      className={`rounded-xl border p-4 sm:p-5 ${
        accent ? 'border-emerald/40 bg-emerald/[0.05]' : 'border-line/70 bg-panel/50'
      }`}
    >
      <p className="text-[12px] text-mut">{label}</p>
      <p
        className={`font-mono font-600 text-[20px] sm:text-[26px] mt-2 tracking-tight ${
          accent ? 'text-emerald-soft' : ''
        }`}
      >
        {value}
      </p>
      {delta && (
        <p
          className={`text-[11.5px] mt-1 inline-flex items-center gap-1 ${
            neutral ? 'text-mut' : positive ? 'text-emerald-soft' : 'text-bad'
          }`}
        >
          {!neutral && (
            <Icon name={positive ? 'trendUp' : 'trendDown'} className="h-3.5 w-3.5" />
          )}
          {delta}
        </p>
      )}
    </div>
  )
}

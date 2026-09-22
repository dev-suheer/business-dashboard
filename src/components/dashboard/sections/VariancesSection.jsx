import { useMemo, useState } from 'react'
import { amount, humanize, isoDate, ratePct, signedAmount } from '../../../utils/format'
import StatusBadge from '../table/StatusBadge'
import TableToolbar from '../table/TableToolbar'

const HEADERS = [
  ['Order', ''],
  ['SKU', ''],
  ['Item', ''],
  ['Date', ''],
  ['Status', ''],
  ['GMV', ' text-right'],
  ['Rate applied', ' text-right'],
  ['Expected', ' text-right'],
  ['Actual', ' text-right'],
  ['Variance', ' text-right'],
  ['Class', ''],
  ['Coupon', ''],
]

/* Only lines whose commission breached line_tolerance are returned — this is the
   evidence behind the commission exceptions, not a full line listing. */
export default function VariancesSection({ variances, rates }) {
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return variances
    return variances.filter(
      (v) =>
        v.order_no.toLowerCase().includes(q) ||
        (v.sku ?? '').toLowerCase().includes(q) ||
        (v.item_title ?? '').toLowerCase().includes(q),
    )
  }, [variances, query])

  return (
    <section id="sec-variances" className="sec">
      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <TableToolbar
          title="Commission variance"
          subtitle={`Lines breaching the ${amount(rates.line_tolerance)} tolerance · standard ${ratePct(
            rates.standard_rate,
          )}, promo ${ratePct(rates.promo_rate)} to ${isoDate(rates.promo_cutoff)}`}
          query={query}
          onQueryChange={setQuery}
          placeholder="Search order, SKU or item"
        />
        {variances.length === 0 ? (
          <p className="px-5 py-6 text-[13px] text-emerald-soft">
            No commission lines breached tolerance.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12.5px] min-w-[1300px]">
              <thead>
                <tr className="text-mut text-left border-b border-line/70">
                  {HEADERS.map(([label, align]) => (
                    <th key={label} className={`font-normal px-4 py-3 whitespace-nowrap${align}`}>
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((v, i) => (
                  <tr key={i} className="border-b border-line/40 hover:bg-panel2/60">
                    <td className="px-4 py-2.5 font-mono whitespace-nowrap">{v.order_no}</td>
                    <td className="px-4 py-2.5 font-mono text-mut">{v.sku ?? '—'}</td>
                    {/* Bilingual EN/AR titles: dir="auto" and CSS ellipsis, never sliced. */}
                    <td className="px-4 py-2.5 max-w-[260px]">
                      <span dir="auto" title={v.item_title ?? ''} className="block truncate">
                        {v.item_title ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(v.order_date)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(v.gmv)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{ratePct(v.rate)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(v.expected_commission)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(v.actual_commission)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{signedAmount(v.variance)}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={v.variance_class} label={humanize(v.variance_class)} />
                    </td>
                    <td className="px-4 py-2.5 text-mut whitespace-nowrap">
                      {v.coupon_name ? `${v.coupon_name} (${amount(v.coupon_value)})` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-line/70 text-[11px] text-mut">
          Showing {rows.length} of {variances.length} lines
        </div>
      </div>
    </section>
  )
}

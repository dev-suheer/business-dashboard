import { amount, humanize, isoDate, signedAmount } from '../../../utils/format'
import { absExceeds, sign } from '../../../utils/money'
import StatusBadge from './StatusBadge'

const HEADERS = [
  ['Order', ''],
  ['Date', ''],
  ['Status', ''],
  ['Portal GMV', ' text-right'],
  ['Vendor amt', ' text-right'],
  ['Difference', ' text-right'],
  ['Exp. comm.', ' text-right'],
  ['Act. comm.', ' text-right'],
  ['Variance', ''],
  ['Payable', ' text-right'],
  ['Adjustments', ' text-right'],
  ['Net', ' text-right'],
  ['Match', ''],
  ['Flags', ''],
]

const toneOf = (value) => (sign(value) > 0 ? 'text-warn' : sign(value) < 0 ? 'text-bad' : 'text-mut')

/* A small amount_diff is normal vendor rounding; it is only highlighted past the
   order tolerance or when the server raised AMOUNT_MISMATCH for the order (guide §6.4).
   Excluded (RTO) rows stay visible — they carry the clawbacks the headline includes. */
export default function OrdersTable({ rows, orderTolerance, mismatched }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] min-w-[1400px]">
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
          {rows.map((o) => {
            const diffBreach =
              mismatched.has(o.order_no) ||
              (o.amount_diff !== null && absExceeds(o.amount_diff, orderTolerance))
            return (
              <tr
                key={o.order_no}
                className={`border-b border-line/40 hover:bg-panel2/60 transition-colors ${
                  o.included_in_payable ? '' : 'opacity-70'
                }`}
              >
                <td className="px-4 py-2.5 font-mono whitespace-nowrap">
                  {o.order_no}
                  {o.line_count > 1 && (
                    <span className="ml-1.5 text-[10.5px] text-mut">×{o.line_count}</span>
                  )}
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(o.order_date)}</td>
                <td className="px-4 py-2.5">
                  <div className="flex flex-wrap gap-1">
                    {o.statuses.map((s) => (
                      <StatusBadge key={s} status={s} />
                    ))}
                    {!o.included_in_payable && <StatusBadge status="Excluded" />}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{amount(o.portal_gmv)}</td>
                <td className="px-4 py-2.5 text-right font-mono">{amount(o.vendor_amount)}</td>
                <td
                  className={`px-4 py-2.5 text-right font-mono ${
                    diffBreach ? 'text-bad font-600' : 'text-mut'
                  }`}
                >
                  {signedAmount(o.amount_diff)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{amount(o.expected_commission)}</td>
                <td className="px-4 py-2.5 text-right font-mono">{amount(o.actual_commission)}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge
                    status={o.variance_class}
                    label={
                      humanize(o.variance_class) +
                      (sign(o.commission_variance) !== 0 ? ' ' + signedAmount(o.commission_variance) : '')
                    }
                  />
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{amount(o.payable)}</td>
                <td className={`px-4 py-2.5 text-right font-mono ${toneOf(o.adjustments)}`}>
                  {amount(o.adjustments)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono font-600">{amount(o.net_payable)}</td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={o.match_state} label={humanize(o.match_state)} />
                </td>
                <td className="px-4 py-2.5 text-[11px] text-mut whitespace-nowrap">
                  {o.flags.length ? o.flags.join(', ') : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

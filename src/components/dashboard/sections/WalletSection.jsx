import { amount, humanize, isoDate, signedAmount } from '../../../utils/format'
import Card from '../../common/Card'
import StatusBadge from '../table/StatusBadge'

const HEADERS = [
  ['SG order', ''],
  ['Booking', ''],
  ['Vertical', ''],
  ['Order date', ''],
  ['Portal wallet', ' text-right'],
  ['History paid', ' text-right'],
  ['History refunded', ' text-right'],
  ['Events', ' text-right'],
  ['Difference', ' text-right'],
  ['State', ''],
]

/* Rendered only when a wallet history was uploaded. `out_of_window` is informational —
   the export simply does not cover that date — so it is muted, not red. */
export default function WalletSection({ wallet }) {
  const counts = [
    ['Matched', wallet.matched, 'text-emerald-soft'],
    ['Amount mismatch', wallet.amount_mismatch, 'text-bad'],
    ['Missing', wallet.missing, 'text-bad'],
    ['Out of window', wallet.out_of_window, 'text-mut'],
  ]

  return (
    <section id="sec-wallet" className="sec space-y-4">
      <div>
        <h2 className="font-display font-600 text-[18px] tracking-tight">Wallet</h2>
        <p className="text-[12px] text-mut">
          {wallet.rows_checked} wallet-paid rows checked against a history covering{' '}
          {isoDate(wallet.window_start)} – {isoDate(wallet.window_end)}
        </p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {counts.map(([label, value, tone]) => (
          <Card key={label}>
            <p className="text-[12px] text-mut">{label}</p>
            <p className={`font-mono font-600 text-[22px] mt-1.5 ${tone}`}>{value}</p>
          </Card>
        ))}
      </div>

      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <div className="p-5 border-b border-line/70">
          <h3 className="font-display font-600 text-[15px]">Wallet checks</h3>
          <p className="text-[11px] text-mut">
            Portal wallet share against the history&apos;s own movements
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[12.5px] min-w-[1000px]">
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
              {wallet.checks.map((c, i) => (
                <tr key={i} className="border-b border-line/40 hover:bg-panel2/60">
                  {/* A per-export sequence, not an identity — display only. */}
                  <td className="px-4 py-2.5 font-mono text-mut">{c.sg_order_id}</td>
                  <td className="px-4 py-2.5 font-mono">{c.booking_id ?? '—'}</td>
                  <td className="px-4 py-2.5">{humanize(c.vertical)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(c.order_date)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {amount(c.portal_wallet_amount)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(c.history_paid)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(c.history_refunded)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-mut">{c.events}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{signedAmount(c.diff)}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={c.state} label={humanize(c.state)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {wallet.unmatched_history.length > 0 && (
        <details className="group rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
          <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
            <div>
              <h3 className="font-display font-600 text-[15px]">Unmatched history movements</h3>
              <p className="text-[11px] text-mut">
                {wallet.unmatched_history.length} wallet movements with no portal row
              </p>
            </div>
            <span className="text-[12px] text-emerald-soft group-open:hidden">Show</span>
            <span className="text-[12px] text-emerald-soft hidden group-open:inline">Hide</span>
          </summary>
          <div className="overflow-x-auto border-t border-line/70">
            <table className="w-full text-[12.5px] min-w-[760px]">
              <thead>
                <tr className="text-mut text-left border-b border-line/70">
                  {['Event', 'SG order', 'Vertical', 'Date', 'Type', 'Message', 'Amount'].map(
                    (h, i) => (
                      <th key={h} className={`font-normal px-4 py-3 ${i === 6 ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {wallet.unmatched_history.map((e, i) => (
                  <tr key={i} className="border-b border-line/40">
                    <td className="px-4 py-2.5 font-mono text-mut">{e.event_id ?? '—'}</td>
                    <td className="px-4 py-2.5 font-mono">{e.sg_order_id}</td>
                    <td className="px-4 py-2.5">{humanize(e.vertical)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(e.event_date)}</td>
                    <td className="px-4 py-2.5">{e.payment_type ?? '—'}</td>
                    <td className="px-4 py-2.5 max-w-[260px]">
                      <span dir="auto" title={e.message ?? ''} className="block truncate">
                        {e.message ?? '—'}
                      </span>
                    </td>
                    {/* Negative is a payment, positive a refund. */}
                    <td className="px-4 py-2.5 text-right font-mono">{signedAmount(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </section>
  )
}

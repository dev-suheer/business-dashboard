import { Fragment, useState } from 'react'
import { amount, humanize, isoDate, ratePct, signedAmount } from '../../../utils/format'
import { sign } from '../../../utils/money'
import StatusBadge from './StatusBadge'

const HEADERS = [
  ['', ''],
  ['Booking', ''],
  ['Date', ''],
  ['Vertical', ''],
  ['Locality', ''],
  ['Match', ''],
  ['Refund', ''],
  ['Base — ours', ' text-right'],
  ['Base — theirs', ' text-right'],
  ['Difference', ' text-right'],
  ['Comm. — ours', ' text-right'],
  ['Comm. — theirs', ' text-right'],
  ['Contract rate', ' text-right'],
  ['Comm. at contract', ' text-right'],
  ['Net at contract', ' text-right'],
  ['VAT uplift', ' text-right'],
  ['Flags', ''],
]

const LINE_HEADERS = [
  'Invoice',
  'Line',
  'Billing type',
  'PNR',
  'Route',
  'Client',
  'Check in',
  'Check out',
  'VAT %',
  'Cancel fee',
  'Total',
  'Commission',
  'Net payable',
]

/* The sign is meaningful: a negative difference means they billed more than we booked. */
const diffTone = (value) => (sign(value) < 0 ? 'text-bad' : sign(value) > 0 ? 'text-warn' : 'text-mut')

function InvoiceLines({ lines, colSpan }) {
  return (
    <tr className="border-b border-line/40 bg-panel2/40">
      <td colSpan={colSpan} className="px-4 py-3">
        <p className="text-[11px] text-mut mb-2">
          {lines.length} claim line{lines.length > 1 ? 's' : ''} under this booking
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11.5px] min-w-[900px]">
            <thead>
              <tr className="text-mut text-left border-b border-line/50">
                {LINE_HEADERS.map((h, i) => (
                  <th key={h} className={`font-normal py-1.5 pr-3 ${i > 7 ? 'text-right' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => (
                <tr key={i} className="border-b border-line/25">
                  <td className="py-1.5 pr-3 font-mono">{l.invoice_no ?? '—'}</td>
                  <td className="py-1.5 pr-3">{l.line_item ?? '—'}</td>
                  <td className="py-1.5 pr-3">{l.billing_type}</td>
                  <td className="py-1.5 pr-3 font-mono">{l.pnr ?? '—'}</td>
                  <td className="py-1.5 pr-3">{l.route ?? '—'}</td>
                  <td className="py-1.5 pr-3">
                    <span dir="auto" className="block max-w-[180px] truncate" title={l.client_name ?? ''}>
                      {l.client_name ?? '—'}
                    </span>
                  </td>
                  {/* Text in the source, MM/DD/YYYY — shown as written, never parsed. */}
                  <td className="py-1.5 pr-3">{l.check_in_text ?? '—'}</td>
                  <td className="py-1.5 pr-3">{l.check_out_text ?? '—'}</td>
                  <td className="py-1.5 pr-3 text-right font-mono">{l.vat_percent}</td>
                  <td className="py-1.5 pr-3 text-right font-mono">{amount(l.airline_cancel_fee)}</td>
                  <td className="py-1.5 pr-3 text-right font-mono">{amount(l.total_invoice)}</td>
                  <td className="py-1.5 pr-3 text-right font-mono">{amount(l.commission)}</td>
                  <td className="py-1.5 text-right font-mono">{amount(l.net_payable)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  )
}

export default function BookingsTable({ rows, linesByBooking }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] min-w-[1500px]">
        <thead>
          <tr className="text-mut text-left border-b border-line/70">
            {HEADERS.map(([label, align], i) => (
              <th key={i} className={`font-normal px-4 py-3 whitespace-nowrap${align}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b) => {
            const lines = linesByBooking.get(b.booking_id) ?? []
            const open = expanded === b.booking_id
            return (
              <Fragment key={b.booking_id}>
                <tr className="border-b border-line/40 hover:bg-panel2/60 transition-colors">
                  <td className="px-4 py-2.5">
                    {lines.length > 0 && (
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setExpanded(open ? null : b.booking_id)}
                        className="h-6 w-6 rounded border border-line2 text-mut hover:text-emerald-soft hover:border-emerald/40"
                        title={`${lines.length} claim line${lines.length > 1 ? 's' : ''}`}
                      >
                        {open ? '−' : '+'}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-2.5 font-mono whitespace-nowrap">
                    {b.booking_id}
                    {b.vendor_lines > 1 && (
                      <span className="ml-1.5 text-[10.5px] text-mut">×{b.vendor_lines}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {isoDate(b.order_date ?? b.booking_date)}
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={b.vertical} label={humanize(b.vertical)} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={b.locality} label={humanize(b.locality)} />
                  </td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={b.match_state} label={humanize(b.match_state)} />
                  </td>
                  <td className="px-4 py-2.5">
                    {b.refund === 'none' ? (
                      <span className="text-mut">—</span>
                    ) : (
                      <StatusBadge status={b.refund} label={humanize(b.refund) + ' refund'} />
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(b.portal_base)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(b.vendor_base)}</td>
                  <td className={`px-4 py-2.5 text-right font-mono ${diffTone(b.base_diff)}`}>
                    {signedAmount(b.base_diff)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(b.portal_commission)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(b.vendor_commission)}</td>
                  <td className="px-4 py-2.5 text-right font-mono" title={`billed ${ratePct(b.vendor_rate)}`}>
                    {ratePct(b.contract_rate)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    {amount(b.commission_as_vendor)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono font-600">
                    {amount(b.net_payable_as_vendor)}
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-mono ${
                      sign(b.vat_uplift_shortfall) !== 0 ? 'text-warn' : 'text-mut'
                    }`}
                  >
                    {amount(b.vat_uplift_shortfall)}
                  </td>
                  <td className="px-4 py-2.5 text-[11px] text-mut whitespace-nowrap">
                    {b.flags.length ? b.flags.join(', ') : '—'}
                  </td>
                </tr>
                {open && <InvoiceLines lines={lines} colSpan={HEADERS.length} />}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

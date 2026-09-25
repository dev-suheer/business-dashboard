import { useMemo, useState } from 'react'
import { amount, humanize, isoDate } from '../../../utils/format'
import { absExceeds } from '../../../utils/money'
import BookingsTable from '../table/BookingsTable'
import TableToolbar from '../table/TableToolbar'

const VERTICAL_OPTIONS = [
  ['all', 'All verticals'],
  ['hotel', 'Hotel'],
  ['flight', 'Flight'],
]

const LOCALITY_OPTIONS = [
  ['all', 'All localities'],
  ['local', 'Local'],
  ['international', 'International'],
]

const MATCH_OPTIONS = [
  ['all', 'All match states'],
  ['matched', 'Matched'],
  ['portal_only', 'Ours only'],
  ['vendor_only', 'Theirs only'],
]

const REFUND_OPTIONS = [
  ['all', 'All bookings'],
  ['none', 'Not refunded'],
  ['full', 'Full refund'],
  ['partial', 'Partial refund'],
  ['differences', 'Differences only'],
]

/* The main travel table: one row per booking, with its claim lines behind a toggle. */
export default function BookingsSection({
  bookings,
  invoiceLines,
  flaggedRows,
  rates,
  query,
  onQueryChange,
}) {
  const [vertical, setVertical] = useState('all')
  const [locality, setLocality] = useState('all')
  const [match, setMatch] = useState('all')
  const [refund, setRefund] = useState('all')

  /* A group booking fans out into many claim lines; they are joined on booking_id. */
  const linesByBooking = useMemo(() => {
    const map = new Map()
    for (const line of invoiceLines) {
      const list = map.get(line.booking_id)
      if (list) list.push(line)
      else map.set(line.booking_id, [line])
    }
    return map
  }, [invoiceLines])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bookings.filter(
      (b) =>
        (vertical === 'all' || b.vertical === vertical) &&
        (locality === 'all' || b.locality === locality) &&
        (match === 'all' || b.match_state === match) &&
        (refund === 'all' ||
          (refund === 'differences'
            ? absExceeds(b.base_diff, rates.base_tolerance) ||
              absExceeds(b.commission_diff_as_vendor, rates.commission_tolerance)
            : b.refund === refund)) &&
        (!q || b.booking_id.toLowerCase().includes(q)),
    )
  }, [bookings, query, vertical, locality, match, refund, rates])

  return (
    <section id="sec-bookings" className="sec space-y-4">
      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <TableToolbar
          title="Bookings"
          subtitle="One row per booking · expand a row for its claim lines"
          query={query}
          onQueryChange={onQueryChange}
          placeholder="Search booking id"
          filters={[
            { label: 'Vertical', value: vertical, onChange: setVertical, options: VERTICAL_OPTIONS },
            { label: 'Locality', value: locality, onChange: setLocality, options: LOCALITY_OPTIONS },
            { label: 'Match state', value: match, onChange: setMatch, options: MATCH_OPTIONS },
            { label: 'Refund', value: refund, onChange: setRefund, options: REFUND_OPTIONS },
          ]}
        />
        <BookingsTable rows={rows} linesByBooking={linesByBooking} />
        <div className="px-5 py-3 border-t border-line/70 text-[11px] text-mut">
          Showing {rows.length} of {bookings.length} bookings · totals are in the Overview
        </div>
      </div>

      {flaggedRows.length > 0 && (
        <details className="group rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
          <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
            <div>
              <h3 className="font-display font-600 text-[15px]">Flagged portal rows</h3>
              <p className="text-[11px] text-mut">
                {flaggedRows.length} export row{flaggedRows.length > 1 ? 's' : ''} that raised
                something — not the whole export
              </p>
            </div>
            <span className="text-[12px] text-emerald-soft group-open:hidden">Show</span>
            <span className="text-[12px] text-emerald-soft hidden group-open:inline">Hide</span>
          </summary>
          <div className="overflow-x-auto border-t border-line/70">
            <table className="w-full text-[12.5px] min-w-[1100px]">
              <thead>
                <tr className="text-mut text-left border-b border-line/70">
                  {[
                    'Sheet · row',
                    'SG order',
                    'Booking',
                    'Vertical',
                    'Date',
                    'Status',
                    'Payment',
                    'Method',
                    'Order total',
                    'Wallet',
                    'Card',
                    'Commission',
                  ].map((h, i) => (
                    <th key={h} className={`font-normal px-4 py-3 ${i > 7 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flaggedRows.map((r, i) => (
                  <tr key={i} className="border-b border-line/40 hover:bg-panel2/60">
                    <td className="px-4 py-2.5 text-mut whitespace-nowrap">
                      {r.sheet} · {r.row}
                    </td>
                    {/* A per-export sequence, not an identity — display only. */}
                    <td className="px-4 py-2.5 font-mono text-mut">{r.sg_order_id ?? '—'}</td>
                    <td className="px-4 py-2.5 font-mono">{r.booking_id ?? '—'}</td>
                    <td className="px-4 py-2.5">{humanize(r.vertical)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(r.order_date)}</td>
                    <td className="px-4 py-2.5">{r.status}</td>
                    <td className="px-4 py-2.5">{r.payment_status}</td>
                    <td className="px-4 py-2.5">{r.payment_method ?? '—'}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(r.order_total)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(r.wallet_amount)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{amount(r.card_amount)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {amount(r.commission_charged)}
                    </td>
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

import { useMemo, useState } from 'react'
import OrdersTable from '../table/OrdersTable'
import TableToolbar from '../table/TableToolbar'

const MATCH_OPTIONS = [
  ['all', 'All match states'],
  ['matched', 'Matched'],
  ['unmatched', 'Unmatched'],
  ['prior_period', 'Prior period'],
  ['later_period', 'Later period'],
  ['ambiguous', 'Ambiguous'],
]

const VARIANCE_OPTIONS = [
  ['all', 'All variance classes'],
  ['clean', 'Clean'],
  ['overcharge', 'Overcharge'],
  ['wrong_rate', 'Wrong rate'],
  ['promo_absorbed', 'Promo absorbed'],
]

const STATUS_OPTIONS = [
  ['all', 'All statuses'],
  ['Delivered', 'Delivered'],
  ['Ready to Pickup', 'Ready to Pickup'],
  ['Return', 'Return'],
  ['RTO', 'RTO'],
]

const FLAG_OPTIONS = [
  ['all', 'All flags'],
  ['CLAWBACK', 'Clawback'],
  ['RETURN_ADJUSTED', 'Return adjusted'],
  ['RTO_EXCLUDED', 'RTO excluded'],
  ['PENDING_DELIVERY', 'Pending delivery'],
]

/* The Orders table. No summed footer: row figures are rounded per order, so a footer
   total would disagree with the summary by a cent or two (guide §6.3). */
export default function LineItemsSection({ orders, exceptions, rates, query, onQueryChange }) {
  const [match, setMatch] = useState('all')
  const [variance, setVariance] = useState('all')
  const [status, setStatus] = useState('all')
  const [flag, setFlag] = useState('all')

  /* Orders the server flagged with AMOUNT_MISMATCH get their difference highlighted. */
  const mismatched = useMemo(
    () => new Set(exceptions.filter((e) => e.code === 'AMOUNT_MISMATCH').map((e) => e.order_no)),
    [exceptions],
  )

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter(
      (o) =>
        (match === 'all' || o.match_state === match) &&
        (variance === 'all' || o.variance_class === variance) &&
        (status === 'all' || o.statuses.includes(status)) &&
        (flag === 'all' || o.flags.includes(flag)) &&
        (!q || o.order_no.toLowerCase().includes(q)),
    )
  }, [orders, query, match, variance, status, flag])

  return (
    <section id="sec-items" className="sec">
      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <TableToolbar
          title="Orders"
          subtitle="One row per order · excluded (RTO) orders are shown and labelled"
          query={query}
          onQueryChange={onQueryChange}
          placeholder="Search order no"
          filters={[
            { label: 'Status', value: status, onChange: setStatus, options: STATUS_OPTIONS },
            { label: 'Variance class', value: variance, onChange: setVariance, options: VARIANCE_OPTIONS },
            { label: 'Match state', value: match, onChange: setMatch, options: MATCH_OPTIONS },
            { label: 'Flag', value: flag, onChange: setFlag, options: FLAG_OPTIONS },
          ]}
        />
        <OrdersTable rows={rows} orderTolerance={rates.order_tolerance} mismatched={mismatched} />
        <div className="px-5 py-3 border-t border-line/70 text-[11px] text-mut">
          Showing {rows.length} of {orders.length} orders · totals are in the Overview and
          Settlement bridge
        </div>
      </div>
    </section>
  )
}

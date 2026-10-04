import { useEffect, useMemo, useState } from 'react'
import FoodOrdersTable from '../table/FoodOrdersTable'
import TableToolbar from '../table/TableToolbar'

const VERDICT_OPTIONS = [
  ['all', 'All verdicts'],
  ['settled', 'Settled'],
  ['held', 'Held'],
  ['portal_only', 'Portal only'],
  ['vendor_only', 'Vendor only'],
]

/* One row per paired order. Headline totals stay in Overview — row dues are not summed.
   `reviewNonce` bumps when an exception link sets the query, so that jump clears a
   verdict filter without also clearing it on every keystroke. */
export default function FoodOrdersSection({ orders, query, onQueryChange, reviewNonce = 0 }) {
  const [verdict, setVerdict] = useState('all')

  useEffect(() => {
    if (reviewNonce) setVerdict('all')
  }, [reviewNonce])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return orders.filter((order) => {
      if (verdict !== 'all' && order.verdict !== verdict) return false
      if (!q) return true
      const place = (order.portal?.restaurant_name || order.vendor?.brand_name || '').toLowerCase()
      const vendorNo = (order.vendor?.order_no || '').toLowerCase()
      return order.order_id.toLowerCase().includes(q) || place.includes(q) || vendorNo.includes(q)
    })
  }, [orders, query, verdict])

  return (
    <section id="sec-orders" className="sec">
      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <TableToolbar
          title="Orders"
          subtitle="Paired on Partner Order ID · dates are shown, not compared"
          query={query}
          onQueryChange={onQueryChange}
          placeholder="Search order or restaurant"
          filters={[
            { label: 'Verdict', value: verdict, onChange: setVerdict, options: VERDICT_OPTIONS },
          ]}
        />
        <FoodOrdersTable rows={rows} />
        <div className="px-5 py-3 border-t border-line/70 text-[11px] text-mut">
          Showing {rows.length} of {orders.length} orders · settled due is in Overview
        </div>
      </div>
    </section>
  )
}

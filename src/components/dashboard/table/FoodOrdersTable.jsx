import { Fragment, useState } from 'react'
import { amount, humanize, isoDate, ratePct, signedAmount } from '../../../utils/format'
import { sign } from '../../../utils/money'
import StatusBadge from './StatusBadge'

const HEADERS = [
  ['', ''],
  ['Order', ''],
  ['Restaurant', ''],
  ['Portal date', ''],
  ['Vendor date', ''],
  ['Verdict', ''],
  ['Portal food', ' text-right'],
  ['Vendor food', ' text-right'],
  ['Gap', ' text-right'],
  ['Due', ' text-right'],
  ['Compensation', ' text-right'],
  ['Flags', ''],
]

function Field({ label, value, mono = false }) {
  return (
    <div>
      <dt className="text-mut">{label}</dt>
      <dd className={`mt-0.5 ${mono ? 'font-mono' : ''}`} dir="auto">
        {value ?? ''}
      </dd>
    </div>
  )
}

function moneyOrBlank(value) {
  if (value == null || sign(value) === 0) return ''
  return amount(value)
}

function OrderDetail({ order }) {
  const { portal, vendor, checks } = order
  return (
    <tr className="border-b border-line/40 bg-panel2/40">
      <td colSpan={HEADERS.length} className="px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-[12px]">
          <div>
            <p className="text-[11px] text-mut mb-2">Portal</p>
            {portal ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Field label="Restaurant" value={portal.restaurant_name} />
                <Field label="Status" value={portal.order_status} />
                <Field label="Payment" value={portal.payment_method} />
                <Field label="Food total" value={amount(portal.total_amount)} mono />
                <Field label="Subtotal" value={amount(portal.sub_total)} mono />
                <Field label="Discount" value={amount(portal.discount)} mono />
                <Field label="Customer delivery" value={amount(portal.sg_delivery)} mono />
                <Field label="Rate" value={portal.stated_rate == null ? '' : ratePct(portal.stated_rate)} mono />
                <Field label="Commission" value={amount(portal.commission_amount)} mono />
                <Field label="Compensation" value={amount(portal.compensation_amount)} mono />
                <Field label="Net payable" value={amount(portal.net_payable)} mono />
                <Field label="Promocode" value={portal.promocode} />
              </dl>
            ) : (
              <p className="text-mut">No portal row.</p>
            )}
          </div>

          <div>
            <p className="text-[11px] text-mut mb-2">Vendor</p>
            {vendor ? (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                <Field label="Brand" value={vendor.brand_name} />
                <Field label="Status" value={vendor.order_status} />
                <Field label="Vendor order" value={vendor.order_no} mono />
                <Field label="Food total" value={amount(vendor.total)} mono />
                <Field label="Chef total" value={amount(vendor.order_chef_total)} mono />
                <Field
                  label="Rate"
                  value={
                    vendor.shoppinggate_percentage == null
                      ? ''
                      : ratePct(vendor.shoppinggate_percentage)
                  }
                  mono
                />
                <Field label="Fees" value={amount(vendor.shoppinggate_fees)} mono />
                <Field label="Promotion" value={amount(vendor.promotion_discount)} mono />
                <Field label="Delivery fee" value={amount(vendor.delivery_fee)} mono />
                <Field label="SG delivery charge" value={amount(vendor.sg_delivery_charge)} mono />
                <Field label="Chef delivery charge" value={amount(vendor.chef_delivery_charge)} mono />
              </dl>
            ) : (
              <p className="text-mut">No vendor row.</p>
            )}
          </div>
        </div>

        {vendor?.order_items && (
          <p className="mt-4 text-[12px] text-mut" dir="auto">
            <span className="text-txt">Items. </span>
            {vendor.order_items}
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 text-[12px]">
          <Field label="IDs match" value={checks.ids_match ? 'Yes' : 'No'} />
          <Field
            label="Food difference"
            value={checks.order_amount_difference == null ? '' : signedAmount(checks.order_amount_difference)}
            mono
          />
          <Field
            label="Fee difference"
            value={checks.fee_difference == null ? '' : signedAmount(checks.fee_difference)}
            mono
          />
          <Field
            label="SG delivery share"
            value={checks.sg_delivery_share == null ? '' : amount(checks.sg_delivery_share)}
            mono
          />
          <Field
            label="Chef delivery share"
            value={checks.chef_delivery_share == null ? '' : amount(checks.chef_delivery_share)}
            mono
          />
          <Field
            label="Customer delivery"
            value={checks.customer_delivery == null ? '' : amount(checks.customer_delivery)}
            mono
          />
        </dl>
      </td>
    </tr>
  )
}

export default function FoodOrdersTable({ rows }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[12.5px] min-w-[1180px]">
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
          {rows.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length} className="px-5 py-8 text-center text-[13px] text-mut">
                No orders match these filters.
              </td>
            </tr>
          ) : (
            rows.map((order) => {
              const open = expanded === order.order_id
              const place = order.portal?.restaurant_name || order.vendor?.brand_name
              const gap = order.checks?.order_amount_difference
              return (
                <Fragment key={order.order_id}>
                  <tr className="border-b border-line/40 hover:bg-panel2/60 transition-colors">
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-label={open ? 'Hide order detail' : 'Show order detail'}
                        onClick={() => setExpanded(open ? null : order.order_id)}
                        className="h-6 w-6 rounded border border-line2 text-mut hover:text-emerald-soft hover:border-emerald/40"
                      >
                        {open ? '−' : '+'}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 font-mono whitespace-nowrap">{order.order_id}</td>
                    <td className="px-4 py-2.5 max-w-[220px]">
                      <span dir="auto" className="block truncate" title={place ?? ''}>
                        {place ?? ''}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {order.portal?.order_date ? isoDate(order.portal.order_date) : ''}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {order.vendor?.requested_delivery_date
                        ? isoDate(order.vendor.requested_delivery_date)
                        : ''}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={order.verdict} label={humanize(order.verdict)} />
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {order.portal ? amount(order.portal.total_amount) : ''}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {order.vendor ? amount(order.vendor.total) : ''}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-mono ${
                        gap != null && sign(gap) !== 0 ? 'text-bad' : 'text-mut'
                      }`}
                    >
                      {gap == null ? '' : signedAmount(gap)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {order.due == null ? '' : amount(order.due)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">
                      {moneyOrBlank(order.portal?.compensation_amount)}
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-mut whitespace-nowrap">
                      {order.flags.length ? order.flags.map(humanize).join(', ') : ''}
                    </td>
                  </tr>
                  {open && <OrderDetail order={order} />}
                </Fragment>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

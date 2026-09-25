import { amount } from '../../../utils/format'
import Card from '../../common/Card'

const HEADERS = ['Method', 'Rows', 'Bookings', 'Order total', 'Wallet', 'Card']

function MethodTable({ title, subtitle, rows }) {
  return (
    <Card>
      <h3 className="font-display font-600 text-[15px]">{title}</h3>
      <p className="text-[11px] text-mut mb-4">{subtitle}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px] min-w-[520px]">
          <thead>
            <tr className="text-mut text-left border-b border-line/70">
              {HEADERS.map((h, i) => (
                <th key={h} className={`font-normal py-2 pr-3 ${i ? 'text-right' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Sent sorted by value, largest first — rendered in that order. */}
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line/40">
                <td className="py-2 pr-3">{r.label}</td>
                <td className="py-2 pr-3 text-right font-mono">{r.rows}</td>
                <td className="py-2 pr-3 text-right font-mono">{r.bookings}</td>
                <td className="py-2 pr-3 text-right font-mono">{amount(r.order_total)}</td>
                <td className="py-2 pr-3 text-right font-mono">{amount(r.wallet_amount)}</td>
                <td className="py-2 text-right font-mono">{amount(r.card_amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

/* The pivot the finance team already uses: the raw labels, and the same money split by
   instrument so a combined payment counts on both. */
export default function PaymentMethodsSection({ paymentMethods }) {
  return (
    <section id="sec-payment-methods" className="sec space-y-4">
      <div>
        <h2 className="font-display font-600 text-[18px] tracking-tight">Payment methods</h2>
        <p className="text-[12px] text-mut">How the orders were paid, by label and by instrument</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <MethodTable
          title="By label"
          subtitle="The export's own Payment Method text"
          rows={paymentMethods.by_label}
        />
        <MethodTable
          title="By instrument"
          subtitle="Combined labels split on + — what actually moved on each"
          rows={paymentMethods.by_instrument}
        />
      </div>
    </section>
  )
}

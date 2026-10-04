import { useMemo } from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { amount, isoDate, ratePct } from '../../../utils/format'
import { clientRecon } from '../../../utils/foodRecon'
import { sign } from '../../../utils/money'
import Card from '../../common/Card'
import ChartCard from '../../common/ChartCard'
import LegendDot from '../../common/LegendDot'
import CountDonut from '../../charts/CountDonut'
import ExceptionSeverityChart from '../../charts/ExceptionSeverityChart'
import KpiCard from '../KpiCard'

function Figures({ title, subtitle, rows }) {
  return (
    <Card>
      <h3 className="font-display font-600 text-[15px]">{title}</h3>
      <p className="text-[11px] text-mut mb-4">{subtitle}</p>
      <ul className="space-y-2.5 text-[13px]">
        {rows.map(([label, value, tone]) => (
          <li key={label} className="flex items-center justify-between gap-4">
            <span className="text-mut">{label}</span>
            <span className={`font-mono text-right ${tone ?? ''}`}>{value}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

const MEASURES = [
  ['food', 'Food Amount'],
  ['delivery', 'Delivery'],
  ['addDc', 'ADD DC'],
  ['roundOff', 'Round of differ'],
  ['com', 'COM'],
  ['total', 'Total Order Amount'],
  ['wallet', 'Wallet Amount'],
  ['card', 'Applepay/Card Amount'],
  ['collection', 'Total collection'],
  ['portalTotal', 'Portal total'],
  ['collectionGap', 'T. Order - Collection Dif'],
  ['promo', 'sg promo code disc'],
  ['remaining', 'T. Remaining'],
]

function yellow(key) {
  return key === 'total'
}

function ReconSummary({ orders }) {
  const recon = useMemo(() => clientRecon(orders), [orders])
  return (
    <Card className="overflow-x-auto">
      <h3 className="font-display font-600 text-[15px]">Recon summary</h3>
      <p className="text-[11px] text-mut mb-4">Same block as the client recon sheet</p>
      <table className="w-full min-w-[1080px] text-[12.5px] border-separate border-spacing-0">
        <tbody>
          <tr>
            <td className="py-2 pr-4 text-mut whitespace-nowrap">SG FOOD ORDER Amount</td>
            <td className="py-2 pr-6 font-mono whitespace-nowrap">{amount(recon.sgFood)}</td>
            <td colSpan={MEASURES.length} />
          </tr>
          <tr>
            <td className="py-2 pr-4 text-mut whitespace-nowrap">Vendor FOOD ORDER Amount</td>
            <td className="py-2 pr-6 font-mono whitespace-nowrap">{amount(recon.vendorFood)}</td>
            {MEASURES.map(([key, label]) => (
              <td
                key={key}
                className={`py-2 px-3 whitespace-nowrap ${
                  yellow(key) ? 'bg-[#FFFF00] text-black font-600' : 'text-mut'
                }`}
              >
                {label}
              </td>
            ))}
          </tr>
          <tr>
            <td />
            <td className="py-2 pr-6">
              <span className="inline-block bg-[#FFFF00] text-black font-mono font-600 px-2 py-0.5">
                {amount(recon.difference)}
              </span>
            </td>
            {MEASURES.map(([key]) => (
              <td key={key} className="py-2 px-3 whitespace-nowrap">
                <span
                  className={`font-mono ${
                    yellow(key) ? 'inline-block bg-[#FFFF00] text-black font-600 px-2 py-0.5' : ''
                  }`}
                >
                  {amount(recon[key])}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </Card>
  )
}

/* Headline figures come from `summary`. Compensation is reported beside the settlement
   and is not subtracted from settled due. */
export default function FoodOverviewSection({ result }) {
  const { palette } = useTheme()
  const { summary, detected, exceptions, vendor_name: vendor, orders } = result
  const breaks = summary.amount_breaks + summary.fee_breaks + summary.delivery_breaks

  return (
    <section id="sec-overview" className="sec space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Settled due"
          value={amount(summary.settled_due)}
          delta={summary.settled_orders + ' delivered orders'}
          accent
        />
        <KpiCard
          label="Held"
          value={amount(summary.held_due)}
          delta={summary.held_orders + ' order' + (summary.held_orders === 1 ? '' : 's') + ', food amount off'}
          positive={summary.held_orders === 0}
        />
        <KpiCard
          label="Vendor only"
          value={summary.vendor_only}
          delta={amount(summary.vendor_only_due) + ' on the vendor statement'}
          positive={summary.vendor_only === 0}
        />
        <KpiCard
          label="Compensation"
          value={amount(summary.compensation_total)}
          delta={summary.compensation_orders + ' orders · not subtracted'}
        />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Paired"
          value={summary.paired}
          delta="on Partner Order ID"
        />
        <KpiCard
          label="Portal only"
          value={summary.portal_only}
          delta="no vendor row"
          positive={summary.portal_only === 0}
        />
        <KpiCard
          label="Breaks"
          value={breaks}
          delta={
            summary.amount_breaks +
            ' amount · ' +
            summary.fee_breaks +
            ' fee · ' +
            summary.delivery_breaks +
            ' delivery'
          }
          positive={breaks === 0}
        />
        <KpiCard
          label="Not delivered"
          value={summary.not_delivered}
          delta="only Delivered rows can settle"
          positive={summary.not_delivered === 0}
        />
      </div>

      <ReconSummary orders={orders} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Exceptions by code"
          subtitle="Most severe first"
          legendGap="gap-4"
          legend={
            <>
              <LegendDot color="bg-bad" label="High" />
              <LegendDot color="bg-warn" label="Medium" />
              <LegendDot color="bg-mut" label="Info" />
            </>
          }
          height="h-64"
        >
          {exceptions.length ? (
            <ExceptionSeverityChart exceptions={exceptions} />
          ) : (
            <p className="h-full grid place-items-center text-[13px] text-emerald-soft">
              Clean run. No exceptions.
            </p>
          )}
        </ChartCard>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Verdicts</h3>
          <p className="text-[11px] text-mut mb-2">
            {summary.portal_rows} portal rows · {summary.vendor_rows} vendor rows
          </p>
          <CountDonut
            centre={summary.settled_orders}
            caption="settled"
            rows={[
              ['Settled', summary.settled_orders, palette.COLORS.emerald],
              ['Held', summary.held_orders, palette.COLORS.warn],
              ['Portal only', summary.portal_only, palette.COLORS.bad],
              ['Vendor only', summary.vendor_only, palette.COLORS.mut],
            ]}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Figures
          title="What settled"
          subtitle="Delivered pairs whose food amounts agree"
          rows={[
            ['Subtotal', amount(summary.settled_subtotal)],
            ['Customer delivery', amount(summary.settled_customer_delivery)],
            ['SG delivery share', amount(summary.settled_sg_delivery)],
            ['Vendor fees', amount(summary.settled_vendor_fees)],
            [
              'Food gap',
              amount(summary.settled_food_gap),
              sign(summary.settled_food_gap) === 0 ? 'text-mut' : 'text-warn',
            ],
          ]}
        />

        <Figures
          title="How this run settles"
          subtitle={vendor ? vendor : 'Food'}
          rows={[
            ['Pairing', 'Partner Order ID'],
            ['Dates', 'Not compared'],
            ['Can settle', 'Delivered only'],
            ['Compensation', 'Not subtracted'],
            [
              'Rates seen',
              summary.rates_seen.map((rate) => ratePct(rate)).join(', ') || 'None',
            ],
          ]}
        />

        <Card>
          <h3 className="font-display font-600 text-[15px]">Files read</h3>
          <p className="text-[11px] text-mut mb-4">
            {isoDate(summary.portal_date_start)} to {isoDate(summary.portal_date_end)}
          </p>
          <ul className="space-y-2.5 text-[12px]">
            {detected.map((d) => (
              <li key={d.role} className="flex items-start gap-3">
                <span className="w-16 shrink-0 font-mono text-emerald-soft">{d.role}</span>
                <span className="min-w-0 text-mut">
                  <span className="text-txt">{d.sheets.join(', ')}</span> ({d.rows} rows) from{' '}
                  <span className="break-all">{d.filename}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </section>
  )
}

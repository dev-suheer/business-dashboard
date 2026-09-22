import { amount, isoDate, ratePct } from '../../../utils/format'
import { sign } from '../../../utils/money'
import Card from '../../common/Card'
import ChartCard from '../../common/ChartCard'
import LegendDot from '../../common/LegendDot'
import ExceptionSeverityChart from '../../charts/ExceptionSeverityChart'
import MatchDonut from '../../charts/MatchDonut'
import KpiCard from '../KpiCard'

/* Headline figures come straight from `summary` — never from summing rows (guide §6.3). */
export default function OverviewSection({ result }) {
  const { summary, rates, detected, exceptions } = result
  const actionable = exceptions.filter((e) => e.severity !== 'info').length
  const informational = exceptions.length - actionable

  return (
    <section id="sec-overview" className="sec space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Net payable to vendor"
          value={amount(summary.net_payable)}
          delta={'after ' + amount(summary.adjustments) + ' adjustments'}
          accent
        />
        <KpiCard
          label="Gross sales"
          value={amount(summary.gross_sales)}
          delta={summary.orders + ' orders · ' + summary.portal_lines + ' lines'}
        />
        <KpiCard
          label="Commission earned"
          value={amount(summary.commission_earned)}
          delta={'on ' + amount(summary.payable_before_adjustments) + ' payable before adj.'}
        />
        <KpiCard
          label="Overcharged commission"
          value={amount(summary.overcharged_commission)}
          delta="owed back to the vendor"
          positive={sign(summary.overcharged_commission) === 0}
        />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Orders matched"
          value={summary.orders_matched + ' / ' + summary.orders}
          delta={summary.orders_exact + ' exact to the cent'}
        />
        <KpiCard
          label="Exceptions to review"
          value={actionable}
          delta={informational + ' informational (expected)'}
          positive={actionable === 0}
        />
        <KpiCard
          label="Promotional absorption"
          value={amount(summary.promotional_absorption)}
          delta="margin leakage — not a vendor claim"
        />
        <KpiCard
          label="Unexplained difference"
          value={amount(summary.unexplained_difference)}
          delta="vs vendor balance — see Settlement bridge"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Exceptions by code"
          subtitle="Most severe first · info codes are expected conditions"
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
              Clean cycle — no exceptions
            </p>
          )}
        </ChartCard>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Match breakdown</h3>
          <p className="text-[11px] text-mut mb-2">Orders against the vendor statement</p>
          <MatchDonut summary={summary} />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-display font-600 text-[15px]">Rates applied</h3>
          <p className="text-[11px] text-mut mb-4">
            Period {isoDate(result.period_start)} – {isoDate(result.period_end)}
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-[12px]">
            {[
              ['Standard rate', ratePct(rates.standard_rate)],
              ['Promo rate', ratePct(rates.promo_rate)],
              ['Promo cutoff', isoDate(rates.promo_cutoff)],
              ['Line tolerance', amount(rates.line_tolerance)],
              ['Order tolerance', amount(rates.order_tolerance)],
              ['Ledger entries', summary.ledger_entries],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-mut">{label}</dt>
                <dd className="font-mono text-txt mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Files read</h3>
          <p className="text-[11px] text-mut mb-4">Which sheet was used for each upload</p>
          <ul className="space-y-2.5 text-[12px]">
            {detected.map((d) => (
              <li key={d.role} className="flex items-start gap-3">
                <span className="w-20 shrink-0 font-mono text-emerald-soft">{d.role}</span>
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

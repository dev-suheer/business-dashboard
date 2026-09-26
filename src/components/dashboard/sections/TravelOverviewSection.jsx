import { useTheme } from '../../../hooks/useTheme'
import { amount, isoDate, ratePct, signedAmount } from '../../../utils/format'
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
            <span className={`font-mono ${tone ?? ''}`}>{value}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

const diffTone = (value) => (sign(value) === 0 ? 'text-mut' : 'text-warn')

/* Headline figures come from `summary`; the differences it carries are computed over
   matched, non-refunded bookings only. */
export default function TravelOverviewSection({ result }) {
  const { palette } = useTheme()
  const { summary, rates, detected, exceptions, claim_periods: claims, adjustments } = result
  const actionable = exceptions.filter((e) => e.severity !== 'info').length
  const informational = exceptions.length - actionable

  return (
    <section id="sec-overview" className="sec space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Net payable at contract rate"
          value={amount(summary.net_payable_as_vendor)}
          delta="our base × their contract rate"
          accent
        />
        <KpiCard
          label="VAT uplift shortfall"
          value={amount(summary.vat_uplift_shortfall)}
          delta="commission never charged to customers"
          positive={sign(summary.vat_uplift_shortfall) === 0}
        />
        <KpiCard
          label="Vendor overcharge"
          value={amount(summary.vendor_overcharge)}
          delta="billed above the contract rate"
          positive={sign(summary.vendor_overcharge) === 0}
        />
        <KpiCard
          label="Retained fees"
          value={amount(summary.retained_fees)}
          delta={'commission kept on refunds ' + amount(summary.commission_retained_on_refunds)}
        />
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Bookings matched"
          value={summary.bookings_matched}
          delta={`${summary.bookings_portal_only} ours only · ${summary.bookings_vendor_only} theirs only`}
        />
        <KpiCard
          label="Rows read"
          value={summary.portal_rows}
          delta={`${summary.portal_bookings} bookings · ${summary.repeat_rows} repeat rows excluded`}
        />
        <KpiCard
          label="Claim lines"
          value={summary.vendor_lines}
          delta={`${summary.vendor_bookings} bookings on the claim`}
        />
        <KpiCard
          label="Findings to review"
          value={actionable}
          delta={informational + ' informational (expected)'}
          positive={actionable === 0}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Findings by code"
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
              Clean claim — no findings
            </p>
          )}
        </ChartCard>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Booking match</h3>
          <p className="text-[11px] text-mut mb-2">Our bookings against their claim</p>
          <CountDonut
            centre={summary.bookings_matched}
            caption="matched"
            rows={[
              ['Matched', summary.bookings_matched, palette.COLORS.emerald],
              ['Ours only', summary.bookings_portal_only, palette.COLORS.warn],
              ['Theirs only', summary.bookings_vendor_only, palette.COLORS.bad],
            ]}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Figures
          title="Ours vs theirs"
          subtitle="Matched, non-refunded bookings"
          rows={[
            ['Base — ours', amount(summary.portal_base)],
            ['Base — theirs', amount(summary.vendor_base)],
            ['Difference', signedAmount(summary.base_difference), diffTone(summary.base_difference)],
            ['Commission — ours', amount(summary.portal_commission)],
            ['Commission — theirs', amount(summary.vendor_commission)],
            [
              'Difference',
              signedAmount(summary.commission_difference),
              diffTone(summary.commission_difference),
            ],
            ['Net payable — ours', amount(summary.portal_net_payable)],
            ['Net payable — theirs', amount(summary.vendor_net_payable)],
            [
              'Difference',
              signedAmount(summary.net_payable_difference),
              diffTone(summary.net_payable_difference),
            ],
          ]}
        />

        <Figures
          title="At the contract rate"
          subtitle="Both sides on our base, their rate — what settles"
          rows={[
            ['Commission as vendor', amount(summary.commission_as_vendor)],
            ['Net payable as vendor', amount(summary.net_payable_as_vendor)],
            [
              'Commission still to argue',
              signedAmount(summary.commission_difference_at_contract),
              diffTone(summary.commission_difference_at_contract),
            ],
            [
              'Net payable still to argue',
              signedAmount(summary.net_payable_difference_at_contract),
              diffTone(summary.net_payable_difference_at_contract),
            ],
            ['Vendor adjustments', signedAmount(summary.vendor_adjustments)],
          ]}
        />

        <Figures
          title="Commission by vertical"
          subtitle="With the ex-VAT column"
          rows={[
            ['Hotel', amount(summary.hotel_commission)],
            ['Hotel ex-VAT', amount(summary.hotel_commission_ex_vat)],
            ['Flight', amount(summary.flight_commission)],
            ['Flight ex-VAT', amount(summary.flight_commission_ex_vat)],
            [
              'Wallet rows checked',
              summary.wallet_rows_checked
                ? `${summary.wallet_matched} / ${summary.wallet_rows_checked} matched`
                : 'no wallet file',
            ],
          ]}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-display font-600 text-[15px]">Rates applied</h3>
          <p className="text-[11px] text-mut mb-4">
            {result.vendor_name ?? 'Vendor'} · period {isoDate(result.period_start)} –{' '}
            {isoDate(result.period_end)}
          </p>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 text-[12px]">
            {[
              ['Hotel rate', ratePct(rates.hotel_rate)],
              ['Flight rate', ratePct(rates.flight_rate)],
              ['VAT uplift', ratePct(rates.vat_rate)],
              ['Base tolerance', amount(rates.base_tolerance)],
              ['Commission tolerance', amount(rates.commission_tolerance)],
              ['Rate tolerance', ratePct(rates.rate_tolerance)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-mut">{label}</dt>
                <dd className="font-mono text-txt mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11.5px] text-mut leading-relaxed">
            On an international booking the vendor bills its rate uplifted by VAT, while we
            charge the local rate on every booking. That gap is the VAT uplift shortfall; each
            booking&apos;s own contract rate is in the Bookings table.
          </p>
        </Card>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Files read</h3>
          <p className="text-[11px] text-mut mb-4">Which sheet was used for each upload</p>
          <ul className="space-y-2.5 text-[12px]">
            {detected.map((d) => (
              <li key={d.role} className="flex items-start gap-3">
                <span className="w-24 shrink-0 font-mono text-emerald-soft">{d.role}</span>
                <span className="min-w-0 text-mut">
                  <span className="text-txt">{d.sheets.join(', ')}</span> ({d.rows} rows) from{' '}
                  <span className="break-all">{d.filename}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-display font-600 text-[15px]">Claim periods</h3>
          <p className="text-[11px] text-mut mb-4">The claim workbook&apos;s own ledger</p>
          {claims.length === 0 ? (
            <p className="text-[12.5px] text-mut">The claim carries no summary tab.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] min-w-[520px]">
                <thead>
                  <tr className="text-mut text-left border-b border-line/70">
                    {['Period', 'Total claim', 'Commission', 'Payable', 'Paid', 'Difference'].map(
                      (h, i) => (
                        <th key={h} className={`font-normal py-2 ${i ? 'text-right' : ''}`}>
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {claims.map((c, i) => (
                    <tr key={i} className="border-b border-line/40">
                      <td className="py-2 pr-3">{c.claim_period}</td>
                      <td className="py-2 text-right font-mono">{amount(c.total_claim)}</td>
                      <td className="py-2 text-right font-mono">{amount(c.commission_amount)}</td>
                      <td className="py-2 text-right font-mono">{amount(c.total_payable)}</td>
                      <td className="py-2 text-right font-mono">{amount(c.paid_amount)}</td>
                      <td className="py-2 text-right font-mono text-mut">{amount(c.difference)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Vendor adjustments</h3>
          <p className="text-[11px] text-mut mb-4">Free-text corrections written into the claim</p>
          {adjustments.length === 0 ? (
            <p className="text-[12.5px] text-mut">No adjustments on this claim.</p>
          ) : (
            <ul className="space-y-3 text-[12.5px]">
              {adjustments.map((a, i) => (
                <li key={i} className="flex items-start justify-between gap-4">
                  <span className="min-w-0">
                    <span className="block">{a.text}</span>
                    <span className="text-[11px] text-mut">
                      {a.booking_id ? (
                        <span className="font-mono">{a.booking_id}</span>
                      ) : (
                        'could not be linked to a booking'
                      )}
                    </span>
                  </span>
                  <span className="font-mono shrink-0">{signedAmount(a.commission)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  )
}

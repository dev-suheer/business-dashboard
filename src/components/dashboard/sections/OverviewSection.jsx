import { useMemo } from 'react'
import { dataset, rand, totals } from '../../../data/generateDataset'
import { money } from '../../../utils/format'
import Card from '../../common/Card'
import ChartCard from '../../common/ChartCard'
import LegendDot from '../../common/LegendDot'
import MatchDonut from '../../charts/MatchDonut'
import TrendChart from '../../charts/TrendChart'
import VendorBarChart from '../../charts/VendorBarChart'
import KpiCard from '../KpiCard'

export default function OverviewSection() {
  /* Re-rolled per run, matching the reference's renderKpis. */
  const ledgerDelta = useMemo(() => '+' + rand(3, 9) + '% vs last run', [])

  return (
    <section id="sec-overview" className="sec space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Records processed"
          value={dataset.items.length}
          delta="all sources parsed"
          positive
        />
        <KpiCard label="Ledger reconciled" value={money(totals.ledger)} delta={ledgerDelta} positive />
        <KpiCard
          label="Match rate"
          value={totals.matchRate.toFixed(1) + '%'}
          delta={totals.matched + ' clean matches'}
          positive
        />
        <KpiCard
          label="Open variance"
          value={money(totals.absVar)}
          delta={totals.variance + totals.unmatched + ' items to review'}
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ChartCard
          className="xl:col-span-2"
          title="Ledger vs vendor by month"
          subtitle="Posted amount, last 8 periods"
          legendGap="gap-4"
          legend={
            <>
              <LegendDot color="bg-emerald" label="Ledger" />
              <LegendDot color="bg-warn" label="Vendor" />
            </>
          }
          height="h-64"
        >
          <TrendChart />
        </ChartCard>

        <Card>
          <h3 className="font-display font-600 text-[15px]">Match breakdown</h3>
          <p className="text-[11px] text-mut mb-2">Share of line items</p>
          <MatchDonut />
        </Card>
      </div>

      <ChartCard
        title="Top vendors by spend"
        subtitle="Reconciled ledger value"
        height="h-56"
      >
        <VendorBarChart />
      </ChartCard>
    </section>
  )
}

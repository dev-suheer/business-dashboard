import ChartCard from '../../common/ChartCard'
import LegendDot from '../../common/LegendDot'
import StatusStackChart from '../../charts/StatusStackChart'
import VarianceScatter from '../../charts/VarianceScatter'
import VendorRadar from '../../charts/VendorRadar'
import VolumeComboChart from '../../charts/VolumeComboChart'

export default function TrendsSection() {
  return (
    <section id="sec-trends" className="sec space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display font-600 text-[18px] tracking-tight">Trends &amp; analysis</h2>
          <p className="text-[12px] text-mut">Volume, distribution and vendor quality</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          title="Volume vs match rate"
          subtitle="Invoices processed against clean-match rate"
          legendGap="gap-4"
          legend={
            <>
              <LegendDot color="bg-emerald" label="Invoices" />
              <LegendDot color="bg-warn" label="Match %" />
            </>
          }
          height="h-60"
        >
          <VolumeComboChart />
        </ChartCard>

        <ChartCard
          title="Status by month"
          subtitle="Line items grouped by outcome"
          legend={
            <>
              <LegendDot color="bg-emerald" label="Matched" />
              <LegendDot color="bg-warn" label="Variance" />
              <LegendDot color="bg-bad" label="Unmatched" />
            </>
          }
          height="h-60"
        >
          <StatusStackChart />
        </ChartCard>

        <ChartCard
          title="Variance distribution"
          subtitle="Variance against invoice size"
          legend={
            <>
              <LegendDot color="bg-emerald" label="Matched" round />
              <LegendDot color="bg-warn" label="Variance" round />
              <LegendDot color="bg-bad" label="Unmatched" round />
            </>
          }
          height="h-60"
        >
          <VarianceScatter />
        </ChartCard>

        <ChartCard
          title="Vendor scorecard"
          subtitle="Top vendor vs portfolio average"
          legend={
            <>
              <LegendDot color="bg-emerald" label="Northwind" />
              <LegendDot color="bg-warn" label="Portfolio" />
            </>
          }
          height="h-60"
        >
          <VendorRadar />
        </ChartCard>
      </div>
    </section>
  )
}

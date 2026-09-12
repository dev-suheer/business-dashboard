import Card from '../../common/Card'
import ChartCard from '../../common/ChartCard'
import LegendDot from '../../common/LegendDot'
import AgeingBarChart from '../../charts/AgeingBarChart'
import CashAreaChart from '../../charts/CashAreaChart'
import PaymentPolar from '../../charts/PaymentPolar'

export default function PaymentsSection() {
  return (
    <section id="sec-payments" className="sec space-y-4">
      <div>
        <h2 className="font-display font-600 text-[18px] tracking-tight">Payments</h2>
        <p className="text-[12px] text-mut">Ageing, status mix and cleared cash</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ChartCard
          title="Outstanding by ageing"
          subtitle="Amount due per bucket"
          height="h-56"
        >
          <AgeingBarChart />
        </ChartCard>

        <Card>
          <h3 className="font-display font-600 text-[15px] mb-1">Payment status mix</h3>
          <p className="text-[11px] text-mut mb-4">Share of invoices by state</p>
          <PaymentPolar />
        </Card>
      </div>

      <ChartCard
        title="Cleared vs outstanding cash"
        subtitle="Stacked monthly settlement"
        legendGap="gap-4"
        legend={
          <>
            <LegendDot color="bg-emerald" label="Cleared" />
            <LegendDot color="bg-warn" label="Outstanding" />
          </>
        }
        height="h-56"
      >
        <CashAreaChart />
      </ChartCard>
    </section>
  )
}

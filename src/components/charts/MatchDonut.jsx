import { Doughnut } from 'react-chartjs-2'
import { BASE_OPTIONS } from './chartSetup'

const options = { ...BASE_OPTIONS, cutout: '72%' }

const COLORS = ['#10B981', '#F5A524', '#F26D6D']

/* Orders against the vendor statement: exact to the cent, matched within tolerance, and
   not on the statement at all. Counts are the summary's integers. */
export default function MatchDonut({ summary }) {
  const exact = summary.orders_exact
  const withinTolerance = summary.orders_matched - summary.orders_exact
  const unmatched = summary.orders - summary.orders_matched
  const rows = [
    ['Exact match', exact],
    ['Within tolerance', withinTolerance],
    ['Not on statement', unmatched],
  ]
  const pct = summary.orders ? Math.round((summary.orders_matched / summary.orders) * 100) : 0

  const data = {
    labels: rows.map((r) => r[0]),
    datasets: [
      {
        data: rows.map((r) => r[1]),
        backgroundColor: COLORS,
        borderColor: '#0A0F0D',
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  return (
    <>
      <div className="h-44 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <p className="font-mono font-600 text-2xl text-emerald-soft">{pct}%</p>
            <p className="text-[10px] text-mut">matched</p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px]">
        {rows.map(([label, count], i) => (
          <div key={label} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-mut">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[i] }} />
              {label}
            </span>
            <span className="font-mono text-txt">{count}</span>
          </div>
        ))}
      </div>
    </>
  )
}

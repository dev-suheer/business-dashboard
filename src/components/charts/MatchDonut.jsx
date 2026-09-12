import { Doughnut } from 'react-chartjs-2'
import { totals } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

const options = { ...BASE_OPTIONS, cutout: '72%' }

const LEGEND = [
  ['Matched', '#10B981', 'matched'],
  ['Variance', '#F5A524', 'variance'],
  ['Unmatched', '#F26D6D', 'unmatched'],
]

export default function MatchDonut() {
  const data = {
    labels: ['Matched', 'Variance', 'Unmatched'],
    datasets: [
      {
        data: [totals.matched, totals.variance, totals.unmatched],
        backgroundColor: ['#10B981', '#F5A524', '#F26D6D'],
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
            <p className="font-mono font-600 text-2xl text-emerald-soft">
              {totals.matchRate.toFixed(0)}%
            </p>
            <p className="text-[10px] text-mut">matched</p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px]">
        {LEGEND.map(([label, color, key]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-mut">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
              {label}
            </span>
            <span className="font-mono text-txt">{totals[key]}</span>
          </div>
        ))}
      </div>
    </>
  )
}

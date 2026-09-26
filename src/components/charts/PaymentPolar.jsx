import { PolarArea } from 'react-chartjs-2'
import { PAYMENT_LABELS } from '../../constants/theme'
import { useTheme } from '../../hooks/useTheme'
import { dataset } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

export default function PaymentPolar() {
  const { palette } = useTheme()
  const { COLORS, GRID, PAYMENT_COLORS } = palette
  const total = dataset.paymentStatus.reduce((a, b) => a + b, 0)

  const options = {
    ...BASE_OPTIONS,
    scales: {
      r: {
        grid: { color: GRID },
        angleLines: { color: GRID },
        ticks: { display: false, backdropColor: 'transparent' },
      },
    },
  }

  const data = {
    labels: PAYMENT_LABELS,
    datasets: [
      {
        data: dataset.paymentStatus,
        backgroundColor: PAYMENT_COLORS.map((c) => c + 'cc'),
        borderColor: COLORS.ink,
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="h-56 grid grid-cols-2 items-center">
      <PolarArea data={data} options={options} />
      <div className="space-y-2 text-[12px]">
        {PAYMENT_LABELS.map((label, i) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-mut">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: PAYMENT_COLORS[i] }} />
              {label}
            </span>
            <span className="font-mono text-txt">
              {Math.round((dataset.paymentStatus[i] / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

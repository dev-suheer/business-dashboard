import { Line } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { MONTHS, dataset } from '../../data/generateDataset'
import { BASE_OPTIONS, dollarsK } from './chartSetup'

export default function TrendChart() {
  const { palette } = useTheme()
  const { COLORS, GRID, accentFill } = palette

  const options = {
    ...BASE_OPTIONS,
    scales: {
      x: { grid: { display: false }, border: { color: GRID } },
      y: {
        grid: { color: GRID },
        border: { display: false },
        ticks: { callback: dollarsK },
      },
    },
  }

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Ledger',
        data: dataset.ledgerByMonth,
        borderColor: COLORS.emerald,
        backgroundColor: accentFill(0.12),
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Vendor',
        data: dataset.vendorByMonth,
        borderColor: COLORS.warn,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  return <Line data={data} options={options} />
}

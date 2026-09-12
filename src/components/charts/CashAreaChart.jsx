import { Line } from 'react-chartjs-2'
import { GRID } from '../../constants/theme'
import { MONTHS, dataset } from '../../data/generateDataset'
import { BASE_OPTIONS, dollarsUnit } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  scales: {
    x: { grid: { display: false }, border: { color: GRID } },
    y: {
      stacked: true,
      grid: { color: GRID },
      border: { display: false },
      ticks: { callback: dollarsUnit },
    },
  },
}

export default function CashAreaChart() {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Cleared',
        data: dataset.cashCleared,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.22)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'Outstanding',
        data: dataset.cashOutstanding,
        borderColor: '#F5A524',
        backgroundColor: 'rgba(245,165,36,0.16)',
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  }

  return <Line data={data} options={options} />
}

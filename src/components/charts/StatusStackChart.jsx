import { Bar } from 'react-chartjs-2'
import { GRID } from '../../constants/theme'
import { MONTHS, dataset } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  scales: {
    x: { stacked: true, grid: { display: false }, border: { color: GRID } },
    y: { stacked: true, grid: { color: GRID }, border: { display: false } },
  },
}

export default function StatusStackChart() {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Matched',
        data: dataset.statusByMonth.map((s) => s.matched),
        backgroundColor: '#10B981',
        borderRadius: 3,
        stack: 's',
      },
      {
        label: 'Variance',
        data: dataset.statusByMonth.map((s) => s.variance),
        backgroundColor: '#F5A524',
        borderRadius: 3,
        stack: 's',
      },
      {
        label: 'Unmatched',
        data: dataset.statusByMonth.map((s) => s.unmatched),
        backgroundColor: '#F26D6D',
        borderRadius: 3,
        stack: 's',
      },
    ],
  }

  return <Bar data={data} options={options} />
}

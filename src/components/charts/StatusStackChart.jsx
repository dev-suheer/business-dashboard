import { Bar } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { MONTHS, dataset } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

export default function StatusStackChart() {
  const { palette } = useTheme()
  const { COLORS, GRID } = palette

  const options = {
    ...BASE_OPTIONS,
    scales: {
      x: { stacked: true, grid: { display: false }, border: { color: GRID } },
      y: { stacked: true, grid: { color: GRID }, border: { display: false } },
    },
  }

  const data = {
    labels: MONTHS,
    datasets: [
      {
        label: 'Matched',
        data: dataset.statusByMonth.map((s) => s.matched),
        backgroundColor: COLORS.emerald,
        borderRadius: 3,
        stack: 's',
      },
      {
        label: 'Variance',
        data: dataset.statusByMonth.map((s) => s.variance),
        backgroundColor: COLORS.warn,
        borderRadius: 3,
        stack: 's',
      },
      {
        label: 'Unmatched',
        data: dataset.statusByMonth.map((s) => s.unmatched),
        backgroundColor: COLORS.bad,
        borderRadius: 3,
        stack: 's',
      },
    ],
  }

  return <Bar data={data} options={options} />
}

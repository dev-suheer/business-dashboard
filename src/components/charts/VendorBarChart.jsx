import { Bar } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { topVendorsBySpend } from '../../data/generateDataset'
import { BASE_OPTIONS, dollarsK } from './chartSetup'

export default function VendorBarChart() {
  const { palette } = useTheme()
  const { COLORS, GRID } = palette

  const options = {
    ...BASE_OPTIONS,
    indexAxis: 'y',
    scales: {
      x: {
        grid: { color: GRID },
        border: { display: false },
        ticks: { callback: dollarsK },
      },
      y: { grid: { display: false }, border: { display: false } },
    },
  }

  const data = {
    labels: topVendorsBySpend.map((t) => t[0]),
    datasets: [
      {
        data: topVendorsBySpend.map((t) => t[1]),
        backgroundColor: COLORS.emerald,
        hoverBackgroundColor: COLORS.emeraldSoft,
        borderRadius: 5,
        barThickness: 16,
      },
    ],
  }

  return <Bar data={data} options={options} />
}

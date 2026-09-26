import { Radar } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { dataset } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

export default function VendorRadar() {
  const { palette } = useTheme()
  const { COLORS, GRID, accentFill } = palette

  const options = {
    ...BASE_OPTIONS,
    scales: {
      r: {
        min: 0,
        max: 100,
        grid: { color: GRID },
        angleLines: { color: GRID },
        pointLabels: { color: COLORS.mut, font: { size: 10 } },
        ticks: { display: false, stepSize: 20, backdropColor: 'transparent' },
      },
    },
  }

  const data = {
    labels: dataset.radarLabels,
    datasets: [
      {
        label: 'Northwind Supply',
        data: dataset.radarTop,
        borderColor: COLORS.emerald,
        backgroundColor: accentFill(0.18),
        borderWidth: 2,
        pointBackgroundColor: COLORS.emerald,
        pointRadius: 3,
      },
      {
        label: 'Portfolio avg',
        data: dataset.radarAvg,
        borderColor: COLORS.warn,
        backgroundColor: 'rgba(245,165,36,0.10)',
        borderWidth: 2,
        pointBackgroundColor: COLORS.warn,
        pointRadius: 3,
      },
    ],
  }

  return <Radar data={data} options={options} />
}

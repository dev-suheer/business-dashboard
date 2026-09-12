import { Radar } from 'react-chartjs-2'
import { COLORS, GRID } from '../../constants/theme'
import { dataset } from '../../data/generateDataset'
import { BASE_OPTIONS } from './chartSetup'

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

export default function VendorRadar() {
  const data = {
    labels: dataset.radarLabels,
    datasets: [
      {
        label: 'Northwind Supply',
        data: dataset.radarTop,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16,185,129,0.18)',
        borderWidth: 2,
        pointBackgroundColor: '#10B981',
        pointRadius: 3,
      },
      {
        label: 'Portfolio avg',
        data: dataset.radarAvg,
        borderColor: '#F5A524',
        backgroundColor: 'rgba(245,165,36,0.10)',
        borderWidth: 2,
        pointBackgroundColor: '#F5A524',
        pointRadius: 3,
      },
    ],
  }

  return <Radar data={data} options={options} />
}

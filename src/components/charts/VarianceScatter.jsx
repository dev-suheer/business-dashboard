import { Scatter } from 'react-chartjs-2'
import { COLORS, GRID } from '../../constants/theme'
import { dataset } from '../../data/generateDataset'
import { BASE_OPTIONS, dollarsK } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  scales: {
    x: {
      grid: { color: GRID },
      border: { color: GRID },
      ticks: { callback: dollarsK },
      title: { display: true, text: 'Invoice size', color: COLORS.mut, font: { size: 10 } },
    },
    y: {
      grid: { color: GRID },
      border: { display: false },
      ticks: { callback: dollarsK },
      title: { display: true, text: 'Variance', color: COLORS.mut, font: { size: 10 } },
    },
  },
}

/* Unmatched rows plot at -ledger so a missing vendor line reads as a full-value shortfall. */
const pointsFor = (status) =>
  dataset.items
    .filter((r) => r.status === status)
    .map((r) => ({ x: r.ledger, y: r.status === 'Unmatched' ? -r.ledger : r.variance }))

export default function VarianceScatter() {
  const data = {
    datasets: [
      {
        label: 'Matched',
        data: pointsFor('Matched'),
        backgroundColor: 'rgba(16,185,129,0.65)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Variance',
        data: pointsFor('Variance'),
        backgroundColor: 'rgba(245,165,36,0.85)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Unmatched',
        data: pointsFor('Unmatched'),
        backgroundColor: 'rgba(242,109,109,0.85)',
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  }

  return <Scatter data={data} options={options} />
}

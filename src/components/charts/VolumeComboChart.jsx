import { Chart } from 'react-chartjs-2'
import { GRID } from '../../constants/theme'
import { MONTHS, dataset } from '../../data/generateDataset'
import { BASE_OPTIONS, percent } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  scales: {
    x: { grid: { display: false }, border: { color: GRID } },
    y: { position: 'left', grid: { color: GRID }, border: { display: false }, beginAtZero: true },
    y1: {
      position: 'right',
      grid: { display: false },
      border: { display: false },
      min: 0,
      max: 100,
      ticks: { callback: percent },
    },
  },
}

export default function VolumeComboChart() {
  const data = {
    labels: MONTHS,
    datasets: [
      {
        type: 'bar',
        label: 'Invoices',
        data: dataset.invoiceCounts,
        backgroundColor: 'rgba(16,185,129,0.55)',
        hoverBackgroundColor: '#34D399',
        borderRadius: 4,
        barThickness: 18,
        yAxisID: 'y',
        order: 2,
      },
      {
        type: 'line',
        label: 'Match rate',
        data: dataset.matchRatePct,
        borderColor: '#F5A524',
        backgroundColor: 'rgba(245,165,36,0.12)',
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        yAxisID: 'y1',
        order: 1,
      },
    ],
  }

  return <Chart type="bar" data={data} options={options} />
}

import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import { AGEING_COLORS, AGEING_LABELS, GRID } from '../../constants/theme'
import { rand } from '../../data/generateDataset'
import { BASE_OPTIONS, dollarsUnit } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  scales: {
    x: { grid: { display: false }, border: { color: GRID } },
    y: {
      grid: { color: GRID },
      border: { display: false },
      ticks: { callback: dollarsUnit },
    },
  },
}

export default function AgeingBarChart() {
  /* The reference generated these inside buildCharts, so they were re-rolled on every run.
     Mount-scoped useMemo reproduces that: a "New reconciliation" yields fresh buckets. */
  const buckets = useMemo(
    () => [rand(120, 220), rand(70, 140), rand(40, 90), rand(15, 55), rand(8, 30)],
    [],
  )

  const data = {
    labels: AGEING_LABELS,
    datasets: [
      {
        data: buckets,
        backgroundColor: AGEING_COLORS,
        borderRadius: 5,
        barThickness: 34,
      },
    ],
  }

  return <Bar data={data} options={options} />
}

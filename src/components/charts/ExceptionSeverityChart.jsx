import { Bar } from 'react-chartjs-2'
import { GRID } from '../../constants/theme'
import { BASE_OPTIONS } from './chartSetup'

const options = {
  ...BASE_OPTIONS,
  indexAxis: 'y',
  scales: {
    x: {
      grid: { color: GRID },
      border: { display: false },
      ticks: { precision: 0 },
    },
    y: { grid: { display: false }, border: { display: false } },
  },
}

const COLORS = { high: '#F26D6D', medium: '#F5A524', info: '#8A9A90' }

/* Exception count per code, coloured by severity, in the server's order (most severe
   first). Info codes are expected conditions, so they are drawn muted. */
export default function ExceptionSeverityChart({ exceptions }) {
  const byCode = new Map()
  for (const e of exceptions) {
    const entry = byCode.get(e.code) ?? { count: 0, severity: e.severity }
    entry.count += 1
    byCode.set(e.code, entry)
  }
  const codes = [...byCode.keys()]

  const data = {
    labels: codes,
    datasets: [
      {
        data: codes.map((c) => byCode.get(c).count),
        backgroundColor: codes.map((c) => COLORS[byCode.get(c).severity] ?? COLORS.info),
        borderRadius: 5,
        barThickness: 14,
      },
    ],
  }

  return <Bar data={data} options={options} />
}

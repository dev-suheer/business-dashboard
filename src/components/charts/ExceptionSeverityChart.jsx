import { Bar } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { BASE_OPTIONS } from './chartSetup'

const SEVERITY = { high: '#F26D6D', medium: '#F5A524', info: '#8A9A90' }

/* Exception count per code, coloured by severity, in the server's order (most severe
   first). Info codes are expected conditions, so they are drawn muted. */
export default function ExceptionSeverityChart({ exceptions }) {
  const { palette } = useTheme()
  const { GRID } = palette

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
        backgroundColor: codes.map((c) => SEVERITY[byCode.get(c).severity] ?? SEVERITY.info),
        borderRadius: 5,
        barThickness: 14,
      },
    ],
  }

  return <Bar data={data} options={options} />
}

import { Doughnut } from 'react-chartjs-2'
import { useTheme } from '../../hooks/useTheme'
import { BASE_OPTIONS } from './chartSetup'

const options = { ...BASE_OPTIONS, cutout: '72%' }

/* A donut over plain counts: `rows` is [label, count, colour]. `centre` is the figure
   printed in the hole, with `caption` beneath it. */
export default function CountDonut({ rows, centre, caption }) {
  const { palette } = useTheme()

  const data = {
    labels: rows.map((r) => r[0]),
    datasets: [
      {
        data: rows.map((r) => r[1]),
        backgroundColor: rows.map((r) => r[2]),
        borderColor: palette.COLORS.ink,
        borderWidth: 3,
        hoverOffset: 4,
      },
    ],
  }

  return (
    <>
      <div className="h-44 relative">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 grid place-items-center pointer-events-none">
          <div className="text-center">
            <p className="font-mono font-600 text-2xl text-emerald-soft">{centre}</p>
            <p className="text-[10px] text-mut">{caption}</p>
          </div>
        </div>
      </div>
      <div className="mt-3 space-y-1.5 text-[12px]">
        {rows.map(([label, count, color]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-mut">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: color }} />
              {label}
            </span>
            <span className="font-mono text-txt">{count}</span>
          </div>
        ))}
      </div>
    </>
  )
}

import { Chart, registerables } from 'chart.js'
import { COLORS } from '../../constants/theme'

/* The reference loaded the Chart.js UMD bundle, which auto-registers everything.
   Registering all controllers here keeps parity. */
Chart.register(...registerables)

Chart.defaults.color = COLORS.mut
Chart.defaults.font.family = 'Inter, sans-serif'
Chart.defaults.font.size = 11

/* Shared option shape — every chart in the reference disabled the built-in legend and
   drew its own chips in the card header. */
export const BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
}

export const dollarsK = (v) => '$' + v / 1000 + 'k'
export const dollarsUnit = (v) => '$' + v + 'k'
export const percent = (v) => v + '%'

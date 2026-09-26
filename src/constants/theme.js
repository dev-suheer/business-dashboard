/* Hex values duplicated from the CSS theme tokens because Chart.js draws to canvas and
   cannot read Tailwind classes. Keep in sync with src/styles/index.css. */

export const THEME_STORAGE_KEY = 'bd-theme'
export const DEFAULT_THEME = 'green'

export function hexAlpha(hex, alpha) {
  const n = hex.replace('#', '')
  const r = parseInt(n.slice(0, 2), 16)
  const g = parseInt(n.slice(2, 4), 16)
  const b = parseInt(n.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

export const THEMES = [
  {
    id: 'green',
    label: 'Green',
    swatch: '#10B981',
    ink: '#0A0F0D',
    emerald: '#10B981',
    emeraldSoft: '#34D399',
    emeraldMid: '#2DBB8A',
    mut: '#8A9A90',
    warn: '#F5A524',
    bad: '#F26D6D',
    line2: '#2C3D34',
  },
  {
    id: 'blue',
    label: 'Blue',
    swatch: '#3B82F6',
    ink: '#0A0F14',
    emerald: '#3B82F6',
    emeraldSoft: '#60A5FA',
    emeraldMid: '#5B9CF6',
    mut: '#8A96A3',
    warn: '#F5A524',
    bad: '#F26D6D',
    line2: '#2C3E4E',
  },
  {
    id: 'maroon',
    label: 'Maroon',
    swatch: '#E05C76',
    ink: '#12090C',
    emerald: '#E05C76',
    emeraldSoft: '#F07A90',
    emeraldMid: '#C94B63',
    mut: '#9A8A8E',
    warn: '#F5A524',
    bad: '#F26D6D',
    line2: '#4A3038',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    swatch: '#E8C547',
    ink: '#12100A',
    emerald: '#E8C547',
    emeraldSoft: '#F5D76E',
    emeraldMid: '#D4B03A',
    mut: '#9A9178',
    warn: '#F97316',
    bad: '#F26D6D',
    line2: '#4A4330',
  },
]

export const THEME_MAP = Object.fromEntries(THEMES.map((theme) => [theme.id, theme]))

export function getPalette(themeId) {
  const theme = THEME_MAP[themeId] ?? THEME_MAP[DEFAULT_THEME]
  return {
    COLORS: {
      ink: theme.ink,
      emerald: theme.emerald,
      emeraldSoft: theme.emeraldSoft,
      mut: theme.mut,
      warn: theme.warn,
      bad: theme.bad,
    },
    GRID: hexAlpha(theme.line2, 0.5),
    AGEING_COLORS: [theme.emerald, theme.emeraldMid, theme.warn, '#EF8B4B', theme.bad],
    PAYMENT_COLORS: [theme.emerald, theme.emeraldMid, theme.warn, theme.bad],
    accentFill: (alpha) => hexAlpha(theme.emerald, alpha),
  }
}

const fallback = getPalette(DEFAULT_THEME)

export const COLORS = fallback.COLORS
export const GRID = fallback.GRID
export const AGEING_LABELS = ['Current', '1–30d', '31–60d', '61–90d', '90d+']
export const AGEING_COLORS = fallback.AGEING_COLORS
export const PAYMENT_LABELS = ['Paid', 'Scheduled', 'Pending', 'Overdue']
export const PAYMENT_COLORS = fallback.PAYMENT_COLORS

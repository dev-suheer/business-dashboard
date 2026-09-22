import { sign } from './money'

export const money =(n) => '$' + Math.round(n).toLocaleString('en-US')

export function formatFileSize(bytes) {
  return bytes / 1024 < 1024
    ? (bytes / 1024).toFixed(0) + ' KB'
    : (bytes / 1048576).toFixed(1) + ' MB'
}

export function fileExtension(name) {
  const i = name.lastIndexOf('.')
  return i === -1 ? '' : name.slice(i).toLowerCase()
}

export function fileTypeLabel(name) {
  const ext = fileExtension(name)
  return ext ? ext.slice(1).toUpperCase() : 'FILE'
}

/* Secondary line of the filled dropzone: "93 KB · XLSX". */
export function formatFileDetail(file) {
  return formatFileSize(file.size) + ' · ' + fileTypeLabel(file.name)
}

export function formatRunDate(date) {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
}

/* Variance cell text: "—" when flat, otherwise a signed amount with the minus outside
   the currency symbol ("-$420" rather than "$-420"). */
export function formatVariance(variance) {
  if (variance === 0) return '—'
  return (variance > 0 ? '+' : '') + money(variance).replace('$-', '-$')
}

/* ---- API values ---------------------------------------------------------------------
   Money arrives as fixed 2dp decimal strings. Number() here is for display grouping only;
   any arithmetic goes through utils/money.js. */
const AMOUNT_FORMAT = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/* "13876.31" → "13,876.31"; null → "—" (a missing value is not zero). */
export function amount(value) {
  if (value === null || value === undefined) return '—'
  return AMOUNT_FORMAT.format(Number(value))
}

/* Signed variant for differences: "+15.00", "-238.85", "0.00". */
export function signedAmount(value) {
  if (value === null || value === undefined) return '—'
  const text = amount(value)
  return sign(value) > 0 ? '+' + text : text
}

/* "0.15" → "15%", "0.14996" → "14.996%". */
export function ratePct(value) {
  if (value === null || value === undefined) return '—'
  return String(Number((Number(value) * 100).toFixed(4))) + '%'
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/* "2026-07-22" → "22 Jul 2026". Split rather than `new Date(...)`, which reads a bare
   date as UTC midnight and renders the previous day west of Greenwich. */
export function isoDate(value) {
  if (!value) return '—'
  const [y, m, d] = value.split('-')
  const month = MONTH_NAMES[Number(m) - 1]
  return month ? `${d} ${month} ${y}` : value
}

/* "later_period" → "Later period". */
export function humanize(value) {
  if (!value) return '—'
  const text = value.replace(/_/g, ' ').toLowerCase()
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const money = (n) => '$' + Math.round(n).toLocaleString('en-US')

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

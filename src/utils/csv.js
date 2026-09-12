import { dataset } from '../data/generateDataset'

export function toCsv(rows) {
  return rows
    .map((r) =>
      r
        .map((c) => {
          const s = String(c ?? '')
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
        })
        .join(','),
    )
    .join('\n')
}

export function download(name, rows) {
  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export const builders = {
  master: () => [
    ['Reference', 'Vendor', 'Ledger Amount', 'Vendor Amount', 'Variance', 'Status'],
    ...dataset.items.map((r) => [r.ref, r.vendor, r.ledger, r.vend, r.variance, r.status]),
  ],
  recon: () => [
    ['Reference', 'Vendor', 'Ledger', 'Vendor', 'Variance', 'Match Type', 'Action'],
    ...dataset.items.map((r) => [
      r.ref,
      r.vendor,
      r.ledger,
      r.vend,
      r.variance,
      r.status,
      r.status === 'Matched' ? 'None' : 'Review',
    ]),
  ],
  payments: () => [
    ['Reference', 'Vendor', 'Amount Due', 'Status', 'Ageing Bucket'],
    ...dataset.items.map((r, i) => [
      r.ref,
      r.vendor,
      r.status === 'Unmatched' ? r.ledger : r.vend,
      ['Paid', 'Scheduled', 'Pending', 'Overdue'][i % 4],
      ['Current', '1-30d', '31-60d', '61-90d', '90d+'][i % 5],
    ]),
  ],
}

export const DOWNLOAD_NAMES = {
  master: 'master_data.csv',
  recon: 'vendor_reconciliation.csv',
  payments: 'payments.csv',
}

export function downloadReport(key) {
  download(DOWNLOAD_NAMES[key], builders[key]())
}

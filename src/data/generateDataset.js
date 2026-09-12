/* Mock data generator ported verbatim from the reference implementation.
   The uploaded files are never parsed — every figure on the dashboard comes from here.
   Built once at module load so a "New reconciliation" replays the same run, exactly as
   the reference did. */

export const rand = (min, max) => Math.round(min + Math.random() * (max - min))

export const VENDORS = [
  'Northwind Supply',
  'Apex Logistics',
  'Cedar & Co',
  'Vantage Media',
  'Ironline Parts',
  'Summit Freight',
  'Blue Harbor Ltd',
  'Meridian Tech',
  'Copper Ridge',
  'Halcyon Group',
]

export const MONTHS = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

function buildDataset() {
  const items = []
  for (let i = 0; i < 46; i++) {
    const vendor = VENDORS[rand(0, VENDORS.length - 1)]
    const ledger = rand(1200, 48000)
    const roll = Math.random()
    let vend, status, variance
    if (roll < 0.68) {
      vend = ledger
      status = 'Matched'
      variance = 0
    } else if (roll < 0.9) {
      const d = rand(20, 900) * (Math.random() < 0.5 ? -1 : 1)
      vend = ledger + d
      status = 'Variance'
      variance = vend - ledger
    } else {
      vend = 0
      status = 'Unmatched'
      variance = -ledger
    }
    items.push({ ref: 'INV-' + (10240 + i), vendor, ledger, vend, variance, status })
  }

  const ledgerByMonth = MONTHS.map(() => rand(180000, 340000))
  const vendorByMonth = ledgerByMonth.map((v) => v + rand(-14000, 16000))
  const invoiceCounts = MONTHS.map(() => rand(30, 66))
  const matchRatePct = MONTHS.map(() => rand(79, 96))
  const statusByMonth = invoiceCounts.map((c, i) => {
    const m = Math.round((c * matchRatePct[i]) / 100)
    const rest = c - m
    const v = Math.round(rest * 0.62)
    return { matched: m, variance: v, unmatched: rest - v }
  })
  const cashCleared = MONTHS.map(() => rand(120, 260))
  const cashOutstanding = MONTHS.map(() => rand(28, 108))
  const paymentStatus = [rand(19, 30), rand(11, 18), rand(6, 13), rand(3, 9)]
  const radarLabels = ['Match rate', 'On-time pay', 'Data quality', 'Price accuracy', 'Dispute-free']
  const radarTop = radarLabels.map(() => rand(82, 96))
  const radarAvg = radarLabels.map(() => rand(70, 85))

  return {
    items,
    ledgerByMonth,
    vendorByMonth,
    invoiceCounts,
    matchRatePct,
    statusByMonth,
    cashCleared,
    cashOutstanding,
    paymentStatus,
    radarLabels,
    radarTop,
    radarAvg,
  }
}

function buildTotals(items) {
  const t = { ledger: 0, vendor: 0, matched: 0, variance: 0, unmatched: 0, absVar: 0 }
  items.forEach((r) => {
    t.ledger += r.ledger
    t.vendor += r.vend
    t.absVar += Math.abs(r.variance)
    if (r.status === 'Matched') t.matched++
    else if (r.status === 'Variance') t.variance++
    else t.unmatched++
  })
  t.matchRate = (t.matched / items.length) * 100
  return t
}

export const dataset = buildDataset()
export const totals = buildTotals(dataset.items)

/* Derived once — the reference recomputed this inside buildCharts, but the input never
   changes so the result is identical. */
export const topVendorsBySpend = (() => {
  const spend = {}
  dataset.items.forEach((r) => {
    spend[r.vendor] = (spend[r.vendor] || 0) + r.ledger
  })
  return Object.entries(spend)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
})()

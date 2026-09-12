import { formatVariance, money } from '../../../utils/format'
import StatusBadge from './StatusBadge'

const HEADERS = [
  { label: 'Reference', align: '' },
  { label: 'Vendor', align: '' },
  { label: 'Ledger', align: ' text-right' },
  { label: 'Vendor', align: ' text-right' },
  { label: 'Variance', align: ' text-right' },
  { label: 'Status', align: '' },
]

const varianceColor = (variance) =>
  variance === 0 ? 'text-mut' : variance > 0 ? 'text-warn' : 'text-bad'

export default function LineItemsTable({ rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px] min-w-[720px]">
        <thead>
          <tr className="text-mut text-left border-b border-line/70">
            {HEADERS.map((h, i) => (
              <th key={i} className={`font-500 font-normal px-5 py-3${h.align}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.ref} className="border-b border-line/40 hover:bg-panel2/60 transition-colors">
              <td className="px-5 py-3 font-mono text-[12px] text-mut">{r.ref}</td>
              <td className="px-5 py-3">{r.vendor}</td>
              <td className="px-5 py-3 text-right font-mono">{money(r.ledger)}</td>
              <td className="px-5 py-3 text-right font-mono">
                {r.vend ? money(r.vend) : <span className="text-mut">—</span>}
              </td>
              <td className={`px-5 py-3 text-right font-mono ${varianceColor(r.variance)}`}>
                {formatVariance(r.variance)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={r.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

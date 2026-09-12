import { useMemo, useState } from 'react'
import { dataset } from '../../../data/generateDataset'
import LineItemsTable from '../table/LineItemsTable'
import TableToolbar from '../table/TableToolbar'

export default function LineItemsSection() {
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return dataset.items.filter(
      (r) =>
        (activeFilter === 'all' || r.status === activeFilter) &&
        (!q || r.vendor.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q)),
    )
  }, [query, activeFilter])

  return (
    <section id="sec-items" className="sec">
      <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <TableToolbar
          query={query}
          onQueryChange={setQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />
        <LineItemsTable rows={rows} />
        <div className="px-5 py-3 border-t border-line/70 text-[11px] text-mut">
          Showing {rows.length} of {dataset.items.length} records
        </div>
      </div>
    </section>
  )
}

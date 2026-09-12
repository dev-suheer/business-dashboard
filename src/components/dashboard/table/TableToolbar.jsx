import Icon from '../../common/Icon'

const FILTERS = ['all', 'Matched', 'Variance', 'Unmatched']

/* Responsive note: the reference laid the search field and the filter group out as one
   non-wrapping row, which overflowed the card between roughly 640px and 1280px. Adding
   `flex-wrap` lets them drop onto their own line; once there is room the layout is
   identical to the reference. */
export default function TableToolbar({ query, onQueryChange, activeFilter, onFilterChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-line/70 flex-wrap">
      <div>
        <h3 className="font-display font-600 text-[15px]">Reconciliation line items</h3>
        <p className="text-[11px] text-mut">Matched, variance and unmatched records</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative w-full sm:w-auto">
          <Icon
            name="search"
            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-mut"
          />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search vendor or ref"
            className="w-full sm:w-56 h-9 rounded-lg bg-panel2 border border-line pl-9 pr-3 text-[12.5px] placeholder:text-mut focus:outline-none focus:border-emerald/50"
          />
        </div>

        <div className="flex rounded-lg border border-line overflow-hidden text-[12px]">
          {FILTERS.map((filter, i) => (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`px-3 h-9 ${i > 0 ? 'border-l border-line ' : ''}${
                activeFilter === filter
                  ? 'bg-emerald/12 text-emerald-soft font-500'
                  : 'text-mut hover:text-txt'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

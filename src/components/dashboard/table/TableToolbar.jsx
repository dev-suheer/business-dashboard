import Icon from '../../common/Icon'

const SELECT =
  'h-9 rounded-lg bg-panel2 border border-line px-3 text-[12.5px] text-txt focus:outline-none focus:border-emerald/50'

/* Responsive note: the reference laid the search field and the filter group out as one
   non-wrapping row, which overflowed the card between roughly 640px and 1280px. Adding
   `flex-wrap` lets them drop onto their own line; once there is room the layout is
   identical to the reference.

   `filters` is a list of { value, onChange, options: [[value, label], ...] } selects. */
export default function TableToolbar({
  title,
  subtitle,
  query,
  onQueryChange,
  placeholder = 'Search',
  filters = [],
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-line/70 flex-wrap">
      <div>
        <h3 className="font-display font-600 text-[15px]">{title}</h3>
        <p className="text-[11px] text-mut">{subtitle}</p>
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
            placeholder={placeholder}
            className="w-full sm:w-56 h-9 rounded-lg bg-panel2 border border-line pl-9 pr-3 text-[12.5px] placeholder:text-mut focus:outline-none focus:border-emerald/50"
          />
        </div>

        {filters.map((f) => (
          <select
            key={f.label}
            aria-label={f.label}
            value={f.value}
            onChange={(e) => f.onChange(e.target.value)}
            className={SELECT}
          >
            {f.options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        ))}
      </div>
    </div>
  )
}

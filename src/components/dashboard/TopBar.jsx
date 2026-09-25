import Icon from '../common/Icon'

/* Presentational: each dashboard owns its own meta line and download call, because the
   xlsx report is a different endpoint per category. */
export default function TopBar({ title, meta, downloading, error, onDownload, onOpenNav }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 md:px-8 h-16 bg-ink/85 backdrop-blur border-b border-line/70">
      <div className="flex items-center gap-3 min-w-0">
        {/* Drawer trigger — replaces the navigation the reference dropped below lg. */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNav}
          className="lg:hidden h-9 w-9 shrink-0 rounded-lg border border-line2 bg-panel grid place-items-center text-mut hover:text-emerald-soft hover:border-emerald/50 transition-colors"
        >
          <Icon name="menu" className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="font-display font-600 text-[16px] tracking-tight truncate">{title}</h1>
          <p className="text-[11px] text-mut truncate">{meta}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {error && (
          <p className="hidden md:block max-w-xs truncate text-[11.5px] text-bad" title={error}>
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={onDownload}
          disabled={downloading}
          title={error ?? 'Re-runs the reconciliation and returns the Excel report'}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald px-3 h-9 text-[12.5px] font-600 text-ink enabled:hover:bg-emerald-soft transition-colors disabled:opacity-60 disabled:cursor-wait"
        >
          {downloading ? (
            <span className="h-4 w-4 rounded-full border-2 border-ink/30 border-t-ink spin" />
          ) : (
            <Icon name="download" className="h-4 w-4" />
          )}
          <span className="hidden md:inline">
            {downloading ? 'Preparing report…' : 'Download report (.xlsx)'}
          </span>
        </button>
      </div>
    </header>
  )
}

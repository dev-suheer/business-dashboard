import { downloadReport } from '../../utils/csv'
import Icon from '../common/Icon'

const DOWNLOADS = [
  { key: 'master', label: 'Master data', primary: false },
  { key: 'recon', label: 'Reconciliation', primary: false },
  { key: 'payments', label: 'Payments', primary: true },
]

export default function TopBar({ runMeta, onOpenNav }) {
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
          <h1 className="font-display font-600 text-[16px] tracking-tight truncate">
            Reconciliation summary
          </h1>
          <p className="text-[11px] text-mut truncate">{runMeta}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {DOWNLOADS.map(({ key, label, primary }) => (
          <button
            key={key}
            type="button"
            onClick={() => downloadReport(key)}
            className={
              primary
                ? 'inline-flex items-center gap-2 rounded-lg bg-emerald px-3 h-9 text-[12.5px] font-600 text-ink hover:bg-emerald-soft transition-colors'
                : 'inline-flex items-center gap-2 rounded-lg border border-line2 bg-panel px-3 h-9 text-[12.5px] font-500 hover:border-emerald/50 hover:text-emerald-soft transition-colors'
            }
          >
            <Icon name="download" className="h-4 w-4" />
            <span className="hidden md:inline">{label}</span>
          </button>
        ))}
      </div>
    </header>
  )
}

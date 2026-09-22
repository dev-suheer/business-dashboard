import { useState } from 'react'
import { downloadReport, SessionExpiredError } from '../../api/client'
import { isoDate } from '../../utils/format'
import Icon from '../common/Icon'

function runMeta(result) {
  const parts = [result.category]
  if (result.merchant_id) parts.push('merchant ' + result.merchant_id)
  parts.push(isoDate(result.period_start) + ' – ' + isoDate(result.period_end))
  parts.push(result.summary.orders + ' orders')
  return parts.join(' · ')
}

/* The xlsx report is a multipart POST, so it is fetched as a blob rather than linked.
   It re-uploads and re-processes the same files, so it takes as long as the run did. */
export default function TopBar({ result, files, onOpenNav }) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const download = async () => {
    if (downloading) return
    setDownloading(true)
    setError(null)
    try {
      /* Same pattern the server uses: reconciliation-<category>-<start>-to-<end>.xlsx */
      const name = `reconciliation-${result.category}-${result.period_start}-to-${result.period_end}.xlsx`
      await downloadReport(files, undefined, name)
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }

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
          <p className="text-[11px] text-mut truncate">{runMeta(result)}</p>
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
          onClick={download}
          disabled={downloading}
          title={error ?? undefined}
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

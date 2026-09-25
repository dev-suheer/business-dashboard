import { useCallback, useState } from 'react'
import { downloadReport, SessionExpiredError } from '../api/client'

/* The xlsx report is a second multipart POST that re-runs the whole reconciliation, so
   it needs its own loading state. The server's filename is only readable when it exposes
   Content-Disposition, so a matching fallback name is passed in. */
export function useReportDownload(files, category, fallbackName) {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)

  const download = useCallback(async () => {
    if (downloading) return
    setDownloading(true)
    setError(null)
    try {
      await downloadReport(files, { category, fallbackName })
    } catch (err) {
      if (!(err instanceof SessionExpiredError)) setError(err.message || 'Download failed')
    } finally {
      setDownloading(false)
    }
  }, [downloading, files, category, fallbackName])

  return { downloading, error, download }
}

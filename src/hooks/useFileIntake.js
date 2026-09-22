import { useCallback, useState } from 'react'

/* One slot per required API field. The same File may sit in more than one slot — portal and promo are usually two tabs
   of one workbook, and the server picks the right tab for each field. */
const EMPTY = { portal: null, vendor: null, promo: null }
const REQUIRED = ['portal', 'vendor', 'promo']

export function useFileIntake() {
  const [files, setFiles] = useState(EMPTY)

  const selectFile = useCallback((key, file) => {
    if (!file) return
    setFiles((prev) => ({ ...prev, [key]: file }))
  }, [])

  const clearFile = useCallback((key) => {
    setFiles((prev) => ({ ...prev, [key]: null }))
  }, [])

  const reset = useCallback(() => setFiles(EMPTY), [])

  const missing = REQUIRED.filter((key) => !files[key]).length
  const ready = missing === 0
  const hint = ready
    ? 'Ready to run — all three files selected.'
    : missing === REQUIRED.length
      ? 'Portal export, vendor statement and discount sheet are required.'
      : `${missing} more required file${missing > 1 ? 's' : ''} to go.`

  return { files, ready, hint, selectFile, clearFile, reset }
}

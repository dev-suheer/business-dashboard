import { useCallback, useState } from 'react'

const HINTS = {
  ready: 'Ready to run — 92 rows detected across both files.',
  partial: 'One more file to go.',
  empty: 'Both files are required to begin.',
}

export function useFileIntake() {
  const [files, setFiles] = useState({ raw: null, vendor: null })

  const selectFile = useCallback((key, file) => {
    if (!file) return
    setFiles((prev) => ({ ...prev, [key]: file }))
  }, [])

  const clearFile = useCallback((key) => {
    setFiles((prev) => ({ ...prev, [key]: null }))
  }, [])

  const reset = useCallback(() => setFiles({ raw: null, vendor: null }), [])

  const ready = Boolean(files.raw && files.vendor)
  const hint = ready ? HINTS.ready : files.raw || files.vendor ? HINTS.partial : HINTS.empty

  return { files, ready, hint, selectFile, clearFile, reset }
}

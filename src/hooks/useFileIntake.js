import { useCallback, useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_KEYS } from '../constants/categories'

/* One slot per upload field of the active category. Files are held per category, so
   switching tabs does not discard what was already picked — the guide asks for the File
   objects to survive, since re-running means re-uploading. The same File may sit in more
   than one slot: portal and promo are often two tabs of one workbook. */
const emptyFiles = () =>
  Object.fromEntries(
    CATEGORY_KEYS.map((key) => [
      key,
      Object.fromEntries(CATEGORIES[key].zones.map((z) => [z.key, null])),
    ]),
  )

export function useFileIntake(category) {
  const [all, setAll] = useState(emptyFiles)
  const files = all[category]
  const zones = CATEGORIES[category].zones

  const selectFile = useCallback(
    (key, file) => {
      if (!file) return
      setAll((prev) => ({ ...prev, [category]: { ...prev[category], [key]: file } }))
    },
    [category],
  )

  const clearFile = useCallback(
    (key) => {
      setAll((prev) => ({ ...prev, [category]: { ...prev[category], [key]: null } }))
    },
    [category],
  )

  const reset = useCallback(() => setAll(emptyFiles()), [])

  const { ready, hint } = useMemo(() => {
    const missing = zones.filter((z) => z.required && !files[z.key])
    const optional = zones.filter((z) => !z.required)
    if (missing.length === 0) {
      return {
        ready: true,
        hint: optional.length
          ? `Ready to run — the ${optional[0].title.toLowerCase()} is optional.`
          : 'Ready to run — all files selected.',
      }
    }
    return {
      ready: false,
      hint:
        missing.length === zones.filter((z) => z.required).length
          ? `${missing.map((z) => z.title).join(', ')} are required.`
          : `${missing.length} more required file${missing.length > 1 ? 's' : ''} to go.`,
    }
  }, [files, zones])

  return { files, ready, hint, selectFile, clearFile, reset }
}

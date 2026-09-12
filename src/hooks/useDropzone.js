import { useMemo, useState } from 'react'

/* Hands the whole FileList to the caller rather than just the first entry, so a
   multi-file drop can be rejected instead of silently taking one at random. */
export function useDropzone(onFiles) {
  const [active, setActive] = useState(false)

  const dropHandlers = useMemo(
    () => ({
      onDragEnter: (e) => {
        e.preventDefault()
        setActive(true)
      },
      onDragOver: (e) => {
        e.preventDefault()
        setActive(true)
      },
      onDragLeave: (e) => {
        e.preventDefault()
        setActive(false)
      },
      onDrop: (e) => {
        e.preventDefault()
        setActive(false)
        onFiles(e.dataTransfer.files)
      },
    }),
    [onFiles],
  )

  return { active, dropHandlers }
}

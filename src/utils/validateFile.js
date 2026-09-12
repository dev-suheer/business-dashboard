import { ACCEPTED_EXTENSIONS, ACCEPTED_LABEL } from '../constants/uploads'
import { fileExtension } from './format'

/* Returns an error message, or null when the file is acceptable.

   This runs on every path into the zone, not just the picker: the `accept` attribute is
   ignored by drag-drop, so a PDF dragged onto the zone would otherwise sail straight
   through. */
export function validateFile(file) {
  if (!file) return 'No file detected.'
  if (!ACCEPTED_EXTENSIONS.includes(fileExtension(file.name))) {
    return `Unsupported file type — ${ACCEPTED_LABEL} only.`
  }
  if (file.size === 0) return 'That file is empty.'
  return null
}

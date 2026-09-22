/* The API accepts Excel workbooks only (.xlsx, .xlsm, .xltx) — anything else is a 415. */
export const ACCEPTED_EXTENSIONS = ['.xlsx', '.xlsm', '.xltx']

/* Filters the OS file picker. Note this is a hint only — it does not apply to drag-drop,
   so validateFile still has to check every incoming file. */
export const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(',')

export const ACCEPTED_LABEL = 'XLSX, XLSM or XLTX'

/* Server limit per file (413 above this). Checked locally so an oversized file is
   rejected instantly instead of after the upload. */
export const MAX_FILE_BYTES = 209715200

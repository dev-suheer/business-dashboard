/* Both intake zones take the same spreadsheet formats. PDF is not accepted. */
export const ACCEPTED_EXTENSIONS = ['.xlsx', '.xls', '.csv']

/* Filters the OS file picker. Note this is a hint only — it does not apply to drag-drop,
   so validateFile still has to check every incoming file. */
export const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(',')

export const ACCEPTED_LABEL = 'XLSX, XLS or CSV'

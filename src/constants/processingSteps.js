export const PROCESSING_STEPS = [
  { title: 'Parsing files', sub: 'Reading rows and normalizing columns', pct: 18 },
  { title: 'Matching references', sub: 'Aligning ledger entries to vendor lines', pct: 46 },
  { title: 'Scoring variances', sub: 'Flagging amount and date mismatches', pct: 72 },
  { title: 'Building outputs', sub: 'Compiling master, reconciliation and payments', pct: 100 },
]

/* Timings taken verbatim from the reference implementation. */
export const STEP_INTERVAL = 620
export const REVEAL_DELAY = 320

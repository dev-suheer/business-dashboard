/* The reconcile call is synchronous on the server and has no progress endpoint, so this
   is an honest indeterminate indicator. Cancel aborts the request in the browser; it does
   not stop the server, but it frees the user. */
export default function ProcessingOverlay({ active, onCancel }) {
  if (!active) return null

  return (
    <div className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-sm grid place-items-center">
      <div className="w-full max-w-md px-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-2 border-line border-t-emerald-soft spin" />
        <h2 className="mt-7 font-display text-xl font-600">Reconciling</h2>
        <p className="text-[13px] text-mut mt-1">
          Uploading and processing your workbooks — large files can take several minutes.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-8 inline-flex items-center gap-2 rounded-lg border border-line2 bg-panel px-4 h-9 text-[12.5px] text-mut hover:text-txt hover:border-emerald/40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

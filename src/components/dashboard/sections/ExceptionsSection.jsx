import { amount } from '../../../utils/format'

const SEVERITY = {
  high: { label: 'High', tone: 'bg-bad/12 text-bad border-bad/25' },
  medium: { label: 'Medium', tone: 'bg-warn/12 text-warn border-warn/25' },
  info: { label: 'Info', tone: 'bg-panel2 text-mut border-line2' },
}

function ExceptionRow({ exception: e, onShowOrder }) {
  /* Styled purely on severity, so an unknown code still renders sensibly. */
  const sev = SEVERITY[e.severity] ?? SEVERITY.info
  return (
    <li className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 px-5 py-3 border-b border-line/40">
      <span
        className={`inline-flex w-fit shrink-0 items-center rounded-md border px-2 py-0.5 text-[10.5px] font-mono ${sev.tone}`}
      >
        {e.code}
      </span>
      <div className="flex-1 min-w-0 text-[13px]">
        {/* detail is written for end users — shown verbatim. */}
        <p>{e.detail}</p>
        {e.order_no && (
          <button
            type="button"
            onClick={() => onShowOrder(e.order_no)}
            className="mt-0.5 font-mono text-[11.5px] text-emerald-soft hover:text-emerald"
          >
            {e.order_no}
          </button>
        )}
      </div>
      <span className="font-mono text-[13px] shrink-0">{amount(e.amount)}</span>
    </li>
  )
}

/* Rendered in the server's order (most severe first). Info exceptions are expected
   conditions and dominate by volume, so they sit collapsed behind a count. */
export default function ExceptionsSection({ exceptions, onShowOrder }) {
  const actionable = exceptions.filter((e) => e.severity !== 'info')
  const info = exceptions.filter((e) => e.severity === 'info')

  return (
    <section id="sec-exceptions" className="sec space-y-4">
      <div>
        <h2 className="font-display font-600 text-[18px] tracking-tight">Exceptions</h2>
        <p className="text-[12px] text-mut">
          {actionable.length} to review · {info.length} informational
        </p>
      </div>

      {exceptions.length === 0 ? (
        <div className="rounded-xl border border-emerald/30 bg-emerald/[0.04] p-5 text-[13px] text-emerald-soft">
          Clean cycle — no exceptions.
        </div>
      ) : (
        <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
          {actionable.length > 0 ? (
            <ul>
              {actionable.map((e, i) => (
                <ExceptionRow key={i} exception={e} onShowOrder={onShowOrder} />
              ))}
            </ul>
          ) : (
            <p className="px-5 py-4 text-[13px] text-emerald-soft border-b border-line/40">
              Nothing needs action — only informational items below.
            </p>
          )}

          {info.length > 0 && (
            <details className="group">
              <summary className="flex items-center justify-between px-5 py-3 cursor-pointer list-none text-[12.5px] text-mut hover:text-txt">
                <span>{info.length} informational (expected)</span>
                <span className="text-emerald-soft group-open:hidden">Show</span>
                <span className="text-emerald-soft hidden group-open:inline">Hide</span>
              </summary>
              <ul className="border-t border-line/40">
                {info.map((e, i) => (
                  <ExceptionRow key={i} exception={e} onShowOrder={onShowOrder} />
                ))}
              </ul>
            </details>
          )}
        </div>
      )}
    </section>
  )
}

import { amount, humanize, isoDate, signedAmount } from '../../../utils/format'
import { sign, sub, sum } from '../../../utils/money'
import Card from '../../common/Card'

function Row({ label, value, strong = false, muted = false, children }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-2.5 border-b border-line/40 text-[13px] ${
        strong ? 'bg-panel2/60 font-500' : ''
      }`}
    >
      <span className={`min-w-0 ${muted ? 'text-mut pl-4' : ''}`}>{label}{children}</span>
      <span className={`font-mono shrink-0 ${strong ? 'text-txt' : 'text-mut'}`}>{value}</span>
    </div>
  )
}

/* Walks from payable before adjustments to the vendor's closing balance. The unexplained
   difference is expected to be non-zero (guide §6.2): the vendor's balance is a running
   account total, so the out-of-window invoices and journal postings listed below are
   what bridge the gap. */
export default function BridgeSection({ result, onShowOrder }) {
  const { summary, exceptions, unmatched_ledger: ledger, orders } = result

  const adjusted = orders.filter((o) => sign(o.adjustments) !== 0)
  const prior = exceptions.filter((e) => e.code === 'PRIOR_PERIOD')
  const later = exceptions.filter((e) => e.code === 'LATER_PERIOD')
  const journals = ledger.filter((l) => l.doc_type === 'journal_entry')

  /* Effect on the vendor's balance: debits raise it, credits lower it. */
  const journalNet = sub(sum(journals.map((j) => j.debit)), sum(journals.map((j) => j.credit)))

  const components = [
    {
      label: 'Invoiced before the period opened',
      count: prior.length,
      value: sum(prior.map((e) => e.amount)),
    },
    {
      label: 'Invoiced after the period closed',
      count: later.length,
      value: sum(later.map((e) => e.amount)),
    },
    { label: 'Journal postings (net debit − credit)', count: journals.length, value: journalNet },
  ]

  return (
    <section id="sec-bridge" className="sec space-y-4">
      <div>
        <h2 className="font-display font-600 text-[18px] tracking-tight">Settlement bridge</h2>
        <p className="text-[12px] text-mut">
          From payable to the vendor&apos;s closing balance
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
          <Row label="Payable before adjustments" value={amount(summary.payable_before_adjustments)} strong />
          {adjusted.map((o) => (
            <Row key={o.order_no} label="" value={signedAmount(o.adjustments)} muted>
              <button
                type="button"
                onClick={() => onShowOrder(o.order_no)}
                className="font-mono text-[12px] text-emerald-soft hover:text-emerald"
              >
                {o.order_no}
              </button>
              <span className="ml-2 text-[11px] text-mut">
                {o.flags.join(', ') || 'Adjustment'}
                {!o.included_in_payable && ' · excluded from payable'}
              </span>
            </Row>
          ))}
          <Row label="Total adjustments" value={signedAmount(summary.adjustments)} muted />
          <Row label="Net payable" value={amount(summary.net_payable)} strong />
          <Row label="Vendor closing balance" value={amount(summary.vendor_closing_balance)} strong />
          <Row
            label="Unexplained difference (balance − net payable)"
            value={amount(summary.unexplained_difference)}
            strong
          />
        </div>

        <Card>
          <h3 className="font-display font-600 text-[15px]">What explains the difference</h3>
          <p className="text-[11px] text-mut mb-4">
            The vendor&apos;s balance covers everything they have invoiced, not just this
            cycle. A non-zero difference is expected.
          </p>
          <ul className="space-y-3 text-[13px]">
            {components.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-4">
                <span>
                  {c.label} <span className="text-mut text-[11px]">({c.count})</span>
                </span>
                <span className="font-mono">{amount(c.value)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <details className="group rounded-xl border border-line/70 bg-panel/50 overflow-hidden">
        <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer list-none">
          <div>
            <h3 className="font-display font-600 text-[15px]">Unmatched statement rows</h3>
            <p className="text-[11px] text-mut">
              {ledger.length} vendor rows not attached to an order in this cycle
            </p>
          </div>
          <span className="text-[12px] text-emerald-soft group-open:hidden">Show</span>
          <span className="text-[12px] text-emerald-soft hidden group-open:inline">Hide</span>
        </summary>
        <div className="overflow-x-auto border-t border-line/70">
          <table className="w-full text-[12.5px] min-w-[1000px]">
            <thead>
              <tr className="text-mut text-left border-b border-line/70">
                {['Doc no', 'Type', 'Date', 'Debit', 'Credit', 'Balance', 'Order', 'Description', 'State', 'Sheet'].map(
                  (h) => (
                    <th
                      key={h}
                      className={`font-normal px-4 py-3 ${
                        ['Debit', 'Credit', 'Balance'].includes(h) ? 'text-right' : ''
                      }`}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {ledger.map((l, i) => (
                <tr key={i} className="border-b border-line/40 hover:bg-panel2/60">
                  <td className="px-4 py-2.5 font-mono text-mut">{l.doc_no ?? '—'}</td>
                  <td className="px-4 py-2.5">{humanize(l.doc_type)}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{isoDate(l.doc_date)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(l.debit)}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{amount(l.credit)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-mut">{amount(l.balance)}</td>
                  <td className="px-4 py-2.5 font-mono">{l.order_no ?? '—'}</td>
                  <td className="px-4 py-2.5 max-w-[240px]">
                    <span dir="auto" title={l.raw_desc ?? ''} className="block truncate">
                      {l.raw_desc ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{humanize(l.match_state)}</td>
                  <td className="px-4 py-2.5 text-mut whitespace-nowrap">{l.sheet ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}

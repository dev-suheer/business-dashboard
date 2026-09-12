import Icon from '../common/Icon'

export default function StartBar({ hint, ready, onStart }) {
  return (
    <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-[12px] text-mut">{hint}</p>
      <button
        type="button"
        disabled={!ready}
        onClick={onStart}
        className="group inline-flex items-center gap-2 rounded-lg bg-emerald px-5 h-11 text-[14px] font-600 text-ink transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-emerald-soft enabled:glow"
      >
        Start reconciliation
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>
    </div>
  )
}

import Icon from '../common/Icon'

export default function StartBar({ hint, ready, onStart }) {
  return (
    <div className="mt-6 xl:mt-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <p className="text-[12px] xl:text-[13px] text-mut">{hint}</p>
      <button
        type="button"
        disabled={!ready}
        onClick={onStart}
        className="group inline-flex items-center gap-2 rounded-lg bg-emerald px-5 xl:px-6 h-11 xl:h-12 text-[14px] xl:text-[15px] font-600 text-ink transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:bg-emerald-soft enabled:glow"
      >
        Start reconciliation
        <Icon name="arrowRight" className="h-4 w-4 xl:h-4.5 xl:w-4.5" />
      </button>
    </div>
  )
}

import Icon from '../common/Icon'

export default function AuthSubmit({ children, icon = 'arrowRight', disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald h-11 text-[14px] font-600 text-ink transition-colors enabled:hover:bg-emerald-soft disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}

export function AuthBackLink({ onClick, children = 'Back to sign in' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-[12px] text-mut hover:text-txt transition-colors"
    >
      <Icon name="arrowLeft" className="h-3.5 w-3.5" />
      {children}
    </button>
  )
}

import Icon from '../common/Icon'

export default function AuthNotice({ tone = 'error', children }) {
  const isSuccess = tone === 'success'
  return (
    <div
      role="alert"
      className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-[12px] leading-relaxed ${
        isSuccess
          ? 'border-emerald/30 bg-emerald/[0.06] text-emerald-soft'
          : 'border-bad/30 bg-bad/[0.06] text-bad'
      }`}
    >
      <Icon name={isSuccess ? 'check' : 'alert'} className="h-4 w-4 shrink-0 mt-px" />
      <span>{children}</span>
    </div>
  )
}

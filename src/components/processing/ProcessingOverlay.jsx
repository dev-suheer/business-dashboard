import { useProcessingSequence } from '../../hooks/useProcessingSequence'

export default function ProcessingOverlay({ active, onComplete }) {
  const { step, completed, pct } = useProcessingSequence(active, onComplete)

  if (!active) return null

  return (
    <div className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-sm grid place-items-center">
      <div className="w-full max-w-md px-8 text-center">
        <div className="mx-auto h-14 w-14 rounded-full border-2 border-line border-t-emerald-soft spin" />
        <h2 className="mt-7 font-display text-xl font-600">{step.title}</h2>
        <p className="text-[13px] text-mut mt-1">{step.sub}</p>
        <div className="mt-6 h-1.5 rounded-full bg-panel2 overflow-hidden">
          <div
            className="h-full bg-emerald transition-all duration-300 ease-out"
            style={{ width: pct + '%' }}
          />
        </div>
        <div className="mt-6 space-y-2 text-left">
          {completed.map((s) => (
            <div key={s.title} className="flex items-center gap-2 text-[12px] text-mut">
              <span className="h-4 w-4 rounded-full border border-emerald-soft/60 grid place-items-center text-emerald-soft">
                ✓
              </span>
              {s.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { PROCESSING_STEPS, REVEAL_DELAY, STEP_INTERVAL } from '../constants/processingSteps'

/* Drives the intake → dashboard transition. `shown` counts completed steps (0 through 4),
   so the progress bar renders at 0% on the first paint and then transitions to 18%, which
   is what the reference achieved with its `w-0` starting class. */
export function useProcessingSequence(active, onComplete) {
  const [shown, setShown] = useState(0)
  const completeRef = useRef(onComplete)
  completeRef.current = onComplete

  useEffect(() => {
    if (!active) {
      setShown(0)
      return undefined
    }

    let i = 0
    let timer
    const tick = () => {
      if (i >= PROCESSING_STEPS.length) {
        timer = setTimeout(() => completeRef.current(), REVEAL_DELAY)
        return
      }
      i += 1
      setShown(i)
      timer = setTimeout(tick, STEP_INTERVAL)
    }
    tick()

    return () => clearTimeout(timer)
  }, [active])

  return {
    step: PROCESSING_STEPS[Math.max(0, shown - 1)],
    completed: PROCESSING_STEPS.slice(0, shown),
    pct: shown === 0 ? 0 : PROCESSING_STEPS[shown - 1].pct,
  }
}

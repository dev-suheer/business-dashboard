import { useEffect, useRef } from 'react'
import { OTP_LENGTH } from '../../constants/auth'

/* Boxes are backed by a single string. Unfilled slots are held as spaces so a digit typed
   into box 4 stays in box 4 instead of collapsing to the front when the array is joined. */
const EMPTY = ' '

export default function OtpInput({ value, onChange }) {
  const refs = useRef([])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  const digits = Array.from({ length: OTP_LENGTH }, (_, i) => {
    const char = value[i]
    return char && char !== EMPTY ? char : ''
  })

  const emit = (next) => {
    onChange(
      next
        .map((c) => c || EMPTY)
        .join('')
        .replace(/\s+$/, ''),
    )
  }

  const setAt = (index, char) => {
    const next = digits.slice()
    next[index] = char
    emit(next)
  }

  const handleChange = (index, raw) => {
    const char = raw.replace(/\D/g, '').slice(-1)
    setAt(index, char)
    if (char && index < OTP_LENGTH - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      /* With a digit present, let the native delete clear this box and stay put. Only step
         back once the box is already empty. */
      if (digits[index] || index === 0) return
      e.preventDefault()
      setAt(index - 1, '')
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    e.preventDefault()
    onChange(pasted)
    refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus()
  }

  return (
    <div className="flex items-center gap-2" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          className="h-12 w-full min-w-0 rounded-lg bg-panel2 border border-line text-center font-mono text-[16px] text-txt focus:outline-none focus:border-emerald/50 transition-colors"
        />
      ))}
    </div>
  )
}

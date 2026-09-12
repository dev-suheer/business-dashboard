import { useState } from 'react'
import Icon from '../common/Icon'

export default function AuthField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  action,
  invalid,
}) {
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <label htmlFor={id} className="text-[12px] text-mut">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && reveal ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-11 rounded-lg bg-panel2 border ${
            invalid ? 'border-bad/45' : 'border-line focus:border-emerald/50'
          } pl-3 ${
            isPassword ? 'pr-10' : 'pr-3'
          } text-[13.5px] text-txt placeholder:text-mut focus:outline-none transition-colors`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? 'Hide password' : 'Show password'}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-mut hover:text-txt transition-colors"
          >
            <Icon name={reveal ? 'eyeOff' : 'eye'} className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

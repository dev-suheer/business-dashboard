import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'
import { useTheme } from '../../hooks/useTheme'

export default function ThemePicker({ fullWidth = false, menu = 'down' }) {
  const { theme, setTheme, themes } = useTheme()
  const current = themes.find((item) => item.id === theme) ?? themes[0]
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Color theme, ${current.label}`}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex items-center gap-2 rounded-lg border border-line2 bg-panel pl-1.5 pr-2 h-9 text-[12.5px] text-mut hover:text-txt hover:border-emerald/40 transition-colors ${
          fullWidth ? 'w-full justify-between' : ''
        }`}
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <span
            className="relative h-5 w-5 shrink-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]"
            style={{ background: current.swatch }}
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          </span>
          <span className={`text-txt ${fullWidth ? '' : 'hidden sm:inline'}`}>{current.label}</span>
        </span>
        <svg
          viewBox="0 0 12 12"
          className={`h-3 w-3 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Color theme"
          className={`absolute z-30 rounded-xl border border-line/70 bg-panel/95 backdrop-blur-md p-1.5 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.75)] fade-up ${
            fullWidth ? 'left-0 right-0 w-full' : 'right-0 w-44'
          } ${menu === 'up' ? 'bottom-[calc(100%+8px)]' : 'top-[calc(100%+8px)]'}`}
        >
          {themes.map((item) => {
            const on = theme === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={on}
                onClick={() => {
                  setTheme(item.id)
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2.5 rounded-lg px-2 h-9 text-[12.5px] transition-colors ${
                  on ? 'bg-emerald/12 text-txt' : 'text-mut hover:bg-panel2 hover:text-txt'
                }`}
              >
                <span
                  className="relative h-[18px] w-[18px] shrink-0 rounded-full"
                  style={{ background: item.swatch }}
                >
                  <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
                </span>
                <span className="flex-1 text-left">{item.label}</span>
                {on && <Icon name="check" className="h-3.5 w-3.5 text-emerald-soft" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react'
import { Chart } from 'chart.js'
import {
  DEFAULT_THEME,
  THEME_MAP,
  THEME_STORAGE_KEY,
  THEMES,
  getPalette,
} from '../constants/theme'

const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && THEME_MAP[stored]) return stored
  } catch {
    /* private mode / blocked storage */
  }
  return DEFAULT_THEME
}

function applyTheme(id) {
  document.documentElement.setAttribute('data-theme', id)
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)
  const palette = useMemo(() => getPalette(theme), [theme])

  useEffect(() => {
    applyTheme(theme)
    Chart.defaults.color = palette.COLORS.mut
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme, palette])

  const value = useMemo(
    () => ({ theme, setTheme, palette, themes: THEMES }),
    [theme, palette],
  )

  return createElement(ThemeContext.Provider, { value }, children)
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

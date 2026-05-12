"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { Theme } from "@/lib/tokens"

interface ThemeContextValue {
  theme:     Theme
  setTheme:  (t: Theme) => void
  toggle:    () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    "dark",
  setTheme: () => {},
  toggle:   () => {},
})

const STORAGE_KEY = "fiinor-theme"
const DEFAULT: Theme = "dark"
const THEMES: Theme[] = ["dark", "light"]

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /* SSR: always DEFAULT (matches html class="dark" from layout.tsx)
     Client: read localStorage in useEffect to avoid hydration mismatch */
  const [theme, setThemeState] = useState<Theme>(DEFAULT)

  /* On mount: read saved theme from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
      if (stored && THEMES.includes(stored)) setThemeState(stored)
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Sync <html> className and persist on every theme change */
  useEffect(() => {
    const root = document.documentElement
    THEMES.forEach(t => root.classList.remove(t))
    root.classList.add(theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }, [theme])

  const setTheme = useCallback((t: Theme) => {
    if (THEMES.includes(t)) setThemeState(t)
  }, [])

  const toggle = useCallback(() => {
    setThemeState(prev => {
      const idx = THEMES.indexOf(prev)
      return THEMES[(idx + 1) % THEMES.length]
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

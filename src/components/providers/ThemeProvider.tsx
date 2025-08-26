'use client'

import * as React from 'react'
import { 
  THEME_CONFIG, 
  THEME_COLORS, 
  CSS_VARIABLES, 
  MEDIA_QUERY_DARK,
  type Theme 
} from '@/lib/constants/theme'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isSystemTheme: boolean
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  defaultTheme = THEME_CONFIG.DEFAULT_THEME,
  storageKey = THEME_CONFIG.STORAGE_KEY,
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<'light' | 'dark'>('light')
  const [isSystemTheme, setIsSystemTheme] = React.useState(false)

  // Get system theme preference
  const getSystemTheme = React.useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia(MEDIA_QUERY_DARK).matches ? 'dark' : 'light'
  }, [])

  // Resolve theme based on current theme setting
  const resolveTheme = React.useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }, [getSystemTheme])

  // Apply theme to document
  const applyTheme = React.useCallback((targetTheme: 'light' | 'dark') => {
    const root = document.documentElement
    const colors = THEME_COLORS[targetTheme]

    // Disable transitions temporarily if specified
    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.appendChild(
        document.createTextNode(
          '*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}'
        )
      )
      document.head.appendChild(css)

      // Force reflow
      (() => window.getComputedStyle(document.body))()

      // Re-enable transitions
      setTimeout(() => {
        document.head.removeChild(css)
      }, 1)
    }

    // Apply CSS custom properties
    Object.entries(CSS_VARIABLES).forEach(([cssVar, colorKey]) => {
      if (cssVar === '--radius') {
        root.style.setProperty(cssVar, CSS_VARIABLES[cssVar])
      } else {
        const colorValue = colors[colorKey as keyof typeof colors]
        if (colorValue) {
          // Convert HSL string to just the values (remove 'hsl(' and ')')
          const hslValues = colorValue.replace('hsl(', '').replace(')', '')
          root.style.setProperty(cssVar, hslValues)
        }
      }
    })

    // Update class on html element
    root.classList.remove('light', 'dark')
    root.classList.add(targetTheme)

    // Update color-scheme for better browser integration
    root.style.colorScheme = targetTheme
  }, [disableTransitionOnChange])

  // Set theme and persist to storage
  const setTheme = React.useCallback((newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }

    setThemeState(newTheme)
    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)
    setIsSystemTheme(newTheme === 'system')
    applyTheme(resolved)
  }, [storageKey, resolveTheme, applyTheme])

  // Toggle between light and dark (skips system)
  const toggleTheme = React.useCallback(() => {
    if (theme === 'system') {
      // If currently system, toggle to opposite of current system preference
      const systemTheme = getSystemTheme()
      setTheme(systemTheme === 'light' ? 'dark' : 'light')
    } else {
      // Toggle between light and dark
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
  }, [theme, getSystemTheme, setTheme])

  // Initialize theme on mount
  React.useEffect(() => {
    let initialTheme = defaultTheme

    // Try to get theme from localStorage
    try {
      const savedTheme = localStorage.getItem(storageKey) as Theme | null
      if (savedTheme && THEME_CONFIG.THEMES.includes(savedTheme)) {
        initialTheme = savedTheme
      }
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }

    // If system theme is disabled, fallback to light
    if (!enableSystem && initialTheme === 'system') {
      initialTheme = 'light'
    }

    const resolved = resolveTheme(initialTheme)
    setThemeState(initialTheme)
    setResolvedTheme(resolved)
    setIsSystemTheme(initialTheme === 'system')
    applyTheme(resolved)
  }, [defaultTheme, storageKey, enableSystem, resolveTheme, applyTheme])

  // Listen for system theme changes
  React.useEffect(() => {
    if (!enableSystem) return

    const mediaQuery = window.matchMedia(MEDIA_QUERY_DARK)
    
    const handleChange = () => {
      if (theme === 'system') {
        const newSystemTheme = getSystemTheme()
        setResolvedTheme(newSystemTheme)
        applyTheme(newSystemTheme)
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    } 
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange)
      return () => mediaQuery.removeListener(handleChange)
    }
  }, [theme, enableSystem, getSystemTheme, applyTheme])

  // Prevent hydration mismatch by not rendering until mounted
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const contextValue = React.useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      isSystemTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme, isSystemTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = React.useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook for accessing theme in components
export function useResolvedTheme() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme
}

// Hook for checking if dark mode is active
export function useIsDarkMode() {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark'
}
export const THEME_CONFIG = {
  STORAGE_KEY: 'administrativa-mente-theme',
  DEFAULT_THEME: 'system' as const,
  THEMES: ['light', 'dark', 'system'] as const,
} as const

export type Theme = typeof THEME_CONFIG.THEMES[number]

// Premium color definitions matching CLAUDE.md specifications
export const THEME_COLORS = {
  light: {
    // Background colors
    background: 'hsl(0, 0%, 100%)',
    backgroundSecondary: 'hsl(0, 0%, 98%)',
    
    // Foreground colors
    foreground: 'hsl(240, 10%, 9%)',
    foregroundMuted: 'hsl(240, 5%, 46%)',
    
    // Primary colors (zinc-based)
    primary: 'hsl(240, 6%, 10%)',
    primaryForeground: 'hsl(0, 0%, 98%)',
    
    // Accent colors
    accent: 'hsl(240, 5%, 96%)',
    accentForeground: 'hsl(240, 6%, 10%)',
    
    // Muted colors
    muted: 'hsl(240, 5%, 96%)',
    mutedForeground: 'hsl(240, 4%, 46%)',
    
    // Border and ring
    border: 'hsl(240, 6%, 90%)',
    ring: 'hsl(240, 5%, 85%)',
    
    // Surface colors for glassmorphism
    surfacePrimary: 'hsl(0, 0%, 100%)',
    surfaceSecondary: 'hsl(240, 5%, 98%)',
    surfaceTertiary: 'hsl(240, 5%, 96%)',
    
    // Text reading colors
    textPrimary: 'hsl(240, 10%, 9%)',
    textSecondary: 'hsl(240, 5%, 46%)',
    textAccent: 'hsl(216, 87%, 52%)',
  },
  dark: {
    // Background colors
    background: 'hsl(240, 10%, 6%)',
    backgroundSecondary: 'hsl(240, 10%, 8%)',
    
    // Foreground colors
    foreground: 'hsl(0, 0%, 93%)',
    foregroundMuted: 'hsl(240, 5%, 65%)',
    
    // Primary colors
    primary: 'hsl(0, 0%, 98%)',
    primaryForeground: 'hsl(240, 6%, 10%)',
    
    // Accent colors
    accent: 'hsl(240, 4%, 16%)',
    accentForeground: 'hsl(0, 0%, 93%)',
    
    // Muted colors
    muted: 'hsl(240, 4%, 16%)',
    mutedForeground: 'hsl(240, 5%, 65%)',
    
    // Border and ring
    border: 'hsl(240, 4%, 16%)',
    ring: 'hsl(240, 4%, 84%)',
    
    // Surface colors for glassmorphism
    surfacePrimary: 'hsl(240, 10%, 6%)',
    surfaceSecondary: 'hsl(240, 10%, 8%)',
    surfaceTertiary: 'hsl(240, 4%, 16%)',
    
    // Text reading colors
    textPrimary: 'hsl(0, 0%, 93%)',
    textSecondary: 'hsl(240, 5%, 65%)',
    textAccent: 'hsl(216, 87%, 65%)',
  },
} as const

// CSS custom properties mapping
export const CSS_VARIABLES = {
  '--background': 'background',
  '--background-secondary': 'backgroundSecondary',
  '--foreground': 'foreground',
  '--foreground-muted': 'foregroundMuted',
  '--primary': 'primary',
  '--primary-foreground': 'primaryForeground',
  '--accent': 'accent',
  '--accent-foreground': 'accentForeground',
  '--muted': 'muted',
  '--muted-foreground': 'mutedForeground',
  '--border': 'border',
  '--ring': 'ring',
  '--surface-primary': 'surfacePrimary',
  '--surface-secondary': 'surfaceSecondary',
  '--surface-tertiary': 'surfaceTertiary',
  '--text-primary': 'textPrimary',
  '--text-secondary': 'textSecondary',
  '--text-accent': 'textAccent',
  '--radius': '0.75rem',
} as const

// Media query for system theme detection
export const MEDIA_QUERY_DARK = '(prefers-color-scheme: dark)'

// Theme transitions
export const THEME_TRANSITION = {
  duration: '200ms',
  easing: 'ease-out',
  properties: ['background-color', 'border-color', 'color', 'fill', 'stroke'],
} as const
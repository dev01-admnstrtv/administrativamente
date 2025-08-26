'use client'

import * as React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/Button'
import { 
  Modal,
  ModalHeader,
  ModalBody,
  ModalTitle,
  ModalDescription
} from '@/components/ui/Modal'
import { cn } from '@/lib/utils'
import type { Theme } from '@/lib/constants/theme'

interface ThemeToggleProps {
  variant?: 'button' | 'minimal' | 'dropdown'
  showLabel?: boolean
  className?: string
}

export function ThemeToggle({ 
  variant = 'button', 
  showLabel = false,
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, isSystemTheme } = useTheme()
  const [showThemeModal, setShowThemeModal] = React.useState(false)

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'inline-flex items-center justify-center w-9 h-9 rounded-lg',
          'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:ring-offset-2',
          className
        )}
        aria-label="Alternar tema"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowThemeModal(true)}
          className={cn('justify-start gap-2', className)}
        >
          {theme === 'light' && <Sun className="h-4 w-4" />}
          {theme === 'dark' && <Moon className="h-4 w-4" />}
          {theme === 'system' && <Monitor className="h-4 w-4" />}
          {showLabel && (
            <span className="capitalize">
              {theme === 'system' ? 'Sistema' : theme === 'light' ? 'Claro' : 'Escuro'}
            </span>
          )}
        </Button>

        <ThemeModal 
          isOpen={showThemeModal} 
          onClose={() => setShowThemeModal(false)}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      </>
    )
  }

  // Default button variant
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setShowThemeModal(true)}
        className={cn('relative', className)}
        aria-label="Alterar tema"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        
        {/* System indicator */}
        {isSystemTheme && (
          <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2">
            <div className="w-1 h-1 bg-zinc-400 rounded-full" />
          </div>
        )}
      </Button>

      <ThemeModal 
        isOpen={showThemeModal} 
        onClose={() => setShowThemeModal(false)}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
    </>
  )
}

interface ThemeModalProps {
  isOpen: boolean
  onClose: () => void
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
}

function ThemeModal({ isOpen, onClose, currentTheme, onThemeChange }: ThemeModalProps) {
  const themes = [
    {
      key: 'light' as const,
      name: 'Claro',
      description: 'Tema claro com design limpo',
      icon: Sun,
    },
    {
      key: 'dark' as const,
      name: 'Escuro',
      description: 'Tema escuro para reduzir o cansaço visual',
      icon: Moon,
    },
    {
      key: 'system' as const,
      name: 'Sistema',
      description: 'Segue a preferência do sistema operacional',
      icon: Monitor,
    },
  ]

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      title="Escolher Tema"
      description="Selecione sua preferência de tema para uma melhor experiência de leitura."
    >
      <div className="space-y-3">
        {themes.map((themeOption) => {
          const Icon = themeOption.icon
          const isSelected = currentTheme === themeOption.key
          
          return (
            <button
              key={themeOption.key}
              onClick={() => handleThemeSelect(themeOption.key)}
              className={cn(
                'w-full flex items-start gap-3 p-3 rounded-lg text-left',
                'border transition-all duration-200 ease-out',
                'hover:bg-zinc-50 dark:hover:bg-zinc-800/50',
                'focus:outline-none focus:ring-2 focus:ring-zinc-400/20',
                isSelected
                  ? 'border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-800/50'
                  : 'border-zinc-200 dark:border-zinc-700'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg',
                'bg-zinc-100 dark:bg-zinc-800',
                isSelected && 'bg-zinc-200 dark:bg-zinc-700'
              )}>
                <Icon className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {themeOption.name}
                  </h3>
                  {isSelected && (
                    <div className="w-2 h-2 bg-zinc-600 dark:bg-zinc-400 rounded-full" />
                  )}
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  {themeOption.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

// Simple toggle switch component for settings pages
export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-zinc-400/20 focus:ring-offset-2',
        isDark 
          ? 'bg-zinc-600' 
          : 'bg-zinc-200',
        className
      )}
      role="switch"
      aria-checked={isDark}
      aria-label="Alternar tema escuro"
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          'shadow-sm ring-0',
          isDark ? 'translate-x-6' : 'translate-x-1'
        )}
      >
        {isDark ? (
          <Moon className="h-3 w-3 m-0.5 text-zinc-600" />
        ) : (
          <Sun className="h-3 w-3 m-0.5 text-zinc-600" />
        )}
      </span>
    </button>
  )
}

// Compact theme indicator for status bars
export function ThemeIndicator({ className }: { className?: string }) {
  const { theme, resolvedTheme } = useTheme()
  
  return (
    <div className={cn('flex items-center gap-1 text-xs text-zinc-500', className)}>
      {theme === 'light' && <Sun className="h-3 w-3" />}
      {theme === 'dark' && <Moon className="h-3 w-3" />}
      {theme === 'system' && <Monitor className="h-3 w-3" />}
      <span>
        {theme === 'system' ? `Sistema (${resolvedTheme})` : theme}
      </span>
    </div>
  )
}
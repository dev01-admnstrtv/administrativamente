'use client'

import * as React from 'react'
import { Type, Eye, Focus, Clock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

type TypographyMode = 'adaptive' | 'reading' | 'focus' | 'bionic'

interface TypographyControllerProps {
  className?: string
  onModeChange?: (mode: TypographyMode) => void
}

interface TypographyContextType {
  mode: TypographyMode
  setMode: (mode: TypographyMode) => void
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  fontSize: number
  setFontSize: (size: number) => void
}

const TypographyContext = React.createContext<TypographyContextType | null>(null)

export function useTypography() {
  const context = React.useContext(TypographyContext)
  if (!context) {
    throw new Error('useTypography must be used within a TypographyProvider')
  }
  return context
}

export function TypographyProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<TypographyMode>('adaptive')
  const [fontSize, setFontSize] = React.useState(16)
  const [timeOfDay, setTimeOfDay] = React.useState<'morning' | 'afternoon' | 'evening' | 'night'>('afternoon')

  // Detect time of day and adjust typography
  React.useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 6 && hour < 12) {
        setTimeOfDay('morning')
      } else if (hour >= 12 && hour < 17) {
        setTimeOfDay('afternoon')
      } else if (hour >= 17 && hour < 22) {
        setTimeOfDay('evening')
      } else {
        setTimeOfDay('night')
      }
    }

    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Apply typography mode to document
  React.useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-typography-mode', mode)
    root.setAttribute('data-time-of-day', timeOfDay)
    root.style.setProperty('--user-font-size', `${fontSize}px`)
  }, [mode, timeOfDay, fontSize])

  const value = React.useMemo(() => ({
    mode,
    setMode,
    timeOfDay,
    fontSize,
    setFontSize
  }), [mode, timeOfDay, fontSize])

  return (
    <TypographyContext.Provider value={value}>
      {children}
    </TypographyContext.Provider>
  )
}

export function TypographyController({ className, onModeChange }: TypographyControllerProps) {
  const { mode, setMode, timeOfDay, fontSize, setFontSize } = useTypography()
  
  const modes: Array<{
    id: TypographyMode
    label: string
    icon: React.ElementType
    description: string
  }> = [
    {
      id: 'adaptive',
      label: 'Adaptivo',
      icon: Type,
      description: 'Tipografia que se adapta ao contexto'
    },
    {
      id: 'reading',
      label: 'Leitura',
      icon: Eye,
      description: 'Otimizado para leitura profunda'
    },
    {
      id: 'focus',
      label: 'Foco',
      icon: Focus,
      description: 'Experiência imersiva de leitura'
    },
    {
      id: 'bionic',
      label: 'Biônico',
      icon: Zap,
      description: 'Leitura acelerada com destaque'
    }
  ]

  const handleModeChange = (newMode: TypographyMode) => {
    setMode(newMode)
    onModeChange?.(newMode)
    
    // Animate transition
    const article = document.querySelector('.typography-content')
    if (article) {
      article.classList.add('typography-transitioning')
      setTimeout(() => {
        article.classList.remove('typography-transitioning')
      }, 600)
    }
  }

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case 'morning': return '🌅'
      case 'afternoon': return '☀️'
      case 'evening': return '🌇'
      case 'night': return '🌙'
      default: return '☀️'
    }
  }

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex flex-col gap-3',
      'lg:bottom-8 lg:right-8',
      className
    )}>
      {/* Main Typography Control */}
      <div className="flex flex-col gap-2 p-3 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <Type className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Tipografia {getTimeIcon()}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          {modes.map((modeOption) => {
            const Icon = modeOption.icon
            const isActive = mode === modeOption.id
            
            return (
              <Button
                key={modeOption.id}
                variant={isActive ? 'premium' : 'ghost'}
                size="sm"
                onClick={() => handleModeChange(modeOption.id)}
                className={cn(
                  'flex flex-col items-center gap-1 h-auto py-2 px-3',
                  'transition-all duration-200',
                  isActive && 'shadow-lg scale-105'
                )}
                title={modeOption.description}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{modeOption.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      {/* Font Size Control */}
      <div className="flex items-center gap-2 p-3 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Tamanho</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="h-6 w-6 p-0"
            disabled={fontSize <= 12}
          >
            <span className="text-xs">A</span>
          </Button>
          
          <span className="text-xs font-medium min-w-8 text-center">
            {fontSize}px
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className="h-6 w-6 p-0"
            disabled={fontSize >= 24}
          >
            <span className="text-sm font-bold">A</span>
          </Button>
        </div>
      </div>

      {/* Reading Mode Indicator */}
      {mode !== 'adaptive' && (
        <div className="flex items-center justify-between p-2 bg-primary/10 backdrop-blur-xl border border-primary/20 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-medium text-primary">
              Modo {modes.find(m => m.id === mode)?.label}
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleModeChange('adaptive')}
            className="h-6 w-6 p-0 text-primary/60 hover:text-primary"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  )
}

// Hook for bionic reading transformation
export function useBionicReading() {
  const transformToBionic = React.useCallback((text: string): string => {
    return text.replace(/\b\w+\b/g, (word) => {
      if (word.length <= 2) return word
      
      const fixationLength = Math.ceil(word.length / 2)
      const fixation = word.slice(0, fixationLength)
      const saccade = word.slice(fixationLength)
      
      return `<span class="bionic-word">
        <span class="bionic-fixation">${fixation}</span><span class="bionic-saccade">${saccade}</span>
      </span>`
    })
  }, [])

  return { transformToBionic }
}

// Enhanced Text Component with Typography Support
interface EnhancedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'body' | 'heading' | 'caption'
  children: React.ReactNode
  enableBionic?: boolean
}

export function EnhancedText({ 
  variant = 'body', 
  children, 
  enableBionic = false,
  className,
  ...props 
}: EnhancedTextProps) {
  const { mode, timeOfDay } = useTypography()
  const { transformToBionic } = useBionicReading()
  const [content, setContent] = React.useState<string>('')

  React.useEffect(() => {
    if (typeof children === 'string' && mode === 'bionic' && enableBionic) {
      setContent(transformToBionic(children))
    } else {
      setContent(typeof children === 'string' ? children : '')
    }
  }, [children, mode, enableBionic, transformToBionic])

  const baseClasses = cn(
    'typography-adaptive',
    `typography-${timeOfDay}`,
    {
      'typography-reading': mode === 'reading',
      'typography-focus': mode === 'focus',
      'bionic-reading': mode === 'bionic' && enableBionic,
      'text-body-medium': variant === 'body',
      'heading-dynamic': variant === 'heading',
      'text-sm text-muted-foreground': variant === 'caption',
    },
    className
  )

  if (mode === 'bionic' && enableBionic && typeof children === 'string') {
    return (
      <div 
        className={baseClasses}
        dangerouslySetInnerHTML={{ __html: content }}
        {...props}
      />
    )
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  )
}
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type GlassLayer = 1 | 2 | 3 | 4 | 5
type GlassVariant = 'base' | 'frosted' | 'crystal' | 'liquid' | 'warm' | 'cool' | 'premium'
type GlassEffect = 'interactive' | 'reactive' | 'floating' | 'shimmer' | 'stacked'

interface GlassContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  layer?: GlassLayer
  variant?: GlassVariant
  effects?: GlassEffect[]
  children: React.ReactNode
  className?: string
  asChild?: boolean
  ref?: React.Ref<HTMLDivElement>
}

export const GlassContainer = React.forwardRef<HTMLDivElement, Omit<GlassContainerProps, 'ref'>>(({
  layer = 2,
  variant = 'base',
  effects = [],
  children,
  className,
  asChild,
  ...props
}, ref) => {
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  // Combine the refs
  React.useImperativeHandle(ref, () => containerRef.current!, []);

  // Handle reactive glass mouse tracking
  React.useEffect(() => {
    if (!effects.includes('reactive') || !containerRef.current) return

    const container = containerRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100
      
      container.style.setProperty('--mouse-x', `${x}px`)
      container.style.setProperty('--mouse-y', `${y}px`)
    }

    const handleMouseLeave = () => {
      container.style.setProperty('--mouse-x', '0')
      container.style.setProperty('--mouse-y', '0')
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [effects])

  const glassClasses = cn(
    // Base layer class
    variant === 'base' && `glass-layer-${layer}`,
    
    // Variant classes
    variant === 'frosted' && 'glass-frosted',
    variant === 'crystal' && 'glass-crystal',
    variant === 'liquid' && 'glass-liquid',
    variant === 'warm' && 'glass-warm',
    variant === 'cool' && 'glass-cool',
    variant === 'premium' && 'glass-premium',
    
    // Effect classes
    effects.includes('interactive') && 'glass-interactive',
    effects.includes('reactive') && 'glass-reactive',
    effects.includes('floating') && 'glass-floating',
    effects.includes('shimmer') && 'glass-shimmer',
    effects.includes('stacked') && 'glass-stack',
    
    className
  )

  if (asChild) {
    return React.cloneElement(
      React.Children.only(children) as React.ReactElement,
      {
        ref: containerRef,
        className: cn(glassClasses, (children as React.ReactElement).props.className),
        ...props
      }
    )
  }

  return (
    <div ref={containerRef} className={glassClasses} {...props}>
      {children}
    </div>
  )
})

GlassContainer.displayName = 'GlassContainer'

// Specialized Glass Card Component
interface GlassCardProps extends Omit<GlassContainerProps, 'variant'> {
  hover3D?: boolean
  clickRipple?: boolean
}

export function GlassCard({ 
  hover3D = false,
  clickRipple = false,
  effects = [],
  children,
  className,
  onClick,
  ...props
}: GlassCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [isClicked, setIsClicked] = React.useState(false)

  // 3D hover effect
  React.useEffect(() => {
    if (!hover3D || !cardRef.current) return

    const card = cardRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }

    card.addEventListener('mousemove', handleMouseMove)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [hover3D])

  // Ripple effect on click
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickRipple && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement('div')
      ripple.className = 'absolute rounded-full bg-white/20 pointer-events-none'
      ripple.style.width = '10px'
      ripple.style.height = '10px'
      ripple.style.left = `${x - 5}px`
      ripple.style.top = `${y - 5}px`
      ripple.style.animation = 'glass-ripple 0.6s ease-out'

      cardRef.current.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    }

    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 150)
    onClick?.(e)
  }

  return (
    <GlassContainer
      ref={cardRef}
      layer={3}
      variant="crystal"
      effects={[...effects, 'interactive']}
      className={cn(
        'glass-card-container cursor-pointer select-none',
        'transition-all duration-300 ease-out',
        isClicked && 'scale-95',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <div className="glass-card">
        {children}
      </div>
    </GlassContainer>
  )
}

// Glass Navigation Bar
interface GlassNavProps extends React.HTMLAttributes<HTMLElement> {
  blur?: 'light' | 'medium' | 'heavy'
  sticky?: boolean
}

export function GlassNav({ 
  blur = 'medium',
  sticky = true,
  children,
  className,
  ...props
}: GlassNavProps) {
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    if (!sticky) return

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [sticky])

  const blurClass = {
    light: 'glass-layer-1',
    medium: 'glass-layer-2', 
    heavy: 'glass-layer-3'
  }[blur]

  return (
    <nav
      className={cn(
        blurClass,
        'transition-all duration-300 ease-out',
        sticky && 'sticky top-0 z-50',
        sticky && isScrolled && 'glass-layer-4',
        className
      )}
      {...props}
    >
      {children}
    </nav>
  )
}

// Glass Modal Backdrop
interface GlassModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function GlassModal({ 
  isOpen,
  onClose,
  children,
  className
}: GlassModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 glass-layer-1 bg-black/20" />
      
      {/* Modal Content */}
      <GlassContainer
        layer={5}
        variant="frosted"
        effects={['floating']}
        className={cn(
          'relative max-w-lg w-full max-h-[90vh] overflow-auto',
          'animate-scale-in',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </GlassContainer>
    </div>
  )
}

// Glass Tooltip
interface GlassTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export function GlassTooltip({ 
  content,
  children,
  position = 'top',
  delay = 0
}: GlassTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const timeoutRef = React.useRef<NodeJS.Timeout>()

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsVisible(false)
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }[position]

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      
      {isVisible && (
        <GlassContainer
          layer={4}
          variant="frosted"
          className={cn(
            'absolute z-50 px-3 py-2 text-sm whitespace-nowrap',
            'animate-fade-in',
            positionClasses
          )}
        >
          {content}
        </GlassContainer>
      )}
    </div>
  )
}
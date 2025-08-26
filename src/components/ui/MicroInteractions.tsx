'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

// Intersection Observer Hook for scroll animations
export function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = React.useState(false)
  const [hasBeenInView, setHasBeenInView] = React.useState(false)
  const ref = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, hasBeenInView])

  return { ref, isInView, hasBeenInView }
}

// Enhanced Button with Micro-interactions
interface MicroButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'magnetic' | 'ripple' | 'morph' | 'elastic'
  children: React.ReactNode
}

export function MicroButton({ 
  variant = 'magnetic',
  children,
  className,
  onClick,
  ...props
}: MicroButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Magnetic effect
  React.useEffect(() => {
    if (variant !== 'magnetic' || !buttonRef.current) return

    const button = buttonRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = 100
      
      if (distance < maxDistance) {
        const strength = (maxDistance - distance) / maxDistance
        const moveX = x * strength * 0.3
        const moveY = y * strength * 0.3
        
        button.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`
      } else {
        button.style.transform = 'translate(0, 0) scale(1)'
      }
    }

    const handleMouseLeave = () => {
      button.style.transform = 'translate(0, 0) scale(1)'
    }

    button.addEventListener('mousemove', handleMouseMove)
    button.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      button.removeEventListener('mousemove', handleMouseMove)
      button.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [variant])

  const variantClasses = {
    magnetic: 'micro-button micro-button-magnetic',
    ripple: 'micro-button micro-button-ripple',
    morph: 'micro-button micro-card-morph',
    elastic: 'micro-button'
  }

  return (
    <button
      ref={buttonRef}
      className={cn(variantClasses[variant], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

// Enhanced Card with Tilt and Parallax
interface MicroCardProps extends React.HTMLAttributes<HTMLDivElement> {
  effect?: 'tilt' | 'parallax' | 'morph' | 'float'
  intensity?: 'subtle' | 'moderate' | 'strong'
  children: React.ReactNode
}

export function MicroCard({ 
  effect = 'tilt',
  intensity = 'moderate',
  children,
  className,
  ...props
}: MicroCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null)

  // Tilt effect
  React.useEffect(() => {
    if (effect !== 'tilt' || !cardRef.current) return

    const card = cardRef.current
    const intensityMap = { subtle: 5, moderate: 10, strong: 20 }
    const maxTilt = intensityMap[intensity]
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const rotateX = (y - centerY) / maxTilt
      const rotateY = (centerX - x) / maxTilt

      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        translateZ(20px)
      `
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
  }, [effect, intensity])

  // Parallax effect
  React.useEffect(() => {
    if (effect !== 'parallax' || !cardRef.current) return

    const card = cardRef.current
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      
      card.style.setProperty('--mouse-x', `${x}px`)
      card.style.setProperty('--mouse-y', `${y}px`)
    }

    card.addEventListener('mousemove', handleMouseMove)

    return () => {
      card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [effect])

  const effectClasses = {
    tilt: 'micro-card micro-card-tilt',
    parallax: 'micro-card micro-card-parallax',
    morph: 'micro-card micro-card-morph',
    float: 'micro-card micro-button-magnetic'
  }

  return (
    <div
      ref={cardRef}
      className={cn(effectClasses[effect], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Animated Text with Various Effects
interface AnimatedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'typewriter' | 'reveal' | 'gradient' | 'spacing'
  delay?: number
  children: string
}

export function AnimatedText({ 
  animation = 'reveal',
  delay = 0,
  children,
  className,
  ...props
}: AnimatedTextProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const { ref, hasBeenInView } = useInView(0.3)

  React.useEffect(() => {
    if (hasBeenInView) {
      const timeout = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timeout)
    }
  }, [hasBeenInView, delay])

  const animationClasses = {
    typewriter: 'micro-typewriter',
    reveal: cn('micro-text-reveal', isVisible && 'in-view'),
    gradient: 'micro-text-gradient',
    spacing: 'micro-text-spacing'
  }

  return (
    <div
      ref={ref}
      className={cn(animationClasses[animation], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Morphing Icon Component
interface MorphIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode
  morphIcon?: React.ReactNode
  animation?: 'morph' | 'bounce' | 'pulse' | 'rotate'
  trigger?: 'hover' | 'click' | 'auto'
}

export function MorphIcon({ 
  icon,
  morphIcon,
  animation = 'morph',
  trigger = 'hover',
  className,
  ...props
}: MorphIconProps) {
  const [isTransformed, setIsTransformed] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsTransformed(prev => !prev)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [trigger])

  const handleInteraction = () => {
    if (trigger === 'click') {
      setIsTransformed(prev => !prev)
    }
  }

  const animationClasses = {
    morph: 'micro-icon-morph',
    bounce: 'micro-icon-bounce',
    pulse: 'micro-icon-pulse',
    rotate: 'micro-icon-morph'
  }

  const shouldShowMorph = (trigger === 'hover' && isHovered) || 
                          (trigger === 'click' && isTransformed) ||
                          (trigger === 'auto' && isTransformed)

  return (
    <div
      className={cn(animationClasses[animation], className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      {...props}
    >
      <div className="transition-all duration-300 ease-out">
        {shouldShowMorph && morphIcon ? morphIcon : icon}
      </div>
    </div>
  )
}

// Staggered Animation Container
interface StaggerContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  staggerDelay?: number
  children: React.ReactNode
}

export function StaggerContainer({ 
  staggerDelay = 100,
  children,
  className,
  ...props
}: StaggerContainerProps) {
  const { ref, hasBeenInView } = useInView(0.2)

  return (
    <div
      ref={ref}
      className={cn(
        'micro-stagger-container',
        hasBeenInView && 'in-view',
        className
      )}
      style={{ '--stagger-delay': `${staggerDelay}ms` } as React.CSSProperties}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <div 
          className="micro-stagger-item"
          style={{ transitionDelay: `${index * staggerDelay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

// Parallax Scroll Effect
interface ParallaxProps extends React.HTMLAttributes<HTMLDivElement> {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  children: React.ReactNode
}

export function Parallax({ 
  speed = 0.5,
  direction = 'up',
  children,
  className,
  ...props
}: ParallaxProps) {
  const elementRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const scrolled = window.pageYOffset
      const rate = scrolled * -speed
      
      const transforms = {
        up: `translateY(${rate}px)`,
        down: `translateY(${-rate}px)`,
        left: `translateX(${rate}px)`,
        right: `translateX(${-rate}px)`
      }

      element.style.transform = transforms[direction]
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return (
    <div
      ref={elementRef}
      className={cn('micro-parallax', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Gesture Handler Hook
export function useSwipeGesture(onSwipe: (direction: 'left' | 'right') => void) {
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)
  
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      onSwipe('left')
    } else if (isRightSwipe) {
      onSwipe('right')
    }
  }

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}
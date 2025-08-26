'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ReadingProgressProps {
  className?: string
  target?: string // CSS selector for the content to track
}

export function ReadingProgress({ className, target = 'article' }: ReadingProgressProps) {
  const [progress, setProgress] = React.useState(0)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const calculateProgress = () => {
      const targetElement = document.querySelector(target)
      if (!targetElement) return

      const rect = targetElement.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const documentHeight = targetElement.scrollHeight
      const scrollTop = window.scrollY
      
      // Calculate the start position (when article starts being visible)
      const elementTop = scrollTop + rect.top
      
      // Calculate progress
      const scrolledDistance = scrollTop + windowHeight - elementTop
      const progressPercentage = Math.max(0, Math.min(100, (scrolledDistance / documentHeight) * 100))
      
      setProgress(progressPercentage)
      
      // Show progress bar when user starts reading (after scrolling a bit)
      setIsVisible(scrollTop > 200)
    }

    // Initial calculation
    calculateProgress()

    // Add scroll listener
    const handleScroll = () => calculateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Add resize listener for responsive calculations
    const handleResize = () => calculateProgress()
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [target])

  return (
    <>
      {/* Fixed Progress Bar */}
      <div 
        className={cn(
          'fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 transition-all duration-300 ease-out dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100',
          isVisible ? 'opacity-100' : 'opacity-0',
          className
        )}
        style={{ width: `${progress}%` }}
      />
      
      {/* Floating Progress Indicator */}
      <div 
        className={cn(
          'fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-premium backdrop-blur-lg transition-all duration-300 ease-out dark:bg-zinc-900/90',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        )}
      >
        {/* Circular Progress */}
        <svg className="h-10 w-10 -rotate-90 transform" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-zinc-200 dark:text-zinc-700"
          />
          {/* Progress circle */}
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${progress}, 100`}
            className="text-zinc-900 transition-all duration-300 ease-out dark:text-zinc-100"
          />
        </svg>
        
        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </>
  )
}
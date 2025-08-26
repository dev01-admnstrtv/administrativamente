'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const spinnerVariants = cva(
  'animate-spin rounded-full transition-all duration-200 ease-out',
  {
    variants: {
      variant: {
        default:
          'border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100',
        primary:
          'border-2 border-zinc-200 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100',
        secondary:
          'border-2 border-zinc-100 border-t-zinc-600 dark:border-zinc-800 dark:border-t-zinc-400',
        subtle:
          'border-2 border-zinc-100/50 border-t-zinc-500 dark:border-zinc-800/50 dark:border-t-zinc-400',
        success:
          'border-2 border-emerald-200 border-t-emerald-600 dark:border-emerald-800 dark:border-t-emerald-400',
        warning:
          'border-2 border-amber-200 border-t-amber-600 dark:border-amber-800 dark:border-t-amber-400',
        error:
          'border-2 border-red-200 border-t-red-600 dark:border-red-800 dark:border-t-red-400',
      },
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
        '2xl': 'h-16 w-16',
      },
      speed: {
        slow: 'animate-spin [animation-duration:2s]',
        normal: 'animate-spin [animation-duration:1s]',
        fast: 'animate-spin [animation-duration:0.5s]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      speed: 'normal',
    },
  }
)

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
  showLabel?: boolean
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ 
    className, 
    variant, 
    size, 
    speed, 
    label = 'Carregando...', 
    showLabel = false,
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn('flex items-center gap-2', className)} 
        {...props}
      >
        <div
          className={cn(spinnerVariants({ variant, size, speed }))}
          role='status'
          aria-label={label}
        >
          <span className='sr-only'>{label}</span>
        </div>
        
        {showLabel && (
          <span className='text-sm text-muted-foreground font-medium'>
            {label}
          </span>
        )}
      </div>
    )
  }
)
LoadingSpinner.displayName = 'LoadingSpinner'

// Additional spinner variants for specific use cases
const PulseSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = ({
  size = 'md',
  className,
  label = 'Carregando...',
}) => {
  const sizeClasses = {
    xs: 'h-2 w-2',
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
    '2xl': 'h-12 w-12',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className='flex space-x-1'>
        <div className={cn('bg-zinc-600 rounded-full animate-pulse', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
        <div className={cn('bg-zinc-600 rounded-full animate-pulse', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
        <div className={cn('bg-zinc-600 rounded-full animate-pulse', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
      </div>
      <span className='sr-only'>{label}</span>
    </div>
  )
}

const DotsSpinner: React.FC<Omit<LoadingSpinnerProps, 'variant'>> = ({
  size = 'md',
  className,
  label = 'Carregando...',
}) => {
  const sizeClasses = {
    xs: 'h-1 w-1',
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
    '2xl': 'h-6 w-6',
  }

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <div className={cn('bg-zinc-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
      <div className={cn('bg-zinc-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
      <div className={cn('bg-zinc-600 rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
      <span className='sr-only'>{label}</span>
    </div>
  )
}

export { LoadingSpinner, PulseSpinner, DotsSpinner, spinnerVariants }
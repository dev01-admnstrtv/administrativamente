'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default zinc/slate palette
        default:
          'border-transparent bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
        
        // Secondary light variant
        secondary:
          'border-transparent bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        
        // Outline variant
        outline: 
          'border border-zinc-200 bg-transparent text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800',
        
        // Premium glass effect
        glass:
          'border border-zinc-200/50 bg-white/80 backdrop-blur-sm text-zinc-900 hover:bg-white/90 dark:border-zinc-700/50 dark:bg-zinc-900/80 dark:text-zinc-100 dark:hover:bg-zinc-900/90',
        
        // Premium gradient
        premium:
          'border-transparent bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-50 shadow-premium hover:from-zinc-800 hover:to-zinc-700 hover:shadow-premium-lg dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900',
        
        // Semantic colors with improved contrast
        success:
          'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50',
          
        warning:
          'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50',
          
        error:
          'border-transparent bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50',
          
        info:
          'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50',
        
        // Category-specific colors for blog
        gestao:
          'border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50',
          
        lideranca:
          'border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/50',
          
        estrategia:
          'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50',
          
        tecnologia:
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs h-5',
        sm: 'px-2 py-0.5 text-xs h-6',
        md: 'px-2.5 py-1 text-xs h-7',
        lg: 'px-3 py-1 text-sm h-8',
        xl: 'px-4 py-1.5 text-sm h-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-98',
  {
    variants: {
      variant: {
        // Primary - Premium dark button (Apple-inspired)
        primary:
          'bg-zinc-900 text-zinc-50 shadow-premium hover:bg-zinc-800 hover:shadow-premium-lg dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
        
        // Secondary - Light subtle button
        secondary:
          'bg-zinc-100 text-zinc-900 shadow-premium hover:bg-zinc-200 hover:shadow-premium-lg dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
        
        // Ghost - Minimal hover state
        ghost:
          'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100',
        
        // Outline - Bordered button
        outline:
          'border border-zinc-200 bg-white text-zinc-900 shadow-premium hover:bg-zinc-50 hover:shadow-premium-lg dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900',
        
        // Link - Text-only button
        link: 'text-zinc-700 underline-offset-4 hover:underline hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100',
        
        // Premium variants
        premium:
          'bg-gradient-to-r from-zinc-900 to-zinc-800 text-zinc-50 shadow-premium-lg hover:shadow-premium-xl hover:from-zinc-800 hover:to-zinc-700 btn-premium dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900',
        
        // Destructive - For important actions
        destructive:
          'bg-red-600 text-white shadow-premium hover:bg-red-700 hover:shadow-premium-lg dark:bg-red-700 dark:hover:bg-red-600',
        
        // Success - For positive actions
        success:
          'bg-green-600 text-white shadow-premium hover:bg-green-700 hover:shadow-premium-lg dark:bg-green-700 dark:hover:bg-green-600',
        
        // Warning - For cautious actions
        warning:
          'bg-yellow-600 text-white shadow-premium hover:bg-yellow-700 hover:shadow-premium-lg dark:bg-yellow-700 dark:hover:bg-yellow-600',
      },
      size: {
        xs: 'h-7 px-2 text-xs font-medium',
        sm: 'h-8 px-3 text-sm font-medium',
        md: 'h-10 px-4 py-2 text-sm font-medium',
        lg: 'h-12 px-6 text-base font-medium',
        xl: 'h-14 px-8 text-lg font-medium',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

const inputVariants = cva(
  'flex w-full rounded-lg border bg-background text-sm transition-all duration-200 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-zinc-200 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-700 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20',
        premium:
          'border-zinc-200 bg-zinc-50/50 backdrop-blur-sm focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 focus:bg-background dark:border-zinc-700 dark:bg-zinc-900/50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500/20',
        ghost:
          'border-transparent bg-zinc-100/50 hover:bg-zinc-100 focus:bg-background focus:border-zinc-300 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 dark:focus:border-zinc-600',
        error:
          'border-red-300 bg-red-50/50 focus:border-red-400 focus:ring-2 focus:ring-red-400/20 dark:border-red-700 dark:bg-red-900/20 dark:focus:border-red-500',
        success:
          'border-green-300 bg-green-50/50 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 dark:border-green-700 dark:bg-green-900/20 dark:focus:border-green-500',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-3 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string
  helperText?: string
  floatingLabel?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helperText, 
    variant, 
    size, 
    id, 
    floatingLabel = false,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    ...props 
  }, ref) => {
    const inputId = id || React.useId()
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type

    const isFloatingActive = floatingLabel && (isFocused || hasValue || props.value || props.defaultValue)
    
    React.useEffect(() => {
      if (props.value !== undefined) {
        setHasValue(String(props.value).length > 0)
      }
    }, [props.value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }
    
    return (
      <div className='w-full'>
        <div className='relative'>
          {/* Left Icon */}
          {leftIcon && (
            <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            type={inputType}
            id={inputId}
            className={cn(
              inputVariants({ variant: error ? 'error' : variant, size }),
              leftIcon && 'pl-10',
              (rightIcon || showPasswordToggle) && 'pr-10',
              floatingLabel && label && 'pt-6 pb-2',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
            ref={ref}
            {...props}
          />

          {/* Floating Label */}
          {floatingLabel && label ? (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-3 transition-all duration-200 ease-out pointer-events-none text-muted-foreground',
                leftIcon && 'left-10',
                isFloatingActive
                  ? 'top-1 text-xs font-medium'
                  : 'top-1/2 -translate-y-1/2 text-sm'
              )}
            >
              {label}
            </label>
          ) : label ? (
            <label
              htmlFor={inputId}
              className='mb-2 block text-sm font-medium text-foreground'
            >
              {label}
            </label>
          ) : null}

          {/* Right Icon or Password Toggle */}
          {showPasswordToggle && type === 'password' ? (
            <button
              type="button"
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          ) : rightIcon ? (
            <div className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
              {rightIcon}
            </div>
          ) : null}
        </div>

        {/* Error Message */}
        {error && (
          <p className='mt-2 text-sm text-red-600 flex items-center gap-1' role='alert'>
            <span className="w-1 h-1 bg-red-600 rounded-full flex-shrink-0" />
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p className='mt-2 text-sm text-muted-foreground'>{helperText}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input, inputVariants }
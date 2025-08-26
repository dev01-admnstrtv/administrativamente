'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  className?: string
  overlayClassName?: string
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
  overlayClassName,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}) => {
  const [mounted, setMounted] = React.useState(false)

  // Handle mounting to avoid SSR issues
  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Handle escape key
  React.useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  // Handle body scroll lock
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full m-4',
  }

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in',
          overlayClassName
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full glass-card-premium rounded-xl shadow-premium-xl animate-scale-in',
            sizeClasses[size],
            className
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-description' : undefined}
        >
          {/* Close Button */}
          {showCloseButton && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full hover:bg-muted/80"
              onClick={onClose}
              aria-label="Fechar modal"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          {/* Header */}
          {(title || description) && (
            <div className="border-b border-border/20 px-6 py-4">
              {title && (
                <h2
                  id="modal-title"
                  className="text-headline-small font-serif text-foreground"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  className="mt-2 text-sm text-muted-foreground"
                >
                  {description}
                </p>
              )}
            </div>
          )}

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

// Modal sub-components
const ModalHeader: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('border-b border-border/20 px-6 py-4', className)}>
    {children}
  </div>
)

const ModalBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div className={cn('px-6 py-4 max-h-[70vh] overflow-y-auto', className)}>
    {children}
  </div>
)

const ModalFooter: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div 
    className={cn(
      'border-t border-border/20 px-6 py-4 flex items-center justify-end gap-3',
      className
    )}
  >
    {children}
  </div>
)

const ModalTitle: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <h2 className={cn('text-headline-small font-serif text-foreground', className)}>
    {children}
  </h2>
)

const ModalDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <p className={cn('text-sm text-muted-foreground', className)}>
    {children}
  </p>
)

export { Modal, ModalHeader, ModalBody, ModalFooter, ModalTitle, ModalDescription }
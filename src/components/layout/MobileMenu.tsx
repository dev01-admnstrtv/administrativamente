'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Home, Briefcase, Users, Target, Laptop, Mail, Moon, Sun, Monitor, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navigation = [
  { 
    name: 'Início', 
    href: '/', 
    description: 'Página inicial',
    icon: Home,
    color: 'text-blue-500'
  },
  { 
    name: 'Gestão', 
    href: '/category/gestao', 
    description: 'Processos e metodologias',
    icon: Briefcase,
    color: 'text-emerald-500'
  },
  { 
    name: 'Liderança', 
    href: '/category/lideranca', 
    description: 'Desenvolvimento de pessoas',
    icon: Users,
    color: 'text-orange-500'
  },
  { 
    name: 'Estratégia', 
    href: '/category/estrategia', 
    description: 'Planejamento e visão',
    icon: Target,
    color: 'text-purple-500'
  },
  { 
    name: 'Tecnologia', 
    href: '/category/tecnologia', 
    description: 'Transformação digital',
    icon: Laptop,
    color: 'text-cyan-500'
  },
] as const

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onSearchOpen: () => void
}

export function MobileMenu({ isOpen, onClose, onSearchOpen }: MobileMenuProps) {
  const pathname = usePathname()
  const menuRef = React.useRef<HTMLDivElement>(null)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)

  // Focus management
  React.useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus()
    }
  }, [isOpen])

  // Handle escape key, body scroll lock, and focus trap
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
        return
      }
      
      // Focus trap
      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, onClose])

  const handleSearchClick = () => {
    onClose()
    onSearchOpen()
  }

  const handleNewsletterClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile Menu Panel */}
      <div 
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-background/95 backdrop-blur-2xl border-l border-border/50 shadow-premium-xl z-50 lg:hidden animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação mobile"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-white shadow-premium transition-transform dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900">
                <span className="font-serif text-sm font-bold">A</span>
              </div>
              <div>
                <div className="font-serif text-lg font-bold leading-none">
                  Administrativa
                  <span className="text-muted-foreground font-normal">(mente)</span>
                </div>
              </div>
            </div>
            
            {/* Close Button */}
            <Button
              ref={closeButtonRef}
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full"
              aria-label="Fechar menu de navegação"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2" role="navigation" aria-label="Menu principal">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3">
                Navegação
              </div>
              
              {navigation.map((item, index) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/' && pathname.startsWith(item.href))
                const IconComponent = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-muted/50 active:scale-[0.98] animate-slide-up',
                      isActive 
                        ? 'bg-muted/80 text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 transition-colors',
                      isActive ? 'bg-white/10' : 'group-hover:bg-white/10',
                      item.color
                    )}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-foreground' : 'text-foreground/90 group-hover:text-foreground'
                      )}>
                        {item.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </div>
                    </div>
                    
                    {isActive && (
                      <div className="h-2 w-2 bg-foreground rounded-full animate-scale-up" />
                    )}
                  </Link>
                )
              })}
            </nav>
            
            {/* Actions Section */}
            <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4 px-3">
                Ações
              </div>
              
              {/* Search */}
              <button
                onClick={handleSearchClick}
                className="group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:bg-muted/50 active:scale-[0.98] w-full text-left animate-slide-up"
                style={{ animationDelay: '300ms' }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors text-blue-500">
                  <Search className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground/90 group-hover:text-foreground">
                    Buscar Conteúdo
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Encontre artigos e recursos
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <kbd className="px-2 py-1 text-xs bg-muted/50 rounded border border-border/50">
                    ⌘K
                  </kbd>
                </div>
              </button>

              {/* Theme Toggle */}
              <div className="group flex items-center gap-4 p-4 rounded-xl bg-muted/20 animate-slide-up" style={{ animationDelay: '350ms' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-amber-500">
                  <Sun className="h-5 w-5 dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:block" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-foreground">
                    Tema
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Personalizar aparência
                  </div>
                </div>
                
                <ThemeToggle variant="dropdown" showLabel />
              </div>
            </div>
          </div>
          
          {/* Footer CTA */}
          <div className="p-6 border-t border-border/50 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <Button
              asChild
              variant="premium"
              className="w-full h-12 text-sm font-medium shadow-premium"
            >
              <Link 
                href="/newsletter"
                onClick={handleNewsletterClick}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Newsletter Premium
              </Link>
            </Button>
            
            <div className="text-center mt-3">
              <p className="text-xs text-muted-foreground">
                Insights exclusivos toda semana
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
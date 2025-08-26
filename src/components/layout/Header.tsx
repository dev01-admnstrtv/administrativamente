'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, Command } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SearchOverlay } from './SearchOverlay'
import { MobileMenu } from './MobileMenu'

const navigation = [
  { name: 'Início', href: '/', description: 'Página inicial' },
  { name: 'Gestão', href: '/category/gestao', description: 'Processos e metodologias' },
  { name: 'Liderança', href: '/category/lideranca', description: 'Desenvolvimento de pessoas' },
  { name: 'Estratégia', href: '/category/estrategia', description: 'Planejamento e visão' },
  { name: 'Tecnologia', href: '/category/tecnologia', description: 'Transformação digital' },
] as const

interface HeaderProps {
  variant?: 'default' | 'transparent' | 'solid'
  className?: string
}

export function Header({ variant = 'default', className }: HeaderProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  // Handle scroll for dynamic header styling
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const headerClasses = cn(
    'sticky top-0 z-50 w-full transition-all duration-200 ease-out',
    {
      'border-b border-border/40 bg-background/80 backdrop-blur-xl': variant === 'default',
      'border-b border-transparent bg-transparent': variant === 'transparent' && !isScrolled,
      'border-b border-border/40 bg-background/95 backdrop-blur-xl shadow-sm': variant === 'transparent' && isScrolled,
      'border-b border-border bg-background shadow-sm': variant === 'solid',
    },
    className
  )

  return (
    <>
      <header className={headerClasses}>
        <div className='container flex h-16 items-center justify-between'>
          {/* Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              className='group flex items-center space-x-3 text-foreground transition-all hover:opacity-80'
            >
              {/* Logo Icon */}
              <div className='relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-700 shadow-premium transition-transform group-hover:scale-105 dark:from-zinc-100 dark:to-zinc-300 overflow-hidden'>
                <Image 
                  src="https://administrative.com.br/img/Lampada.png"
                  alt="Administrativa(mente) Logo"
                  width={30}
                  height={30}
                  className="object-contain"
                />
                <div className='absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100' />
              </div>
              
              {/* Logo Text */}
              <div className='block'>
                <div className='font-serif text-lg sm:text-xl font-bold leading-none'>
                  Administrativa
                  <span className='text-muted-foreground font-normal'>(mente)</span>
                </div>
                <div className='hidden sm:block text-xs text-muted-foreground font-medium tracking-wide'>
                  Premium Business Insights
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-1'>
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out',
                    'hover:bg-muted/50 hover:text-foreground',
                    isActive 
                      ? 'text-foreground bg-muted/30' 
                      : 'text-muted-foreground'
                  )}
                >
                  <span className='relative z-10'>{item.name}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-foreground rounded-full' />
                  )}
                  
                  {/* Tooltip */}
                  <div className='absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap dark:bg-zinc-100 dark:text-zinc-900'>
                    {item.description}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Actions */}
          <div className='flex items-center space-x-2'>
            {/* Search Button with Keyboard Shortcut */}
            <Button
              variant='ghost'
              onClick={() => setSearchOpen(true)}
              className='group hidden sm:inline-flex items-center gap-2 px-3 h-9 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all'
              aria-label='Abrir busca'
            >
              <Search className='h-4 w-4' />
              <span className='hidden md:inline'>Buscar</span>
              <div className='hidden lg:flex items-center gap-1 ml-auto'>
                <kbd className='px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50'>
                  <Command className='h-3 w-3' />
                </kbd>
                <kbd className='px-1.5 py-0.5 text-xs bg-muted/50 rounded border border-border/50'>
                  K
                </kbd>
              </div>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle variant="minimal" className="hidden sm:inline-flex" />

            {/* Newsletter CTA */}
            <Button
              asChild
              size='sm'
              variant='premium'
              className='hidden lg:inline-flex'
            >
              <Link href='/newsletter'>Newsletter</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant='ghost'
              size='icon'
              className='lg:hidden'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              <div className='relative'>
                <Menu className={cn(
                  'h-4 w-4 transition-all duration-200',
                  mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                )} />
                <X className={cn(
                  'absolute inset-0 h-4 w-4 transition-all duration-200',
                  mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                )} />
              </div>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSearchOpen={() => setSearchOpen(true)}
      />

      {/* Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
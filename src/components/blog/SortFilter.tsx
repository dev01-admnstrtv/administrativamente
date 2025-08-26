'use client'

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronDown, Calendar, TrendingUp, Clock, ArrowUpDown as SortAlpha } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const sortOptions = [
  { value: 'date', label: 'Mais Recentes', icon: Calendar, description: 'Ordenar por data de publicação' },
  { value: 'popularity', label: 'Mais Populares', icon: TrendingUp, description: 'Ordenar por número de visualizações' },
  { value: 'reading-time', label: 'Leitura Rápida', icon: Clock, description: 'Ordenar por tempo de leitura' },
  { value: 'alphabetical', label: 'A-Z', icon: SortAlpha, description: 'Ordenar por ordem alfabética' }
]

interface SortFilterProps {
  currentSort: string
  className?: string
}

export function SortFilter({ currentSort, className }: SortFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find(option => option.value === currentSort) || sortOptions[0]

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (sortValue === 'date') {
      params.delete('sort')
    } else {
      params.set('sort', sortValue)
    }
    
    // Reset to first page when changing sort
    params.delete('page')
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(newUrl)
    setIsOpen(false)
  }

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 justify-between min-w-[140px]"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center gap-2">
          <currentOption.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentOption.label}</span>
        </div>
        <ChevronDown className={cn(
          'h-4 w-4 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 z-50 mt-2 w-64 overflow-hidden rounded-lg border border-border bg-background shadow-premium-lg">
          <div className="p-2">
            <div className="mb-2 px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ordenar por
            </div>
            {sortOptions.map((option) => {
              const Icon = option.icon
              const isSelected = currentSort === option.value
              
              return (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={cn(
                    'w-full flex items-start gap-3 px-3 py-3 rounded-md text-left transition-all duration-200',
                    'hover:bg-muted/50 focus:bg-muted/50 focus:outline-none',
                    isSelected && 'bg-muted text-foreground shadow-sm'
                  )}
                >
                  <Icon className={cn(
                    'h-4 w-4 mt-0.5 shrink-0',
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  )} />
                  <div className="min-w-0 flex-1">
                    <div className={cn(
                      'font-medium text-sm',
                      isSelected ? 'text-foreground' : 'text-foreground'
                    )}>
                      {option.label}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
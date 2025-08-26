'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Grid3X3, List } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ViewToggleProps {
  currentView: string
  className?: string
}

export function ViewToggle({ currentView, className }: ViewToggleProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (view === 'grid') {
      params.delete('view')
    } else {
      params.set('view', view)
    }
    
    const queryString = params.toString()
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(newUrl)
  }

  return (
    <div className={cn('flex items-center rounded-lg border border-border bg-background p-1', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewChange('grid')}
        className={cn(
          'h-7 px-2 transition-all duration-200',
          currentView === 'grid'
            ? 'bg-muted text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        aria-label="Visualização em grade"
      >
        <Grid3X3 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleViewChange('list')}
        className={cn(
          'h-7 px-2 transition-all duration-200',
          currentView === 'list'
            ? 'bg-muted text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        )}
        aria-label="Visualização em lista"
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  )
}
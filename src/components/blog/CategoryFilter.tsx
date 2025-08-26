'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface Category {
  name: string
  slug: string
  count: number
}

interface CategoryFilterProps {
  categories: Category[]
  currentCategory: string
  className?: string
}

export function CategoryFilter({ categories, currentCategory, className }: CategoryFilterProps) {
  const pathname = usePathname()

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-sm font-medium text-muted-foreground mr-2">
        Categorias:
      </span>
      
      {categories.map((category) => {
        const isActive = currentCategory === category.slug
        const href = category.slug === 'all' ? '/posts' : `/category/${category.slug}`
        
        return (
          <Button
            key={category.slug}
            variant={isActive ? 'primary' : 'outline'}
            size="sm"
            asChild
            className={cn(
              'gap-2 transition-all duration-200',
              isActive && 'shadow-premium'
            )}
          >
            <Link href={href}>
              {category.name}
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs px-1.5 py-0.5 h-auto',
                  isActive 
                    ? 'bg-white/20 text-white border-white/30 dark:bg-black/20 dark:text-zinc-100 dark:border-black/30' 
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                )}
              >
                {category.count}
              </Badge>
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
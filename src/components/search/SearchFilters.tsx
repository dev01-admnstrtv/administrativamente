'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CalendarDays, TrendingUp, User, BookOpen, Hash, ArrowUpDown } from 'lucide-react'

interface SearchFiltersProps {
  categories: Array<{ name: string; count: number }>
  authors: Array<{ name: string; count: number }>
  selectedCategory: string
  selectedAuthor: string
  sortBy: string
  onCategoryChange: (category: string) => void
  onAuthorChange: (author: string) => void
  onSortChange: (sort: string) => void
}

export function SearchFilters({
  categories,
  authors,
  selectedCategory,
  selectedAuthor,
  sortBy,
  onCategoryChange,
  onAuthorChange,
  onSortChange
}: SearchFiltersProps) {
  
  const sortOptions = [
    { value: 'date', label: 'Mais recentes', icon: CalendarDays },
    { value: 'title', label: 'A-Z', icon: ArrowUpDown },
    { value: 'readingTime', label: 'Tempo de leitura', icon: TrendingUp },
  ]

  return (
    <Card className="mb-8 border-0 shadow-premium">
      <CardContent className="p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Categories Filter */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <BookOpen className="h-4 w-4" />
              Categorias
            </div>
            <div className="space-y-2">
              <Button
                variant={!selectedCategory ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onCategoryChange('')}
                className="h-8 w-full justify-start text-xs"
              >
                Todas as categorias
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant={selectedCategory === category.name ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onCategoryChange(
                    selectedCategory === category.name ? '' : category.name
                  )}
                  className="h-8 w-full justify-between text-xs"
                >
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Authors Filter */}
          {authors.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4" />
                Autores
              </div>
              <div className="space-y-2">
                <Button
                  variant={!selectedAuthor ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onAuthorChange('')}
                  className="h-8 w-full justify-start text-xs"
                >
                  Todos os autores
                </Button>
                {authors.map((author) => (
                  <Button
                    key={author.name}
                    variant={selectedAuthor === author.name ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onAuthorChange(
                      selectedAuthor === author.name ? '' : author.name
                    )}
                    className="h-8 w-full justify-between text-xs"
                  >
                    <span className="truncate">{author.name}</span>
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {author.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Sort Options */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
              <ArrowUpDown className="h-4 w-4" />
              Ordenar por
            </div>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={sortBy === option.value ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onSortChange(option.value)}
                  className="h-8 w-full justify-start gap-2 text-xs"
                >
                  <option.icon className="h-3 w-3" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-6 border-t border-border/40 pt-6">
          <div className="mb-3 text-sm font-semibold text-foreground">
            Filtros rápidos
          </div>
          <div className="flex flex-wrap gap-2">
            {['Últimos 30 dias', 'Mais populares', 'Leitura rápida (< 5 min)', 'Leitura longa (> 10 min)'].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => {
                  // TODO: Implement quick filters
                  console.log('Quick filter:', filter)
                }}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


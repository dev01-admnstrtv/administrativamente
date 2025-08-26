'use client'

import { useEffect, useState } from 'react'
import { Search, Clock, Hash, BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/Card'

interface SearchAutocompleteProps {
  suggestions: string[]
  query: string
  onSelect: (suggestion: string) => void
}

export function SearchAutocomplete({ suggestions, query, onSelect }: SearchAutocompleteProps) {
  const [hoveredIndex, setHoveredIndex] = useState(-1)

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHoveredIndex((prev) => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHoveredIndex((prev) => prev > 0 ? prev - 1 : -1)
      } else if (e.key === 'Enter' && hoveredIndex >= 0) {
        e.preventDefault()
        onSelect(suggestions[hoveredIndex])
      } else if (e.key === 'Escape') {
        setHoveredIndex(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [suggestions, hoveredIndex, onSelect])

  if (suggestions.length === 0) {
    return null
  }

  // Get suggestion type based on content
  const getSuggestionType = (suggestion: string) => {
    const categories = ['Gestão', 'Liderança', 'Estratégia', 'Tecnologia', 'Pessoas', 'Processos']
    if (categories.includes(suggestion)) {
      return { icon: BookOpen, label: 'Categoria' }
    }
    if (suggestion.length <= 15 && !suggestion.includes(' ')) {
      return { icon: Hash, label: 'Tag' }
    }
    return { icon: Search, label: 'Termo' }
  }

  // Highlight matching part of suggestion
  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase())
    if (index === -1) return text

    const before = text.slice(0, index)
    const match = text.slice(index, index + query.length)
    const after = text.slice(index + query.length)

    return (
      <>
        {before}
        <span className="bg-primary/20 text-primary font-medium">{match}</span>
        {after}
      </>
    )
  }

  return (
    <Card className="absolute top-full left-0 right-0 z-50 mt-2 border-0 shadow-premium-lg">
      <div className="max-h-80 overflow-y-auto p-2">
        {suggestions.map((suggestion, index) => {
          const { icon: Icon, label } = getSuggestionType(suggestion)
          const isHovered = index === hoveredIndex

          return (
            <button
              key={suggestion}
              onClick={() => onSelect(suggestion)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(-1)}
              className={`
                flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors
                ${isHovered 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-foreground hover:bg-accent/50'
                }
              `}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {highlightMatch(suggestion, query)}
                </div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>

              {/* Recent search indicator */}
              <Clock className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
            </button>
          )
        })}

        {/* Footer */}
        <div className="border-t border-border/40 mt-2 pt-2 px-3 pb-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Use ↑↓ para navegar, Enter para selecionar</span>
            <span>Esc para fechar</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
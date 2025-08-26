'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Search, X, TrendingUp, Clock, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
  title: string
  excerpt: string
  category: string
  url: string
  type: 'post' | 'category' | 'author'
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'trending' | 'tag'
  count?: number
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Enhanced search suggestions with categorization
  const trendingSuggestions: SearchSuggestion[] = [
    { id: 't1', text: 'gestão de equipes remotas', type: 'trending', count: 287 },
    { id: 't2', text: 'liderança transformacional', type: 'trending', count: 195 },
    { id: 't3', text: 'metodologias ágeis', type: 'trending', count: 156 },
    { id: 't4', text: 'inteligência emocional', type: 'trending', count: 143 },
  ]

  const recentSuggestions: SearchSuggestion[] = [
    { id: 'r1', text: 'transformação digital empresarial', type: 'recent' },
    { id: 'r2', text: 'cultura de inovação', type: 'recent' },
    { id: 'r3', text: 'feedback contínuo', type: 'recent' },
    { id: 'r4', text: 'gestão de mudanças', type: 'recent' },
  ]

  const topicSuggestions: SearchSuggestion[] = [
    { id: 'topic1', text: 'estratégia', type: 'tag', count: 89 },
    { id: 'topic2', text: 'produtividade', type: 'tag', count: 67 },
    { id: 'topic3', text: 'liderança', type: 'tag', count: 124 },
    { id: 'topic4', text: 'gestão', type: 'tag', count: 203 },
  ]

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Como Implementar Gestão por Objetivos (OKRs) em Startups',
      excerpt: 'Guia completo para implementar OKRs de forma eficiente em empresas em crescimento...',
      category: 'Estratégia',
      url: '/post/okrs-startups',
      type: 'post'
    },
    {
      id: '2',
      title: 'Liderança Adaptativa: Navegando em Tempos de Incerteza',
      excerpt: 'Como desenvolver as habilidades de liderança necessárias para guiar equipes...',
      category: 'Liderança',
      url: '/post/lideranca-adaptativa',
      type: 'post'
    },
    {
      id: '3',
      title: 'Transformação Digital na Gestão Empresarial',
      excerpt: 'Estratégias para digitalizar processos e modernizar a gestão corporativa...',
      category: 'Tecnologia',
      url: '/post/transformacao-digital',
      type: 'post'
    },
  ]

  // Handle mounting for SSR
  React.useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Focus input when overlay opens
  React.useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    const performSearch = async () => {
      try {
        const params = new URLSearchParams({
          q: query,
          limit: '5' // Limit results for overlay
        })
        
        const response = await fetch(`/api/search?${params.toString()}`)
        const data = await response.json()
        
        if (data.posts) {
          const formattedResults: SearchResult[] = data.posts.map((post: any) => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            category: post.category?.name || 'Artigo',
            url: `/post/${post.slug}`,
            type: 'post' as const
          }))
          setResults(formattedResults)
        }
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }
    
    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      
      if (e.key === 'Escape') {
        onClose()
      }
      
      if (e.key === 'Enter' && query.trim()) {
        // Navigate to full search page
        onClose()
        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
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
  }, [isOpen, onClose, query])

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    // Close overlay and navigate to search page with query
    onClose()
    window.location.href = `/search?q=${encodeURIComponent(suggestion.text)}`
  }

  const handleResultClick = (result: SearchResult) => {
    // Close overlay first
    onClose()
    // Navigate to result
    window.location.href = result.url
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'trending':
        return <TrendingUp className="h-3 w-3" />
      case 'recent':
        return <Clock className="h-3 w-3" />
      case 'tag':
        return <Hash className="h-3 w-3" />
      default:
        return <Search className="h-3 w-3" />
    }
  }

  const getBadgeVariant = (category: string) => {
    switch (category.toLowerCase()) {
      case 'gestão':
        return 'gestao' as const
      case 'liderança':
        return 'lideranca' as const
      case 'estratégia':
        return 'estrategia' as const
      case 'tecnologia':
        return 'tecnologia' as const
      default:
        return 'default' as const
    }
  }

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* Premium Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 pointer-events-none animate-fade-in" />

      {/* Search Container */}
      <div className="relative flex flex-col w-full max-w-2xl mx-auto mt-8 sm:mt-16 px-4 animate-scale-fade-up">
        {/* Search Input */}
        <div className="glass-card-premium rounded-2xl p-4 sm:p-6 shadow-premium-xl border border-white/10 backdrop-blur-2xl bg-white/5 dark:bg-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar artigos, categorias..."
              className="pl-12 pr-12 h-12 sm:h-14 text-base sm:text-lg border-0 bg-transparent focus:ring-0 focus:border-0"
              autoComplete="off"
            />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="flex justify-between items-center mt-3 sm:mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Digite para buscar</span>
              <span className="sm:hidden">Buscar conteúdo</span>
              {query.trim() && (
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Enter</kbd>
                  <span className="hidden sm:inline text-xs">para ver todos</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-muted rounded text-xs">Esc</kbd>
              <span className="hidden sm:inline">para fechar</span>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <div className="mt-3 sm:mt-4 max-h-[60vh] sm:max-h-96 overflow-y-auto animate-slide-up-delay">
          {!query.trim() ? (
            /* Suggestions */
            <div className="glass-card-premium rounded-2xl p-4 sm:p-6 shadow-premium-xl border border-white/10 backdrop-blur-2xl bg-white/5 dark:bg-white/5">
              <div className="space-y-6">
                {/* Trending Searches */}
                <div className="animate-slide-up">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    <h3 className="text-sm font-medium text-foreground">
                      Tendências
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {trendingSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-2 sm:gap-3 w-full p-2 sm:p-3 rounded-lg text-left hover:bg-white/5 hover:backdrop-blur-sm transition-all duration-200 group animate-slide-up active:scale-95"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="text-orange-500/70 group-hover:text-orange-500 transition-colors">
                          <TrendingUp className="h-3.5 w-3.5" />
                        </div>
                        
                        <span className="flex-1 text-sm sm:text-sm text-foreground/90 group-hover:text-foreground">
                          {suggestion.text}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            {suggestion.count}
                          </span>
                          <div className="w-1 h-1 bg-orange-500 rounded-full opacity-60" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <h3 className="text-sm font-medium text-foreground">
                      Recentes
                    </h3>
                  </div>
                  <div className="space-y-1">
                    {recentSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center gap-2 sm:gap-3 w-full p-2 sm:p-3 rounded-lg text-left hover:bg-white/5 hover:backdrop-blur-sm transition-all duration-200 group animate-slide-up active:scale-95"
                        style={{ animationDelay: `${250 + index * 50}ms` }}
                      >
                        <div className="text-blue-500/70 group-hover:text-blue-500 transition-colors">
                          <Clock className="h-3.5 w-3.5" />
                        </div>
                        
                        <span className="flex-1 text-sm sm:text-sm text-foreground/90 group-hover:text-foreground">
                          {suggestion.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Topics */}
                <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Hash className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-medium text-foreground">
                      Tópicos Populares
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {topicSuggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group animate-scale-up active:scale-95"
                        style={{ animationDelay: `${450 + index * 75}ms` }}
                      >
                        <Hash className="h-3 w-3 text-purple-500/70 group-hover:text-purple-500" />
                        <span className="text-sm text-foreground/90 group-hover:text-foreground">
                          {suggestion.text}
                        </span>
                        <span className="text-xs text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded-full">
                          {suggestion.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Search Results */
            <div className="glass-card-premium rounded-2xl p-4 sm:p-6 shadow-premium-xl border border-white/10 backdrop-blur-2xl bg-white/5 dark:bg-white/5">
              {isSearching ? (
                <div className="flex items-center justify-center py-6 sm:py-8">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-4 h-4 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Buscando...
                    </span>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-foreground">
                      Resultados da busca
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className="w-full p-3 sm:p-4 rounded-lg text-left hover:bg-white/5 transition-all duration-200 group border border-transparent hover:border-white/20 active:scale-[0.98]"
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge 
                                variant={getBadgeVariant(result.category)}
                                size="sm"
                                className="text-xs"
                              >
                                {result.category}
                              </Badge>
                            </div>
                            
                            <h4 className="font-medium text-sm sm:text-base text-foreground group-hover:text-accent-foreground transition-colors line-clamp-2 mb-1">
                              {result.title}
                            </h4>
                            
                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-2">
                              {result.excerpt}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* View All Results Button */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <Button
                      variant="ghost"
                      className="w-full justify-center gap-2 text-sm"
                      onClick={() => {
                        onClose()
                        window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
                      }}
                    >
                      Ver todos os resultados
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    Nenhum resultado encontrado
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Tente buscar por outros termos
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
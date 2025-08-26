'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, Filter, X, Clock, Calendar, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SearchResults } from './SearchResults'
import { SearchFilters } from './SearchFilters'
import { SearchAutocomplete } from './SearchAutocomplete'
import { useDebounce } from '@/lib/hooks/useDebounce'

export interface SearchResponse {
  posts: any[]
  query: string
  total: number
  hasMore: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  filters: {
    categories: Array<{ name: string; count: number }>
    authors: Array<{ name: string; count: number }>
  }
  suggestions: string[]
}

export function SearchPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || '')
  const [selectedAuthor, setSelectedAuthor] = useState(searchParams?.get('author') || '')
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'date')
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams?.get('page') || '1'))
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  const debouncedQuery = useDebounce(searchQuery, 300)

  // Update URL with search parameters
  const updateSearchParams = useCallback((params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams?.toString())
    
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value)
      } else {
        newSearchParams.delete(key)
      }
    })

    router.push(`${pathname}?${newSearchParams.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  // Perform search
  const performSearch = useCallback(async (
    query: string,
    category?: string,
    author?: string,
    sort?: string,
    page?: number
  ) => {
    if (!query.trim()) {
      setSearchResults(null)
      return
    }

    setIsLoading(true)
    
    try {
      const params = new URLSearchParams({
        q: query,
        page: (page || 1).toString(),
        limit: '12',
        ...(category && { category }),
        ...(author && { author }),
        ...(sort && { sort })
      })

      const response = await fetch(`/api/search?${params.toString()}`)
      const data: SearchResponse = await response.json()
      
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Effect for search when query changes
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, selectedCategory, selectedAuthor, sortBy, 1)
      setCurrentPage(1)
      updateSearchParams({
        q: debouncedQuery,
        category: selectedCategory,
        author: selectedAuthor,
        sort: sortBy,
        page: '1'
      })
    }
  }, [debouncedQuery, selectedCategory, selectedAuthor, sortBy, performSearch, updateSearchParams])

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handleAuthorChange = (author: string) => {
    setSelectedAuthor(author)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    performSearch(debouncedQuery, selectedCategory, selectedAuthor, sortBy, page)
    updateSearchParams({
      q: debouncedQuery,
      category: selectedCategory,
      author: selectedAuthor,
      sort: sortBy,
      page: page.toString()
    })
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setSelectedAuthor('')
    setSortBy('date')
    setCurrentPage(1)
  }

  const activeFiltersCount = [selectedCategory, selectedAuthor].filter(Boolean).length

  return (
    <div className="container px-4 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold text-foreground lg:text-5xl">
            Buscar Artigos
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre insights sobre gestão, liderança, estratégia e muito mais
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8 border-0 shadow-premium">
          <CardContent className="p-6">
            {/* Search Input */}
            <div className="relative mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Digite sua busca... (ex: liderança, gestão, KPIs)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 200)}
                  className="h-12 pl-12 pr-4 text-base"
                />
              </div>
              
              {/* Autocomplete */}
              {showAutocomplete && searchQuery && searchResults?.suggestions && (
                <SearchAutocomplete
                  suggestions={searchResults.suggestions}
                  query={searchQuery}
                  onSelect={(suggestion) => {
                    setSearchQuery(suggestion)
                    setShowAutocomplete(false)
                  }}
                />
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1 h-5 min-w-5 px-1 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>

              {/* Active Filters */}
              {selectedCategory && (
                <Badge variant="secondary" className="gap-1 px-2 py-1">
                  {selectedCategory}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-foreground"
                    onClick={() => handleCategoryChange('')}
                  />
                </Badge>
              )}

              {selectedAuthor && (
                <Badge variant="secondary" className="gap-1 px-2 py-1">
                  {selectedAuthor}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-foreground"
                    onClick={() => handleAuthorChange('')}
                  />
                </Badge>
              )}

              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Limpar filtros
                </Button>
              )}

              {/* Results Count */}
              {searchResults && searchQuery && (
                <div className="ml-auto text-sm text-muted-foreground">
                  {searchResults.total} {searchResults.total === 1 ? 'resultado' : 'resultados'} 
                  para "{searchQuery}"
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        {showFilters && searchResults && (
          <SearchFilters
            categories={searchResults.filters.categories}
            authors={searchResults.filters.authors}
            selectedCategory={selectedCategory}
            selectedAuthor={selectedAuthor}
            sortBy={sortBy}
            onCategoryChange={handleCategoryChange}
            onAuthorChange={handleAuthorChange}
            onSortChange={handleSortChange}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults && (
          <SearchResults
            results={searchResults}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}

        {/* Empty State */}
        {!isLoading && !searchResults && searchQuery && (
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Nenhum resultado encontrado</h3>
            <p className="mb-6 text-muted-foreground">
              Tente ajustar sua busca ou usar termos diferentes
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Limpar busca
            </Button>
          </div>
        )}

        {/* Initial State - Popular Topics */}
        {!isLoading && !searchQuery && (
          <div className="py-8">
            <h3 className="mb-6 text-xl font-semibold">Tópicos populares</h3>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {[
                { name: 'Liderança', icon: TrendingUp, count: '18 artigos' },
                { name: 'Gestão', icon: Calendar, count: '24 artigos' },
                { name: 'Estratégia', icon: Clock, count: '15 artigos' },
              ].map((topic) => (
                <Button
                  key={topic.name}
                  variant="ghost"
                  className="h-auto justify-between p-4 text-left"
                  onClick={() => setSearchQuery(topic.name)}
                >
                  <div className="flex items-center gap-3">
                    <topic.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-semibold">{topic.name}</div>
                      <div className="text-sm text-muted-foreground">{topic.count}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
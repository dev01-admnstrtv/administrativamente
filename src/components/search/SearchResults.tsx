'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Clock, Calendar, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import type { SearchResponse } from './SearchPageContent'

interface SearchResultsProps {
  results: SearchResponse
  currentPage: number
  onPageChange: (page: number) => void
}

export function SearchResults({ results, currentPage, onPageChange }: SearchResultsProps) {
  const { posts, pagination } = results

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="mb-2 text-xl font-semibold">Nenhum resultado encontrado</h3>
        <p className="text-muted-foreground">
          Tente usar termos diferentes ou remover alguns filtros
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Results Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="group cursor-pointer overflow-hidden border-0 p-0 shadow-premium transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
          >
            <Link href={`/post/${post.slug}`}>
              {/* Featured Image */}
              <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                {post.featuredImage ? (
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={400}
                    height={250}
                    className="aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[16/10] flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="mb-1 text-2xl">
                        {post.category?.name === 'Liderança' && '👥'}
                        {post.category?.name === 'Gestão' && '⚙️'}
                        {post.category?.name === 'Estratégia' && '🎯'}
                        {post.category?.name === 'Pessoas' && '🤝'}
                        {post.category?.name === 'Tecnologia' && '💻'}
                        {(!post.category?.name || 
                          !['Liderança', 'Gestão', 'Estratégia', 'Pessoas', 'Tecnologia'].includes(post.category.name)
                        ) && '📄'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Meta */}
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {post.category?.name || 'Artigo'}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-serif text-lg font-bold leading-tight text-foreground line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Author & Date */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                    <span>{post.author?.name || 'Administrativa(mente)'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.publishedAt)}
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
            hasNext={pagination.hasNext}
            hasPrevious={pagination.hasPrevious}
          />
        </div>
      )}

      {/* Results Summary */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        Mostrando {posts.length} de {pagination.total} resultados
        {pagination.totalPages > 1 && (
          <> • Página {currentPage} de {pagination.totalPages}</>
        )}
      </div>
    </div>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  hasNext: boolean
  hasPrevious: boolean
}

function Pagination({ currentPage, totalPages, onPageChange, hasNext, hasPrevious }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  return (
    <div className="flex items-center gap-1">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevious}
        className="gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        Anterior
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1 mx-4">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <div className="flex items-center justify-center w-8 h-8">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="gap-1"
      >
        Próxima
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
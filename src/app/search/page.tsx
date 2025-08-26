import { Metadata } from 'next'
import { Suspense } from 'react'
import { SearchPageContent } from '@/components/search/SearchPageContent'

export const metadata: Metadata = {
  title: 'Buscar | Administrativa(mente)',
  description: 'Encontre artigos sobre gestão, liderança, estratégia e muito mais. Sistema de busca avançado com filtros.',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<SearchPageSkeleton />}>
        <SearchPageContent />
      </Suspense>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Search Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 h-12 w-64 rounded-lg bg-muted animate-pulse" />
          <div className="mx-auto h-4 w-96 rounded bg-muted animate-pulse" />
        </div>

        {/* Search Form Skeleton */}
        <div className="mb-8 rounded-2xl bg-card p-6 shadow-premium">
          <div className="mb-4 h-12 w-full rounded-lg bg-muted animate-pulse" />
          <div className="flex gap-4">
            <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
            <div className="h-10 w-32 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>

        {/* Results Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card p-6 shadow-premium">
              <div className="mb-4 aspect-[16/10] rounded-lg bg-muted animate-pulse" />
              <div className="mb-3 flex items-center gap-2">
                <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
                <div className="h-4 w-16 rounded bg-muted animate-pulse" />
              </div>
              <div className="mb-3 h-6 w-full rounded bg-muted animate-pulse" />
              <div className="mb-4 h-4 w-full rounded bg-muted animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                <div>
                  <div className="mb-1 h-4 w-20 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-16 rounded bg-muted animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
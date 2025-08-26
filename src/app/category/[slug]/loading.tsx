import { Skeleton } from '@/components/ui/Skeleton'

export default function CategoryLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-20" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8" />
                <div>
                  <Skeleton className="h-6 w-24 mb-1" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <Skeleton className="h-9 w-9 sm:hidden" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 py-16 dark:from-zinc-950 dark:to-zinc-900/50">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Skeleton className="mx-auto mb-6 h-16 w-16 rounded-full" />
            <Skeleton className="mx-auto mb-4 h-12 w-64" />
            <div className="mx-auto mb-8 space-y-2">
              <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
              <Skeleton className="h-6 w-3/4 max-w-xl mx-auto" />
            </div>
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="border-b border-border/40 bg-white/50 py-6 dark:bg-zinc-950/50">
        <div className="container px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-20" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
            
            {/* Search and Controls */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-64 hidden sm:block" />
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-white p-0 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
                {/* Image */}
                <Skeleton className="aspect-[16/10] w-full rounded-t-xl" />
                
                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Tags */}
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  
                  {/* Title */}
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  
                  {/* Excerpt */}
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <div className="flex gap-3">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  
                  {/* Read more */}
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-center gap-2">
            <Skeleton className="h-9 w-20" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-9" />
              ))}
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
      </section>
    </div>
  )
}
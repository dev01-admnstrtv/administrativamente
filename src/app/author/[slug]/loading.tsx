import { Skeleton } from '@/components/ui/Skeleton'

export default function AuthorLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-40" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 py-16 dark:from-zinc-950 dark:to-zinc-900/50 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              {/* Author Info */}
              <div className="lg:col-span-2">
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <Skeleton className="h-32 w-32 shrink-0 rounded-2xl sm:h-40 sm:w-40" />
                    <Skeleton className="absolute -bottom-3 -right-3 h-9 w-9 rounded-full" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <Skeleton className="h-10 w-64 mb-2" />
                      <Skeleton className="h-6 w-48 mb-1" />
                      <Skeleton className="h-5 w-40" />
                    </div>

                    {/* Location and Join Date */}
                    <div className="mb-6 flex flex-wrap items-center gap-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    {/* Bio */}
                    <div className="mb-6 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Expertise */}
                    <div className="mb-6">
                      <Skeleton className="h-5 w-24 mb-3" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-18" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-3">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Achievements */}
              <div className="space-y-6">
                {/* Stats Card */}
                <div className="rounded-xl border bg-white p-6 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="mb-4">
                    <Skeleton className="h-6 w-28" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-8 w-12 mx-auto mb-1" />
                        <Skeleton className="h-3 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="rounded-xl border bg-white p-6 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="mb-4">
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="mt-1 h-2 w-2 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div className="rounded-xl border bg-white p-6 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="mb-4">
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Skeleton className="mt-1 h-2 w-2 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <Skeleton className="h-10 w-48 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-16" />
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
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
        </div>
      </section>
    </div>
  )
}
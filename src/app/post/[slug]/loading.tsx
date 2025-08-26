import { Skeleton } from '@/components/ui/Skeleton'

export default function PostLoading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-4 w-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 py-16 dark:from-zinc-950 dark:to-zinc-900/50 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl">
            {/* Tags */}
            <div className="mb-6 flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-18" />
            </div>

            {/* Title */}
            <div className="mb-6 space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-3/4" />
            </div>

            {/* Excerpt */}
            <div className="mb-8 space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>

            {/* Meta Info */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                
                {/* Date */}
                <div className="hidden sm:block">
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            {/* Featured Image */}
            <Skeleton className="mb-12 aspect-[16/9] w-full rounded-2xl" />

            {/* Article Content */}
            <div className="space-y-6">
              {/* Paragraph */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Heading */}
              <Skeleton className="h-8 w-2/3" />

              {/* Paragraph */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>

              {/* Subheading */}
              <Skeleton className="h-6 w-1/2" />

              {/* Paragraph */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              {/* Quote */}
              <div className="border-l-4 border-zinc-300 bg-zinc-50/50 py-4 px-6 rounded-r-lg dark:border-zinc-700 dark:bg-zinc-900/50">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3 mt-3" />
                </div>
              </div>

              {/* List */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* More paragraphs */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio */}
      <section className="border-t border-border/40 bg-zinc-50/50 py-16 dark:bg-zinc-950/50">
        <div className="container px-4">
          <div className="mx-auto max-w-3xl">
            <div className="rounded-xl border bg-white p-8 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                <Skeleton className="h-20 w-20 rounded-full shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="mb-12 text-center">
              <Skeleton className="mx-auto mb-4 h-8 w-48" />
              <Skeleton className="mx-auto h-4 w-64" />
            </div>

            {/* Posts Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border bg-white p-0 shadow-premium dark:bg-zinc-900 dark:border-zinc-800">
                  <Skeleton className="aspect-[16/10] w-full rounded-t-xl" />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-5 w-3/4" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-6 rounded-full" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
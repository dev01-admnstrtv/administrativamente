import Link from 'next/link'
import { ArrowRight, Clock, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface RelatedPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: {
    name: string
  }
  publishedAt: string
  readTime: number
  slug: string
}

interface RelatedPostsProps {
  posts: RelatedPost[]
  title?: string
  className?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    month: 'short',
    day: 'numeric'
  })
}

function getCategoryEmoji(category: string) {
  const emojiMap: Record<string, string> = {
    'Liderança': '👥',
    'Gestão': '⚙️',
    'Estratégia': '🎯',
    'Pessoas': '🤝',
    'Tecnologia': '💻',
    'Processos': '🔄'
  }
  return emojiMap[category] || '📄'
}

export function RelatedPosts({ 
  posts, 
  title = "Artigos Relacionados",
  className = "" 
}: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <section className={`py-16 lg:py-24 ${className}`}>
      <div className="container px-4">
        <div className="mx-auto max-w-6xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
              {title}
            </h2>
            <p className="mt-4 text-muted-foreground lg:text-lg">
              Continue expandindo seu conhecimento com estes insights exclusivos
            </p>
          </div>

          {/* Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card 
                key={post.id}
                variant="default" 
                className="group cursor-pointer overflow-hidden border-0 p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-lg"
              >
                <Link href={`/post/${post.slug}`}>
                  {/* Image Placeholder */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <div className="mb-1 text-3xl">
                          {getCategoryEmoji(post.category)}
                        </div>
                      </div>
                    </div>
                    <div className="aspect-[16/10]" />
                    
                    {/* Overlay with category */}
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="mb-3 font-serif text-lg font-bold leading-tight text-foreground line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                        <div className="text-xs text-muted-foreground">
                          {post.author.name}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readTime} min
                        </div>
                      </div>
                    </div>

                    {/* Read More Indicator */}
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                      Ler artigo
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* View All Posts CTA */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/posts" className="gap-2">
                Ver Todos os Artigos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
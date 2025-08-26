import Link from 'next/link'
import { Clock, Calendar, Eye, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface PostCardProps {
  post: {
    id: string
    title: string
    excerpt: string
    category: string
    author: {
      name: string
      avatar: string
      role?: string
    }
    publishedAt: string
    readTime: number
    image: string
    slug: string
    tags: string[]
    views?: number
    featured?: boolean
  }
  variant?: 'default' | 'horizontal' | 'compact'
  className?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
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

function formatViews(views?: number) {
  if (!views) return '0'
  if (views < 1000) return views.toString()
  return `${(views / 1000).toFixed(1)}k`
}

export function PostCard({ post, variant = 'default', className }: PostCardProps) {
  if (variant === 'horizontal') {
    return (
      <Card className={cn(
        'group cursor-pointer overflow-hidden border-0 p-0 transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1',
        className
      )}>
        <Link href={`/post/${post.slug}`}>
          <div className="flex flex-col gap-0 sm:flex-row">
            {/* Image */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 sm:w-80 sm:shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="mb-1 text-3xl">
                    {getCategoryEmoji(post.category)}
                  </div>
                </div>
              </div>
              <div className="aspect-[16/10] sm:aspect-[4/3]" />
              
              {/* Featured Badge */}
              {post.featured && (
                <div className="absolute top-4 left-4">
                  <Badge variant="premium" className="text-xs">
                    ⭐ Em destaque
                  </Badge>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="flex flex-col justify-center p-6 sm:p-8 flex-1">
              {/* Tags */}
              <div className="mb-3 flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h3 className="mb-3 font-serif text-xl font-bold leading-tight text-foreground group-hover:text-zinc-600 dark:group-hover:text-zinc-300 lg:text-2xl">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="mb-4 text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                  <span>{post.author.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.publishedAt)}
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readTime} min
                </div>
                
                {post.views && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {formatViews(post.views)}
                  </div>
                )}
              </div>

              {/* Read More */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                Ler artigo completo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={cn(
        'group cursor-pointer border-0 p-4 transition-all duration-300 hover:bg-muted/50',
        className
      )}>
        <Link href={`/post/${post.slug}`}>
          <div className="flex items-start gap-4">
            {/* Small Image */}
            <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-lg w-16 h-16 shrink-0">
              <div className="absolute inset-0 flex items-center justify-center text-lg">
                {getCategoryEmoji(post.category)}
              </div>
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <h4 className="font-serif font-semibold leading-tight text-foreground group-hover:text-zinc-600 dark:group-hover:text-zinc-300 line-clamp-2 mb-1">
                {post.title}
              </h4>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{post.author.name}</span>
                <span>•</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>•</span>
                <span>{post.readTime} min</span>
              </div>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  // Default grid variant
  return (
    <Card className={cn(
      'group cursor-pointer overflow-hidden border-0 p-0 transition-all duration-300 hover:-translate-y-2 hover:shadow-premium-lg',
      className
    )}>
      <Link href={`/post/${post.slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="mb-1 text-3xl">
                {getCategoryEmoji(post.category)}
              </div>
            </div>
          </div>
          <div className="aspect-[16/10]" />
          
          {/* Featured Badge */}
          {post.featured && (
            <div className="absolute top-4 left-4">
              <Badge variant="premium" className="text-xs">
                ⭐ Destaque
              </Badge>
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="text-xs">
              {post.category}
            </Badge>
          </div>
          
          {/* Views Badge */}
          {post.views && (
            <div className="absolute bottom-4 right-4">
              <Badge variant="outline" className="text-xs bg-white/90 dark:bg-zinc-900/90">
                <Eye className="h-3 w-3 mr-1" />
                {formatViews(post.views)}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6">
          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

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
  )
}
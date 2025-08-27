import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Users, Target, Clock, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { getFeaturedPosts, getRecentPosts, getCategoryStats } from '@/lib/notion/posts'
import { transformNotionPost } from '@/lib/notion/transforms'

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function HomePage() {
  // Fetch real data from Notion
  const [featuredPostsRaw, recentPostsRaw, categoryStats] = await Promise.all([
    getFeaturedPosts(1),
    getRecentPosts(6),
    getCategoryStats()
  ])

  // Transform Notion data to BlogPost format
  const featuredPosts = featuredPostsRaw.map(post => transformNotionPost(post))
  const recentPosts = recentPostsRaw.map(post => transformNotionPost(post))

  const featuredPost = featuredPosts[0]
  const categories = categoryStats.map(cat => ({
    name: cat.name,
    count: cat.count,
    icon: cat.name === 'Gestão' ? Target : 
          cat.name === 'Liderança' ? Users :
          cat.name === 'Estratégia' ? TrendingUp : ArrowUpRight,
    color: cat.name === 'Gestão' ? 'blue' : 
           cat.name === 'Liderança' ? 'purple' :
           cat.name === 'Estratégia' ? 'green' : 'orange'
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100/50 dark:from-zinc-950 dark:to-zinc-900/50">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-zinc-100/20 to-zinc-200/30 dark:via-zinc-800/20 dark:to-zinc-700/30" />
        
        <div className="container relative px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Premium Badge */}
            <div className="mb-8 flex justify-center">
              <Badge variant="premium" className="px-4 py-2 text-sm font-medium">
                ✨ Premium Business Insights
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-6xl xl:text-7xl">
              Transforme sua
              <span className="relative mx-3 text-zinc-600 dark:text-zinc-400">
                gestão
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-zinc-900/20 to-zinc-600/20 dark:from-zinc-100/20 dark:to-zinc-400/20" />
              </span>
              em vantagem competitiva
            </h1>

            {/* Subtitle */}
            <p className="mb-10 text-lg leading-relaxed text-muted-foreground lg:text-xl">
              Insights estratégicos, metodologias comprovadas e ferramentas práticas 
              para líderes que buscam excelência operacional e resultados extraordinários.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="premium"
                className="group h-14 px-8 text-base font-semibold"
                asChild
              >
                <Link href="/newsletter">
                  Receber Insights Exclusivos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base"
                asChild
              >
                <Link href="#featured">
                  Explorar Conteúdo
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <div key={category.name} className="text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white/50 shadow-premium dark:bg-zinc-900/50">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="font-serif text-2xl font-bold text-foreground lg:text-3xl">
                      {category.count}+
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Artigos {category.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Post Section */}
      {featuredPost && (
        <section id="featured" className="py-16 lg:py-24">
          <div className="container px-4">
            <div className="mb-12 text-center">
              <Badge variant="outline" className="mb-4">
                Em Destaque
              </Badge>
              <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
                Leitura Essencial
              </h2>
            </div>

            <Card variant="premium" className="group cursor-pointer overflow-hidden border-0 p-0 shadow-premium-xl hover:-translate-y-2 hover:shadow-premium-xl">
              <Link href={`/post/${featuredPost.slug}`}>
                <div className="grid gap-0 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    {featuredPost.featuredImage ? (
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="mb-2 text-4xl">📊</div>
                          <div className="text-sm">Imagem em breve</div>
                        </div>
                      </div>
                    )}
                    <div className="aspect-[4/3] lg:aspect-[1/1]" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-4 flex items-center gap-3">
                      <Badge variant="secondary">{featuredPost.category?.name || 'Sem categoria'}</Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {featuredPost.readingTime} min
                      </div>
                    </div>

                    <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-foreground lg:text-3xl">
                      {featuredPost.title}
                    </h3>

                    <p className="mb-6 text-muted-foreground leading-relaxed lg:text-lg">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {featuredPost.author?.avatar ? (
                          <Image
                            src={featuredPost.author.avatar}
                            alt={featuredPost.author.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                        )}
                        <div>
                          <div className="font-semibold text-foreground">
                            {featuredPost.author?.name || 'Autor'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(featuredPost.publishedAt)}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </Card>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="bg-zinc-50/50 py-16 dark:bg-zinc-950/50 lg:py-24">
        <div className="container px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
                Artigos Recentes
              </h2>
              <p className="mt-2 text-muted-foreground lg:text-lg">
                Conteúdo exclusivo para líderes visionários
              </p>
            </div>
            
            <Button variant="ghost" asChild>
              <Link href="/posts">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <Card 
                key={post.id} 
                variant="default"
                className="group cursor-pointer overflow-hidden border-0 p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-lg"
              >
                <Link href={`/post/${post.slug}`}>
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <div className="mb-1 text-2xl">
                            {post.category?.name === 'Liderança' && '👥'}
                            {post.category?.name === 'Gestão' && '⚙️'}
                            {post.category?.name === 'Estratégia' && '🎯'}
                            {post.category?.name === 'Pessoas' && '🤝'}
                            {post.category?.name === 'Tecnologia' && '💻'}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="aspect-[16/10]" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        {post.category?.name || 'Sem categoria'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {post.readingTime} min
                      </div>
                    </div>

                    <h3 className="mb-3 font-serif text-lg font-bold leading-tight text-foreground group-hover:text-zinc-600 dark:group-hover:text-zinc-300">
                      {post.title}
                    </h3>

                    <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3">
                      {post.author?.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {post.author?.name || 'Autor'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(post.publishedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl">
            <Card variant="premium" className="relative overflow-hidden border-0 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white dark:from-zinc-100 dark:to-zinc-200 dark:text-zinc-900">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10 dark:via-black/5 dark:to-black/10" />
              
              <CardContent className="relative p-8 text-center lg:p-12">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-white/10 p-4 dark:bg-black/10">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>

                <h2 className="mb-4 font-serif text-3xl font-bold lg:text-4xl">
                  Fique à Frente da Concorrência
                </h2>
                
                <p className="mb-8 text-lg text-white/80 dark:text-zinc-700 leading-relaxed">
                  Receba semanalmente insights exclusivos, frameworks práticos e 
                  estudos de caso reais direto na sua caixa de entrada.
                </p>

                <div className="mb-6">
                  <ul className="inline-flex flex-wrap items-center gap-6 text-sm text-white/90 dark:text-zinc-600">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      Conteúdo Exclusivo
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      Sem Spam
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      Cancele a Qualquer Momento
                    </li>
                  </ul>
                </div>

                <Button
                  size="lg"
                  variant="secondary"
                  className="group h-14 bg-white text-zinc-900 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                  asChild
                >
                  <Link href="/newsletter">
                    Quero Receber Insights Exclusivos
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <p className="mt-4 text-xs text-white/60 dark:text-zinc-500">
                  Junte-se a mais de 2.500 líderes que já transformaram sua gestão
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
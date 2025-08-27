import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, TrendingUp, Clock, Calendar, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { getFeaturedPosts, getRecentPosts, getCategoryStats } from '@/lib/notion/posts'
import { getAllCategories } from '@/lib/notion/categories'
import { transformNotionPost } from '@/lib/notion/transforms'

// Helper function to format dates
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function HomePage() {
  try {
    const [featuredPostsData, recentPostsData, categoriesData, categoryStats] = await Promise.all([
      getFeaturedPosts(3),
      getRecentPosts(9),
      getAllCategories(),
      getCategoryStats()
    ])

    const featuredPosts = featuredPostsData.map(post => transformNotionPost(post))
    const recentPosts = recentPostsData.map(post => transformNotionPost(post))
    const categories = categoriesData

    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="hero-content animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="glass-card px-4 py-2 rounded-full">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://administrative.com.br/img/Lampada.png"
                      alt="Administrativa(mente)"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                    <span className="text-sm font-medium">Premium Business Insights</span>
                  </div>
                </div>
              </div>
              
              <h1 className="hero-title heading-hero">
                Administrativa
                <span className="text-blue-600">(mente)</span>
              </h1>
              
              <p className="hero-subtitle text-body">
                Transforme sua visão estratégica em resultados excepcionais. 
                Insights premium sobre gestão, liderança e inovação corporativa para executivos de alto nível.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
                <Link href="/newsletter" className="w-full sm:w-auto">
                  <button className="glass-interactive w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2">
                    Receber Insights Exclusivos
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                
                <Link href="#featured-content" className="w-full sm:w-auto">
                  <button className="glass-interactive w-full sm:w-auto px-8 py-4 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                    Explorar Conteúdo
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Content Section */}
        <section id="featured-content" className="py-16 lg:py-24">
          <div className="container">
            <div className="text-center mb-12 animate-slide-up">
              <h2 className="heading-section mb-4">
                Insights Selecionados
              </h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Conteúdo premium curado especialmente para acelerar sua evolução como líder
              </p>
            </div>

            {/* Featured Posts Grid */}
            {featuredPosts.length > 0 && (
              <div className="grid-featured mb-16 animate-scale-in">
                {/* Main Featured Post */}
                <article className="post-card group">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={featuredPosts[0]?.featuredImage || '/api/placeholder/600/400'}
                      alt={featuredPosts[0]?.title || 'Featured post'}
                      width={600}
                      height={400}
                      className="post-image"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-600 text-white">
                        Destaque
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="post-content">
                    <div className="flex items-center gap-4 mb-3 text-small text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredPosts[0]?.publishedAt || new Date().toISOString())}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {featuredPosts[0]?.readingTime || 5} min
                      </div>
                    </div>
                    
                    <h3 className="post-title text-xl lg:text-2xl group-hover:text-blue-600 transition-colors">
                      <Link href={`/post/${featuredPosts[0]?.slug || 'post'}`}>
                        {featuredPosts[0]?.title || 'Untitled'}
                      </Link>
                    </h3>
                    
                    <p className="post-excerpt text-body">
                      {featuredPosts[0]?.excerpt || 'No excerpt available.'}
                    </p>
                    
                    <div className="post-meta">
                      <div className="flex items-center gap-2">
                        {featuredPosts[0]?.author?.avatar && (
                          <Image
                            src={featuredPosts[0]?.author?.avatar || ''}
                            alt={featuredPosts[0]?.author?.name || 'Author'}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        )}
                        <span className="text-small font-medium">
                          {featuredPosts[0]?.author?.name || 'Admin'}
                        </span>
                      </div>
                      
                      <Badge variant="secondary">
                        {featuredPosts[0]?.category?.name || 'Gestão'}
                      </Badge>
                    </div>
                  </div>
                </article>

                {/* Secondary Featured Posts */}
                <div className="space-y-6">
                  {featuredPosts.slice(1, 3).map((post, index) => (
                    <article key={post.slug} className="post-card group flex gap-4">
                      <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                        <Image
                          src={post.featuredImage || '/api/placeholder/300/200'}
                          alt={post.title}
                          width={150}
                          height={100}
                          className="w-24 h-16 sm:w-32 sm:h-20 lg:w-40 lg:h-24 object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt)}
                          <span>•</span>
                          <Clock className="w-3 h-3" />
                          {post.readingTime} min
                        </div>
                        
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                          <Link href={`/post/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Recent Posts Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="heading-section mb-4">
                Últimas Publicações
              </h2>
              <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                Mantenha-se atualizado com nossos insights mais recentes
              </p>
            </div>

            <div className="grid-posts">
              {recentPosts.map((post, index) => (
                <article key={post.slug} className="post-card group animate-fade-in">
                  <div className="relative overflow-hidden rounded-t-xl">
                    <Image
                      src={post.featuredImage || '/api/placeholder/400/250'}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="post-image"
                    />
                  </div>
                  
                  <div className="post-content">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {post.category?.name || 'Gestão'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </div>
                    </div>
                    
                    <h3 className="post-title group-hover:text-blue-600 transition-colors">
                      <Link href={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="post-excerpt">
                      {post.excerpt}
                    </p>
                    
                    <div className="post-meta">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author?.name || 'Admin'}</span>
                      </div>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-16">
            <div className="container">
              <div className="text-center mb-12">
                <h2 className="heading-section mb-4">
                  Explore por Categoria
                </h2>
                <p className="text-body text-muted-foreground max-w-2xl mx-auto">
                  Navegue pelos nossos tópicos especializados
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.slice(0, 4).map((category, index) => {
                  const categoryName = category.properties?.Name?.title?.[0]?.plain_text || 'Category'
                  const categorySlug = category.properties?.Slug?.rich_text?.[0]?.plain_text || 'category'
                  const categoryDescription = category.properties?.Description?.rich_text?.[0]?.plain_text || 'No description available'
                  const stats = categoryStats.find(stat => stat.name === categoryName)
                  return (
                    <Link
                      key={category.id || index}
                      href={`/category/${categorySlug}`}
                      className="glass-interactive p-6 text-center group"
                    >
                      <div className="text-3xl mb-3">📊</div>
                      <h3 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {categoryName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {categoryDescription}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {stats?.count || 0} posts
                      </Badge>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="heading-section mb-4 text-white">
                Não Perca Nenhum Insight
              </h2>
              <p className="text-body mb-8 text-blue-100">
                Receba semanalmente os melhores conteúdos sobre gestão e liderança diretamente no seu e-mail
              </p>
              <Link href="/newsletter">
                <button className="glass-card px-8 py-4 rounded-xl font-semibold text-blue-600 bg-white hover:bg-gray-50 transition-all inline-flex items-center gap-2">
                  Inscrever-se Gratuitamente
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
    console.error('Error loading homepage data:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erro ao carregar página</h1>
          <p className="text-muted-foreground">Tente novamente em alguns instantes.</p>
        </div>
      </div>
    )
  }
}
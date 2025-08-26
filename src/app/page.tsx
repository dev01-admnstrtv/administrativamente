import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Users, Target, Clock, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { GlassContainer, GlassCard } from '@/components/ui/GlassContainer'
import { MicroButton, MicroCard, AnimatedText, StaggerContainer, MorphIcon } from '@/components/ui/MicroInteractions'
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
      {/* Premium Hero Section with Glassmorphism */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Dynamic Background with Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-blue-50/30 to-purple-50/20 dark:from-zinc-950 dark:via-blue-950/30 dark:to-purple-950/20" />
          
          {/* Floating Glass Orbs */}
          <GlassContainer 
            variant="crystal" 
            effects={['floating']} 
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-60" 
          />
          <GlassContainer 
            variant="warm" 
            effects={['floating']} 
            className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full opacity-40" 
            style={{ animationDelay: '1s' }}
          />
          <GlassContainer 
            variant="cool" 
            effects={['floating']} 
            className="absolute bottom-1/3 left-1/3 w-20 h-20 rounded-full opacity-50" 
            style={{ animationDelay: '2s' }}
          />
        </div>
        
        <div className="container relative px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-5xl text-center">
            {/* Premium Badge with Glass Effect */}
            <div className="mb-12 flex justify-center">
              <GlassContainer 
                variant="premium" 
                effects={['shimmer']}
                className="px-6 py-3 rounded-full"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MorphIcon 
                    icon={<Sparkles className="h-4 w-4" />}
                    morphIcon={<BookOpen className="h-4 w-4" />}
                    animation="pulse"
                    trigger="auto"
                  />
                  Premium Business Insights
                </div>
              </GlassContainer>
            </div>

            {/* Animated Main Headline */}
            <AnimatedText
              animation="reveal"
              className="heading-hero mb-8 font-serif leading-tight tracking-tight"
              delay={300}
            >
              Transforme sua gestão em vantagem competitiva
            </AnimatedText>

            {/* Animated Subtitle */}
            <AnimatedText
              animation="reveal"
              className="mb-12 text-xl leading-relaxed text-muted-foreground lg:text-2xl max-w-3xl mx-auto"
              delay={600}
            >
              Insights estratégicos, metodologias comprovadas e ferramentas práticas 
              para líderes que buscam excelência operacional e resultados extraordinários.
            </AnimatedText>

            {/* Enhanced CTA Buttons */}
            <StaggerContainer className="flex flex-col items-center justify-center gap-6 sm:flex-row" staggerDelay={200}>
              <Link href="/newsletter">
                <MicroButton
                  variant="magnetic"
                  className="group h-16 px-10 text-lg font-semibold glass-premium rounded-2xl border-0 text-white hover:scale-105 transition-all"
                >
                  Receber Insights Exclusivos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </MicroButton>
              </Link>
              
              <Link href="#featured-content">
                <MicroButton
                  variant="ripple"
                  className="group h-16 px-10 text-lg font-medium glass-layer-2 rounded-2xl hover:glass-layer-3 transition-all"
                >
                  Explorar Conteúdo
                  <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                </MicroButton>
              </Link>
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Featured Content Section */}
      <section id="featured-content" className="py-20 lg:py-32">
        <div className="container px-4">
          <div className="mx-auto max-w-6xl">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <AnimatedText
                animation="reveal"
                className="heading-section mb-6 font-serif"
              >
                Conteúdo Premium em Destaque
              </AnimatedText>
              
              <AnimatedText
                animation="reveal"
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
                delay={300}
              >
                Insights selecionados para acelerar sua evolução como líder
              </AnimatedText>
            </div>

            {/* Featured Post Card */}
            {featuredPost && (
              <MicroCard
                effect="tilt"
                intensity="moderate"
                className="mb-20"
              >
                <GlassCard hover3D clickRipple className="overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image Section */}
                    <div className="relative h-64 lg:h-96 overflow-hidden">
                      <div className="micro-image-zoom w-full h-full">
                        <Image
                          src={featuredPost.image || '/api/placeholder/800/600'}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform"
                        />
                      </div>
                      
                      {/* Overlay Badge */}
                      <div className="absolute top-6 left-6">
                        <GlassContainer variant="frosted" className="px-4 py-2 rounded-full">
                          <Badge variant="premium" className="border-0 bg-transparent">
                            ⭐ Em Destaque
                          </Badge>
                        </GlassContainer>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-4 flex items-center gap-3">
                        <Badge variant="outline">{featuredPost.category?.name || 'Gestão'}</Badge>
                        <span className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {featuredPost.readingTime} min
                        </span>
                      </div>
                      
                      <h2 className="heading-subsection mb-4 font-serif">
                        {featuredPost.title}
                      </h2>
                      
                      <p className="mb-6 text-body-medium text-muted-foreground">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                          <div>
                            <div className="font-medium">{featuredPost.author?.name || 'Admin'}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatDate(featuredPost.publishedAt)}
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/post/${featuredPost.slug}`}>
                          <MicroButton variant="magnetic" className="glass-interactive p-4 rounded-xl">
                            <ArrowUpRight className="h-5 w-5" />
                          </MicroButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </MicroCard>
            )}

            {/* Categories Grid */}
            {categories.length > 0 && (
              <div className="mb-20">
                <AnimatedText
                  animation="reveal" 
                  className="heading-subsection mb-8 text-center font-serif"
                >
                  Explore por Categoria
                </AnimatedText>
                
                <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={150}>
                  {categories.slice(0, 4).map((category, index) => {
                    const IconComponent = category.icon
                    return (
                      <GlassCard
                        key={category.name}
                        hover3D
                        className="group text-center p-8"
                      >
                        <div className="mb-4 flex justify-center">
                          <div className="glass-layer-2 p-4 rounded-2xl group-hover:glass-layer-3 transition-all">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        
                        <h3 className="mb-2 font-serif text-lg font-semibold">{category.name}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">
                          {category.count} artigos
                        </p>
                        
                        <Link href={`/category/${category.name.toLowerCase()}`}>
                          <MicroButton variant="ripple" className="w-full glass-layer-1 hover:glass-layer-2">
                            Explorar
                          </MicroButton>
                        </Link>
                      </GlassCard>
                    )
                  })}
                </StaggerContainer>
              </div>
            )}

            {/* Recent Posts Grid */}
            <div>
              <AnimatedText
                animation="reveal"
                className="heading-subsection mb-12 text-center font-serif"
              >
                Últimos Insights
              </AnimatedText>
              
              <StaggerContainer className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={100}>
                {recentPosts.slice(0, 6).map((post) => (
                  <MicroCard key={post.slug} effect="tilt" intensity="subtle">
                    <GlassCard className="group h-full overflow-hidden">
                      {/* Image */}
                      <div className="micro-image-zoom relative h-48 overflow-hidden">
                        <Image
                          src={post.image || '/api/placeholder/600/400'}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <div className="mb-3 flex items-center justify-between">
                          <Badge variant="secondary">{post.category?.name || 'Gestão'}</Badge>
                          <span className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {post.readingTime} min
                          </span>
                        </div>
                        
                        <h3 className="mb-3 font-serif text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            {formatDate(post.publishedAt)}
                          </div>
                          
                          <Link href={`/post/${post.slug}`}>
                            <MicroButton variant="magnetic" className="glass-interactive p-2 rounded-lg">
                              <ArrowRight className="h-4 w-4" />
                            </MicroButton>
                          </Link>
                        </div>
                      </div>
                    </GlassCard>
                  </MicroCard>
                ))}
              </StaggerContainer>
            </div>

            {/* Newsletter CTA */}
            <div className="mt-20 text-center">
              <GlassContainer variant="premium" effects={['shimmer']} className="mx-auto max-w-2xl p-12 rounded-3xl">
                <MorphIcon 
                  icon={<Sparkles className="h-12 w-12 mb-6 mx-auto text-primary" />}
                  animation="pulse"
                  trigger="auto"
                />
                
                <AnimatedText
                  animation="gradient"
                  className="heading-subsection mb-4 font-serif"
                >
                  Transforme sua gestão hoje mesmo
                </AnimatedText>
                
                <p className="mb-8 text-body-medium text-muted-foreground">
                  Junte-se a mais de 10.000 líderes que recebem insights exclusivos toda semana
                </p>
                
                <Link href="/newsletter">
                  <MicroButton variant="magnetic" className="glass-premium h-14 px-8 text-lg font-semibold rounded-2xl text-white">
                    Receber Newsletter Premium
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </MicroButton>
                </Link>
              </GlassContainer>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
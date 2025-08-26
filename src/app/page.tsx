import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, TrendingUp, Users, Target, Clock, ArrowUpRight, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { GlassContainer, GlassCard } from '@/components/ui/GlassContainer'
import { MicroButton, MicroCard, AnimatedText, StaggerContainer, MorphIcon } from '@/components/ui/MicroInteractions'
import { Hero3D } from '@/components/ui/Hero3D'
import { MagazineLayout } from '@/components/ui/MagazineLayout'
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
      {/* 3D Hero Section */}
      <Hero3D
        title="Transforme sua gestão em vantagem competitiva"
        subtitle="Insights estratégicos, metodologias comprovadas e ferramentas práticas para líderes que buscam excelência operacional e resultados extraordinários."
        enableParallax={true}
        className="relative"
      >
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
      </Hero3D>

      {/* Magazine-Style Content Section */}
      <section id="featured-content" className="py-20 lg:py-32 relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />
        
        <div className="container px-4 relative z-10">
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

          {/* Magazine Layout */}
          <MagazineLayout 
            posts={[...featuredPosts, ...recentPosts].map(post => ({
              id: post.slug,
              title: post.title,
              excerpt: post.excerpt,
              slug: post.slug,
              image: post.image || '/api/placeholder/600/400',
              category: {
                name: post.category?.name || 'Gestão',
                color: '#3b82f6'
              },
              author: {
                name: post.author?.name || 'Admin',
                avatar: post.author?.avatar || undefined,
                bio: post.author?.bio || undefined
              },
              publishedAt: post.publishedAt,
              readingTime: post.readingTime,
              featured: featuredPosts.includes(post)
            }))}
            layout="standard"
            animated={true}
          />

          {/* Categories Section - Redesigned */}
          {categories.length > 0 && (
            <div className="mt-20">
              <AnimatedText
                animation="reveal" 
                className="heading-subsection mb-12 text-center font-serif"
              >
                Explore por Categoria
              </AnimatedText>
              
              <div className="magazine-container">
                {categories.slice(0, 4).map((category, index) => {
                  const IconComponent = category.icon
                  return (
                    <MicroCard 
                      key={category.name} 
                      effect="tilt" 
                      intensity="subtle"
                      className="col-3"
                    >
                      <GlassCard hover3D className="group text-center p-8 h-full">
                        <div className="mb-6 flex justify-center">
                          <div className="glass-layer-2 p-4 rounded-2xl group-hover:glass-layer-3 transition-all">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                        </div>
                        
                        <h3 className="mb-3 font-serif text-lg font-semibold">{category.name}</h3>
                        <p className="mb-6 text-sm text-muted-foreground">
                          {category.count} artigos
                        </p>
                        
                        <Link href={`/category/${category.name.toLowerCase()}`}>
                          <MicroButton variant="ripple" className="w-full glass-layer-1 hover:glass-layer-2">
                            Explorar
                          </MicroButton>
                        </Link>
                      </GlassCard>
                    </MicroCard>
                  )
                })}
              </div>
            </div>
          )}

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
      </section>
    </div>
  )
}
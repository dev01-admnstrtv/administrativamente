import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Users, BookOpen, Award, ExternalLink, Linkedin, Twitter, Globe, Mail, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { PostCard } from '@/components/blog/PostCard'
import { SortFilter } from '@/components/blog/SortFilter'
import { ViewToggle } from '@/components/blog/ViewToggle'

// Mock data - In real implementation, this would come from Notion API
const getAuthorData = (slug: string) => {
  const authors = {
    'carolina-silva': {
      id: 'carolina-silva',
      name: 'Carolina Silva',
      slug: 'carolina-silva',
      title: 'Head of Digital Strategy',
      company: 'TechCorp Consulting',
      avatar: '/images/authors/carolina.jpg',
      bio: 'Especialista em transformação digital com mais de 15 anos de experiência liderando iniciativas estratégicas em empresas Fortune 500.',
      longBio: 'Carolina Silva é uma líder reconhecida em transformação digital e estratégia corporativa. Com mais de 15 anos de experiência, ela tem ajudado empresas Fortune 500 a navegar pela complexidade da era digital, implementando soluções que geram valor real e sustentável. PhD em Administração pela FGV e MBA pela Wharton School, Carolina combina rigor acadêmico com experiência prática para entregar insights que realmente fazem a diferença. Sua paixão por inovação e excelência operacional a tornou uma das vozes mais respeitadas no cenário empresarial brasileiro.',
      location: 'São Paulo, Brasil',
      website: 'https://carolinasilva.com.br',
      joinedDate: '2020-03-15',
      expertise: ['Transformação Digital', 'Estratégia Corporativa', 'Liderança', 'Inovação'],
      achievements: [
        'Top 40 Under 40 - Harvard Business Review Brasil',
        'Digital Leader of the Year - MIT Technology Review',
        'Palestrante TEDx com +500k visualizações'
      ],
      education: [
        'PhD em Administração - FGV-SP',
        'MBA em Strategy - Wharton School',
        'Bacharel em Engenharia - USP'
      ],
      social: {
        linkedin: 'https://linkedin.com/in/carolinasilva',
        twitter: 'https://twitter.com/carolinasilva',
        website: 'https://carolinasilva.com.br',
        email: 'carolina@administrativa-mente.com'
      },
      stats: {
        postsCount: 12,
        totalViews: 45000,
        avgReadTime: 9,
        followers: 2500
      }
    },
    'roberto-santos': {
      id: 'roberto-santos',
      name: 'Roberto Santos',
      slug: 'roberto-santos',
      title: 'Leadership Coach & Consultant',
      company: 'Santos Leadership Institute',
      avatar: '/images/authors/roberto.jpg',
      bio: 'Coach executivo certificado com foco em desenvolvimento de liderança adaptativa e alta performance.',
      longBio: 'Roberto Santos é um coach executivo certificado e consultor especializado em desenvolvimento de liderança. Com mais de 12 anos de experiência, ele trabalha com executivos C-level e líderes emergentes para desenvolver competências de liderança adaptativa e construir equipes de alta performance. Formado em Psicologia Organizacional e certificado pelo ICF, Roberto tem uma abordagem prática e baseada em evidências que já transformou centenas de líderes em diversas indústrias.',
      location: 'Rio de Janeiro, Brasil',
      website: 'https://robertosantos.coach',
      joinedDate: '2020-06-20',
      expertise: ['Liderança', 'Coaching Executivo', 'Desenvolvimento de Pessoas', 'Alta Performance'],
      achievements: [
        'Master Certified Coach (MCC) - ICF',
        'Top 10 Leadership Coaches - Forbes Brasil',
        'Autor do bestseller "Liderança Adaptativa"'
      ],
      education: [
        'Especialização em Coaching - PUC-Rio',
        'Psicologia Organizacional - UFRJ',
        'Executive Program - Stanford Graduate School'
      ],
      social: {
        linkedin: 'https://linkedin.com/in/robertosantos',
        twitter: 'https://twitter.com/robertosantos',
        website: 'https://robertosantos.coach',
        email: 'roberto@administrativa-mente.com'
      },
      stats: {
        postsCount: 8,
        totalViews: 32000,
        avgReadTime: 7,
        followers: 1800
      }
    }
  }
  
  return authors[slug as keyof typeof authors] || authors['carolina-silva']
}

const getAuthorPosts = (authorSlug: string) => {
  // Mock posts data filtered by author
  const allPosts = [
    {
      id: '1',
      title: 'Transformação Digital: O Guia Completo para Líderes Modernos',
      excerpt: 'Como implementar uma estratégia de transformação digital eficaz que gere resultados mensuráveis e sustentáveis.',
      category: 'Estratégia',
      author: {
        name: 'Carolina Silva',
        avatar: '/images/authors/carolina.jpg',
        role: 'Head of Digital Strategy'
      },
      publishedAt: '2024-01-15',
      readTime: 12,
      image: '/images/posts/digital-transformation.jpg',
      slug: 'transformacao-digital-guia-completo',
      tags: ['Transformação Digital', 'Estratégia', 'Inovação'],
      views: 2100,
      featured: true
    },
    {
      id: '2',
      title: 'IA na Estratégia Empresarial: Oportunidades e Desafios',
      excerpt: 'Explore como a inteligência artificial está redefinindo o planejamento estratégico e a tomada de decisões.',
      category: 'Tecnologia',
      author: {
        name: 'Carolina Silva',
        avatar: '/images/authors/carolina.jpg',
        role: 'Head of Digital Strategy'
      },
      publishedAt: '2024-01-08',
      readTime: 10,
      image: '/images/posts/ai-strategy.jpg',
      slug: 'ia-estrategia-empresarial',
      tags: ['IA', 'Estratégia', 'Tecnologia'],
      views: 1850,
      featured: false
    },
    {
      id: '3',
      title: 'Liderança Adaptativa: Navegando pela Incerteza com Confiança',
      excerpt: 'Estratégias práticas para desenvolver uma liderança resiliente em tempos de mudança constante.',
      category: 'Liderança',
      author: {
        name: 'Roberto Santos',
        avatar: '/images/authors/roberto.jpg',
        role: 'Leadership Coach'
      },
      publishedAt: '2024-01-12',
      readTime: 8,
      image: '/images/posts/adaptive-leadership.jpg',
      slug: 'lideranca-adaptativa-incerteza',
      tags: ['Liderança', 'Adaptabilidade', 'Resiliência'],
      views: 890,
      featured: true
    },
    {
      id: '4',
      title: 'Desenvolvendo Líderes do Futuro: Um Framework Prático',
      excerpt: 'Metodologia estruturada para identificar e desenvolver talentos de liderança na sua organização.',
      category: 'Liderança',
      author: {
        name: 'Roberto Santos',
        avatar: '/images/authors/roberto.jpg',
        role: 'Leadership Coach'
      },
      publishedAt: '2024-01-05',
      readTime: 11,
      image: '/images/posts/future-leaders.jpg',
      slug: 'desenvolvendo-lideres-futuro',
      tags: ['Liderança', 'Desenvolvimento', 'Talentos'],
      views: 1200,
      featured: false
    }
  ]
  
  // Filter posts by author
  const author = getAuthorData(authorSlug)
  return allPosts.filter(post => 
    post.author.name.toLowerCase().replace(/\s+/g, '-') === authorSlug ||
    post.author.name === author.name
  )
}

interface AuthorPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    view?: string
    page?: string
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatJoinDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
}

export function generateMetadata({ params }: AuthorPageProps): Metadata {
  const author = getAuthorData(params.slug)
  
  return {
    title: `${author.name} - Artigos e Insights | Administrativa(mente)`,
    description: `Conheça ${author.name}, ${author.title}. ${author.bio} Leia seus artigos sobre ${author.expertise.join(', ').toLowerCase()}.`,
    keywords: `${author.name}, ${author.expertise.join(', ')}, gestão empresarial, liderança`,
    authors: [{ name: author.name }],
    openGraph: {
      title: `${author.name} - ${author.title}`,
      description: author.bio,
      type: 'profile',
    }
  }
}

export default function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const author = getAuthorData(params.slug)
  const posts = getAuthorPosts(params.slug)
  
  const currentSort = searchParams.sort || 'date'
  const currentView = searchParams.view || 'grid'
  const currentPage = parseInt(searchParams.page || '1')
  
  // Apply sorting
  const sortedPosts = [...posts].sort((a, b) => {
    switch (currentSort) {
      case 'date':
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      case 'popularity':
        return (b.views || 0) - (a.views || 0)
      case 'reading-time':
        return a.readTime - b.readTime
      case 'alphabetical':
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })
  
  // Pagination
  const postsPerPage = 9
  const totalPages = Math.ceil(sortedPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
              <div>
                <h1 className="font-serif text-xl font-bold text-foreground">
                  {author.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {author.title}
                </p>
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
                    <div className="h-32 w-32 shrink-0 rounded-2xl bg-gradient-to-br from-zinc-200 to-zinc-300 shadow-premium dark:from-zinc-700 dark:to-zinc-800 sm:h-40 sm:w-40" />
                    <div className="absolute -bottom-3 -right-3 rounded-full bg-white p-2 shadow-premium dark:bg-zinc-900">
                      <Award className="h-5 w-5 text-amber-500" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="mb-4">
                      <h1 className="mb-2 font-serif text-3xl font-bold text-foreground lg:text-4xl">
                        {author.name}
                      </h1>
                      <p className="mb-1 text-lg font-medium text-muted-foreground">
                        {author.title}
                      </p>
                      <p className="text-muted-foreground">
                        {author.company}
                      </p>
                    </div>

                    {/* Location and Join Date */}
                    <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {author.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Autor desde {formatJoinDate(author.joinedDate)}
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                      {author.longBio}
                    </p>

                    {/* Expertise Tags */}
                    <div className="mb-6">
                      <h3 className="mb-3 text-sm font-semibold text-foreground">Especialidades</h3>
                      <div className="flex flex-wrap gap-2">
                        {author.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex flex-wrap items-center gap-3">
                      {author.social.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {author.social.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </a>
                        </Button>
                      )}
                      {author.social.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={author.social.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                            <Globe className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                      {author.social.email && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${author.social.email}`} className="gap-2">
                            <Mail className="h-4 w-4" />
                            Contato
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats and Achievements */}
              <div className="space-y-6">
                {/* Stats Card */}
                <Card variant="premium" className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5" />
                      Estatísticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">
                          {author.stats.postsCount}
                        </div>
                        <div className="text-sm text-muted-foreground">Artigos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">
                          {(author.stats.totalViews / 1000).toFixed(0)}k
                        </div>
                        <div className="text-sm text-muted-foreground">Visualizações</div>
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">
                          {author.stats.avgReadTime}m
                        </div>
                        <div className="text-sm text-muted-foreground">Tempo Médio</div>
                      </div>
                      <div className="text-center">
                        <div className="font-serif text-2xl font-bold text-foreground">
                          {(author.stats.followers / 1000).toFixed(1)}k
                        </div>
                        <div className="text-sm text-muted-foreground">Seguidores</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card variant="default" className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Award className="h-5 w-5" />
                      Conquistas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    {author.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {achievement}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education */}
                <Card variant="default" className="p-6">
                  <CardHeader className="p-0 pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5" />
                      Formação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    {author.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {edu}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
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
                <h2 className="font-serif text-3xl font-bold text-foreground lg:text-4xl">
                  Artigos de {author.name.split(' ')[0]}
                </h2>
                <p className="mt-2 text-muted-foreground lg:text-lg">
                  {posts.length} artigo{posts.length !== 1 ? 's' : ''} publicado{posts.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <SortFilter currentSort={currentSort} />
                <ViewToggle currentView={currentView} />
              </div>
            </div>

            {/* Posts Grid */}
            {paginatedPosts.length > 0 ? (
              <>
                <div className={
                  currentView === 'grid' 
                    ? 'grid gap-8 md:grid-cols-2 lg:grid-cols-3'
                    : 'space-y-8'
                }>
                  {paginatedPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      variant={currentView === 'grid' ? 'default' : 'horizontal'}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Button variant="outline" asChild>
                        <Link 
                          href={`/author/${params.slug}?${new URLSearchParams({
                            ...searchParams,
                            page: (currentPage - 1).toString()
                          }).toString()}`}
                        >
                          Anterior
                        </Link>
                      </Button>
                    )}
                    
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? 'primary' : 'ghost'}
                          size="sm"
                          asChild
                        >
                          <Link 
                            href={`/author/${params.slug}?${new URLSearchParams({
                              ...searchParams,
                              page: page.toString()
                            }).toString()}`}
                          >
                            {page}
                          </Link>
                        </Button>
                      ))}
                    </div>
                    
                    {currentPage < totalPages && (
                      <Button variant="outline" asChild>
                        <Link 
                          href={`/author/${params.slug}?${new URLSearchParams({
                            ...searchParams,
                            page: (currentPage + 1).toString()
                          }).toString()}`}
                        >
                          Próxima
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16">
                <div className="mb-6 text-6xl text-muted-foreground/50">
                  ✍️
                </div>
                <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                  Nenhum artigo encontrado
                </h3>
                <p className="mb-6 text-muted-foreground">
                  {author.name} ainda não publicou artigos na plataforma.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/">
                    Explorar outros autores
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
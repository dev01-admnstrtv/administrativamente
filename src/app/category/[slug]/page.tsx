import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Filter, SortAsc, Grid3X3, List, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { CategoryFilter } from '@/components/blog/CategoryFilter'
import { PostCard } from '@/components/blog/PostCard'
import { SortFilter } from '@/components/blog/SortFilter'
import { ViewToggle } from '@/components/blog/ViewToggle'

// Mock data - In real implementation, this would come from Notion API
const getCategoryData = (slug: string) => {
  const categories = {
    'gestao': {
      id: 'gestao',
      name: 'Gestão',
      description: 'Processos administrativos, workflows e metodologias para otimizar a operação empresarial.',
      longDescription: 'Explore artigos sobre gestão empresarial, processos administrativos e metodologias comprovadas para otimizar operações e maximizar resultados organizacionais.',
      icon: '⚙️',
      color: 'blue',
      postCount: 24,
      slug: 'gestao'
    },
    'lideranca': {
      id: 'lideranca',
      name: 'Liderança',
      description: 'Desenvolvimento de líderes, gestão de pessoas e construção de equipes de alta performance.',
      longDescription: 'Descubra estratégias de liderança moderna, técnicas de desenvolvimento de pessoas e frameworks para construir equipes excepcionais.',
      icon: '👥',
      color: 'purple',
      postCount: 18,
      slug: 'lideranca'
    },
    'estrategia': {
      id: 'estrategia',
      name: 'Estratégia',
      description: 'Planejamento estratégico, visão de negócios e tomada de decisões corporativas.',
      longDescription: 'Aprenda sobre planejamento estratégico, análise de mercado e metodologias para tomar decisões que impulsionam o crescimento empresarial.',
      icon: '🎯',
      color: 'green',
      postCount: 15,
      slug: 'estrategia'
    },
    'tecnologia': {
      id: 'tecnologia',
      name: 'Tecnologia',
      description: 'Transformação digital, automação e tecnologias emergentes nos negócios.',
      longDescription: 'Mantenha-se atualizado com as últimas tendências em transformação digital, automação inteligente e tecnologias que revolucionam os negócios.',
      icon: '💻',
      color: 'orange',
      postCount: 12,
      slug: 'tecnologia'
    },
    'pessoas': {
      id: 'pessoas',
      name: 'Pessoas',
      description: 'Recursos humanos, cultura organizacional e desenvolvimento de talentos.',
      longDescription: 'Explore estratégias para gestão de talentos, construção de cultura organizacional e criação de ambientes de trabalho excepcionais.',
      icon: '🤝',
      color: 'pink',
      postCount: 16,
      slug: 'pessoas'
    }
  }
  
  return categories[slug as keyof typeof categories] || categories.gestao
}

const getCategoryPosts = (categorySlug: string) => {
  // Mock posts data
  const allPosts = [
    {
      id: '1',
      title: 'Gestão de Processos: Otimização que Realmente Funciona',
      excerpt: 'Metodologias comprovadas para identificar gargalos e implementar melhorias duradouras nos processos empresariais.',
      category: 'Gestão',
      author: {
        name: 'Ana Costa',
        avatar: '/images/authors/ana.jpg',
        role: 'Process Excellence Manager'
      },
      publishedAt: '2024-01-10',
      readTime: 10,
      image: '/images/posts/process-optimization.jpg',
      slug: 'gestao-processos-otimizacao',
      tags: ['Processos', 'Otimização', 'Lean'],
      views: 1250,
      featured: false
    },
    {
      id: '2',
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
      id: '3',
      title: 'Transformação Digital: O Guia Completo para Líderes Modernos',
      excerpt: 'Como implementar uma estratégia de transformação digital eficaz que gere resultados mensuráveis.',
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
      id: '4',
      title: 'Automação Inteligente: Tecnologia a Serviço da Eficiência',
      excerpt: 'Guia prático para implementar automação sem perder o fator humano nos processos organizacionais.',
      category: 'Tecnologia',
      author: {
        name: 'João Pedro',
        avatar: '/images/authors/joao.jpg',
        role: 'Automation Specialist'
      },
      publishedAt: '2024-01-03',
      readTime: 9,
      image: '/images/posts/intelligent-automation.jpg',
      slug: 'automacao-inteligente-eficiencia',
      tags: ['Automação', 'IA', 'Eficiência'],
      views: 750,
      featured: false
    },
    {
      id: '5',
      title: 'Cultura Organizacional: Construindo Times de Alta Performance',
      excerpt: 'Como criar um ambiente que potencialize o talento e gere resultados extraordinários.',
      category: 'Pessoas',
      author: {
        name: 'Miguel Oliveira',
        avatar: '/images/authors/miguel.jpg',
        role: 'People & Culture Director'
      },
      publishedAt: '2024-01-08',
      readTime: 15,
      image: '/images/posts/organizational-culture.jpg',
      slug: 'cultura-organizacional-alta-performance',
      tags: ['Cultura', 'Performance', 'Engajamento'],
      views: 1400,
      featured: false
    },
    {
      id: '6',
      title: 'KPIs Estratégicos: Métricas que Realmente Importam',
      excerpt: 'Identifique e implemente os indicadores que realmente fazem a diferença na gestão.',
      category: 'Estratégia',
      author: {
        name: 'Fernanda Lima',
        avatar: '/images/authors/fernanda.jpg',
        role: 'Business Analytics Lead'
      },
      publishedAt: '2024-01-05',
      readTime: 7,
      image: '/images/posts/strategic-kpis.jpg',
      slug: 'metricas-kpis-gestao-estrategica',
      tags: ['KPIs', 'Métricas', 'Analytics'],
      views: 980,
      featured: false
    }
  ]
  
  // Filter posts by category if needed
  const categoryData = getCategoryData(categorySlug)
  return allPosts.filter(post => 
    categorySlug === 'all' || post.category.toLowerCase() === categoryData.name.toLowerCase()
  )
}

const getAllCategories = () => {
  return [
    { name: 'Todos', slug: 'all', count: 24 },
    { name: 'Gestão', slug: 'gestao', count: 8 },
    { name: 'Liderança', slug: 'lideranca', count: 6 },
    { name: 'Estratégia', slug: 'estrategia', count: 5 },
    { name: 'Tecnologia', slug: 'tecnologia', count: 3 },
    { name: 'Pessoas', slug: 'pessoas', count: 2 }
  ]
}

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    sort?: string
    view?: string
    search?: string
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

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryData(params.slug)
  
  return {
    title: `${category.name} - Artigos e Insights | Administrativa(mente)`,
    description: category.longDescription,
    keywords: `${category.name.toLowerCase()}, gestão empresarial, liderança, estratégia corporativa`,
    openGraph: {
      title: `Artigos sobre ${category.name}`,
      description: category.longDescription,
      type: 'website',
    }
  }
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = getCategoryData(params.slug)
  const posts = getCategoryPosts(params.slug)
  const categories = getAllCategories()
  
  const currentSort = searchParams.sort || 'date'
  const currentView = searchParams.view || 'grid'
  const currentSearch = searchParams.search || ''
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
  
  // Apply search filter
  const filteredPosts = sortedPosts.filter(post =>
    currentSearch === '' ||
    post.title.toLowerCase().includes(currentSearch.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(currentSearch.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(currentSearch.toLowerCase()))
  )
  
  // Pagination
  const postsPerPage = 12
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="text-2xl">{category.icon}</div>
                <div>
                  <h1 className="font-serif text-xl font-bold text-foreground">
                    {category.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {category.postCount} artigos publicados
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Search */}
            <div className="block sm:hidden">
              <Button variant="ghost" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 py-16 dark:from-zinc-950 dark:to-zinc-900/50">
        <div className="container px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-white/50 p-4 text-4xl shadow-premium dark:bg-zinc-900/50">
                {category.icon}
              </div>
            </div>
            
            <h1 className="mb-4 font-serif text-4xl font-bold text-foreground lg:text-5xl">
              {category.name}
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground leading-relaxed lg:text-xl">
              {category.longDescription}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="gap-2">
                📚 {category.postCount} Artigos
              </Badge>
              <Badge variant="outline" className="gap-2">
                ⏱️ {Math.round(category.postCount * 8)} min de leitura
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="border-b border-border/40 bg-white/50 py-6 dark:bg-zinc-950/50">
        <div className="container px-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filter */}
            <CategoryFilter
              categories={categories}
              currentCategory={params.slug}
              className="order-2 lg:order-1"
            />
            
            {/* Search and Controls */}
            <div className="flex items-center gap-4 order-1 lg:order-2">
              {/* Search */}
              <div className="hidden sm:block min-w-0 flex-1 lg:w-64">
                <Input
                  placeholder="Buscar artigos..."
                  defaultValue={currentSearch}
                  className="h-9"
                />
              </div>
              
              {/* Sort */}
              <SortFilter currentSort={currentSort} />
              
              {/* View Toggle */}
              <ViewToggle currentView={currentView} />
            </div>
          </div>
          
          {/* Search Results Info */}
          {(currentSearch || currentSort !== 'date') && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {filteredPosts.length} artigo{filteredPosts.length !== 1 ? 's' : ''} 
                {currentSearch && ` para "${currentSearch}"`}
                {currentSort !== 'date' && ` ordenado${filteredPosts.length !== 1 ? 's' : ''} por ${
                  currentSort === 'popularity' ? 'popularidade' :
                  currentSort === 'reading-time' ? 'tempo de leitura' :
                  currentSort === 'alphabetical' ? 'ordem alfabética' : 'data'
                }`}
              </span>
              
              {(currentSearch || currentSort !== 'date') && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-auto p-0 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  <Link href={`/category/${params.slug}`}>
                    Limpar filtros
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24">
        <div className="container px-4">
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
                        href={`/category/${params.slug}?${new URLSearchParams({
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
                          href={`/category/${params.slug}?${new URLSearchParams({
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
                        href={`/category/${params.slug}?${new URLSearchParams({
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
                📭
              </div>
              <h3 className="mb-2 font-serif text-xl font-semibold text-foreground">
                Nenhum artigo encontrado
              </h3>
              <p className="mb-6 text-muted-foreground">
                {currentSearch 
                  ? `Não encontramos artigos para "${currentSearch}" em ${category.name}.`
                  : `Ainda não temos artigos publicados em ${category.name}.`
                }
              </p>
              <Button variant="outline" asChild>
                <Link href="/">
                  Ver todos os artigos
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
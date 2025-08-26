# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Administrativa(mente) - Blog Premium

## 📋 Visão Geral do Projeto

Desenvolvimento de um blog premium focado em gestão administrativa, liderança e estratégia corporativa. O projeto utiliza Next.js 14, Tailwind CSS e Notion API como CMS, com design minimalista inspirado no estilo Apple e foco na experiência de leitura diferenciada.

**Status do Projeto**: Em fase de setup inicial - ainda não foi inicializado

## 🎯 Objetivos

- **Blog Disruptivo**: Interface única com UX premium
- **Design Minimalista**: Inspirado no design system da Apple
- **Performance Premium**: Core Web Vitals otimizados
- **Experiência de Leitura**: Tipografia e layout focados na legibilidade
- **CMS Headless**: Integração completa com Notion API

## 🏗️ Stack Tecnológica

### Core Technologies
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS com configuração customizada
- **Language**: TypeScript (strict mode)
- **CMS**: Notion API como headless CMS
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Performance & SEO
- **Images**: next/image com otimização avançada
- **Fonts**: next/font (Inter Variable, Charter)
- **Rendering**: SSG + ISR para posts
- **Meta Tags**: Dinâmicos por página
- **Schema.org**: Structured data para SEO

### Development Tools
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky
- **Testing**: Jest + React Testing Library
- **Type Safety**: TypeScript strict mode

## 📁 Estrutura do Projeto

```
administrativa-mente/
├── README.md
├── CLAUDE.md (este arquivo)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── .eslintrc.json
├── .env.local.example
├── 
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx (Homepage)
│   │   ├── loading.tsx
│   │   ├── not-found.tsx
│   │   ├── 
│   │   ├── post/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       ├── loading.tsx
│   │   │       └── opengraph-image.tsx
│   │   ├── 
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── 
│   │   ├── author/
│   │   │   └── [slug]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   ├── 
│   │   ├── search/
│   │   │   └── page.tsx
│   │   ├── 
│   │   ├── newsletter/
│   │   │   └── page.tsx
│   │   ├── 
│   │   └── api/
│   │       ├── posts/
│   │       │   └── route.ts
│   │       ├── search/
│   │       │   └── route.ts
│   │       └── newsletter/
│   │           └── route.ts
│   ├── 
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── 
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── MobileMenu.tsx
│   │   │   └── SearchOverlay.tsx
│   │   ├── 
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── FeaturedPost.tsx
│   │   │   ├── PostContent.tsx
│   │   │   ├── RelatedPosts.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── ReadingProgress.tsx
│   │   │   └── ShareButtons.tsx
│   │   ├── 
│   │   ├── forms/
│   │   │   ├── NewsletterForm.tsx
│   │   │   └── SearchForm.tsx
│   │   ├── 
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── AnalyticsProvider.tsx
│   ├── 
│   ├── lib/
│   │   ├── notion/
│   │   │   ├── client.ts
│   │   │   ├── database.ts
│   │   │   ├── posts.ts
│   │   │   ├── authors.ts
│   │   │   └── categories.ts
│   │   ├── 
│   │   ├── utils/
│   │   │   ├── cn.ts (classnames utility)
│   │   │   ├── date.ts
│   │   │   ├── reading-time.ts
│   │   │   ├── slug.ts
│   │   │   └── seo.ts
│   │   ├── 
│   │   ├── types/
│   │   │   ├── notion.ts
│   │   │   ├── blog.ts
│   │   │   └── api.ts
│   │   ├── 
│   │   ├── constants/
│   │   │   ├── blog.ts
│   │   │   ├── seo.ts
│   │   │   └── navigation.ts
│   │   ├── 
│   │   └── hooks/
│   │       ├── useTheme.ts
│   │       ├── useSearch.ts
│   │       ├── useScrollProgress.ts
│   │       └── useLocalStorage.ts
│   ├── 
│   └── styles/
│       ├── globals.css
│       ├── components.css
│       └── animations.css
├── 
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── opengraph-image.png
│   ├── twitter-image.png
│   └── images/
│       ├── placeholders/
│       └── ui/
└── 
└── docs/
    ├── api.md
    ├── deployment.md
    └── content-strategy.md
```

## 🎨 Design System

### Paleta de Cores (Apple-inspired)
```css
/* Light Mode */
--zinc-50: #fafafa
--zinc-100: #f4f4f5
--zinc-200: #e4e4e7
--zinc-900: #18181b
--zinc-950: #09090b

/* Dark Mode */
--zinc-800: #27272a
--zinc-900: #18181b
--zinc-950: #09090b
```

### Tipografia
```css
/* Font Stack */
--font-sans: 'Inter Variable', 'SF Pro Display', system-ui
--font-serif: 'Charter', 'New York', Georgia Pro
--font-mono: 'SF Mono', 'JetBrains Mono Variable'

/* Scale */
--text-xs: 0.75rem
--text-sm: 0.875rem
--text-base: 1rem
--text-lg: 1.125rem
--text-xl: 1.25rem
--text-2xl: 1.5rem
--text-3xl: 1.875rem
--text-4xl: 2.25rem
--text-5xl: 3rem
--text-6xl: 3.75rem
--text-7xl: 4.5rem
--text-8xl: 6rem
--text-9xl: 8rem
```

### Componentes Base
- **Buttons**: 4 variantes (primary, secondary, ghost, outline)
- **Cards**: Glassmorphism com blur backdrop
- **Inputs**: Floating labels, focus states
- **Badges**: Category tags com cores semânticas
- **Modals**: Full-screen overlays com blur

## 🔧 Configurações Técnicas

### Environment Variables
```bash
# Notion
NOTION_TOKEN=
NOTION_DATABASE_ID=

# Analytics
NEXT_PUBLIC_GA_ID=
VERCEL_ANALYTICS_ID=

# Newsletter
CONVERTKIT_API_KEY=
CONVERTKIT_FORM_ID=

# Meta
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME="Administrativa(mente)"
```

### Next.js Config
```javascript
const nextConfig = {
  experimental: {
    appDir: true,
    serverActions: true,
  },
  images: {
    domains: ['images.unsplash.com', 'notion.so'],
    formats: ['image/webp', 'image/avif'],
  },
  // ... outras configurações
}
```

## 📊 Schema do Banco Notion

### Posts Database
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| Title | Title | Título do post |
| Slug | Rich Text | URL slug único |
| Status | Select | draft, published, archived |
| Published Date | Date | Data de publicação |
| Author | Relation | Relação com database Authors |
| Category | Select | Categoria principal |
| Tags | Multi-select | Tags do post |
| Excerpt | Rich Text | Resumo do post |
| Featured Image | Files | Imagem de destaque |
| Content | Rich Text | Conteúdo completo |
| SEO Title | Rich Text | Título para SEO |
| SEO Description | Rich Text | Meta description |
| Reading Time | Number | Tempo de leitura em minutos |
| Featured | Checkbox | Post em destaque |

### Authors Database
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| Name | Title | Nome do autor |
| Slug | Rich Text | URL slug do autor |
| Bio | Rich Text | Biografia |
| Avatar | Files | Foto do autor |
| Role | Rich Text | Cargo/função |
| Social Links | Rich Text | Links sociais (JSON) |

### Categories Database
| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| Name | Title | Nome da categoria |
| Slug | Rich Text | URL slug |
| Description | Rich Text | Descrição |
| Color | Select | Cor da categoria |
| Icon | Rich Text | Ícone da categoria |

## 🚀 Funcionalidades Premium

### Core Features
- ✅ **Homepage**: Hero + posts em destaque + grid
- ✅ **Post Individual**: Layout de leitura otimizado
- ✅ **Categorias**: Filtros e navegação
- ✅ **Autores**: Páginas de autor
- ✅ **Busca**: Search com autocomplete
- ✅ **Newsletter**: Integração com ConvertKit
- ✅ **Dark/Light Mode**: Toggle suave
- ✅ **Responsive**: Mobile-first design

### Advanced Features
- 🔄 **Reading Progress**: Barra de progresso
- 🔄 **Related Posts**: Algoritmo de similaridade
- 🔄 **Social Share**: Botões otimizados
- 🔄 **Comments**: Sistema de comentários
- 🔄 **Analytics**: Tracking detalhado
- 🔄 **Sitemap**: Geração automática
- 🔄 **RSS Feed**: Feed XML
- 🔄 **PWA**: Service worker

### Performance Features
- ✅ **Image Optimization**: Blur placeholders
- ✅ **Font Optimization**: Variable fonts
- ✅ **Code Splitting**: Lazy loading
- ✅ **Caching**: ISR + Edge caching
- ✅ **Compression**: Gzip + Brotli
- ✅ **Bundle Analysis**: Size optimization

## 📝 Conteúdo & SEO

### Categorias Principais
1. **Gestão** - Processos administrativos, workflows
2. **Liderança** - Management, team building
3. **Estratégia** - Planejamento, business strategy
4. **Tecnologia** - Digital transformation, tools
5. **Pessoas** - HR, cultura organizacional
6. **Processos** - Otimização, automação

### SEO Strategy
- **Keywords**: Gestão administrativa, liderança empresarial
- **Meta Tags**: Dinâmicos por página
- **Schema.org**: Article, Organization, Person
- **Open Graph**: Cards otimizados para social
- **Sitemap**: XML gerado automaticamente
- **Robots.txt**: Configurado para SEO

## 🚀 Comandos de Desenvolvimento

### Setup Inicial do Projeto
```bash
# Inicializar projeto Next.js 14
npx create-next-app@latest . --typescript --tailwind --app

# Instalar dependências principais
npm install lucide-react framer-motion @notionhq/client

# Instalar dependências de desenvolvimento
npm install -D @types/node eslint prettier husky lint-staged
```

### Comandos Principais
```bash
# Desenvolvimento
npm run dev                 # Inicia servidor de desenvolvimento

# Build e Deploy
npm run build              # Build para produção
npm run start              # Inicia servidor de produção
npm run lint               # Executa ESLint
npm run lint:fix           # Fix automático de lint

# Testes (quando configurado)
npm run test               # Executa todos os testes
npm run test:watch         # Testes em modo watch
npm run test:coverage      # Coverage report
```

## 🔄 Fluxo de Desenvolvimento

### 1. Setup Inicial (PRÓXIMO PASSO)
O projeto ainda não foi inicializado. Execute os comandos acima para começar.

### 2. Configuração Base
- Configurar Tailwind com paleta customizada
- Setup TypeScript strict mode
- Configurar ESLint + Prettier
- Setup Notion API client

### 3. Desenvolvimento por Camadas
1. **Layout & Design System** (Semana 1)
2. **Notion Integration** (Semana 2)
3. **Pages & Routing** (Semana 3)
4. **Features Avançadas** (Semana 4)
5. **Otimização & Deploy** (Semana 5)

### 4. Testing & Deploy
- Unit tests com Jest
- Integration tests
- Performance testing
- Deploy na Vercel

## 📋 Checklist de Desenvolvimento

### Phase 1: Foundation
- [ ] Setup projeto Next.js 14
- [ ] Configurar Tailwind CSS premium
- [ ] Criar design system base
- [ ] Setup TypeScript strict
- [ ] Configurar ESLint + Prettier

### Phase 2: Design System
- [ ] Componentes UI base (Button, Input, Card)
- [ ] Layout components (Header, Footer)
- [ ] Theme provider (dark/light)
- [ ] Responsive breakpoints
- [ ] Animation system

### Phase 3: Notion Integration
- [ ] Notion API client
- [ ] Database schemas
- [ ] Data fetching utilities
- [ ] Content transformation
- [ ] ISR implementation

### Phase 4: Core Pages
- [ ] Homepage com hero section
- [ ] Post individual page
- [ ] Category pages
- [ ] Author pages
- [ ] Search functionality

### Phase 5: Advanced Features
- [ ] Newsletter integration
- [ ] Social sharing
- [ ] Reading progress
- [ ] Related posts
- [ ] Comments system

### Phase 6: Performance & SEO
- [ ] Image optimization
- [ ] Meta tags dinâmicos
- [ ] Schema.org markup
- [ ] Sitemap generation
- [ ] Performance monitoring

### Phase 7: Testing & Deploy
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance testing
- [ ] Deploy pipeline
- [ ] Analytics setup

## 🎯 Métricas de Sucesso

### Performance Goals
- **Lighthouse Score**: 95+ em todas as métricas
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1
- **Bundle Size**: < 200KB (gzipped)

### User Experience Goals
- **Time on Page**: > 3 minutos
- **Bounce Rate**: < 40%
- **Page Speed**: 95+ no PageSpeed Insights
- **Accessibility**: WCAG 2.1 AA compliance

### Business Goals
- **Newsletter Signup**: 5% conversion rate
- **Social Shares**: 10+ per post
- **SEO Ranking**: Top 10 para keywords principais
- **Monthly Visitors**: 10k+ no primeiro trimestre

## 📚 Recursos & Referências

### Design Inspiration
- Apple Design Guidelines
- Vercel Design System
- Linear App
- Notion Interface

### Technical References
- Next.js 14 Documentation
- Tailwind CSS v3
- Notion API Docs
- Framer Motion Guide

### Content Strategy
- Harvard Business Review
- McKinsey Insights
- MIT Sloan Management
- Stanford Business

---

## 🏗️ Arquitetura do Código

### Estrutura de Dados (Notion)
- **Posts Database**: Conteúdo principal com status, categorias, autores
- **Authors Database**: Informações dos autores e bios
- **Categories Database**: Organização do conteúdo

### Padrões de Desenvolvimento
- **App Router**: Next.js 13+ com layout.tsx hierarchy
- **Server Components**: Padrão para componentes que não precisam de interatividade
- **Client Components**: Apenas quando necessário (forms, interactions)
- **ISR (Incremental Static Regeneration)**: Para posts e páginas dinâmicas

### Integração com Notion
- **client.ts**: Cliente base da Notion API
- **posts.ts**: Funções para buscar e transformar posts
- **Transformação de dados**: Notion blocks → HTML/React components

### Design System
- **Atomic Design**: Atoms (Button, Input) → Molecules (SearchForm) → Organisms (Header)
- **Tema Dark/Light**: Context provider para alternar temas
- **Tailwind Classes**: Utility-first com componentes customizados

## 💡 Notas para Claude Code

### Prioridades de Desenvolvimento:
1. **Setup**: Inicializar Next.js 14 com TypeScript e Tailwind
2. **Notion Integration**: Configurar API client e database schemas  
3. **Design System**: Componentes base reutilizáveis
4. **Core Pages**: Homepage, post individual, categoria
5. **Performance**: Otimização de imagens, fonts, bundle

### Considerações Técnicas:
- Use TypeScript strict mode em todos os arquivos
- Implemente error boundaries para componentes Notion
- Configure ISR com revalidation de 3600s (1 hora) para posts
- Use next/image com blur placeholders para todas as imagens
- Mantenha bundle size < 200KB (use bundle analyzer)

### Fluxo de Trabalho:
1. Sempre teste localmente com `npm run dev`
2. Execute `npm run build` antes de commits importantes
3. Use `npm run lint` para verificar código
4. Configure Notion database antes de desenvolver integração
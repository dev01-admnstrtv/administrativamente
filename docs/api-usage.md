# API Data Fetching - Guia de Uso

Este documento explica como usar as funções de data fetching implementadas com ISR e cache estratégico.

## Funcionalidades Principais

### 🚀 ISR (Incremental Static Regeneration)
- Cache inteligente com revalidação automática
- Tempos de cache otimizados por tipo de conteúdo
- Background revalidation para performance máxima

### 📊 Cache Estratégico
- Posts: 1 hora de cache
- Posts individuais: 2 horas de cache  
- Categorias: 24 horas de cache
- Autores: 12 horas de cache

### 🔄 Webhooks & Revalidation
- Webhooks do Notion para invalidação automática
- API de revalidação manual para desenvolvimento
- Health checks para monitoramento

## Como Usar

### 1. Posts

```typescript
import { getAllPosts, getFeaturedPosts, getPostBySlugWithContent } from '@/lib/api'

// Obter todos os posts (com cache ISR)
const postsData = await getAllPosts({
  limit: 10,
  page: 1,
  featured: false
})

// Posts em destaque
const featuredPosts = await getFeaturedPosts(3)

// Post individual com conteúdo
const post = await getPostBySlugWithContent('meu-post-slug')
```

### 2. Categorias

```typescript
import { getAllCategories, getPostsByCategory } from '@/lib/api'

// Todas as categorias (com fallback para categorias do CLAUDE.md)
const categories = await getAllCategories()

// Posts de uma categoria específica
const categoryData = await getPostsByCategory('gestao', {
  limit: 10,
  page: 1
})
```

### 3. Autores

```typescript
import { getAllAuthors, getAuthorBySlugWithPosts } from '@/lib/api'

// Todos os autores
const authors = await getAllAuthors()

// Autor específico com seus posts
const authorData = await getAuthorBySlugWithPosts('nome-autor')
```

### 4. Busca

```typescript
import { searchPostsWithCache } from '@/lib/api'

// Busca com cache
const searchResults = await searchPostsWithCache('gestão de equipes', {
  limit: 20,
  page: 1
})
```

## Configuração do Environment

```bash
# .env.local
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_database_id_here

# Opcionais para databases separados
NOTION_AUTHORS_DATABASE_ID=your_authors_db_id
NOTION_CATEGORIES_DATABASE_ID=your_categories_db_id

# Para webhooks e revalidação
NOTION_WEBHOOK_SECRET=your_webhook_secret
REVALIDATE_SECRET=your_revalidate_secret
```

## Revalidação Manual

### API de Revalidação

```bash
# Revalidar todos os posts
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"posts"}'

# Revalidar post específico
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"post","slug":"meu-post"}'

# Revalidar tudo
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret":"your_secret","type":"all"}'
```

### Via GET (para testes)

```bash
curl "http://localhost:3000/api/revalidate?secret=your_secret&type=posts"
```

## Health Check

```bash
curl http://localhost:3000/api/health
```

Retorna:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "responseTimeMs": 150,
  "dataSources": {
    "notion": {
      "status": "healthy",
      "databases": {
        "posts": true,
        "categories": false,
        "authors": false
      }
    }
  },
  "cache": {
    "status": "healthy",
    "stats": {
      "totalEntries": 25,
      "expiredEntries": 2,
      "totalSizeKB": 180
    }
  }
}
```

## Webhook do Notion

Configure o webhook no Notion para:
```
URL: https://yourdomain.com/api/webhook/notion
Secret: your_webhook_secret
```

O webhook detecta automaticamente:
- Criação/atualização de posts
- Mudanças em autores
- Modificações de categorias

E invalida o cache apropriado.

## Error Handling

As funções incluem error handling robusto:

```typescript
import { safeAsync, createFallbackData } from '@/lib/api'

// Função segura que nunca falha
const posts = await safeAsync(
  () => getAllPosts(),
  [], // fallback vazio
  { logError: true }
)

// Dados de fallback quando Notion está indisponível
const fallback = createFallbackData()
```

## Cache Management

```typescript
import { CacheManager, warmCache, debugCache } from '@/lib/api'

// Warming do cache na inicialização
await warmCache()

// Debug do cache (development only)
debugCache()

// Gerenciamento manual do cache
const cache = CacheManager.getInstance()
cache.clear() // Limpar tudo
cache.invalidateByPattern('posts*') // Limpar por padrão
```

## Performance Tips

1. **Use ISR**: As funções já implementam ISR automaticamente
2. **Cache Warming**: Execute `warmCache()` no startup da aplicação
3. **Fallbacks**: Sempre tenha dados de fallback para categorias
4. **Error Boundaries**: Implemente error boundaries no React
5. **Loading States**: Use Suspense para melhor UX

## Exemplo de Uso em Páginas

```typescript
// app/page.tsx
import { getAllPosts, getFeaturedPosts } from '@/lib/api'

export default async function HomePage() {
  const [posts, featured] = await Promise.all([
    getAllPosts({ limit: 6 }),
    getFeaturedPosts(3)
  ])

  return (
    <div>
      <FeaturedSection posts={featured.posts} />
      <PostsGrid posts={posts.posts} />
    </div>
  )
}

// app/post/[slug]/page.tsx
import { getPostBySlugWithContent, getRelatedPostsWithCache } from '@/lib/api'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlugWithContent(params.slug)
  
  if (!post) {
    notFound()
  }

  const related = await getRelatedPostsWithCache(post.id, 4)

  return (
    <article>
      <PostContent post={post} />
      <RelatedPosts posts={related} />
    </article>
  )
}
```

## Monitoramento

- Health check em `/api/health`
- Logs estruturados para debugging
- Métricas de cache e performance
- Alertas para falhas do Notion API

Este sistema fornece uma base sólida para o blog com performance otimizada e resilência a falhas.
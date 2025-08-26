import { unstable_cache } from 'next/cache'
import { 
  getPublishedPosts,
  getFeaturedPosts as getNotionFeaturedPosts,
  getPostBySlug,
  getPostById,
  getPostContent,
  getRelatedPosts,
  searchPosts,
  getAllAuthors as getNotionAllAuthors,
  getAuthorBySlug,
  getAllCategories as getNotionAllCategories,
  getCategoryBySlug,
  getDefaultCategories,
  isAuthorsConfigured,
  isCategoriesConfigured
} from '@/lib/notion'
import {
  transformNotionPost,
  transformNotionAuthor,
  transformNotionCategory,
  transformBlocksToHtml
} from '@/lib/notion/transforms'
import { CACHE_CONFIG, CACHE_KEYS, withCache } from '@/lib/cache'
import type { BlogPost, BlogAuthor, BlogCategory } from '@/lib/types/blog'

/**
 * Get all posts with caching and ISR
 */
export const getAllPosts = unstable_cache(
  async (options?: {
    limit?: number
    page?: number
    category?: string
    author?: string
    featured?: boolean
  }): Promise<{
    posts: BlogPost[]
    hasMore: boolean
    nextCursor: string | null
    total: number
  }> => {
    try {
      const { limit = 10, page = 1, category, author, featured } = options || {}
      const startCursor = page > 1 ? undefined : undefined // TODO: Implement cursor-based pagination
      
      let response
      
      if (featured) {
        const notionPosts = await getNotionFeaturedPosts(limit)
        response = {
          posts: notionPosts,
          hasMore: false,
          nextCursor: null
        }
      } else if (category) {
        response = await getPublishedPosts({
          pageSize: limit,
          startCursor
        })
        // TODO: Filter by category
      } else if (author) {
        response = await getPublishedPosts({
          pageSize: limit,
          startCursor
        })
        // TODO: Filter by author
      } else {
        response = await getPublishedPosts({
          pageSize: limit,
          startCursor
        })
      }

      // Transform posts to blog format
      const transformedPosts = await Promise.all(
        response.posts.map(async (post) => {
          // Get related data
          const [author, category] = await Promise.allSettled([
            post.properties.Author.relation[0]?.id 
              ? getAuthorByIdSafe(post.properties.Author.relation[0].id)
              : Promise.resolve(null),
            post.properties.Category.select?.name
              ? getCategoryByNameSafe(post.properties.Category.select.name)
              : Promise.resolve(null)
          ])

          return transformNotionPost(
            post,
            author.status === 'fulfilled' ? author.value : null,
            category.status === 'fulfilled' ? category.value : null
          )
        })
      )

      return {
        posts: transformedPosts,
        hasMore: response.hasMore,
        nextCursor: response.nextCursor,
        total: transformedPosts.length // TODO: Get actual total count
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return {
        posts: [],
        hasMore: false,
        nextCursor: null,
        total: 0
      }
    }
  },
  [CACHE_KEYS.posts()],
  {
    revalidate: CACHE_CONFIG.POSTS.revalidate,
    tags: CACHE_CONFIG.POSTS.tags
  }
)

/**
 * Get featured posts with caching
 */
export const getFeaturedPosts = unstable_cache(
  async (limit = 3): Promise<BlogPost[]> => {
    try {
      const response = await getAllPosts({ featured: true, limit })
      return response.posts
    } catch (error) {
      console.error('Error fetching featured posts:', error)
      return []
    }
  },
  [CACHE_KEYS.featuredPosts()],
  {
    revalidate: CACHE_CONFIG.POSTS.revalidate,
    tags: CACHE_CONFIG.POSTS.tags
  }
)

/**
 * Get single post by slug with ISR
 */
export const getPostBySlugWithContent = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    if (!slug) return null

    try {
      // Get post data
      const notionPost = await getPostBySlug(slug)
      if (!notionPost) return null

      // Get related data in parallel
      const [authorResult, categoryResult, contentResult] = await Promise.allSettled([
        notionPost.properties.Author.relation[0]?.id 
          ? getAuthorByIdSafe(notionPost.properties.Author.relation[0].id)
          : Promise.resolve(null),
        notionPost.properties.Category.select?.name
          ? getCategoryByNameSafe(notionPost.properties.Category.select.name)
          : Promise.resolve(null),
        getPostContent(notionPost.id)
      ])

      // Transform to blog post
      const blogPost = transformNotionPost(
        notionPost,
        authorResult.status === 'fulfilled' ? authorResult.value : null,
        categoryResult.status === 'fulfilled' ? categoryResult.value : null
      )

      // Add content
      if (contentResult.status === 'fulfilled') {
        blogPost.content = transformBlocksToHtml(contentResult.value)
      }

      return blogPost
    } catch (error) {
      console.error(`Error fetching post ${slug}:`, error)
      return null
    }
  },
  [CACHE_KEYS.post],
  {
    revalidate: CACHE_CONFIG.POST.revalidate,
    tags: CACHE_CONFIG.POST.tags
  }
)

/**
 * Get posts by category with caching
 */
export const getPostsByCategory = unstable_cache(
  async (
    categorySlug: string,
    options?: { limit?: number; page?: number }
  ): Promise<{
    posts: BlogPost[]
    category: BlogCategory | null
    hasMore: boolean
  }> => {
    try {
      const { limit = 10, page = 1 } = options || {}

      // Get category first
      const category = await getCategoryBySlugSafe(categorySlug)
      if (!category) {
        return { posts: [], category: null, hasMore: false }
      }

      // Get posts for this category
      const response = await getAllPosts({
        limit,
        page,
        category: category.name
      })

      return {
        posts: response.posts,
        category: transformNotionCategory(category),
        hasMore: response.hasMore
      }
    } catch (error) {
      console.error(`Error fetching posts for category ${categorySlug}:`, error)
      return { posts: [], category: null, hasMore: false }
    }
  },
  [CACHE_KEYS.postsByCategory],
  {
    revalidate: CACHE_CONFIG.POSTS.revalidate,
    tags: [...CACHE_CONFIG.POSTS.tags, ...CACHE_CONFIG.CATEGORIES.tags]
  }
)

/**
 * Get all categories with caching
 */
export const getAllCategories = unstable_cache(
  async (): Promise<BlogCategory[]> => {
    try {
      if (!isCategoriesConfigured()) {
        // Return default categories from CLAUDE.md
        return getDefaultCategories().map(cat => ({
          id: cat.slug,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          icon: cat.icon,
          colorClasses: {
            background: 'bg-zinc-100 dark:bg-zinc-900/20',
            text: 'text-zinc-800 dark:text-zinc-200',
            border: 'border-zinc-200 dark:border-zinc-800'
          },
          notion: {
            pageId: '',
            lastEditedTime: new Date().toISOString(),
            url: ''
          }
        }))
      }

      const notionCategories = await getNotionAllCategories()
      return notionCategories.map(transformNotionCategory)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Return default categories as fallback
      return getDefaultCategories().map(cat => ({
        id: cat.slug,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        color: cat.color,
        icon: cat.icon,
        colorClasses: {
          background: 'bg-zinc-100 dark:bg-zinc-900/20',
          text: 'text-zinc-800 dark:text-zinc-200',
          border: 'border-zinc-200 dark:border-zinc-800'
        },
        notion: {
          pageId: '',
          lastEditedTime: new Date().toISOString(),
          url: ''
        }
      }))
    }
  },
  [CACHE_KEYS.categories()],
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags
  }
)

/**
 * Get category by slug with caching
 */
export const getCategoryBySlugWithPosts = unstable_cache(
  async (slug: string): Promise<BlogCategory | null> => {
    try {
      const category = await getCategoryBySlugSafe(slug)
      return category ? transformNotionCategory(category) : null
    } catch (error) {
      console.error(`Error fetching category ${slug}:`, error)
      return null
    }
  },
  [CACHE_KEYS.category],
  {
    revalidate: CACHE_CONFIG.CATEGORIES.revalidate,
    tags: CACHE_CONFIG.CATEGORIES.tags
  }
)

/**
 * Get all authors with caching
 */
export const getAllAuthors = unstable_cache(
  async (): Promise<BlogAuthor[]> => {
    try {
      if (!isAuthorsConfigured()) {
        console.warn('Authors database not configured')
        return []
      }

      const notionAuthors = await getNotionAllAuthors()
      return notionAuthors.map(transformNotionAuthor)
    } catch (error) {
      console.error('Error fetching authors:', error)
      return []
    }
  },
  [CACHE_KEYS.authors()],
  {
    revalidate: CACHE_CONFIG.AUTHORS.revalidate,
    tags: CACHE_CONFIG.AUTHORS.tags
  }
)

/**
 * Get author by slug with caching
 */
export const getAuthorBySlugWithPosts = unstable_cache(
  async (slug: string): Promise<{
    author: BlogAuthor | null
    posts: BlogPost[]
  }> => {
    try {
      const author = await getAuthorBySlugSafe(slug)
      if (!author) {
        return { author: null, posts: [] }
      }

      // Get posts by this author
      const response = await getAllPosts({
        author: author.id,
        limit: 20
      })

      return {
        author: transformNotionAuthor(author),
        posts: response.posts
      }
    } catch (error) {
      console.error(`Error fetching author ${slug}:`, error)
      return { author: null, posts: [] }
    }
  },
  [CACHE_KEYS.author],
  {
    revalidate: CACHE_CONFIG.AUTHORS.revalidate,
    tags: [...CACHE_CONFIG.AUTHORS.tags, ...CACHE_CONFIG.POSTS.tags]
  }
)

/**
 * Search posts with caching
 */
export const searchPostsWithCache = unstable_cache(
  async (
    query: string,
    options?: { limit?: number; page?: number }
  ): Promise<{
    posts: BlogPost[]
    query: string
    hasMore: boolean
    total: number
  }> => {
    if (!query.trim()) {
      return { posts: [], query, hasMore: false, total: 0 }
    }

    try {
      const { limit = 20, page = 1 } = options || {}
      
      const response = await searchPosts(query, {
        pageSize: limit,
        startCursor: page > 1 ? undefined : undefined
      })

      // Transform posts
      const transformedPosts = await Promise.all(
        response.posts.map(async (post) => {
          const [author, category] = await Promise.allSettled([
            post.properties.Author.relation[0]?.id 
              ? getAuthorByIdSafe(post.properties.Author.relation[0].id)
              : Promise.resolve(null),
            post.properties.Category.select?.name
              ? getCategoryByNameSafe(post.properties.Category.select.name)
              : Promise.resolve(null)
          ])

          return transformNotionPost(
            post,
            author.status === 'fulfilled' ? author.value : null,
            category.status === 'fulfilled' ? category.value : null
          )
        })
      )

      return {
        posts: transformedPosts,
        query: query.trim(),
        hasMore: response.hasMore,
        total: transformedPosts.length
      }
    } catch (error) {
      console.error(`Error searching posts for "${query}":`, error)
      return { posts: [], query, hasMore: false, total: 0 }
    }
  },
  [CACHE_KEYS.search],
  {
    revalidate: CACHE_CONFIG.SEARCH.revalidate,
    tags: CACHE_CONFIG.SEARCH.tags
  }
)

/**
 * Get related posts with caching
 */
export const getRelatedPostsWithCache = unstable_cache(
  async (postId: string, limit = 4): Promise<BlogPost[]> => {
    try {
      // Get the current post to extract category and tags
      const currentPost = await getPostById(postId)
      if (!currentPost) return []

      const category = currentPost.properties.Category.select?.name
      const tags = currentPost.properties.Tags.multi_select.map(t => t.name)

      const relatedPosts = await getRelatedPosts(postId, category, tags, limit)

      // Transform to blog posts
      return Promise.all(
        relatedPosts.map(async (post) => {
          const [author, categoryData] = await Promise.allSettled([
            post.properties.Author.relation[0]?.id 
              ? getAuthorByIdSafe(post.properties.Author.relation[0].id)
              : Promise.resolve(null),
            post.properties.Category.select?.name
              ? getCategoryByNameSafe(post.properties.Category.select.name)
              : Promise.resolve(null)
          ])

          return transformNotionPost(
            post,
            author.status === 'fulfilled' ? author.value : null,
            categoryData.status === 'fulfilled' ? categoryData.value : null
          )
        })
      )
    } catch (error) {
      console.error(`Error fetching related posts for ${postId}:`, error)
      return []
    }
  },
  [CACHE_KEYS.relatedPosts],
  {
    revalidate: CACHE_CONFIG.POSTS.revalidate,
    tags: CACHE_CONFIG.POSTS.tags
  }
)

// Safe helper functions that don't throw errors
async function getAuthorByIdSafe(authorId: string) {
  try {
    const { getAuthorById } = await import('@/lib/notion/authors')
    return await getAuthorById(authorId)
  } catch (error) {
    console.warn(`Failed to fetch author ${authorId}:`, error)
    return null
  }
}

async function getCategoryByNameSafe(categoryName: string) {
  try {
    const { getCategoryByName } = await import('@/lib/notion/categories')
    return await getCategoryByName(categoryName)
  } catch (error) {
    console.warn(`Failed to fetch category ${categoryName}:`, error)
    return null
  }
}

async function getCategoryBySlugSafe(categorySlug: string) {
  try {
    return await getCategoryBySlug(categorySlug)
  } catch (error) {
    console.warn(`Failed to fetch category ${categorySlug}:`, error)
    return null
  }
}

async function getAuthorBySlugSafe(authorSlug: string) {
  try {
    return await getAuthorBySlug(authorSlug)
  } catch (error) {
    console.warn(`Failed to fetch author ${authorSlug}:`, error)
    return null
  }
}

/**
 * Revalidation helpers
 */
export async function revalidateAllPosts() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('posts')
}

export async function revalidatePost(slug: string) {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('post')
}

export async function revalidateCategories() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('categories')
}

export async function revalidateAuthors() {
  const { revalidateTag } = await import('next/cache')
  revalidateTag('authors')
}

/**
 * Health check for data sources
 */
export async function checkDataHealth(): Promise<{
  notion: boolean
  posts: boolean
  categories: boolean
  authors: boolean
  errors: string[]
}> {
  const errors: string[] = []
  let notion = false
  let posts = false
  let categories = false
  let authors = false

  try {
    const { validateNotionConnection } = await import('@/lib/notion/client')
    const validation = await validateNotionConnection()
    notion = validation.isValid
    posts = validation.databases.posts
    categories = validation.databases.categories
    authors = validation.databases.authors
    
    if (!validation.isValid) {
      errors.push(...validation.errors)
    }
  } catch (error) {
    errors.push(`Connection check failed: ${error}`)
  }

  return {
    notion,
    posts,
    categories,
    authors,
    errors
  }
}
// Cache configuration for different data types
export const CACHE_CONFIG = {
  // Posts change frequently, moderate cache
  POSTS: {
    revalidate: 3600, // 1 hour
    tags: ['posts']
  },
  
  // Individual posts can be cached longer
  POST: {
    revalidate: 7200, // 2 hours
    tags: ['post']
  },
  
  // Categories rarely change, longer cache
  CATEGORIES: {
    revalidate: 86400, // 24 hours
    tags: ['categories']
  },
  
  // Authors rarely change, longer cache
  AUTHORS: {
    revalidate: 43200, // 12 hours
    tags: ['authors']
  },
  
  // Homepage needs fresh content
  HOMEPAGE: {
    revalidate: 1800, // 30 minutes
    tags: ['homepage', 'posts']
  },
  
  // Search results should be fresh
  SEARCH: {
    revalidate: 900, // 15 minutes
    tags: ['search', 'posts']
  }
} as const

/**
 * Cache key generators
 */
export const CACHE_KEYS = {
  posts: (page = 1, limit = 10) => `posts:page:${page}:limit:${limit}`,
  postsByCategory: (category: string, page = 1) => `posts:category:${category}:page:${page}`,
  postsByAuthor: (author: string, page = 1) => `posts:author:${author}:page:${page}`,
  post: (slug: string) => `post:${slug}`,
  postContent: (id: string) => `post:content:${id}`,
  categories: () => 'categories:all',
  category: (slug: string) => `category:${slug}`,
  authors: () => 'authors:all',
  author: (slug: string) => `author:${slug}`,
  featuredPosts: (limit = 3) => `posts:featured:limit:${limit}`,
  relatedPosts: (postId: string, limit = 4) => `posts:related:${postId}:limit:${limit}`,
  search: (query: string, page = 1) => `search:${query}:page:${page}`,
  stats: (type: 'posts' | 'authors' | 'categories') => `stats:${type}`
}

/**
 * Cache utilities for ISR
 */
export class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any, ttlSeconds = 3600): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    const isExpired = Date.now() - entry.timestamp > entry.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Invalidate cache by pattern
  invalidateByPattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }

  // Get cache stats
  getStats() {
    let totalSize = 0
    let expiredCount = 0
    const now = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      totalSize += JSON.stringify(entry.data).length
      if (now - entry.timestamp > entry.ttl) {
        expiredCount++
      }
    }

    return {
      totalEntries: this.cache.size,
      expiredEntries: expiredCount,
      totalSizeBytes: totalSize,
      keys: Array.from(this.cache.keys())
    }
  }
}

/**
 * Wrap async functions with caching
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    keyGenerator: (...args: Parameters<T>) => string
    ttlSeconds?: number
    skipCache?: boolean
  }
): T {
  return (async (...args: Parameters<T>) => {
    if (options.skipCache) {
      return await fn(...args)
    }

    const cache = CacheManager.getInstance()
    const key = options.keyGenerator(...args)
    
    // Try to get from cache first
    const cached = cache.get(key)
    if (cached) {
      return cached
    }

    // Execute function and cache result
    try {
      const result = await fn(...args)
      cache.set(key, result, options.ttlSeconds || 3600)
      return result
    } catch (error) {
      // Don't cache errors
      throw error
    }
  }) as T
}

/**
 * Cache warming utilities
 */
export async function warmCache() {
  console.log('Starting cache warm-up...')
  
  try {
    // Import functions dynamically to avoid circular dependencies
    const { getAllPosts, getFeaturedPosts, getAllCategories, getAllAuthors } = await import('./api/data')
    
    // Warm up essential data
    await Promise.allSettled([
      getAllPosts({ limit: 10 }), // First page of posts
      getFeaturedPosts(),
      getAllCategories(),
      getAllAuthors()
    ])
    
    console.log('Cache warm-up completed')
  } catch (error) {
    console.error('Cache warm-up failed:', error)
  }
}

/**
 * Development cache debugging
 */
export function debugCache() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const cache = CacheManager.getInstance()
  const stats = cache.getStats()
  
  console.log('🗂️ Cache Debug Info:', {
    ...stats,
    sizeKB: Math.round(stats.totalSizeBytes / 1024)
  })
}
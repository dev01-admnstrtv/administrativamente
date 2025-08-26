/**
 * Main API exports for the blog
 * This file provides clean imports for all data fetching functions
 */

// Main data fetching functions
export {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlugWithContent,
  getPostsByCategory,
  getAllCategories,
  getCategoryBySlugWithPosts,
  getAllAuthors,
  getAuthorBySlugWithPosts,
  searchPostsWithCache,
  getRelatedPostsWithCache,
  checkDataHealth
} from './data'

// Cache utilities
export {
  CACHE_CONFIG,
  CACHE_KEYS,
  CacheManager,
  withCache,
  warmCache,
  debugCache
} from '../cache'

// Error handling
export {
  BlogError,
  NotionError,
  CacheError,
  ERROR_CODES,
  handleNotionError,
  withRetry,
  safeAsync,
  validateSlug,
  validatePagination,
  createErrorResponse,
  logError,
  isRetryableError,
  getUserFriendlyMessage,
  validateEnvironment,
  createFallbackData
} from './errors'

// Revalidation helpers (re-export from data.ts)
export {
  revalidateAllPosts,
  revalidatePost,
  revalidateCategories,
  revalidateAuthors
} from './data'

// Types
export type {
  BlogPost,
  BlogAuthor,
  BlogCategory
} from '../types/blog'

// Simplified API for common use cases
export const api = {
  // Posts
  posts: {
    getAll: getAllPosts,
    getFeatured: getFeaturedPosts,
    getBySlug: getPostBySlugWithContent,
    getByCategory: getPostsByCategory,
    search: searchPostsWithCache,
    getRelated: getRelatedPostsWithCache
  },
  
  // Categories
  categories: {
    getAll: getAllCategories,
    getBySlug: getCategoryBySlugWithPosts
  },
  
  // Authors
  authors: {
    getAll: getAllAuthors,
    getBySlug: getAuthorBySlugWithPosts
  },
  
  // System
  system: {
    healthCheck: checkDataHealth,
    warmCache,
    debugCache: debugCache
  }
} as const

// Re-export from data.ts for backward compatibility
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlugWithContent,
  getPostsByCategory,
  getAllCategories,
  getCategoryBySlugWithPosts,
  getAllAuthors,
  getAuthorBySlugWithPosts,
  searchPostsWithCache,
  getRelatedPostsWithCache,
  checkDataHealth
} from './data'

import { warmCache, debugCache } from '../cache'
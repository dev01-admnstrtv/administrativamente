/**
 * Error handling utilities for the blog API
 */

export class BlogError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode = 500,
    public details?: any
  ) {
    super(message)
    this.name = 'BlogError'
  }
}

export class NotionError extends BlogError {
  constructor(message: string, code: string, details?: any) {
    super(message, code, 500, details)
    this.name = 'NotionError'
  }
}

export class CacheError extends BlogError {
  constructor(message: string, details?: any) {
    super(message, 'CACHE_ERROR', 500, details)
    this.name = 'CacheError'
  }
}

// Error codes
export const ERROR_CODES = {
  // Notion API errors
  NOTION_UNAUTHORIZED: 'NOTION_UNAUTHORIZED',
  NOTION_NOT_FOUND: 'NOTION_NOT_FOUND',
  NOTION_RATE_LIMITED: 'NOTION_RATE_LIMITED',
  NOTION_CONNECTION_FAILED: 'NOTION_CONNECTION_FAILED',
  
  // Data errors
  POST_NOT_FOUND: 'POST_NOT_FOUND',
  CATEGORY_NOT_FOUND: 'CATEGORY_NOT_FOUND',
  AUTHOR_NOT_FOUND: 'AUTHOR_NOT_FOUND',
  INVALID_SLUG: 'INVALID_SLUG',
  
  // Cache errors
  CACHE_MISS: 'CACHE_MISS',
  CACHE_EXPIRED: 'CACHE_EXPIRED',
  
  // Generic errors
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR'
} as const

/**
 * Handle Notion API errors and convert to BlogError
 */
export function handleNotionError(error: any): BlogError {
  if (!error) {
    return new NotionError('Unknown Notion error', ERROR_CODES.SERVER_ERROR)
  }

  // Extract error details
  const message = error.message || 'Notion API error'
  const code = error.code || ERROR_CODES.SERVER_ERROR
  
  switch (code) {
    case 'unauthorized':
      return new NotionError(
        'Notion API authentication failed. Check your NOTION_TOKEN.',
        ERROR_CODES.NOTION_UNAUTHORIZED,
        { originalError: error }
      )
    
    case 'object_not_found':
      return new NotionError(
        'Requested Notion object not found. Check your database IDs and permissions.',
        ERROR_CODES.NOTION_NOT_FOUND,
        { originalError: error }
      )
    
    case 'rate_limited':
      return new NotionError(
        'Notion API rate limit exceeded. Please retry later.',
        ERROR_CODES.NOTION_RATE_LIMITED,
        { originalError: error, retryAfter: error.retryAfter }
      )
    
    case 'internal_server_error':
    case 'service_unavailable':
      return new NotionError(
        'Notion API is temporarily unavailable. Please retry later.',
        ERROR_CODES.NOTION_CONNECTION_FAILED,
        { originalError: error }
      )
    
    default:
      return new NotionError(
        `Notion API error: ${message}`,
        ERROR_CODES.SERVER_ERROR,
        { originalError: error }
      )
  }
}

/**
 * Retry wrapper for API calls
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: {
    maxRetries?: number
    delayMs?: number
    backoffMultiplier?: number
    retryCondition?: (error: any) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoffMultiplier = 2,
    retryCondition = (error) => error?.code === 'rate_limited' || error?.code === 'service_unavailable'
  } = options

  let lastError: any
  let delay = delayMs

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      // Don't retry on last attempt
      if (attempt > maxRetries) {
        break
      }
      
      // Check if we should retry this error
      if (!retryCondition(error)) {
        break
      }
      
      console.warn(`Operation failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`, {
        error: error?.message,
        code: error?.code
      })
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= backoffMultiplier
    }
  }

  throw handleNotionError(lastError)
}

/**
 * Safe wrapper that catches errors and returns fallback values
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  options: {
    logError?: boolean
    errorMessage?: string
  } = {}
): Promise<T> {
  const { logError = true, errorMessage } = options

  try {
    return await operation()
  } catch (error) {
    if (logError) {
      console.error(errorMessage || 'Operation failed, using fallback:', {
        error: error instanceof Error ? error.message : error,
        code: (error as any)?.code
      })
    }
    return fallback
  }
}

/**
 * Validate slug format
 */
export function validateSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    throw new BlogError('Invalid slug: must be a non-empty string', ERROR_CODES.INVALID_SLUG)
  }
  
  const cleanSlug = slug.trim().toLowerCase()
  
  if (!cleanSlug) {
    throw new BlogError('Invalid slug: cannot be empty', ERROR_CODES.INVALID_SLUG)
  }
  
  // Check for invalid characters (allow letters, numbers, hyphens)
  if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
    throw new BlogError(
      'Invalid slug: can only contain lowercase letters, numbers, and hyphens',
      ERROR_CODES.INVALID_SLUG
    )
  }
  
  return cleanSlug
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: number, limit?: number) {
  const validPage = Math.max(1, Math.floor(page || 1))
  const validLimit = Math.min(100, Math.max(1, Math.floor(limit || 10)))
  
  return { page: validPage, limit: validLimit }
}

/**
 * Create error response for API routes
 */
export function createErrorResponse(error: BlogError | Error, fallback = 'Internal server error') {
  if (error instanceof BlogError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...(error.details && { details: error.details })
    }
  }
  
  // Generic error
  return {
    error: fallback,
    code: ERROR_CODES.SERVER_ERROR,
    statusCode: 500
  }
}

/**
 * Log error with context
 */
export function logError(error: any, context: string, metadata?: any) {
  const errorInfo = {
    context,
    message: error instanceof Error ? error.message : String(error),
    code: (error as any)?.code,
    stack: error instanceof Error ? error.stack : undefined,
    metadata
  }
  
  console.error('Blog API Error:', errorInfo)
  
  // In production, you might want to send this to an external logging service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToLogService(errorInfo)
  }
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (!error) return false
  
  const retryableCodes = [
    'rate_limited',
    'service_unavailable',
    'internal_server_error',
    'timeout'
  ]
  
  return retryableCodes.includes(error.code)
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: BlogError | Error): string {
  if (error instanceof BlogError) {
    switch (error.code) {
      case ERROR_CODES.POST_NOT_FOUND:
        return 'Sorry, this post could not be found.'
      
      case ERROR_CODES.CATEGORY_NOT_FOUND:
        return 'Sorry, this category could not be found.'
      
      case ERROR_CODES.AUTHOR_NOT_FOUND:
        return 'Sorry, this author could not be found.'
      
      case ERROR_CODES.NOTION_UNAUTHORIZED:
        return 'There was an issue accessing the content. Please try again later.'
      
      case ERROR_CODES.NOTION_RATE_LIMITED:
        return 'Too many requests. Please wait a moment and try again.'
      
      case ERROR_CODES.NOTION_CONNECTION_FAILED:
        return 'Service temporarily unavailable. Please try again later.'
      
      default:
        return 'Something went wrong. Please try again later.'
    }
  }
  
  return 'An unexpected error occurred. Please try again later.'
}

/**
 * Environment validation
 */
export function validateEnvironment() {
  const required = ['NOTION_TOKEN']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new BlogError(
      `Missing required environment variables: ${missing.join(', ')}`,
      ERROR_CODES.INVALID_REQUEST
    )
  }
  
  // Warn about optional but recommended variables
  const recommended = ['NOTION_DATABASE_ID', 'REVALIDATE_SECRET']
  const missingRecommended = recommended.filter(key => !process.env[key])
  
  if (missingRecommended.length > 0) {
    console.warn(`Missing recommended environment variables: ${missingRecommended.join(', ')}`)
  }
}

/**
 * Create fallback data for when Notion is unavailable
 */
export function createFallbackData() {
  return {
    posts: [],
    categories: [
      { id: 'gestao', name: 'Gestão', slug: 'gestao', description: 'Processos administrativos e workflows' },
      { id: 'lideranca', name: 'Liderança', slug: 'lideranca', description: 'Management e team building' },
      { id: 'estrategia', name: 'Estratégia', slug: 'estrategia', description: 'Planejamento e business strategy' },
      { id: 'tecnologia', name: 'Tecnologia', slug: 'tecnologia', description: 'Digital transformation e tools' },
      { id: 'pessoas', name: 'Pessoas', slug: 'pessoas', description: 'HR e cultura organizacional' },
      { id: 'processos', name: 'Processos', slug: 'processos', description: 'Otimização e automação' }
    ],
    authors: [],
    lastUpdated: new Date().toISOString()
  }
}
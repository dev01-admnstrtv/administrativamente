import type { 
  BlogPost, 
  BlogPostSummary, 
  BlogAuthor, 
  BlogCategory, 
  BlogSearchResponse,
  BlogCategoryPage,
  BlogAuthorPage,
  BlogHomepage,
  NewsletterSubscription,
  SearchFilters
} from './blog'

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Base API request interface
 */
export interface ApiRequest<T = any> {
  body?: T
  params?: Record<string, string>
  query?: Record<string, string | string[]>
  headers?: Record<string, string>
}

/**
 * Posts API request types
 */
export interface GetPostsRequest {
  page?: number
  limit?: number
  category?: string
  author?: string
  tag?: string
  featured?: boolean
  status?: 'published' | 'draft' | 'archived'
  sortBy?: 'date' | 'title' | 'readingTime'
  sortOrder?: 'asc' | 'desc'
}

export interface GetPostRequest {
  slug: string
  includeContent?: boolean
  includeDraft?: boolean
}

export interface SearchPostsRequest {
  q: string
  page?: number
  limit?: number
  filters?: Partial<SearchFilters>
}

/**
 * Newsletter API request types
 */
export interface NewsletterSubscribeRequest extends NewsletterSubscription {}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Base API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  meta?: ResponseMeta
}

/**
 * Response metadata
 */
export interface ResponseMeta {
  timestamp: string
  requestId?: string
  version?: string
  cached?: boolean
  cacheExpiry?: string
  executionTime?: number
}

/**
 * Success response wrapper
 */
export interface SuccessResponse<T> extends ApiResponse<T> {
  success: true
  data: T
  error?: never
}

/**
 * Error response wrapper
 */
export interface ErrorResponse extends ApiResponse<never> {
  success: false
  data?: never
  error: ApiError
}

/**
 * Posts API response types
 */
export interface GetPostsResponse extends SuccessResponse<{
  posts: BlogPostSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
  }
  filters?: {
    category?: string
    author?: string
    tag?: string
    featured?: boolean
  }
}> {}

export interface GetPostResponse extends SuccessResponse<{
  post: BlogPost
  related?: BlogPostSummary[]
}> {}

export interface SearchPostsResponse extends SuccessResponse<BlogSearchResponse> {}

/**
 * Categories API response types
 */
export interface GetCategoriesResponse extends SuccessResponse<{
  categories: BlogCategory[]
  stats?: {
    total: number
    withDescription: number
    withIcon: number
    postDistribution: Array<{ category: string; count: number }>
  }
}> {}

export interface GetCategoryResponse extends SuccessResponse<BlogCategoryPage> {}

/**
 * Homepage API response
 */
export interface GetHomepageResponse extends SuccessResponse<BlogHomepage> {}

/**
 * Newsletter API response types
 */
export interface NewsletterSubscribeResponse extends SuccessResponse<{
  message: string
  subscribed: boolean
  email: string
  listId?: string
}> {}

/**
 * Health check response
 */
export interface HealthCheckResponse extends SuccessResponse<{
  status: 'healthy' | 'degraded' | 'unhealthy'
  checks: {
    notion: {
      status: 'healthy' | 'error'
      responseTime: number
      databases: {
        posts: boolean
        authors: boolean
        categories: boolean
      }
    }
    cache: {
      status: 'healthy' | 'error'
      entries: number
      sizeKB: number
    }
  }
  uptime: number
}> {}

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * API Error interface
 */
export interface ApiError {
  code: string
  message: string
  details?: any
  stack?: string
  timestamp: string
  path?: string
  method?: string
}

/**
 * Validation Error interface
 */
export interface ValidationError extends ApiError {
  code: 'VALIDATION_ERROR'
  fields: Array<{
    field: string
    message: string
    value?: any
  }>
}

/**
 * Not Found Error interface
 */
export interface NotFoundError extends ApiError {
  code: 'NOT_FOUND'
  resource: string
  identifier: string
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

/**
 * Notion webhook payload
 */
export interface NotionWebhookPayload {
  object: 'page' | 'database'
  event_type: 'created' | 'updated' | 'deleted'
  event_id: string
  created_time: string
  last_edited_time: string
  data: {
    object: any
    old_data?: any
  }
}

/**
 * Revalidation webhook payload
 */
export interface RevalidationPayload {
  secret: string
  type: 'post' | 'posts' | 'category' | 'author' | 'all'
  slug?: string
  tags?: string[]
  paths?: string[]
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract response data type
 */
export type ResponseData<T extends ApiResponse> = T extends SuccessResponse<infer U> ? U : never

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

/**
 * Type guard for success responses
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true
}

/**
 * Type guard for error responses
 */
export function isErrorResponse(response: ApiResponse): response is ErrorResponse {
  return response.success === false
}

/**
 * Type guard for validation errors
 */
export function isValidationError(error: ApiError): error is ValidationError {
  return error.code === 'VALIDATION_ERROR'
}

/**
 * Type guard for not found errors
 */
export function isNotFoundError(error: ApiError): error is NotFoundError {
  return error.code === 'NOT_FOUND'
}

// ============================================================================
// LEGACY COMPATIBILITY (can be removed later)
// ============================================================================

/**
 * @deprecated Use ApiResponse instead
 */
export interface APIResponse<T> extends ApiResponse<T> {}

/**
 * @deprecated Use GetPostsResponse instead
 */
export interface PostsAPIResponse {
  posts: BlogPostSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

/**
 * @deprecated Use SearchPostsResponse instead
 */
export interface SearchAPIResponse {
  results: BlogPostSummary[]
  query: string
  total: number
  suggestions?: string[]
}

/**
 * @deprecated Use NewsletterSubscribeRequest instead
 */
export interface NewsletterAPIRequest {
  email: string
  source?: string
  tags?: string[]
}

/**
 * @deprecated Use NewsletterSubscribeResponse instead
 */
export interface NewsletterAPIResponse {
  success: boolean
  message: string
  subscribed: boolean
}
// Core blog types
export * from './blog'

// Notion API types
export * from './notion'

// API types and interfaces
export * from './api'

// Validation schemas
export * from './schemas'

// Re-export commonly used types with aliases
export type {
  BlogPost as Post,
  BlogAuthor as Author,
  BlogCategory as Category,
  BlogPostSummary as PostSummary,
} from './blog'

export type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ApiError,
  ValidationError,
  NotFoundError,
  HttpMethod
} from './api'

export type {
  NotionPage,
  NotionPostPage,
  NotionAuthorPage,
  NotionCategoryPage,
  NotionColor,
  NotionFilter,
  NotionSort
} from './notion'

// Validation utilities
export {
  validateBlogPost,
  validateBlogAuthor,
  validateBlogCategory,
  validatePagination,
  validateSlug,
  validateEmail,
  validateUrl,
  validateEnvironment,
  createApiResponse
} from './schemas'

// Type guards
export {
  isSuccessResponse,
  isErrorResponse,
  isValidationError,
  isNotFoundError
} from './api'
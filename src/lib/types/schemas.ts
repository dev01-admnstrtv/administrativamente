import { z } from 'zod'

// ============================================================================
// ZOD VALIDATION SCHEMAS - Runtime type checking
// ============================================================================

/**
 * Author schema validation
 */
export const BlogAuthorSchema = z.object({
  id: z.string().min(1, 'Author ID is required'),
  name: z.string().min(1, 'Author name is required').max(100, 'Author name too long'),
  slug: z.string().min(1, 'Author slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  bio: z.string().max(500, 'Bio too long'),
  role: z.string().min(1, 'Role is required').max(50, 'Role too long'),
  avatar: z.string().url('Invalid avatar URL').nullable(),
  socialLinks: z.object({
    twitter: z.string().url('Invalid Twitter URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
    github: z.string().url('Invalid GitHub URL').optional(),
    website: z.string().url('Invalid website URL').optional(),
    email: z.string().email('Invalid email').optional(),
  }).catchall(z.string().url('Invalid social link URL').optional()),
  notion: z.object({
    pageId: z.string().min(1, 'Page ID required'),
    lastEditedTime: z.string().datetime('Invalid datetime'),
    url: z.string().url('Invalid Notion URL'),
  }),
})

/**
 * Category schema validation
 */
export const BlogCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  slug: z.string().min(1, 'Category slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().max(200, 'Description too long'),
  color: z.enum([
    'default', 'gray', 'brown', 'orange', 'yellow', 'green', 'blue', 
    'purple', 'pink', 'red', 'gray_background', 'brown_background', 
    'orange_background', 'yellow_background', 'green_background', 
    'blue_background', 'purple_background', 'pink_background', 'red_background'
  ]),
  icon: z.string().max(10, 'Icon too long').nullable(),
  colorClasses: z.object({
    background: z.string().min(1, 'Background class required'),
    text: z.string().min(1, 'Text class required'),
    border: z.string().min(1, 'Border class required'),
  }),
  notion: z.object({
    pageId: z.string().min(1, 'Page ID required'),
    lastEditedTime: z.string().datetime('Invalid datetime'),
    url: z.string().url('Invalid Notion URL'),
  }),
})

/**
 * SEO metadata schema
 */
export const BlogSEOSchema = z.object({
  title: z.string().min(1, 'SEO title required').max(60, 'SEO title too long'),
  description: z.string().min(1, 'SEO description required').max(160, 'SEO description too long'),
  canonicalUrl: z.string().url('Invalid canonical URL').optional(),
  ogImage: z.string().url('Invalid OG image URL').optional(),
  keywords: z.array(z.string().min(1, 'Keyword cannot be empty')).optional(),
  structuredData: z.object({
    '@type': z.enum(['Article', 'BlogPosting']),
    headline: z.string().min(1, 'Headline required'),
    description: z.string().min(1, 'Description required'),
    author: z.object({
      '@type': z.literal('Person'),
      name: z.string().min(1, 'Author name required'),
      url: z.string().url('Invalid author URL').optional(),
    }),
    publisher: z.object({
      '@type': z.literal('Organization'),
      name: z.string().min(1, 'Publisher name required'),
      logo: z.string().url('Invalid logo URL').optional(),
    }),
    datePublished: z.string().datetime('Invalid publication date'),
    dateModified: z.string().datetime('Invalid modification date').optional(),
    image: z.string().url('Invalid image URL').optional(),
    wordCount: z.number().int().positive('Word count must be positive').optional(),
  }).optional(),
})

/**
 * Blog post schema validation
 */
export const BlogPostSchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  title: z.string().min(1, 'Post title is required').max(100, 'Title too long'),
  slug: z.string().min(1, 'Post slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt too long'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'archived']),
  publishedAt: z.string().datetime('Invalid publication date'),
  updatedAt: z.string().datetime('Invalid update date'),
  featuredImage: z.string().url('Invalid featured image URL').nullable(),
  author: BlogAuthorSchema.nullable(),
  category: BlogCategorySchema.nullable(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty').max(30, 'Tag too long')).max(10, 'Too many tags'),
  featured: z.boolean(),
  readingTime: z.number().int().positive('Reading time must be positive').max(60, 'Reading time too long'),
  seo: BlogSEOSchema,
  notion: z.object({
    pageId: z.string().min(1, 'Page ID required'),
    databaseId: z.string().min(1, 'Database ID required'),
    lastEditedTime: z.string().datetime('Invalid datetime'),
    url: z.string().url('Invalid Notion URL'),
  }),
})

/**
 * Post summary schema (for listings)
 */
export const BlogPostSummarySchema = z.object({
  id: z.string().min(1, 'Post ID is required'),
  title: z.string().min(1, 'Post title is required').max(100, 'Title too long'),
  slug: z.string().min(1, 'Post slug is required').regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt too long'),
  publishedAt: z.string().datetime('Invalid publication date'),
  featuredImage: z.string().url('Invalid featured image URL').nullable(),
  author: BlogAuthorSchema.pick({
    id: true,
    name: true, 
    slug: true,
    avatar: true
  }).nullable(),
  category: BlogCategorySchema.pick({
    id: true,
    name: true,
    slug: true,
    color: true,
    colorClasses: true
  }).nullable(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty').max(30, 'Tag too long')).max(10, 'Too many tags'),
  featured: z.boolean(),
  readingTime: z.number().int().positive('Reading time must be positive').max(60, 'Reading time too long'),
})

/**
 * Pagination schema
 */
export const PaginationSchema = z.object({
  page: z.number().int().positive('Page must be positive'),
  limit: z.number().int().positive('Limit must be positive').max(100, 'Limit too high'),
  total: z.number().int().nonnegative('Total cannot be negative'),
  totalPages: z.number().int().nonnegative('Total pages cannot be negative'),
  hasNext: z.boolean(),
  hasPrevious: z.boolean(),
  nextCursor: z.string().nullable().optional(),
})

/**
 * Paginated response schema
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    pagination: PaginationSchema,
  })

/**
 * Newsletter subscription schema
 */
export const NewsletterSubscriptionSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required').max(50, 'Name too long').optional(),
  source: z.enum(['homepage', 'post', 'category', 'author', 'search']).optional(),
  interests: z.array(z.string().min(1, 'Interest cannot be empty')).optional(),
  formId: z.string().min(1, 'Form ID required').optional(),
})

/**
 * Search filters schema
 */
export const SearchFiltersSchema = z.object({
  query: z.string().min(1, 'Query cannot be empty').max(100, 'Query too long').optional(),
  category: z.string().min(1, 'Category cannot be empty').optional(),
  author: z.string().min(1, 'Author cannot be empty').optional(),
  tags: z.array(z.string().min(1, 'Tag cannot be empty')).optional(),
  dateFrom: z.string().datetime('Invalid from date').optional(),
  dateTo: z.string().datetime('Invalid to date').optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(['date', 'title', 'readingTime', 'relevance']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})

/**
 * Site configuration schema
 */
export const SiteConfigSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(50, 'Site name too long'),
  description: z.string().min(1, 'Description is required').max(160, 'Description too long'),
  url: z.string().url('Invalid site URL'),
  author: z.object({
    name: z.string().min(1, 'Author name required'),
    email: z.string().email('Invalid author email'),
    twitter: z.string().url('Invalid Twitter URL').optional(),
  }),
  social: z.object({
    twitter: z.string().url('Invalid Twitter URL').optional(),
    linkedin: z.string().url('Invalid LinkedIn URL').optional(),
    instagram: z.string().url('Invalid Instagram URL').optional(),
  }),
  analytics: z.object({
    googleAnalytics: z.string().min(1, 'GA ID required').optional(),
    vercel: z.boolean().optional(),
  }).optional(),
  newsletter: z.object({
    provider: z.enum(['convertkit', 'mailchimp', 'custom']),
    apiKey: z.string().min(1, 'API key required').optional(),
    formId: z.string().min(1, 'Form ID required').optional(),
  }).optional(),
})

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate and parse blog post data
 */
export function validateBlogPost(data: unknown) {
  return BlogPostSchema.parse(data)
}

/**
 * Safely validate blog post data
 */
export function safeParseBlogPost(data: unknown) {
  return BlogPostSchema.safeParse(data)
}

/**
 * Validate and parse blog author data
 */
export function validateBlogAuthor(data: unknown) {
  return BlogAuthorSchema.parse(data)
}

/**
 * Safely validate blog author data
 */
export function safeParseBlogAuthor(data: unknown) {
  return BlogAuthorSchema.safeParse(data)
}

/**
 * Validate and parse blog category data
 */
export function validateBlogCategory(data: unknown) {
  return BlogCategorySchema.parse(data)
}

/**
 * Safely validate blog category data
 */
export function safeParseBlogCategory(data: unknown) {
  return BlogCategorySchema.safeParse(data)
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page?: unknown, limit?: unknown) {
  const params = {
    page: page || 1,
    limit: limit || 10,
  }

  const pageSchema = z.number().int().positive().default(1)
  const limitSchema = z.number().int().positive().max(100).default(10)

  return {
    page: pageSchema.parse(params.page),
    limit: limitSchema.parse(params.limit),
  }
}

/**
 * Validate slug format
 */
export function validateSlug(slug: unknown) {
  return z.string()
    .min(1, 'Slug is required')
    .max(100, 'Slug too long')
    .regex(/^[a-z0-9-]+$/, 'Invalid slug format: only lowercase letters, numbers, and hyphens allowed')
    .parse(slug)
}

/**
 * Validate email address
 */
export function validateEmail(email: unknown) {
  return z.string().email('Invalid email address').parse(email)
}

/**
 * Validate URL
 */
export function validateUrl(url: unknown) {
  return z.string().url('Invalid URL format').parse(url)
}

/**
 * Create type-safe API response
 */
export function createApiResponse<T>(
  data: T,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { 
      success: false, 
      error: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
    }
  }
}

/**
 * Validate environment variables
 */
export const EnvSchema = z.object({
  NOTION_TOKEN: z.string().min(1, 'NOTION_TOKEN is required'),
  NOTION_DATABASE_ID: z.string().min(1, 'NOTION_DATABASE_ID is required').optional(),
  NOTION_POSTS_DATABASE_ID: z.string().min(1, 'NOTION_POSTS_DATABASE_ID is required').optional(),
  NOTION_AUTHORS_DATABASE_ID: z.string().min(1, 'NOTION_AUTHORS_DATABASE_ID is required').optional(),
  NOTION_CATEGORIES_DATABASE_ID: z.string().min(1, 'NOTION_CATEGORIES_DATABASE_ID is required').optional(),
  REVALIDATE_SECRET: z.string().min(1, 'REVALIDATE_SECRET is required').optional(),
  NOTION_WEBHOOK_SECRET: z.string().min(1, 'NOTION_WEBHOOK_SECRET is required').optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url('Invalid SITE_URL').optional(),
  NEXT_PUBLIC_SITE_NAME: z.string().min(1, 'SITE_NAME is required').optional(),
})

/**
 * Validate environment variables
 */
export function validateEnvironment() {
  try {
    return EnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(e => e.path.join('.')).join(', ')
      throw new Error(`Environment validation failed. Missing or invalid: ${missingVars}`)
    }
    throw error
  }
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type BlogPostInput = z.input<typeof BlogPostSchema>
export type BlogAuthorInput = z.input<typeof BlogAuthorSchema>
export type BlogCategoryInput = z.input<typeof BlogCategorySchema>
export type NewsletterInput = z.input<typeof NewsletterSubscriptionSchema>
export type SearchFiltersInput = z.input<typeof SearchFiltersSchema>
export type SiteConfigInput = z.input<typeof SiteConfigSchema>
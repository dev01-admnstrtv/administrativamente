import type { NotionColor } from './notion'

// ============================================================================
// CORE BLOG TYPES - Based on CLAUDE.md schema
// ============================================================================

/**
 * Blog Author interface based on CLAUDE.md Authors Database schema
 */
export interface BlogAuthor {
  /** Unique identifier (Notion page ID) */
  id: string
  /** Author name from Title property */
  name: string
  /** URL slug for author pages */
  slug: string
  /** Author biography from Bio property */
  bio: string
  /** Author role/position from Role property */
  role: string
  /** Avatar image URL from Avatar Files property */
  avatar: string | null
  /** Parsed social links from Social Links JSON property */
  socialLinks: {
    twitter?: string
    linkedin?: string
    instagram?: string
    github?: string
    website?: string
    email?: string
    [key: string]: string | undefined
  }
  /** Notion-specific metadata */
  notion: {
    pageId: string
    lastEditedTime: string
    url: string
  }
}

/**
 * Blog Category interface based on CLAUDE.md Categories Database schema
 */
export interface BlogCategory {
  /** Unique identifier (Notion page ID) */
  id: string
  /** Category name from Title property */
  name: string
  /** URL slug for category pages */
  slug: string
  /** Category description from Description property */
  description: string
  /** Category color from Color Select property */
  color: NotionColor
  /** Category icon from Icon property (emoji or text) */
  icon: string | null
  /** CSS classes for styling based on color */
  colorClasses: {
    background: string
    text: string
    border: string
  }
  /** Notion-specific metadata */
  notion: {
    pageId: string
    lastEditedTime: string
    url: string
  }
}

/**
 * SEO metadata interface
 */
export interface BlogSEO {
  /** SEO-optimized title (from SEO Title property or fallback to title) */
  title: string
  /** Meta description (from SEO Description property or fallback to excerpt) */
  description: string
  /** Canonical URL */
  canonicalUrl?: string
  /** Open Graph image URL */
  ogImage?: string
  /** Additional meta tags */
  keywords?: string[]
  /** Article schema.org structured data */
  structuredData?: {
    '@type': 'Article' | 'BlogPosting'
    headline: string
    description: string
    author: {
      '@type': 'Person'
      name: string
      url?: string
    }
    publisher: {
      '@type': 'Organization'
      name: string
      logo?: string
    }
    datePublished: string
    dateModified?: string
    image?: string
    wordCount?: number
  }
}

/**
 * Complete Blog Post interface based on CLAUDE.md Posts Database schema
 */
export interface BlogPost {
  /** Unique identifier (Notion page ID) */
  id: string
  /** Post title from Title property */
  title: string
  /** URL slug from Slug property */
  slug: string
  /** Post excerpt from Excerpt property */
  excerpt: string
  /** Full post content (transformed from Notion blocks) */
  content: string
  /** Publication status from Status property */
  status: 'draft' | 'published' | 'archived'
  /** Publication date from Published Date property */
  publishedAt: string
  /** Last update timestamp */
  updatedAt: string
  /** Featured image URL from Featured Image Files property */
  featuredImage: string | null
  /** Author information (from Author Relation property) */
  author: BlogAuthor | null
  /** Category information (from Category Select property) */
  category: BlogCategory | null
  /** Post tags from Tags Multi-select property */
  tags: string[]
  /** Whether post is featured from Featured Checkbox property */
  featured: boolean
  /** Reading time in minutes from Reading Time Number property or calculated */
  readingTime: number
  /** SEO metadata */
  seo: BlogSEO
  /** Notion-specific metadata */
  notion: {
    pageId: string
    databaseId: string
    lastEditedTime: string
    url: string
  }
}

/**
 * Simplified post summary for listings
 */
export interface BlogPostSummary {
  id: string
  title: string
  slug: string
  excerpt: string
  publishedAt: string
  featuredImage: string | null
  author: Pick<BlogAuthor, 'id' | 'name' | 'slug' | 'avatar'> | null
  category: Pick<BlogCategory, 'id' | 'name' | 'slug' | 'color' | 'colorClasses'> | null
  tags: string[]
  featured: boolean
  readingTime: number
}

/**
 * Related post interface for recommendations
 */
export interface BlogRelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string | null
  publishedAt: string
  readingTime: number
  category: Pick<BlogCategory, 'name' | 'slug' | 'color'> | null
  similarity?: number // Algorithm-calculated similarity score
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrevious: boolean
    nextCursor?: string | null
  }
}

/**
 * Posts list response
 */
export interface BlogPostsResponse extends PaginatedResponse<BlogPostSummary> {
  /** Featured posts if requested */
  featured?: BlogPostSummary[]
  /** Filter information */
  filters?: {
    category?: string
    author?: string
    tag?: string
    featured?: boolean
  }
}

/**
 * Search response interface
 */
export interface BlogSearchResponse {
  posts: BlogPostSummary[]
  query: string
  total: number
  hasMore: boolean
  suggestions?: string[]
  filters?: {
    categories: Array<{ name: string; count: number }>
    tags: Array<{ name: string; count: number }>
    authors: Array<{ name: string; count: number }>
  }
}

/**
 * Category page data
 */
export interface BlogCategoryPage {
  category: BlogCategory
  posts: BlogPostSummary[]
  relatedCategories?: BlogCategory[]
  pagination: PaginatedResponse<BlogPostSummary>['pagination']
  stats?: {
    totalPosts: number
    averageReadingTime: number
    latestPost?: string
  }
}

/**
 * Author page data  
 */
export interface BlogAuthorPage {
  author: BlogAuthor
  posts: BlogPostSummary[]
  pagination: PaginatedResponse<BlogPostSummary>['pagination']
  stats?: {
    totalPosts: number
    categories: Array<{ name: string; count: number }>
    averageReadingTime: number
    firstPost?: string
    latestPost?: string
  }
}

/**
 * Homepage data structure
 */
export interface BlogHomepage {
  /** Featured posts (up to 3) */
  featuredPosts: BlogPostSummary[]
  /** Recent posts for main feed */
  recentPosts: BlogPostSummary[]
  /** All categories */
  categories: BlogCategory[]
  /** Popular tags */
  popularTags?: Array<{ name: string; count: number }>
  /** Site statistics */
  stats?: {
    totalPosts: number
    totalAuthors: number
    totalCategories: number
    latestPost?: string
  }
}

// ============================================================================
// FORM & INPUT TYPES
// ============================================================================

/**
 * Newsletter subscription
 */
export interface NewsletterSubscription {
  email: string
  name?: string
  source?: 'homepage' | 'post' | 'category' | 'author' | 'search'
  interests?: string[]
  /** ConvertKit form ID if using ConvertKit */
  formId?: string
}

/**
 * Search filters
 */
export interface SearchFilters {
  query?: string
  category?: string
  author?: string
  tags?: string[]
  dateFrom?: string
  dateTo?: string
  featured?: boolean
  sortBy?: 'date' | 'title' | 'readingTime' | 'relevance'
  sortOrder?: 'asc' | 'desc'
}

/**
 * Comment interface (for future implementation)
 */
export interface BlogComment {
  id: string
  postId: string
  author: {
    name: string
    email: string
    avatar?: string
    website?: string
  }
  content: string
  parentId?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt?: string
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Post status literals
 */
export type PostStatus = 'draft' | 'published' | 'archived'

/**
 * Supported category names based on CLAUDE.md
 */
export type CategoryName = 
  | 'Gestão'
  | 'Liderança' 
  | 'Estratégia'
  | 'Tecnologia'
  | 'Pessoas'
  | 'Processos'

/**
 * Social platform types
 */
export type SocialPlatform = 
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'github'
  | 'website'
  | 'email'

/**
 * Content type for RSS and sitemaps
 */
export interface ContentItem {
  title: string
  slug: string
  publishedAt: string
  updatedAt?: string
  excerpt?: string
  author?: string
  category?: string
  type: 'post' | 'category' | 'author'
}

/**
 * Site configuration
 */
export interface SiteConfig {
  name: string
  description: string
  url: string
  author: {
    name: string
    email: string
    twitter?: string
  }
  social: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  analytics?: {
    googleAnalytics?: string
    vercel?: boolean
  }
  newsletter?: {
    provider: 'convertkit' | 'mailchimp' | 'custom'
    apiKey?: string
    formId?: string
  }
}
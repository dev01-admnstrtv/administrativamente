import { 
  queryDatabase, 
  getPage, 
  getPageBlocks, 
  DATABASES,
  notion
} from './client'
import type { 
  NotionPostPage,
  NotionBlock,
  NotionFilter,
  NotionSort
} from '@/lib/types/notion'

/**
 * Get all published posts with optional pagination
 */
export async function getPublishedPosts(options?: {
  pageSize?: number
  startCursor?: string
}): Promise<{
  posts: NotionPostPage[]
  hasMore: boolean
  nextCursor: string | null
}> {
  const filter: NotionFilter = {
    property: 'Status',
    select: {
      equals: 'published'
    }
  }

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.startCursor !== undefined && { startCursor: options.startCursor })
    }
  )

  return {
    posts: response.results,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor
  }
}

/**
 * Get featured posts only
 */
export async function getFeaturedPosts(limit = 3): Promise<NotionPostPage[]> {
  const filter: NotionFilter = {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      {
        property: 'Featured',
        checkbox: {
          equals: true
        }
      }
    ]
  }

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      pageSize: limit
    }
  )

  return response.results
}

/**
 * Get posts by category
 */
export async function getPostsByCategory(
  categoryName: string,
  options?: {
    pageSize?: number
    startCursor?: string
  }
): Promise<{
  posts: NotionPostPage[]
  hasMore: boolean
  nextCursor: string | null
}> {
  const filter: NotionFilter = {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      {
        property: 'Category',
        select: {
          equals: categoryName
        }
      }
    ]
  }

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.startCursor !== undefined && { startCursor: options.startCursor })
    }
  )

  return {
    posts: response.results,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor
  }
}

/**
 * Get posts by author ID
 */
export async function getPostsByAuthor(
  authorId: string,
  options?: {
    pageSize?: number
    startCursor?: string
  }
): Promise<{
  posts: NotionPostPage[]
  hasMore: boolean
  nextCursor: string | null
}> {
  const filter: NotionFilter = {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      {
        property: 'Author',
        relation: {
          contains: authorId
        }
      }
    ]
  }

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.startCursor !== undefined && { startCursor: options.startCursor })
    }
  )

  return {
    posts: response.results,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor
  }
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<NotionPostPage | null> {
  const filter: NotionFilter = {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      {
        property: 'Slug',
        rich_text: {
          equals: slug
        }
      }
    ]
  }

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      pageSize: 1
    }
  )

  return response.results[0] || null
}

/**
 * Get post by ID
 */
export async function getPostById(postId: string): Promise<NotionPostPage> {
  return await getPage<NotionPostPage>(postId)
}

/**
 * Get post content blocks
 */
export async function getPostContent(postId: string): Promise<NotionBlock[]> {
  return await getPageBlocks(postId, true) // Include child blocks
}

/**
 * Get related posts based on category and tags
 */
export async function getRelatedPosts(
  currentPostId: string,
  category?: string,
  tags?: string[],
  limit = 4
): Promise<NotionPostPage[]> {
  const filters: NotionFilter[] = [
    {
      property: 'Status',
      select: {
        equals: 'published'
      }
    },
    // Exclude current post
    {
      property: 'Title',
      rich_text: {
        is_not_empty: true
      }
    }
  ]

  // Add category filter if provided
  if (category) {
    filters.push({
      property: 'Category',
      select: {
        equals: category
      }
    })
  }

  // Add tags filter if provided
  if (tags && tags.length > 0) {
    const tagFilters = tags.map(tag => ({
      property: 'Tags',
      multi_select: {
        contains: tag
      }
    }))

    filters.push({
      or: tagFilters
    })
  }

  const filter: NotionFilter = filters.length > 1 ? { and: filters } : filters[0]!

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      pageSize: limit + 1 // Get one extra to filter out current post
    }
  )

  // Filter out current post and limit results
  return response.results
    .filter(post => post.id !== currentPostId)
    .slice(0, limit)
}

/**
 * Search posts by title and content
 */
export async function searchPosts(
  query: string,
  options?: {
    pageSize?: number
    startCursor?: string
  }
): Promise<{
  posts: NotionPostPage[]
  hasMore: boolean
  nextCursor: string | null
}> {
  const filter: NotionFilter = {
    and: [
      {
        property: 'Status',
        select: {
          equals: 'published'
        }
      },
      {
        or: [
          {
            property: 'Title',
            rich_text: {
              contains: query
            }
          },
          {
            property: 'Excerpt',
            rich_text: {
              contains: query
            }
          },
          {
            property: 'Tags',
            multi_select: {
              contains: query
            }
          }
        ]
      }
    ]
  }

  const sorts: NotionSort[] = [
    {
      property: 'Published Date',
      direction: 'descending'
    }
  ]

  const response = await queryDatabase<NotionPostPage>(
    DATABASES.POSTS,
    {
      filter,
      sorts,
      ...(options?.pageSize !== undefined && { pageSize: options.pageSize }),
      ...(options?.startCursor !== undefined && { startCursor: options.startCursor })
    }
  )

  return {
    posts: response.results,
    hasMore: response.hasMore,
    nextCursor: response.nextCursor
  }
}

/**
 * Get posts statistics
 */
export async function getPostsStatistics(): Promise<{
  totalPublished: number
  totalDrafts: number
  totalFeatured: number
  categoryCounts: Record<string, number>
}> {
  try {
    // Get all posts (published and drafts)
    const allPostsResponse = await queryDatabase<NotionPostPage>(
      DATABASES.POSTS,
      { pageSize: 100 }
    )

    const allPosts = allPostsResponse.results
    
    // Calculate statistics
    const totalPublished = allPosts.filter(
      post => post.properties.Status.select?.name === 'published'
    ).length

    const totalDrafts = allPosts.filter(
      post => post.properties.Status.select?.name === 'draft'
    ).length

    const totalFeatured = allPosts.filter(
      post => post.properties.Featured.checkbox === true
    ).length

    // Count posts by category
    const categoryCounts: Record<string, number> = {}
    allPosts.forEach(post => {
      const category = post.properties.Category.select?.name
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1
      }
    })

    return {
      totalPublished,
      totalDrafts,
      totalFeatured,
      categoryCounts
    }
  } catch (error) {
    console.error('Error getting posts statistics:', error)
    throw new Error('Failed to fetch posts statistics')
  }
}

/**
 * Get recent posts for RSS/sitemap generation
 */
export async function getRecentPosts(limit = 50): Promise<NotionPostPage[]> {
  const response = await getPublishedPosts({ pageSize: limit })
  return response.posts
}

/**
 * Get post slugs for static generation
 */
export async function getPostSlugs(): Promise<string[]> {
  const allPosts = await getPublishedPosts({ pageSize: 100 })
  
  return allPosts.posts
    .map(post => {
      const slug = post.properties.Slug.rich_text[0]?.plain_text
      return slug ? slug.trim() : null
    })
    .filter((slug): slug is string => slug !== null && slug.length > 0)
}

/**
 * Get category statistics for homepage
 */
export async function getCategoryStats(): Promise<Array<{name: string, count: number}>> {
  const stats = await getPostsStatistics()
  
  return Object.entries(stats.categoryCounts).map(([name, count]) => ({
    name,
    count
  }))
}
import { Client } from '@notionhq/client'
import type { 
  NotionPostPage, 
  NotionAuthorPage, 
  NotionCategoryPage,
  NotionBlock,
  NotionPage,
  NotionDatabase,
  NotionDatabaseQuery,
  NotionDatabaseQueryResponse,
  NotionFilter,
  NotionSort
} from '@/lib/types/notion'

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_TOKEN || '',
})

// Database IDs based on CLAUDE.md schema
export const DATABASES = {
  POSTS: process.env.NOTION_DATABASE_ID || process.env.NOTION_POSTS_DATABASE_ID || '',
  AUTHORS: process.env.NOTION_AUTHORS_DATABASE_ID || '',
  CATEGORIES: process.env.NOTION_CATEGORIES_DATABASE_ID || '',
} as const

// Validate environment variables
if (!process.env.NOTION_TOKEN) {
  throw new Error('NOTION_TOKEN environment variable is required')
}

if (!DATABASES.POSTS) {
  console.warn('NOTION_DATABASE_ID or NOTION_POSTS_DATABASE_ID not found in environment variables')
}

/**
 * Query database with enhanced type safety and error handling
 */
export async function queryDatabase<T extends NotionPage = NotionPage>(
  databaseId: string,
  options?: {
    filter?: NotionFilter
    sorts?: NotionSort[]
    pageSize?: number
    startCursor?: string
  }
): Promise<{
  results: T[]
  hasMore: boolean
  nextCursor: string | null
}> {
  if (!databaseId) {
    throw new Error('Database ID is required')
  }

  try {
    const query: any = {
      database_id: databaseId,
      page_size: Math.min(options?.pageSize || 100, 100), // Notion API limit
    }

    // Only add optional properties if they have values
    if (options?.filter) {
      query.filter = options.filter
    }
    if (options?.sorts) {
      query.sorts = options.sorts  
    }
    if (options?.startCursor) {
      query.start_cursor = options.startCursor
    }

    const response = await notion.databases.query(query)

    return {
      results: response.results as T[],
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    }
  } catch (error: any) {
    console.error('Error querying Notion database:', {
      databaseId,
      error: error.message,
      code: error.code,
    })
    
    // Provide more specific error messages
    if (error.code === 'object_not_found') {
      throw new Error(`Database with ID "${databaseId}" not found. Check your database ID and permissions.`)
    } else if (error.code === 'unauthorized') {
      throw new Error('Unauthorized access to Notion API. Check your NOTION_TOKEN.')
    }
    
    throw new Error(`Failed to query database: ${error.message}`)
  }
}

/**
 * Get page by ID with enhanced type safety
 */
export async function getPage<T extends NotionPage = NotionPage>(pageId: string): Promise<T> {
  if (!pageId || typeof pageId !== 'string') {
    throw new Error('Valid page ID is required')
  }

  try {
    const response = await notion.pages.retrieve({
      page_id: pageId,
    })
    
    return response as T
  } catch (error: any) {
    console.error(`Error fetching page ${pageId}:`, {
      error: error.message,
      code: error.code,
    })
    
    if (error.code === 'object_not_found') {
      throw new Error(`Page with ID "${pageId}" not found.`)
    } else if (error.code === 'unauthorized') {
      throw new Error('Unauthorized access to page. Check permissions.')
    }
    
    throw new Error(`Failed to fetch page: ${error.message}`)
  }
}

/**
 * Get all page content blocks with recursive fetching
 */
export async function getPageBlocks(pageId: string, includeChildren = false): Promise<NotionBlock[]> {
  if (!pageId) {
    throw new Error('Page ID is required')
  }

  try {
    const blocks: NotionBlock[] = []
    let cursor: string | undefined

    do {
      const params: any = {
        block_id: pageId,
        page_size: 100,
      }
      
      if (cursor) {
        params.start_cursor = cursor
      }
      
      const response = await notion.blocks.children.list(params)

      const pageBlocks = response.results as NotionBlock[]
      blocks.push(...pageBlocks)
      
      // Recursively fetch child blocks if requested
      if (includeChildren) {
        for (const block of pageBlocks) {
          if (block.has_children) {
            try {
              const childBlocks = await getPageBlocks(block.id, true)
              blocks.push(...childBlocks)
            } catch (error) {
              console.warn(`Failed to fetch child blocks for block ${block.id}:`, error)
            }
          }
        }
      }
      
      cursor = response.has_more ? response.next_cursor || undefined : undefined
    } while (cursor)

    return blocks
  } catch (error: any) {
    console.error(`Error fetching blocks for page ${pageId}:`, {
      error: error.message,
      code: error.code,
    })
    
    if (error.code === 'object_not_found') {
      throw new Error(`Page with ID "${pageId}" not found for blocks.`)
    }
    
    throw new Error(`Failed to fetch page blocks: ${error.message}`)
  }
}

/**
 * Search pages across databases
 */
export async function searchPages(query: string, options?: {
  filter?: any
  sort?: any
}) {
  try {
    const response = await notion.search({
      query,
      filter: options?.filter,
      sort: options?.sort,
    })

    return response.results
  } catch (error) {
    console.error('Error searching Notion pages:', error)
    throw new Error('Failed to search pages')
  }
}

/**
 * Validate Notion connection and database access
 */
export async function validateNotionConnection(): Promise<{
  isValid: boolean
  errors: string[]
  databases: {
    posts: boolean
    authors: boolean
    categories: boolean
  }
}> {
  const errors: string[] = []
  const databaseStatus = {
    posts: false,
    authors: false, 
    categories: false,
  }

  try {
    // Test connection by trying to retrieve user info
    await notion.users.me()
  } catch (error: any) {
    errors.push(`Authentication failed: ${error.message}`)
    return { isValid: false, errors, databases: databaseStatus }
  }

  // Test database access
  if (DATABASES.POSTS) {
    try {
      await notion.databases.retrieve({ database_id: DATABASES.POSTS })
      databaseStatus.posts = true
    } catch (error: any) {
      errors.push(`Posts database access failed: ${error.message}`)
    }
  } else {
    errors.push('Posts database ID not configured')
  }

  if (DATABASES.AUTHORS) {
    try {
      await notion.databases.retrieve({ database_id: DATABASES.AUTHORS })
      databaseStatus.authors = true
    } catch (error: any) {
      errors.push(`Authors database access failed: ${error.message}`)
    }
  }

  if (DATABASES.CATEGORIES) {
    try {
      await notion.databases.retrieve({ database_id: DATABASES.CATEGORIES })
      databaseStatus.categories = true
    } catch (error: any) {
      errors.push(`Categories database access failed: ${error.message}`)
    }
  }

  const isValid = errors.length === 0 && databaseStatus.posts
  return { isValid, errors, databases: databaseStatus }
}

/**
 * Get database metadata
 */
export async function getDatabaseMetadata(databaseId: string) {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    })
    
    return response
  } catch (error) {
    console.error(`Error fetching database metadata for ${databaseId}:`, error)
    throw new Error('Failed to fetch database metadata')
  }
}

// Helper functions for common queries
export const notionQueries = {
  // Get published posts
  publishedPosts: {
    filter: {
      property: 'Status',
      select: {
        equals: 'published',
      },
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  },

  // Get featured posts
  featuredPosts: {
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'published',
          },
        },
        {
          property: 'Featured',
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  },

  // Get posts by category
  postsByCategory: (categoryId: string) => ({
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'published',
          },
        },
        {
          property: 'Category',
          select: {
            equals: categoryId,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  }),

  // Get posts by author
  postsByAuthor: (authorId: string) => ({
    filter: {
      and: [
        {
          property: 'Status',
          select: {
            equals: 'published',
          },
        },
        {
          property: 'Author',
          relation: {
            contains: authorId,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Published Date',
        direction: 'descending',
      },
    ],
  }),
} as const
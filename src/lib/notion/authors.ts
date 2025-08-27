agora facaimport { 
  queryDatabase, 
  getPage, 
  DATABASES 
} from './client'
import type { 
  NotionAuthorPage,
  NotionFilter,
  NotionSort
} from '@/lib/types/notion'

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<NotionAuthorPage[]> {
  if (!DATABASES.AUTHORS) {
    console.warn('Authors database not configured')
    return []
  }

  try {
    const sorts: NotionSort[] = [
      {
        property: 'Name',
        direction: 'ascending'
      }
    ]

    const response = await queryDatabase<NotionAuthorPage>(
      DATABASES.AUTHORS,
      {
        sorts,
        pageSize: 100
      }
    )

    return response.results
  } catch (error) {
    console.error('Error fetching authors:', error)
    return []
  }
}

/**
 * Get author by slug
 */
export async function getAuthorBySlug(slug: string): Promise<NotionAuthorPage | null> {
  if (!DATABASES.AUTHORS) {
    console.warn('Authors database not configured')
    return null
  }

  try {
    const filter: NotionFilter = {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    }

    const response = await queryDatabase<NotionAuthorPage>(
      DATABASES.AUTHORS,
      {
        filter,
        pageSize: 1
      }
    )

    return response.results[0] || null
  } catch (error) {
    console.error(`Error fetching author by slug ${slug}:`, error)
    return null
  }
}

/**
 * Get author by ID
 */
export async function getAuthorById(authorId: string): Promise<NotionAuthorPage | null> {
  if (!DATABASES.AUTHORS) {
    console.warn('Authors database not configured')
    return null
  }

  try {
    return await getPage<NotionAuthorPage>(authorId)
  } catch (error) {
    console.error(`Error fetching author by ID ${authorId}:`, error)
    return null
  }
}

/**
 * Get multiple authors by IDs
 */
export async function getAuthorsByIds(authorIds: string[]): Promise<NotionAuthorPage[]> {
  if (!DATABASES.AUTHORS || authorIds.length === 0) {
    return []
  }

  try {
    const authors = await Promise.allSettled(
      authorIds.map(id => getAuthorById(id))
    )

    return authors
      .filter((result): result is PromiseFulfilledResult<NotionAuthorPage> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value)
  } catch (error) {
    console.error('Error fetching authors by IDs:', error)
    return []
  }
}

/**
 * Search authors by name
 */
export async function searchAuthors(query: string): Promise<NotionAuthorPage[]> {
  if (!DATABASES.AUTHORS) {
    console.warn('Authors database not configured')
    return []
  }

  try {
    const filter: NotionFilter = {
      or: [
        {
          property: 'Name',
          rich_text: {
            contains: query
          }
        },
        {
          property: 'Bio',
          rich_text: {
            contains: query
          }
        },
        {
          property: 'Role',
          rich_text: {
            contains: query
          }
        }
      ]
    }

    const sorts: NotionSort[] = [
      {
        property: 'Name',
        direction: 'ascending'
      }
    ]

    const response = await queryDatabase<NotionAuthorPage>(
      DATABASES.AUTHORS,
      {
        filter,
        sorts,
        pageSize: 20
      }
    )

    return response.results
  } catch (error) {
    console.error(`Error searching authors with query ${query}:`, error)
    return []
  }
}

/**
 * Get author slugs for static generation
 */
export async function getAuthorSlugs(): Promise<string[]> {
  const authors = await getAllAuthors()
  
  return authors
    .map(author => {
      const slug = author.properties.Slug.rich_text[0]?.plain_text
      return slug ? slug.trim() : null
    })
    .filter((slug): slug is string => slug !== null && slug.length > 0)
}

/**
 * Get authors statistics
 */
export async function getAuthorsStatistics(): Promise<{
  totalAuthors: number
  authorsWithBio: number
  authorsWithAvatar: number
  roleDistribution: Record<string, number>
}> {
  try {
    const authors = await getAllAuthors()

    const totalAuthors = authors.length
    
    const authorsWithBio = authors.filter(
      author => author.properties.Bio.rich_text.length > 0
    ).length

    const authorsWithAvatar = authors.filter(
      author => author.properties.Avatar.files.length > 0
    ).length

    // Count authors by role
    const roleDistribution: Record<string, number> = {}
    authors.forEach(author => {
      const role = author.properties.Role.rich_text[0]?.plain_text?.trim()
      if (role) {
        roleDistribution[role] = (roleDistribution[role] || 0) + 1
      }
    })

    return {
      totalAuthors,
      authorsWithBio,
      authorsWithAvatar,
      roleDistribution
    }
  } catch (error) {
    console.error('Error getting authors statistics:', error)
    return {
      totalAuthors: 0,
      authorsWithBio: 0,
      authorsWithAvatar: 0,
      roleDistribution: {}
    }
  }
}

/**
 * Parse social links JSON from author
 */
export function parseAuthorSocialLinks(author: NotionAuthorPage): Record<string, string> {
  try {
    const socialLinksText = author.properties['Social Links'].rich_text[0]?.plain_text
    
    if (!socialLinksText) {
      return {}
    }

    // Try to parse as JSON
    const socialLinks = JSON.parse(socialLinksText)
    
    // Validate that it's an object with string values
    if (typeof socialLinks === 'object' && socialLinks !== null) {
      const validLinks: Record<string, string> = {}
      
      Object.entries(socialLinks).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          validLinks[key] = value.trim()
        }
      })
      
      return validLinks
    }
    
    return {}
  } catch (error) {
    console.warn(`Error parsing social links for author ${author.id}:`, error)
    return {}
  }
}

/**
 * Get author name from properties
 */
export function getAuthorName(author: NotionAuthorPage): string {
  return author.properties.Name.title[0]?.plain_text || 'Unknown Author'
}

/**
 * Get author slug from properties
 */
export function getAuthorSlug(author: NotionAuthorPage): string | null {
  return author.properties.Slug.rich_text[0]?.plain_text || null
}

/**
 * Get author bio from properties
 */
export function getAuthorBio(author: NotionAuthorPage): string {
  return author.properties.Bio.rich_text
    .map(text => text.plain_text)
    .join('')
    .trim()
}

/**
 * Get author role from properties
 */
export function getAuthorRole(author: NotionAuthorPage): string {
  return author.properties.Role.rich_text[0]?.plain_text || 'Contributor'
}

/**
 * Get author avatar URL from properties
 */
export function getAuthorAvatar(author: NotionAuthorPage): string | null {
  const avatar = author.properties.Avatar.files[0]
  
  if (!avatar) {
    return null
  }

  if (avatar.type === 'external') {
    return avatar.external?.url || null
  } else if (avatar.type === 'file') {
    return avatar.file?.url || null
  }

  return null
}

/**
 * Check if authors database is configured
 */
export function isAuthorsConfigured(): boolean {
  return Boolean(DATABASES.AUTHORS)
}
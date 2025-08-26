import { 
  queryDatabase, 
  getPage, 
  DATABASES 
} from './client'
import type { 
  NotionCategoryPage,
  NotionFilter,
  NotionSort,
  NotionColor
} from '@/lib/types/notion'

/**
 * Category mapping based on CLAUDE.md specifications
 */
export const BLOG_CATEGORIES = {
  GESTAO: 'Gestão',
  LIDERANCA: 'Liderança', 
  ESTRATEGIA: 'Estratégia',
  TECNOLOGIA: 'Tecnologia',
  PESSOAS: 'Pessoas',
  PROCESSOS: 'Processos'
} as const

export type BlogCategoryKey = keyof typeof BLOG_CATEGORIES
export type BlogCategoryName = typeof BLOG_CATEGORIES[BlogCategoryKey]

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<NotionCategoryPage[]> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
    return []
  }

  try {
    const sorts: NotionSort[] = [
      {
        property: 'Name',
        direction: 'ascending'
      }
    ]

    const response = await queryDatabase<NotionCategoryPage>(
      DATABASES.CATEGORIES,
      {
        sorts,
        pageSize: 50
      }
    )

    return response.results
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<NotionCategoryPage | null> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
    return null
  }

  try {
    const filter: NotionFilter = {
      property: 'Slug',
      rich_text: {
        equals: slug
      }
    }

    const response = await queryDatabase<NotionCategoryPage>(
      DATABASES.CATEGORIES,
      {
        filter,
        pageSize: 1
      }
    )

    return response.results[0] || null
  } catch (error) {
    console.error(`Error fetching category by slug ${slug}:`, error)
    return null
  }
}

/**
 * Get category by name
 */
export async function getCategoryByName(name: string): Promise<NotionCategoryPage | null> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
    return null
  }

  try {
    const filter: NotionFilter = {
      property: 'Name',
      rich_text: {
        equals: name
      }
    }

    const response = await queryDatabase<NotionCategoryPage>(
      DATABASES.CATEGORIES,
      {
        filter,
        pageSize: 1
      }
    )

    return response.results[0] || null
  } catch (error) {
    console.error(`Error fetching category by name ${name}:`, error)
    return null
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: string): Promise<NotionCategoryPage | null> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
    return null
  }

  try {
    return await getPage<NotionCategoryPage>(categoryId)
  } catch (error) {
    console.error(`Error fetching category by ID ${categoryId}:`, error)
    return null
  }
}

/**
 * Get categories by color
 */
export async function getCategoriesByColor(color: NotionColor): Promise<NotionCategoryPage[]> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
    return []
  }

  try {
    const filter: NotionFilter = {
      property: 'Color',
      select: {
        equals: color
      }
    }

    const sorts: NotionSort[] = [
      {
        property: 'Name',
        direction: 'ascending'
      }
    ]

    const response = await queryDatabase<NotionCategoryPage>(
      DATABASES.CATEGORIES,
      {
        filter,
        sorts,
        pageSize: 20
      }
    )

    return response.results
  } catch (error) {
    console.error(`Error fetching categories by color ${color}:`, error)
    return []
  }
}

/**
 * Search categories by name or description
 */
export async function searchCategories(query: string): Promise<NotionCategoryPage[]> {
  if (!DATABASES.CATEGORIES) {
    console.warn('Categories database not configured')
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
          property: 'Description',
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

    const response = await queryDatabase<NotionCategoryPage>(
      DATABASES.CATEGORIES,
      {
        filter,
        sorts,
        pageSize: 20
      }
    )

    return response.results
  } catch (error) {
    console.error(`Error searching categories with query ${query}:`, error)
    return []
  }
}

/**
 * Get category slugs for static generation
 */
export async function getCategorySlugs(): Promise<string[]> {
  const categories = await getAllCategories()
  
  return categories
    .map(category => {
      const slug = category.properties.Slug.rich_text[0]?.plain_text
      return slug ? slug.trim() : null
    })
    .filter((slug): slug is string => slug !== null && slug.length > 0)
}

/**
 * Get categories statistics
 */
export async function getCategoriesStatistics(): Promise<{
  totalCategories: number
  categoriesWithDescription: number
  categoriesWithIcon: number
  colorDistribution: Record<string, number>
}> {
  try {
    const categories = await getAllCategories()

    const totalCategories = categories.length
    
    const categoriesWithDescription = categories.filter(
      category => category.properties.Description.rich_text.length > 0
    ).length

    const categoriesWithIcon = categories.filter(
      category => category.properties.Icon.rich_text.length > 0
    ).length

    // Count categories by color
    const colorDistribution: Record<string, number> = {}
    categories.forEach(category => {
      const color = category.properties.Color.select?.name
      if (color) {
        colorDistribution[color] = (colorDistribution[color] || 0) + 1
      }
    })

    return {
      totalCategories,
      categoriesWithDescription,
      categoriesWithIcon,
      colorDistribution
    }
  } catch (error) {
    console.error('Error getting categories statistics:', error)
    return {
      totalCategories: 0,
      categoriesWithDescription: 0,
      categoriesWithIcon: 0,
      colorDistribution: {}
    }
  }
}

/**
 * Get category name from properties
 */
export function getCategoryName(category: NotionCategoryPage): string {
  return category.properties.Name.title[0]?.plain_text || 'Unknown Category'
}

/**
 * Get category slug from properties
 */
export function getCategorySlug(category: NotionCategoryPage): string | null {
  return category.properties.Slug.rich_text[0]?.plain_text || null
}

/**
 * Get category description from properties
 */
export function getCategoryDescription(category: NotionCategoryPage): string {
  return category.properties.Description.rich_text
    .map(text => text.plain_text)
    .join('')
    .trim()
}

/**
 * Get category color from properties
 */
export function getCategoryColor(category: NotionCategoryPage): NotionColor | null {
  return category.properties.Color.select?.color || null
}

/**
 * Get category icon from properties
 */
export function getCategoryIcon(category: NotionCategoryPage): string | null {
  return category.properties.Icon.rich_text[0]?.plain_text || null
}

/**
 * Map category color to CSS classes for styling
 */
export function getCategoryColorClasses(color: NotionColor | null): {
  background: string
  text: string
  border: string
} {
  switch (color) {
    case 'blue':
    case 'blue_background':
      return {
        background: 'bg-blue-100 dark:bg-blue-900/20',
        text: 'text-blue-800 dark:text-blue-200',
        border: 'border-blue-200 dark:border-blue-800'
      }
    case 'green':
    case 'green_background':
      return {
        background: 'bg-green-100 dark:bg-green-900/20',
        text: 'text-green-800 dark:text-green-200',
        border: 'border-green-200 dark:border-green-800'
      }
    case 'orange':
    case 'orange_background':
      return {
        background: 'bg-orange-100 dark:bg-orange-900/20',
        text: 'text-orange-800 dark:text-orange-200',
        border: 'border-orange-200 dark:border-orange-800'
      }
    case 'purple':
    case 'purple_background':
      return {
        background: 'bg-purple-100 dark:bg-purple-900/20',
        text: 'text-purple-800 dark:text-purple-200',
        border: 'border-purple-200 dark:border-purple-800'
      }
    case 'pink':
    case 'pink_background':
      return {
        background: 'bg-pink-100 dark:bg-pink-900/20',
        text: 'text-pink-800 dark:text-pink-200',
        border: 'border-pink-200 dark:border-pink-800'
      }
    case 'red':
    case 'red_background':
      return {
        background: 'bg-red-100 dark:bg-red-900/20',
        text: 'text-red-800 dark:text-red-200',
        border: 'border-red-200 dark:border-red-800'
      }
    case 'yellow':
    case 'yellow_background':
      return {
        background: 'bg-yellow-100 dark:bg-yellow-900/20',
        text: 'text-yellow-800 dark:text-yellow-200',
        border: 'border-yellow-200 dark:border-yellow-800'
      }
    case 'gray':
    case 'gray_background':
      return {
        background: 'bg-gray-100 dark:bg-gray-900/20',
        text: 'text-gray-800 dark:text-gray-200',
        border: 'border-gray-200 dark:border-gray-800'
      }
    case 'brown':
    case 'brown_background':
      return {
        background: 'bg-amber-100 dark:bg-amber-900/20',
        text: 'text-amber-800 dark:text-amber-200',
        border: 'border-amber-200 dark:border-amber-800'
      }
    default:
      return {
        background: 'bg-zinc-100 dark:bg-zinc-900/20',
        text: 'text-zinc-800 dark:text-zinc-200',
        border: 'border-zinc-200 dark:border-zinc-800'
      }
  }
}

/**
 * Check if categories database is configured
 */
export function isCategoriesConfigured(): boolean {
  return Boolean(DATABASES.CATEGORIES)
}

/**
 * Get default categories based on CLAUDE.md specifications
 * This can be used as fallback when categories database is not configured
 */
export function getDefaultCategories(): Array<{
  name: string
  slug: string
  description: string
  color: NotionColor
  icon: string
}> {
  return [
    {
      name: 'Gestão',
      slug: 'gestao',
      description: 'Processos administrativos, workflows',
      color: 'blue',
      icon: '📋'
    },
    {
      name: 'Liderança',
      slug: 'lideranca',
      description: 'Management, team building',
      color: 'orange',
      icon: '👥'
    },
    {
      name: 'Estratégia',
      slug: 'estrategia',
      description: 'Planejamento, business strategy',
      color: 'purple',
      icon: '🎯'
    },
    {
      name: 'Tecnologia',
      slug: 'tecnologia',
      description: 'Digital transformation, tools',
      color: 'green',
      icon: '💻'
    },
    {
      name: 'Pessoas',
      slug: 'pessoas',
      description: 'HR, cultura organizacional',
      color: 'pink',
      icon: '🤝'
    },
    {
      name: 'Processos',
      slug: 'processos',
      description: 'Otimização, automação',
      color: 'gray',
      icon: '⚙️'
    }
  ]
}
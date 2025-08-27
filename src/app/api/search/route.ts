import { NextRequest, NextResponse } from 'next/server'
import { searchPosts, getCategoryStats } from '@/lib/notion/posts'
import { getAllAuthors } from '@/lib/notion/authors'
import { getAllCategories } from '@/lib/notion/categories'
import { transformNotionPost } from '@/lib/notion/transforms'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const author = searchParams.get('author')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sort') || 'date'

    // If no query, return empty results with filters
    if (!query.trim()) {
      const [categories, categoryStats] = await Promise.all([
        getAllCategories(),
        getCategoryStats()
      ])

      return NextResponse.json({
        posts: [],
        query: '',
        total: 0,
        hasMore: false,
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        },
        filters: {
          categories: categoryStats,
          authors: [] // We'll populate this when needed
        },
        suggestions: []
      })
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Search posts
    const searchResult = await searchPosts(query, {
      pageSize: limit,
      // For now, we'll implement basic search
      // TODO: Add category and author filtering
    })

    // Transform posts
    const transformedPosts = searchResult.posts.map(post => transformNotionPost(post))

    // Filter by category if specified
    let filteredPosts = transformedPosts
    if (category) {
      filteredPosts = transformedPosts.filter(post => 
        post.category?.name?.toLowerCase() === category.toLowerCase()
      )
    }

    // Calculate pagination
    const total = filteredPosts.length
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrevious = page > 1

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(offset, offset + limit)

    // Get filter data
    const [categories, categoryStats] = await Promise.all([
      getAllCategories(),
      getCategoryStats()
    ])

    // Generate search suggestions based on query
    const suggestions = generateSearchSuggestions(query, transformedPosts)

    return NextResponse.json({
      posts: paginatedPosts,
      query,
      total,
      hasMore: searchResult.hasMore,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrevious
      },
      filters: {
        categories: categoryStats,
        authors: [] // TODO: Implement author filtering
      },
      suggestions
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        posts: [],
        total: 0,
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrevious: false
        }
      },
      { status: 500 }
    )
  }
}

/**
 * Generate search suggestions based on query and posts
 */
function generateSearchSuggestions(query: string, posts: any[]): string[] {
  const suggestions: string[] = []
  const queryLower = query.toLowerCase()

  // Extract relevant terms from posts
  posts.slice(0, 10).forEach(post => {
    // Add category as suggestion
    if (post.category?.name && post.category.name.toLowerCase().includes(queryLower)) {
      suggestions.push(post.category.name)
    }

    // Add tags as suggestions
    post.tags?.forEach((tag: string) => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.push(tag)
      }
    })

    // Add title words as suggestions
    const titleWords = post.title.toLowerCase().split(' ')
    titleWords.forEach((word: string) => {
      if (word.length > 3 && word.includes(queryLower)) {
        suggestions.push(word)
      }
    })
  })

  // Remove duplicates and limit to 5 suggestions
  return [...new Set(suggestions)].slice(0, 5)
}
import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// Webhook secret for security (set in Notion integration)
const WEBHOOK_SECRET = process.env.NOTION_WEBHOOK_SECRET || 'dev-webhook-secret'

interface NotionWebhookPayload {
  type: 'page' | 'database'
  action: 'create' | 'update' | 'delete'
  object: {
    id: string
    parent?: {
      type: string
      database_id?: string
    }
    properties?: any
  }
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify webhook signature (if implemented)
    const signature = request.headers.get('notion-signature')
    const body = await request.text()
    
    // Basic security check
    if (!signature || !body) {
      console.error('Invalid webhook request')
      return NextResponse.json(
        { error: 'Invalid webhook request' },
        { status: 400 }
      )
    }

    const payload: NotionWebhookPayload = JSON.parse(body)
    
    console.log('Notion webhook received:', {
      type: payload.type,
      action: payload.action,
      objectId: payload.object.id,
      timestamp: payload.timestamp
    })

    // Handle different webhook events
    await handleNotionWebhook(payload)

    return NextResponse.json({
      success: true,
      processed: true,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleNotionWebhook(payload: NotionWebhookPayload) {
  const { type, action, object } = payload

  if (type !== 'page') {
    console.log('Ignoring non-page webhook')
    return
  }

  // Determine what type of page was changed
  const databaseId = object.parent?.database_id
  
  if (!databaseId) {
    console.log('Page not in a database, ignoring')
    return
  }

  // Check which database this page belongs to
  const isPostsDb = databaseId === process.env.NOTION_DATABASE_ID || 
                   databaseId === process.env.NOTION_POSTS_DATABASE_ID
  const isAuthorsDb = databaseId === process.env.NOTION_AUTHORS_DATABASE_ID
  const isCategoriesDb = databaseId === process.env.NOTION_CATEGORIES_DATABASE_ID

  switch (action) {
    case 'create':
    case 'update':
      if (isPostsDb) {
        await handlePostChange(object, action)
      } else if (isAuthorsDb) {
        await handleAuthorChange(object, action)
      } else if (isCategoriesDb) {
        await handleCategoryChange(object, action)
      }
      break

    case 'delete':
      // Handle deletions - revalidate broader caches
      if (isPostsDb) {
        revalidateTag('posts')
        revalidatePath('/')
      } else if (isAuthorsDb) {
        revalidateTag('authors')
      } else if (isCategoriesDb) {
        revalidateTag('categories')
      }
      break
  }
}

async function handlePostChange(object: any, action: 'create' | 'update') {
  console.log(`Post ${action}:`, object.id)

  // Always revalidate posts list
  revalidateTag('posts')
  revalidatePath('/')

  // If we can determine the slug, revalidate the specific post
  try {
    const slug = object.properties?.Slug?.rich_text?.[0]?.plain_text
    if (slug) {
      revalidatePath(`/post/${slug}`)
      revalidateTag('post')
      console.log(`Revalidated post: ${slug}`)
    }

    // Revalidate category page if we know the category
    const category = object.properties?.Category?.select?.name
    if (category) {
      // Convert category name to slug (simplified)
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-')
      revalidatePath(`/category/${categorySlug}`)
    }

    // Revalidate author page if we know the author
    const authorId = object.properties?.Author?.relation?.[0]?.id
    if (authorId) {
      // We'd need to fetch the author to get their slug
      // For now, just revalidate all authors
      revalidateTag('authors')
    }

  } catch (error) {
    console.warn('Could not extract specific details for targeted revalidation:', error)
  }
}

async function handleAuthorChange(object: any, action: 'create' | 'update') {
  console.log(`Author ${action}:`, object.id)

  // Revalidate authors
  revalidateTag('authors')

  // Revalidate posts that might reference this author
  revalidateTag('posts')

  // If we can determine the slug, revalidate the specific author page
  try {
    const slug = object.properties?.Slug?.rich_text?.[0]?.plain_text
    if (slug) {
      revalidatePath(`/author/${slug}`)
      console.log(`Revalidated author: ${slug}`)
    }
  } catch (error) {
    console.warn('Could not extract author slug for targeted revalidation:', error)
  }
}

async function handleCategoryChange(object: any, action: 'create' | 'update') {
  console.log(`Category ${action}:`, object.id)

  // Revalidate categories
  revalidateTag('categories')

  // Revalidate posts that might reference this category
  revalidateTag('posts')

  // If we can determine the slug, revalidate the specific category page
  try {
    const slug = object.properties?.Slug?.rich_text?.[0]?.plain_text
    if (slug) {
      revalidatePath(`/category/${slug}`)
      console.log(`Revalidated category: ${slug}`)
    }
  } catch (error) {
    console.warn('Could not extract category slug for targeted revalidation:', error)
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    webhook: 'notion',
    timestamp: new Date().toISOString()
  })
}
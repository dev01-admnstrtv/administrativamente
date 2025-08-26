import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag, revalidatePath } from 'next/cache'

// Secret for webhook security
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'dev-secret'

export async function POST(request: NextRequest) {
  try {
    // Verify secret
    const body = await request.json()
    const { secret, type, slug, tags } = body

    if (secret !== REVALIDATE_SECRET) {
      console.error('Invalid revalidation secret')
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      )
    }

    console.log('Revalidating:', { type, slug, tags })

    // Revalidate based on type
    switch (type) {
      case 'post':
        if (slug) {
          revalidatePath(`/post/${slug}`)
          revalidateTag('post')
        } else {
          revalidateTag('posts')
        }
        break

      case 'posts':
        revalidateTag('posts')
        revalidatePath('/')
        break

      case 'category':
        if (slug) {
          revalidatePath(`/category/${slug}`)
        }
        revalidateTag('categories')
        break

      case 'author':
        if (slug) {
          revalidatePath(`/author/${slug}`)
        }
        revalidateTag('authors')
        break

      case 'all':
        revalidateTag('posts')
        revalidateTag('categories')
        revalidateTag('authors')
        revalidateTag('homepage')
        revalidatePath('/')
        break

      default:
        // Custom tags
        if (tags && Array.isArray(tags)) {
          tags.forEach((tag: string) => revalidateTag(tag))
        }
        break
    }

    return NextResponse.json({
      success: true,
      revalidated: true,
      type,
      slug,
      tags,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { error: 'Revalidation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Support GET for manual testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const type = searchParams.get('type') || 'all'

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: 'Invalid secret' },
      { status: 401 }
    )
  }

  try {
    // Manual revalidation for testing
    switch (type) {
      case 'posts':
        revalidateTag('posts')
        break
      case 'categories':
        revalidateTag('categories')
        break
      case 'authors':
        revalidateTag('authors')
        break
      default:
        revalidateTag('posts')
        revalidateTag('categories')
        revalidateTag('authors')
        break
    }

    return NextResponse.json({
      success: true,
      type,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    )
  }
}
import type { 
  NotionPostPage,
  NotionAuthorPage, 
  NotionCategoryPage,
  NotionRichTextItem,
  NotionBlock
} from '@/lib/types/notion'
import type { 
  BlogPost,
  BlogAuthor,
  BlogCategory 
} from '@/lib/types/blog'
import { 
  getAuthorName,
  getAuthorSlug,
  getAuthorBio,
  getAuthorRole,
  getAuthorAvatar,
  parseAuthorSocialLinks
} from './authors'
import {
  getCategoryName,
  getCategorySlug,
  getCategoryDescription,
  getCategoryColor,
  getCategoryIcon,
  getCategoryColorClasses
} from './categories'
import { calculateReadingTime } from '@/lib/utils/reading-time'
import { formatDate } from '@/lib/utils/date'

/**
 * Transform Notion rich text to plain text
 */
export function richTextToPlainText(richText: NotionRichTextItem[]): string {
  return richText
    .map(text => text.plain_text)
    .join('')
    .trim()
}

/**
 * Transform Notion rich text to HTML
 */
export function richTextToHtml(richText: NotionRichTextItem[]): string {
  return richText
    .map(text => {
      let content = text.plain_text

      // Apply text formatting
      if (text.annotations.bold) {
        content = `<strong>${content}</strong>`
      }
      if (text.annotations.italic) {
        content = `<em>${content}</em>`
      }
      if (text.annotations.code) {
        content = `<code>${content}</code>`
      }
      if (text.annotations.strikethrough) {
        content = `<del>${content}</del>`
      }
      if (text.annotations.underline) {
        content = `<u>${content}</u>`
      }

      // Add links
      if (text.href || text.text?.link) {
        const url = text.href || text.text?.link?.url
        content = `<a href="${url}" target="_blank" rel="noopener noreferrer">${content}</a>`
      }

      return content
    })
    .join('')
}

/**
 * Transform Notion post to blog post
 */
export function transformNotionPost(
  notionPost: NotionPostPage,
  author?: NotionAuthorPage | null,
  category?: NotionCategoryPage | null
): BlogPost {
  const title = richTextToPlainText(notionPost.properties.Title.title)
  const slug = richTextToPlainText(notionPost.properties.Slug.rich_text)
  const excerpt = richTextToPlainText(notionPost.properties.Excerpt.rich_text)
  const content = '' // Content will be loaded separately from blocks
  
  // Get featured image
  let featuredImage: string | null = null
  const featuredImageFile = notionPost.properties['Featured Image'].files[0]
  if (featuredImageFile) {
    if (featuredImageFile.type === 'external') {
      featuredImage = featuredImageFile.external?.url || null
    } else if (featuredImageFile.type === 'file') {
      featuredImage = featuredImageFile.file?.url || null
    }
  }

  // Get published date
  const publishedDate = notionPost.properties['Published Date'].date?.start || notionPost.created_time

  // Get tags
  const tags = notionPost.properties.Tags.multi_select.map(tag => tag.name)

  // Get reading time or calculate from content length
  let readingTime = notionPost.properties['Reading Time'].number || 0
  if (!readingTime && content) {
    readingTime = calculateReadingTime(content)
  }

  // SEO data
  const seoTitle = richTextToPlainText(notionPost.properties['SEO Title'].rich_text) || title
  const seoDescription = richTextToPlainText(notionPost.properties['SEO Description'].rich_text) || excerpt

  // Extract category info directly from properties if not provided
  let categoryInfo = null
  if (category) {
    categoryInfo = transformNotionCategory(category)
  } else if (notionPost.properties.Category.select) {
    // Create a minimal category object from the select property
    categoryInfo = {
      id: notionPost.properties.Category.select.id,
      name: notionPost.properties.Category.select.name,
      slug: notionPost.properties.Category.select.name.toLowerCase().replace(/\s+/g, '-'),
      description: '',
      color: notionPost.properties.Category.select.color || 'default',
      icon: null,
      colorClasses: {
        background: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      },
      notion: {
        pageId: notionPost.properties.Category.select.id,
        lastEditedTime: notionPost.last_edited_time,
        url: ''
      }
    }
  }

  // Handle author - check if Author property exists
  let authorInfo = null
  if (author) {
    authorInfo = transformNotionAuthor(author)
  } else if (notionPost.properties.Author && notionPost.properties.Author.relation && notionPost.properties.Author.relation.length > 0) {
    // Author exists as relation - would need to fetch the full author data
    // For now, create a minimal author object
    authorInfo = {
      id: notionPost.properties.Author.relation[0].id,
      name: 'Autor', // We'd need to fetch this
      slug: 'autor',
      bio: '',
      role: 'Administrativa(mente)',
      avatar: null,
      socialLinks: {},
      notion: {
        pageId: notionPost.properties.Author.relation[0].id,
        lastEditedTime: notionPost.last_edited_time,
        url: ''
      }
    }
  } else {
    // No author property or no author assigned, create default
    authorInfo = {
      id: 'default-author',
      name: 'Administrativa(mente)',
      slug: 'administrativa-mente',
      bio: 'Blog premium focado em gestão administrativa, liderança e estratégia corporativa.',
      role: 'Blog Premium',
      avatar: null,
      socialLinks: {},
      notion: {
        pageId: 'default',
        lastEditedTime: notionPost.last_edited_time,
        url: ''
      }
    }
  }

  return {
    id: notionPost.id,
    title,
    slug,
    excerpt,
    content,
    status: notionPost.properties.Status.select?.name as 'draft' | 'published' | 'archived' || 'draft',
    featuredImage,
    publishedAt: publishedDate,
    updatedAt: notionPost.last_edited_time,
    author: authorInfo,
    category: categoryInfo,
    tags,
    featured: notionPost.properties.Featured.checkbox,
    readingTime,
    seo: {
      title: seoTitle,
      description: seoDescription,
    },
    notion: {
      pageId: notionPost.id,
      databaseId: notionPost.parent.type === 'database_id' ? notionPost.parent.database_id || '' : '',
      lastEditedTime: notionPost.last_edited_time,
      url: notionPost.url
    }
  }
}

/**
 * Transform Notion author to blog author
 */
export function transformNotionAuthor(notionAuthor: NotionAuthorPage): BlogAuthor {
  const name = getAuthorName(notionAuthor)
  const slug = getAuthorSlug(notionAuthor)
  const bio = getAuthorBio(notionAuthor)
  const role = getAuthorRole(notionAuthor)
  const avatar = getAuthorAvatar(notionAuthor)
  const socialLinks = parseAuthorSocialLinks(notionAuthor)

  return {
    id: notionAuthor.id,
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    bio,
    role,
    avatar,
    socialLinks,
    notion: {
      pageId: notionAuthor.id,
      lastEditedTime: notionAuthor.last_edited_time,
      url: notionAuthor.url
    }
  }
}

/**
 * Transform Notion category to blog category
 */
export function transformNotionCategory(notionCategory: NotionCategoryPage): BlogCategory {
  const name = getCategoryName(notionCategory)
  const slug = getCategorySlug(notionCategory)
  const description = getCategoryDescription(notionCategory)
  const color = getCategoryColor(notionCategory)
  const icon = getCategoryIcon(notionCategory)
  const colorClasses = getCategoryColorClasses(color)

  return {
    id: notionCategory.id,
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description,
    color: color || 'default',
    icon,
    colorClasses,
    notion: {
      pageId: notionCategory.id,
      lastEditedTime: notionCategory.last_edited_time,
      url: notionCategory.url
    }
  }
}

/**
 * Transform multiple Notion posts to blog posts
 */
export async function transformNotionPosts(
  notionPosts: NotionPostPage[],
  options?: {
    includeAuthors?: boolean
    includeCategories?: boolean
  }
): Promise<BlogPost[]> {
  const { includeAuthors = false, includeCategories = false } = options || {}
  
  return Promise.all(
    notionPosts.map(async (notionPost) => {
      let author: NotionAuthorPage | null = null
      let category: NotionCategoryPage | null = null

      // TODO: Fetch related author and category if needed
      // This would require importing the author/category functions
      // For now, we'll transform without them

      return transformNotionPost(notionPost, author, category)
    })
  )
}

/**
 * Extract featured image from Notion post
 */
export function extractFeaturedImage(notionPost: NotionPostPage): string | null {
  // Try featured image property first
  const featuredImageFile = notionPost.properties['Featured Image'].files[0]
  if (featuredImageFile) {
    if (featuredImageFile.type === 'external') {
      return featuredImageFile.external?.url || null
    } else if (featuredImageFile.type === 'file') {
      return featuredImageFile.file?.url || null
    }
  }

  // Try page cover as fallback
  if (notionPost.cover) {
    if (notionPost.cover.type === 'external') {
      return notionPost.cover.external?.url || null
    } else if (notionPost.cover.type === 'file') {
      return notionPost.cover.file?.url || null
    }
  }

  return null
}

/**
 * Extract tags from Notion post
 */
export function extractTags(notionPost: NotionPostPage): string[] {
  return notionPost.properties.Tags.multi_select.map(tag => tag.name)
}

/**
 * Check if post is published
 */
export function isPostPublished(notionPost: NotionPostPage): boolean {
  return notionPost.properties.Status.select?.name === 'published'
}

/**
 * Check if post is featured
 */
export function isPostFeatured(notionPost: NotionPostPage): boolean {
  return notionPost.properties.Featured.checkbox
}

/**
 * Get post publish date or fallback to created date
 */
export function getPostPublishDate(notionPost: NotionPostPage): string {
  return notionPost.properties['Published Date'].date?.start || notionPost.created_time
}

/**
 * Transform Notion blocks to HTML content
 * Enhanced version with better list handling
 */
export function transformBlocksToHtml(blocks: NotionBlock[]): string {
  if (!blocks || blocks.length === 0) {
    return ''
  }

  const html = blocks
    .map(block => {
      switch (block.type) {
        case 'paragraph':
          const paragraphText = block.paragraph?.rich_text || []
          if (paragraphText.length === 0) return ''
          return `<p>${richTextToHtml(paragraphText)}</p>`
        
        case 'heading_1':
          const h1Text = block.heading_1?.rich_text || []
          if (h1Text.length === 0) return ''
          return `<h1>${richTextToHtml(h1Text)}</h1>`
        
        case 'heading_2':
          const h2Text = block.heading_2?.rich_text || []
          if (h2Text.length === 0) return ''
          return `<h2>${richTextToHtml(h2Text)}</h2>`
        
        case 'heading_3':
          const h3Text = block.heading_3?.rich_text || []
          if (h3Text.length === 0) return ''
          return `<h3>${richTextToHtml(h3Text)}</h3>`
        
        case 'bulleted_list_item':
          const bulletText = block.bulleted_list_item?.rich_text || []
          if (bulletText.length === 0) return ''
          return `<ul><li>${richTextToHtml(bulletText)}</li></ul>`
        
        case 'numbered_list_item':
          const numberedText = block.numbered_list_item?.rich_text || []
          if (numberedText.length === 0) return ''
          return `<ol><li>${richTextToHtml(numberedText)}</li></ol>`
        
        case 'quote':
          const quoteText = block.quote?.rich_text || []
          if (quoteText.length === 0) return ''
          return `<blockquote>${richTextToHtml(quoteText)}</blockquote>`
        
        case 'code':
          const codeText = block.code?.rich_text || []
          if (codeText.length === 0) return ''
          const language = block.code?.language || 'text'
          return `<pre><code class="language-${language}">${richTextToPlainText(codeText)}</code></pre>`
        
        case 'divider':
          return '<hr />'
        
        case 'image':
          let imageUrl = ''
          if (block.image?.type === 'external') {
            imageUrl = block.image.external?.url || ''
          } else if (block.image?.type === 'file') {
            imageUrl = block.image.file?.url || ''
          }
          if (!imageUrl) return ''
          const caption = block.image?.caption ? richTextToPlainText(block.image.caption) : ''
          return `<figure><img src="${imageUrl}" alt="${caption}" />${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`
        
        default:
          // For unsupported block types, return empty string
          return ''
      }
    })
    .filter(html => html.trim() !== '')
    .join('\n')

  return html
}

/**
 * Transform Notion blocks to markdown content
 */
export function transformBlocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks
    .map(block => {
      switch (block.type) {
        case 'paragraph':
          const paragraphText = block.paragraph?.rich_text || []
          return richTextToPlainText(paragraphText)
        
        case 'heading_1':
          const h1Text = block.heading_1?.rich_text || []
          return `# ${richTextToPlainText(h1Text)}`
        
        case 'heading_2':
          const h2Text = block.heading_2?.rich_text || []
          return `## ${richTextToPlainText(h2Text)}`
        
        case 'heading_3':
          const h3Text = block.heading_3?.rich_text || []
          return `### ${richTextToPlainText(h3Text)}`
        
        case 'bulleted_list_item':
          const bulletText = block.bulleted_list_item?.rich_text || []
          return `- ${richTextToPlainText(bulletText)}`
        
        case 'numbered_list_item':
          const numberedText = block.numbered_list_item?.rich_text || []
          return `1. ${richTextToPlainText(numberedText)}`
        
        case 'quote':
          const quoteText = block.quote?.rich_text || []
          return `> ${richTextToPlainText(quoteText)}`
        
        case 'code':
          const codeText = block.code?.rich_text || []
          const language = block.code?.language || ''
          return `\`\`\`${language}\n${richTextToPlainText(codeText)}\n\`\`\``
        
        case 'divider':
          return '---'
        
        case 'image':
          let imageUrl = ''
          if (block.image?.type === 'external') {
            imageUrl = block.image.external?.url || ''
          } else if (block.image?.type === 'file') {
            imageUrl = block.image.file?.url || ''
          }
          const caption = block.image?.caption ? richTextToPlainText(block.image.caption) : ''
          return `![${caption}](${imageUrl})`
        
        default:
          return ''
      }
    })
    .filter(text => text.trim() !== '')
    .join('\n\n')
}

/**
 * Create blog post excerpt from content
 */
export function createExcerpt(content: string, maxLength = 160): string {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '').trim()
  
  if (plainText.length <= maxLength) {
    return plainText
  }
  
  // Find the last space before the max length to avoid cutting words
  const truncated = plainText.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + '...'
  }
  
  return truncated + '...'
}

/**
 * Sanitize and validate blog post data
 */
export function sanitizeBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    title: post.title.trim(),
    slug: post.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'),
    excerpt: post.excerpt.trim(),
    content: post.content.trim(),
    tags: post.tags.filter(tag => tag.trim().length > 0).map(tag => tag.trim()),
    readingTime: Math.max(1, Math.round(post.readingTime)),
    seo: {
      title: post.seo.title.trim() || post.title,
      description: post.seo.description.trim() || post.excerpt,
    }
  }
}
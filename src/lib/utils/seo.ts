import type { Metadata } from 'next'

interface SEOMetaProps {
  title: string
  description: string
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  tags?: string[]
}

/**
 * Generate comprehensive SEO metadata
 */
export function generateSEOMeta({
  title,
  description,
  canonical,
  image = '/opengraph-image.png',
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags = [],
}: SEOMetaProps): Metadata {
  const siteName = 'Administrativa(mente)'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const fullTitle = `${title} | ${siteName}`
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  const metadata: Metadata = {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || siteUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }

  // Add canonical URL if provided
  if (canonical) {
    metadata.alternates = {
      canonical,
    }
  }

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime: modifiedTime || publishedTime,
      authors: author ? [author] : undefined,
      tags: tags.length > 0 ? tags : undefined,
    }
  }

  return metadata
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleStructuredData({
  title,
  description,
  author,
  publishedTime,
  modifiedTime,
  image,
  url,
  tags = [],
}: {
  title: string
  description: string
  author: string
  publishedTime: string
  modifiedTime?: string
  image: string
  url: string
  tags?: string[]
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Administrativa(mente)',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    datePublished: publishedTime,
    dateModified: modifiedTime || publishedTime,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
  }
}
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, Calendar, User, Share2, Twitter, Linkedin, Facebook, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { ReadingProgress } from '@/components/blog/ReadingProgress'
import { ShareButtons } from '@/components/blog/ShareButtons'
import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { getPostBySlug, getRelatedPosts, getPostContent, getPostSlugs } from '@/lib/notion/posts'
import { transformNotionPost, transformBlocksToHtml } from '@/lib/notion/transforms'

// Get post data from Notion
const getPostData = async (slug: string) => {
  const notionPost = await getPostBySlug(slug)
  
  if (!notionPost) {
    return null
  }

  // Get post content blocks
  const blocks = await getPostContent(notionPost.id)
  const htmlContent = transformBlocksToHtml(blocks)

  // Transform to BlogPost
  const post = transformNotionPost(notionPost)
  
  return {
    ...post,
    content: htmlContent
  }
}

// Get related posts from Notion
const getRelatedPostsData = async (postId: string, category?: string, tags?: string[]) => {
  const notionPosts = await getRelatedPosts(postId, category, tags, 3)
  return notionPosts.map(post => transformNotionPost(post))
}

interface PostPageProps {
  params: {
    slug: string
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostData(params.slug)
  
  if (!post) {
    return {
      title: 'Post não encontrado | Administrativa(mente)',
      description: 'O post solicitado não foi encontrado.'
    }
  }
  
  return {
    title: post.seo.title,
    description: post.seo.description,
    authors: [{ name: post.author?.name || 'Administrativa(mente)' }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author?.name || 'Administrativa(mente)'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostData(params.slug)
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = await getRelatedPostsData(
    post.id, 
    post.category?.name, 
    post.tags
  )
  const postUrl = `https://administrativa-mente.com/post/${post.slug}`

  return (
    <>
      <ReadingProgress />
      
      <article className="min-h-screen">
        {/* Header */}
        <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
          <div className="container px-4 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Link>
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {post.category?.name || 'Sem categoria'}
                </Badge>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {post.readingTime} min de leitura
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-zinc-50 to-zinc-100/50 py-16 dark:from-zinc-950 dark:to-zinc-900/50 lg:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              {/* Tags */}
              <div className="mb-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="mb-6 font-serif text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl xl:text-6xl">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="mb-8 text-xl leading-relaxed text-muted-foreground lg:text-2xl">
                {post.excerpt}
              </p>

              {/* Meta Info */}
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                    <div>
                      <div className="font-semibold text-foreground">
                        {post.author?.name || 'Autor'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {post.author?.role || 'Administrativa(mente)'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Date */}
                  <div className="hidden sm:block text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </div>
                  </div>
                </div>

                {/* Share Buttons */}
                <ShareButtons
                  url={postUrl}
                  title={post.title}
                  description={post.excerpt}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 lg:py-24">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              {/* Featured Image */}
              {post.featuredImage ? (
                <div className="mb-12 aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
              ) : (
                <div className="mb-12 aspect-[16/9] overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <div className="mb-4 text-6xl">📊</div>
                      <div className="text-lg">Imagem do artigo em breve</div>
                      <div className="mt-2 text-sm opacity-70">
                        Adicione uma imagem na propriedade "Featured Image" do post no Notion
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Article Content */}
              {post.content && post.content.trim() ? (
                <div 
                  className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-headings:font-serif prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-p:leading-relaxed prose-p:text-muted-foreground prose-blockquote:border-l-4 prose-blockquote:border-zinc-300 prose-blockquote:bg-zinc-50/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:rounded-r-lg dark:prose-blockquote:border-zinc-700 dark:prose-blockquote:bg-zinc-900/50 prose-ul:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                <div className="space-y-6">
                  {/* Show excerpt as temporary content */}
                  {post.excerpt && (
                    <div className="prose prose-lg prose-zinc max-w-none dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground">
                      <p className="text-xl leading-relaxed">{post.excerpt}</p>
                    </div>
                  )}
                  
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                        <span className="text-xl">📝</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                          Conteúdo em desenvolvimento
                        </h3>
                        <p className="mb-3 text-sm text-blue-700 dark:text-blue-300">
                          Este artigo ainda está sendo escrito. Para adicionar o conteúdo completo:
                        </p>
                        <ol className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                          <li>1. Acesse a página "{post.title}" no Notion</li>
                          <li>2. Adicione conteúdo diretamente na página (parágrafos, cabeçalhos, etc.)</li>
                          <li>3. O conteúdo aparecerá automaticamente aqui após salvar</li>
                        </ol>
                        <div className="mt-4 text-xs text-blue-500 dark:text-blue-500">
                          Post ID: {post.id} | Slug: {post.slug}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Author Bio */}
        <section className="border-t border-border/40 bg-zinc-50/50 py-16 dark:bg-zinc-950/50">
          <div className="container px-4">
            <div className="mx-auto max-w-3xl">
              <Card variant="default" className="p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                  <div className="flex-1">
                    <h3 className="mb-2 font-serif text-xl font-bold text-foreground">
                      {post.author?.name || 'Administrativa(mente)'}
                    </h3>
                    <p className="mb-4 text-sm font-medium text-muted-foreground">
                      {post.author?.role || 'Blog Premium'}
                    </p>
                    <p className="mb-4 leading-relaxed text-muted-foreground">
                      {post.author?.bio || 'Insights estratégicos, metodologias comprovadas e ferramentas práticas para líderes que buscam excelência operacional.'}
                    </p>
                    <div className="flex gap-3">
                      {post.author?.socialLinks?.linkedin && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={post.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {post.author?.socialLinks?.twitter && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={post.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <RelatedPosts posts={relatedPosts} />
      </article>
    </>
  )
}

// Generate static params for all post slugs
export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  
  return slugs.map((slug) => ({
    slug: slug,
  }))
}
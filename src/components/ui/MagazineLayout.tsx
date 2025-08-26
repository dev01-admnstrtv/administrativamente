'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, User, ArrowUpRight, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface MagazineBlogPost {
  id: string
  title: string
  excerpt: string
  slug: string
  image?: string
  category: {
    name: string
    color: string
  }
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  publishedAt: string
  readingTime: number
  featured?: boolean
}

interface MagazineLayoutProps {
  posts: MagazineBlogPost[]
  layout?: 'standard' | 'masonry' | 'golden' | 'z-pattern'
  animated?: boolean
  className?: string
}

interface HeroArticleProps {
  post: MagazineBlogPost
  className?: string
}

interface FeaturedArticleProps {
  post: MagazineBlogPost
  size?: 'small' | 'medium' | 'large'
  className?: string
}

interface SidebarArticleProps {
  post: MagazineBlogPost
  className?: string
}

interface PullquoteProps {
  quote: string
  author?: string
  size?: 'large' | 'sidebar'
  className?: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Hero Article Component
export function HeroArticle({ post, className = "" }: HeroArticleProps) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`article-hero ${className}`}
    >
      <div
        className="article-hero-background"
        style={{ backgroundImage: `url(${post.image || '/api/placeholder/1200/600'})` }}
      />
      
      <div className="article-hero-content">
        <div className="category-pills mb-4">
          <Badge variant="secondary" className="category-pill">
            {post.category.name}
          </Badge>
        </div>
        
        <h1 className="article-hero-title">
          {post.title}
        </h1>
        
        <p className="article-hero-excerpt">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="author-card">
            <div className="author-avatar">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="author-info">
              <div className="author-name">{post.author.name}</div>
              <div className="reading-time">
                <Clock className="w-3 h-3" />
                {post.readingTime} min de leitura
              </div>
            </div>
          </div>
          
          <Link 
            href={`/post/${post.slug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
          >
            Ler artigo
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  )
}

// Featured Article Component
export function FeaturedArticle({ post, size = 'medium', className = "" }: FeaturedArticleProps) {
  const sizeClasses = {
    small: 'col-4',
    medium: 'col-6',
    large: 'col-8'
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`article-featured ${sizeClasses[size]} ${className}`}
    >
      <div className="article-featured-image">
        <Image
          src={post.image || '/api/placeholder/600/300'}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge 
            variant="secondary" 
            className="category-pill"
            style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
          >
            {post.category.name}
          </Badge>
        </div>
      </div>
      
      <div className="article-featured-content">
        <h3 className="article-featured-title">
          <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h3>
        
        <p className="article-featured-excerpt">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="w-3 h-3" />
            {post.author.name}
          </div>
          
          <div className="reading-time">
            {post.readingTime} min
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {formatDate(post.publishedAt)}
        </div>
      </div>
    </motion.article>
  )
}

// Sidebar Article Component
export function SidebarArticle({ post, className = "" }: SidebarArticleProps) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`article-sidebar ${className}`}
    >
      <div className="article-sidebar-image">
        <Image
          src={post.image || '/api/placeholder/200/200'}
          alt={post.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="article-sidebar-content">
        <h4 className="article-sidebar-title">
          <Link href={`/post/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </h4>
        
        <div className="article-sidebar-meta">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.readingTime} min</span>
        </div>
      </div>
    </motion.article>
  )
}

// Pullquote Component
export function Pullquote({ quote, author, size = 'large', className = "" }: PullquoteProps) {
  const baseClass = size === 'large' ? 'pullquote-large' : 'pullquote-sidebar'
  
  return (
    <motion.blockquote
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`${baseClass} ${className}`}
    >
      <Quote className="w-8 h-8 mb-4 text-primary/30" />
      {quote}
      {author && (
        <footer className="mt-4 text-sm font-medium text-muted-foreground">
          — {author}
        </footer>
      )}
    </motion.blockquote>
  )
}

// Main Magazine Layout Component
export function MagazineLayout({ 
  posts, 
  layout = 'standard', 
  animated = true, 
  className = "" 
}: MagazineLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const heroPost = posts.find(post => post.featured) || posts[0]
  const featuredPosts = posts.filter(post => !post.featured).slice(0, 6)
  const sidebarPosts = posts.slice(6, 10)

  const layoutClasses = {
    standard: 'magazine-container',
    masonry: 'layout-masonry',
    golden: 'layout-golden',
    'z-pattern': 'layout-z-pattern'
  }

  return (
    <div 
      ref={containerRef}
      className={`${layoutClasses[layout]} ${animated ? 'animated' : ''} ${className}`}
    >
      {/* Hero Section */}
      {heroPost && layout !== 'masonry' && (
        <HeroArticle post={heroPost} className="col-12" />
      )}

      {/* Section Divider */}
      <div className="section-divider-ornate">
        <div className="divider-ornament">
          ★
        </div>
      </div>

      {/* Featured Articles Grid */}
      <div className="col-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="heading-section mb-8 text-center font-serif"
        >
          Artigos em Destaque
        </motion.h2>
        
        <div className="magazine-container">
          {featuredPosts.slice(0, 3).map((post, index) => (
            <FeaturedArticle
              key={post.id}
              post={post}
              size={index === 0 ? 'large' : 'medium'}
            />
          ))}
        </div>
      </div>

      {/* Pullquote */}
      <Pullquote
        quote="A excelência operacional não é um acidente. É resultado de escolhas, esforço e execução superiores."
        author="Administrativa(mente)"
        className="col-8 col-start-3"
      />

      {/* Secondary Featured Articles */}
      <div className="col-12">
        <div className="magazine-container">
          {featuredPosts.slice(3, 6).map((post, index) => (
            <FeaturedArticle
              key={post.id}
              post={post}
              size="small"
            />
          ))}
        </div>
      </div>

      {/* Sidebar Articles */}
      {sidebarPosts.length > 0 && layout !== 'masonry' && (
        <aside className="col-4">
          <motion.h3
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="heading-subsection mb-6 font-serif"
          >
            Leituras Relacionadas
          </motion.h3>
          
          <div className="space-y-4">
            {sidebarPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.5 + (index * 0.1) }}
              >
                <SidebarArticle post={post} />
              </motion.div>
            ))}
          </div>
        </aside>
      )}
      
      {/* Another section divider */}
      <div className="section-divider col-12" />
    </div>
  )
}

// Layout Variants
export function GoldenRatioLayout({ posts, className = "" }: Omit<MagazineLayoutProps, 'layout'>) {
  return <MagazineLayout posts={posts} layout="golden" className={className} />
}

export function ZPatternLayout({ posts, className = "" }: Omit<MagazineLayoutProps, 'layout'>) {
  return <MagazineLayout posts={posts} layout="z-pattern" className={className} />
}

export function MasonryLayout({ posts, className = "" }: Omit<MagazineLayoutProps, 'layout'>) {
  return <MagazineLayout posts={posts} layout="masonry" className={className} />
}

// Hook for dynamic layout switching
export function useMagazineLayout() {
  const [currentLayout, setCurrentLayout] = useState<MagazineLayoutProps['layout']>('standard')
  
  const switchLayout = (layout: MagazineLayoutProps['layout']) => {
    setCurrentLayout(layout)
  }
  
  const cycleLayouts = () => {
    const layouts: MagazineLayoutProps['layout'][] = ['standard', 'golden', 'z-pattern', 'masonry']
    const currentIndex = layouts.indexOf(currentLayout)
    const nextIndex = (currentIndex + 1) % layouts.length
    setCurrentLayout(layouts[nextIndex])
  }
  
  return {
    currentLayout,
    switchLayout,
    cycleLayouts
  }
}
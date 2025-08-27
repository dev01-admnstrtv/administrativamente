'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, BookOpen, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FocusReader, useFocusReader } from '@/components/ui/FocusReader'
import { MicroButton } from '@/components/ui/MicroInteractions'
import { ReadingAnalytics, ReadingProgress } from '@/components/ai/ReadingAnalytics'
import { useActionTracking } from '@/components/ai/AIPersonalizationProvider'

interface PostContentProps {
  title: string
  content: string
  readingTime: number
  publishedAt: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  category: {
    name: string
    color: string
  }
  className?: string
}

export function PostContent({
  title,
  content,
  readingTime,
  publishedAt,
  author,
  category,
  className = ""
}: PostContentProps) {
  const { isOpen, openReader, closeReader } = useFocusReader()
  const { trackShare, trackBookmark } = useActionTracking()
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <article className={`max-w-4xl mx-auto px-4 py-8 ${className}`}>
        {/* Article Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          {/* Category */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span 
              className="inline-block px-4 py-2 rounded-full text-sm font-medium"
              style={{ 
                backgroundColor: category.color + '20', 
                color: category.color,
                border: `1px solid ${category.color}40`
              }}
            >
              {category.name}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="heading-hero mb-8 font-serif leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {title}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            className="flex items-center justify-center gap-6 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{readingTime} min de leitura</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>{formatDate(publishedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>Por {author.name}</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex items-center justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MicroButton
              variant="magnetic"
              onClick={openReader}
              className="flex items-center gap-2 px-6 py-3 glass-layer-2 rounded-xl hover:glass-layer-3"
            >
              <Eye className="w-4 h-4" />
              Modo de Leitura Focada
            </MicroButton>

            <MicroButton
              variant="ripple"
              onClick={() => trackShare('article', { title, category: category.name })}
              className="flex items-center gap-2 px-4 py-3 glass-layer-1 rounded-xl hover:glass-layer-2"
            >
              <Share2 className="w-4 h-4" />
              Compartilhar
            </MicroButton>
          </motion.div>
        </motion.header>

        {/* Article Content */}
        <motion.div
          className="typography-reading prose prose-lg max-w-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          {/* Convert content to paragraphs for better display */}
          {content.split('\n\n').map((paragraph, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + (index * 0.1), duration: 0.6 }}
              className="mb-6 text-justify leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Author Bio */}
        <motion.footer
          className="mt-16 pt-8 border-t border-border"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="author-card p-8 rounded-xl glass-layer-1">
            <div className="flex items-start gap-4">
              <div className="author-avatar w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xl font-semibold text-primary">
                  {author.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 font-serif">
                  {author.name}
                </h3>
                {author.bio && (
                  <p className="text-muted-foreground leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.footer>
      </article>

      {/* Reading Progress Indicator */}
      <ReadingProgress showPercentage={true} />

      {/* Reading Analytics */}
      <ReadingAnalytics
        articleSlug={title.toLowerCase().replace(/[^a-z0-9]/g, '-')}
        articleTitle={title}
        articleCategory={category.name}
        articleReadingTime={readingTime}
        onAnalyticsUpdate={setAnalyticsData}
        className="fixed bottom-4 right-4 z-40"
      />

      {/* Focus Reader */}
      <FocusReader
        isOpen={isOpen}
        onClose={closeReader}
        title={title}
        content={content}
      />
    </>
  )
}
'use client'

import * as React from 'react'
import { Share2, Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
  className?: string
  variant?: 'default' | 'floating' | 'compact'
}

export function ShareButtons({ 
  url, 
  title, 
  description, 
  className,
  variant = 'default'
}: ShareButtonsProps) {
  const [copied, setCopied] = React.useState(false)
  const [showShareMenu, setShowShareMenu] = React.useState(false)

  const shareData = React.useMemo(() => {
    const encodedUrl = encodeURIComponent(url)
    const encodedTitle = encodeURIComponent(title)
    const encodedDescription = encodeURIComponent(description)

    return {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&via=administrativa_mente`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`
    }
  }, [url, title, description])

  const handleShare = async (platform?: string) => {
    // Check if Web Share API is available
    if (!platform && navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        })
        return
      } catch (error) {
        console.log('Web Share API failed, falling back to manual sharing')
      }
    }

    if (platform && shareData[platform as keyof typeof shareData]) {
      window.open(
        shareData[platform as keyof typeof shareData],
        '_blank',
        'noopener,noreferrer,width=600,height=400'
      )
    } else {
      // Fallback: show sharing menu
      setShowShareMenu(true)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  if (variant === 'floating') {
    return (
      <div className={cn(
        'fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 transform flex-col gap-3 lg:flex',
        className
      )}>
        <div className="flex flex-col gap-2 rounded-lg bg-white/90 p-2 shadow-premium backdrop-blur-lg dark:bg-zinc-900/90">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleShare('twitter')}
            aria-label="Compartilhar no Twitter"
            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleShare('linkedin')}
            aria-label="Compartilhar no LinkedIn"
            className="hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950 dark:hover:text-blue-300"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => handleShare('facebook')}
            aria-label="Compartilhar no Facebook"
            className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={copyToClipboard}
            aria-label="Copiar link"
            className="hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleShare()}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </Button>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm font-medium text-muted-foreground">
        Compartilhar:
      </span>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('twitter')}
          className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 dark:hover:border-blue-800"
        >
          <Twitter className="h-4 w-4" />
          <span className="hidden sm:inline">Twitter</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('linkedin')}
          className="gap-2 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-300 dark:hover:border-blue-800"
        >
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">LinkedIn</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:text-blue-400 dark:hover:border-blue-800"
        >
          <Facebook className="h-4 w-4" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          className={cn(
            'gap-2 transition-colors',
            copied 
              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800' 
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
          )}
        >
          {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
          <span className="hidden sm:inline">
            {copied ? 'Copiado!' : 'Copiar'}
          </span>
        </Button>
      </div>
      
      {/* Mobile Web Share */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleShare()}
        className="gap-2 sm:hidden"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Type, Sun, Moon, Contrast, Minus, Plus, Eye, BookOpen } from 'lucide-react'

interface FocusReaderProps {
  content: string
  title?: string
  isOpen: boolean
  onClose: () => void
  className?: string
}

type ReadingMode = 'default' | 'sepia' | 'dark' | 'high-contrast'
type FontSize = 'small' | 'medium' | 'large'

interface ReadingPreferences {
  mode: ReadingMode
  fontSize: FontSize
  enableBionic: boolean
  enableFocus: boolean
  enableBreathing: boolean
}

const FONT_SIZE_MAP = {
  small: '1rem',
  medium: '1.125rem',
  large: '1.25rem'
}

export function FocusReader({ content, title, isOpen, onClose, className = "" }: FocusReaderProps) {
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    mode: 'default',
    fontSize: 'medium',
    enableBionic: false,
    enableFocus: true,
    enableBreathing: true,
  })
  
  const [readingProgress, setReadingProgress] = useState(0)
  const [estimatedTime, setEstimatedTime] = useState(0)
  const [currentParagraph, setCurrentParagraph] = useState(0)
  
  const contentRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calculate reading time and track progress
  useEffect(() => {
    if (content) {
      const wordCount = content.split(/\s+/).length
      const estimatedMinutes = Math.ceil(wordCount / 200) // 200 WPM average
      setEstimatedTime(estimatedMinutes)
    }
  }, [content])

  // Handle scroll progress
  const handleScroll = useCallback(() => {
    if (!contentRef.current) return
    
    const element = contentRef.current
    const totalHeight = element.scrollHeight - element.clientHeight
    const currentScroll = element.scrollTop
    const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0
    
    setReadingProgress(Math.min(100, Math.max(0, progress)))
  }, [])

  useEffect(() => {
    const element = contentRef.current
    if (element) {
      element.addEventListener('scroll', handleScroll)
      return () => element.removeEventListener('scroll', handleScroll)
    }
    return undefined
  }, [handleScroll])

  // Transform content with bionic reading
  const transformBionicContent = useCallback((text: string): string => {
    if (!preferences.enableBionic) return text
    
    return text.replace(/\b(\w+)\b/g, (word) => {
      if (word.length <= 2) return word
      
      const fixationPoint = Math.ceil(word.length * 0.5)
      const fixation = word.slice(0, fixationPoint)
      const saccade = word.slice(fixationPoint)
      
      return `<span class="bionic-word">
        <span class="bionic-fixation">${fixation}</span>
        <span class="bionic-saccade">${saccade}</span>
      </span>`
    })
  }, [preferences.enableBionic])

  // Process content into paragraphs
  const processedContent = React.useMemo(() => {
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    
    return paragraphs.map((paragraph, index) => {
      const processedText = transformBionicContent(paragraph)
      const isActive = preferences.enableFocus && index === currentParagraph
      
      return {
        id: index,
        text: processedText,
        isActive
      }
    })
  }, [content, transformBionicContent, preferences.enableFocus, currentParagraph])

  // Handle focus mode paragraph highlighting
  useEffect(() => {
    const interval = setInterval(() => {
      if (preferences.enableFocus && processedContent.length > 0) {
        setCurrentParagraph(prev => 
          prev < processedContent.length - 1 ? prev + 1 : 0
        )
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [preferences.enableFocus, processedContent.length])

  // Update CSS custom properties for font size
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--focus-font-size', FONT_SIZE_MAP[preferences.fontSize])
    }
  }, [preferences.fontSize])

  const updatePreferences = (updates: Partial<ReadingPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
  }

  const modeIcons = {
    default: <BookOpen className="w-4 h-4" />,
    sepia: <Sun className="w-4 h-4" />,
    dark: <Moon className="w-4 h-4" />,
    'high-contrast': <Contrast className="w-4 h-4" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="focus-reading-overlay active"
          onClick={onClose}
          aria-hidden={!isOpen}
          role="dialog"
          aria-labelledby="focus-reader-title"
        >
          <motion.div
            ref={containerRef}
            initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, rotateX: 10 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`
              focus-reading-container 
              ${preferences.mode} 
              ${preferences.enableBreathing ? 'focus-breathing' : ''}
              ${className}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="focus-close-button"
              aria-label="Fechar modo de leitura focada"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Progress Indicator */}
            <div className="focus-progress-container">
              <div className="focus-progress-bar">
                <motion.div
                  className="focus-progress-fill"
                  style={{ width: `${readingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="focus-time-estimate">
                {estimatedTime} min
              </span>
            </div>

            {/* Title */}
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                id="focus-reader-title"
                className="text-2xl font-bold mb-6 text-center"
              >
                {title}
              </motion.h1>
            )}

            {/* Content */}
            <motion.div
              ref={contentRef}
              className="focus-reading-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {processedContent.map((paragraph, index) => (
                <motion.div
                  key={paragraph.id}
                  className={`
                    paragraph-progress
                    ${paragraph.isActive ? 'reading' : ''}
                    ${index < currentParagraph ? 'read' : ''}
                    ${preferences.enableFocus ? 'focus-dynamic-spotlight' : ''}
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <p
                    dangerouslySetInnerHTML={{ __html: paragraph.text }}
                    className={paragraph.isActive && preferences.enableFocus ? 'font-semibold' : ''}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Controls */}
            <motion.div
              className="focus-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Font Size Controls */}
              <div className="focus-font-controls">
                <button
                  className={`focus-control-button ${preferences.fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => updatePreferences({ fontSize: 'small' })}
                  aria-label="Fonte pequena"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  className={`focus-control-button ${preferences.fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => updatePreferences({ fontSize: 'medium' })}
                  aria-label="Fonte média"
                >
                  <Type className="w-4 h-4" />
                </button>
                <button
                  className={`focus-control-button ${preferences.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => updatePreferences({ fontSize: 'large' })}
                  aria-label="Fonte grande"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Reading Mode Controls */}
              {Object.entries(modeIcons).map(([mode, icon]) => (
                <button
                  key={mode}
                  className={`focus-control-button ${preferences.mode === mode ? 'active' : ''}`}
                  onClick={() => updatePreferences({ mode: mode as ReadingMode })}
                  aria-label={`Modo ${mode}`}
                >
                  {icon}
                </button>
              ))}

              {/* Feature Toggles */}
              <button
                className={`focus-control-button ${preferences.enableBionic ? 'active' : ''}`}
                onClick={() => updatePreferences({ enableBionic: !preferences.enableBionic })}
                aria-label={`${preferences.enableBionic ? 'Desabilitar' : 'Habilitar'} leitura biônica`}
              >
                <Eye className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Screen Reader Support */}
            <div className="sr-only">
              <p>Progresso da leitura: {Math.round(readingProgress)}%</p>
              <p>Tempo estimado: {estimatedTime} minutos</p>
              <p>Modo atual: {preferences.mode}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for focus reader
export function useFocusReader() {
  const [isOpen, setIsOpen] = useState(false)
  
  const openReader = useCallback(() => setIsOpen(true), [])
  const closeReader = useCallback(() => setIsOpen(false), [])
  const toggleReader = useCallback(() => setIsOpen(prev => !prev), [])
  
  return {
    isOpen,
    openReader,
    closeReader,
    toggleReader
  }
}
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Target, 
  Brain,
  Eye,
  BarChart3,
  Calendar,
  Zap,
  Award,
  Activity,
  PieChart,
  LineChart
} from 'lucide-react'
import { useActionTracking, useUserInsights, useAIPersonalization } from './AIPersonalizationProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ReadingAnalyticsProps {
  articleSlug?: string
  articleTitle?: string
  articleCategory?: string
  articleReadingTime?: number
  onAnalyticsUpdate?: (analytics: any) => void
  className?: string
}

export function ReadingAnalytics({
  articleSlug,
  articleTitle,
  articleCategory,
  articleReadingTime = 0,
  onAnalyticsUpdate,
  className = ""
}: ReadingAnalyticsProps) {
  const [readingSession, setReadingSession] = useState({
    startTime: Date.now(),
    scrollProgress: 0,
    timeSpent: 0,
    engagement: 0,
    pauses: 0,
    focusTime: 0,
    isActive: true
  })

  const [isVisible, setIsVisible] = useState(true)
  const [showDetailed, setShowDetailed] = useState(false)
  
  const { trackRead, trackScroll } = useActionTracking()
  const { profile, analytics, confidence } = useUserInsights()

  // Track reading session
  useEffect(() => {
    if (!articleSlug) return

    let scrollTimer: NodeJS.Timeout
    let focusTimer: NodeJS.Timeout
    let sessionTimer: NodeJS.Timeout

    const startTime = Date.now()
    let lastScrollTime = Date.now()
    let pauseCount = 0
    let totalFocusTime = 0
    let isCurrentlyFocused = true

    // Update session timer
    sessionTimer = setInterval(() => {
      const now = Date.now()
      const timeSpent = now - startTime
      
      setReadingSession(prev => ({
        ...prev,
        timeSpent,
        engagement: calculateEngagement(timeSpent, prev.scrollProgress, pauseCount)
      }))
    }, 1000)

    // Handle scroll tracking
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )

      setReadingSession(prev => ({
        ...prev,
        scrollProgress: Math.max(prev.scrollProgress, scrollPercent)
      }))

      // Track scroll action
      trackScroll('article', {
        slug: articleSlug,
        progress: scrollPercent,
        category: articleCategory
      })

      // Detect reading pauses
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        const timeSinceLastScroll = Date.now() - lastScrollTime
        if (timeSinceLastScroll > 3000 && isCurrentlyFocused) {
          pauseCount++
          setReadingSession(prev => ({ ...prev, pauses: pauseCount }))
        }
      }, 3000)

      lastScrollTime = Date.now()
    }

    // Handle focus/blur for attention tracking
    const handleFocus = () => {
      isCurrentlyFocused = true
      focusTimer = setInterval(() => {
        totalFocusTime += 1000
        setReadingSession(prev => ({ ...prev, focusTime: totalFocusTime }))
      }, 1000)
    }

    const handleBlur = () => {
      isCurrentlyFocused = false
      if (focusTimer) clearInterval(focusTimer)
    }

    // Handle page unload
    const handleUnload = () => {
      const finalTime = Date.now() - startTime
      const finalProgress = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )

      // Track final reading session
      trackRead(articleSlug, {
        title: articleTitle,
        category: articleCategory,
        timeSpent: finalTime,
        scrollProgress: finalProgress,
        engagement: calculateEngagement(finalTime, finalProgress, pauseCount),
        pauses: pauseCount,
        focusTime: totalFocusTime,
        completed: finalProgress > 80
      }, finalTime)

      // Notify parent component
      if (onAnalyticsUpdate) {
        onAnalyticsUpdate({
          timeSpent: finalTime,
          scrollProgress: finalProgress,
          engagement: calculateEngagement(finalTime, finalProgress, pauseCount),
          completed: finalProgress > 80
        })
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('beforeunload', handleUnload)

    // Initialize focus tracking
    handleFocus()

    return () => {
      clearInterval(sessionTimer)
      clearTimeout(scrollTimer)
      clearInterval(focusTimer)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('beforeunload', handleUnload)
      
      // Final cleanup
      handleUnload()
    }
  }, [articleSlug, articleTitle, articleCategory, trackRead, trackScroll, onAnalyticsUpdate])

  const calculateEngagement = (timeSpent: number, scrollProgress: number, pauses: number) => {
    const timeScore = Math.min(timeSpent / (articleReadingTime * 60 * 1000), 1) * 40
    const scrollScore = scrollProgress * 0.4
    const pauseScore = Math.max(0, 20 - pauses * 2)
    return Math.round(timeScore + scrollScore + pauseScore)
  }

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-500'
    if (engagement >= 60) return 'text-blue-500'
    if (engagement >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getEngagementLevel = (engagement: number) => {
    if (engagement >= 80) return 'Excelente'
    if (engagement >= 60) return 'Bom'
    if (engagement >= 40) return 'Regular'
    return 'Baixo'
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!articleSlug || !isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`reading-analytics ${className}`}
    >
      {/* Main Analytics Panel */}
      <div className="analytics-widget">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-sm">Análise de Leitura</span>
            <div className="ai-thinking-indicator">
              <Brain className="w-3 h-3" />
              <span className="text-xs">IA</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetailed(!showDetailed)}
              className="text-xs"
            >
              {showDetailed ? 'Menos' : 'Mais'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-xs"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="analytics-metric">
            <Clock className="w-3 h-3 text-gray-500" />
            <div>
              <div className="metric-value text-sm">
                {formatTime(readingSession.timeSpent)}
              </div>
              <div className="metric-label text-xs">Tempo lendo</div>
            </div>
          </div>

          <div className="analytics-metric">
            <BarChart3 className="w-3 h-3 text-gray-500" />
            <div>
              <div className="metric-value text-sm">
                {readingSession.scrollProgress}%
              </div>
              <div className="metric-label text-xs">Progresso</div>
            </div>
          </div>

          <div className="analytics-metric">
            <Target className={`w-3 h-3 ${getEngagementColor(readingSession.engagement)}`} />
            <div>
              <div className={`metric-value text-sm ${getEngagementColor(readingSession.engagement)}`}>
                {getEngagementLevel(readingSession.engagement)}
              </div>
              <div className="metric-label text-xs">Engajamento</div>
            </div>
          </div>

          <div className="analytics-metric">
            <Eye className="w-3 h-3 text-gray-500" />
            <div>
              <div className="metric-value text-sm">
                {formatTime(readingSession.focusTime)}
              </div>
              <div className="metric-label text-xs">Foco ativo</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span>Progresso da leitura</span>
            <span>{readingSession.scrollProgress}%</span>
          </div>
          <div className="confidence-indicator">
            <motion.div
              className="confidence-fill"
              initial={{ width: 0 }}
              animate={{ width: `${readingSession.scrollProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Engagement Indicator */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs mb-2">
            <Brain className="w-3 h-3" />
            <span>Nível de engajamento: </span>
            <Badge 
              variant="secondary" 
              className={`text-xs ${getEngagementColor(readingSession.engagement)}`}
            >
              {readingSession.engagement}/100
            </Badge>
          </div>
        </div>

        {/* Detailed Analytics */}
        <AnimatePresence>
          {showDetailed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="detailed-analytics border-t border-gray-200 pt-4"
            >
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="analytics-metric">
                  <Calendar className="w-3 h-3 text-gray-500" />
                  <div>
                    <div className="metric-value text-sm">{readingSession.pauses}</div>
                    <div className="metric-label text-xs">Pausas</div>
                  </div>
                </div>

                <div className="analytics-metric">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <div>
                    <div className="metric-value text-sm">
                      {Math.round((readingSession.focusTime / readingSession.timeSpent) * 100) || 0}%
                    </div>
                    <div className="metric-label text-xs">Taxa de foco</div>
                  </div>
                </div>
              </div>

              {/* Reading Speed Analysis */}
              <div className="mb-4">
                <div className="text-xs font-medium mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Velocidade de leitura
                </div>
                <div className="text-xs text-gray-600">
                  {readingSession.scrollProgress > 10 ? (
                    <>
                      Aproximadamente{' '}
                      {Math.round(
                        (readingSession.scrollProgress / 100 * (articleReadingTime * 200)) /
                        (readingSession.timeSpent / 60000)
                      )}{' '}
                      palavras por minuto
                    </>
                  ) : (
                    'Calculando velocidade...'
                  )}
                </div>
              </div>

              {/* AI Insights */}
              {analytics && confidence > 0.5 && (
                <div className="smart-recommendation">
                  <div className="recommendation-header">
                    <div className="recommendation-title">
                      <Brain className="w-3 h-3 inline mr-1" />
                      Insight da IA
                    </div>
                  </div>
                  <div className="recommendation-reason text-xs">
                    {readingSession.engagement >= 80
                      ? 'Excelente engajamento! Este tipo de conteúdo parece ideal para você.'
                      : readingSession.pauses > 5
                      ? 'Muitas pausas detectadas. Considere conteúdo mais curto ou em formatos diferentes.'
                      : readingSession.scrollProgress < 30 && readingSession.timeSpent > 120000
                      ? 'Leitura lenta detectada. Talvez prefira conteúdo com mais elementos visuais.'
                      : 'Padrão de leitura normal. Continue explorando conteúdo similar.'}
                  </div>
                </div>
              )}

              {/* Reading Achievements */}
              {readingSession.scrollProgress >= 100 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="achievement-badge flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
                >
                  <Award className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-800">
                      Artigo completado!
                    </div>
                    <div className="text-xs text-green-600">
                      Você leu o artigo completo em {formatTime(readingSession.timeSpent)}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Reading Progress Component for articles
interface ReadingProgressProps {
  className?: string
  showPercentage?: boolean
}

export function ReadingProgress({ className = "", showPercentage = true }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = window.pageYOffset
      const scrollProgress = (currentProgress / totalHeight) * 100
      setProgress(Math.min(100, Math.max(0, scrollProgress)))
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <motion.div
      className={`reading-progress-container ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {showPercentage && progress > 5 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg border"
        >
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="w-3 h-3" />
            <span>{Math.round(progress)}%</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Reading Session Summary (for end of article)
interface ReadingSessionSummaryProps {
  sessionData: {
    timeSpent: number
    scrollProgress: number
    engagement: number
    completed: boolean
  }
  onShare?: () => void
  onBookmark?: () => void
  className?: string
}

export function ReadingSessionSummary({
  sessionData,
  onShare,
  onBookmark,
  className = ""
}: ReadingSessionSummaryProps) {
  const { preferences } = useAIPersonalization()

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className={`session-summary analytics-widget ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-green-500" />
        <span className="font-semibold">Sessão de leitura concluída!</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="metric-value">{formatTime(sessionData.timeSpent)}</div>
          <div className="metric-label">Tempo total</div>
        </div>
        
        <div className="text-center">
          <div className="metric-value">{sessionData.scrollProgress}%</div>
          <div className="metric-label">Lido</div>
        </div>
        
        <div className="text-center">
          <div className="metric-value text-green-500">{sessionData.engagement}/100</div>
          <div className="metric-label">Engajamento</div>
        </div>
      </div>

      {sessionData.completed && (
        <div className="smart-recommendation">
          <div className="recommendation-header">
            <div className="recommendation-title">Parabéns!</div>
          </div>
          <div className="recommendation-reason">
            Você completou a leitura com {sessionData.engagement}% de engajamento. 
            {preferences?.readingTime === 'short' && sessionData.timeSpent < 300000
              ? ' Perfeito para seu perfil de leitura rápida!'
              : sessionData.engagement > 80
              ? ' Excelente foco durante a leitura!'
              : ' Continue explorando conteúdo similar.'}
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        {onShare && (
          <Button size="sm" variant="outline" onClick={onShare}>
            Compartilhar leitura
          </Button>
        )}
        {onBookmark && (
          <Button size="sm" variant="outline" onClick={onBookmark}>
            Salvar artigo
          </Button>
        )}
      </div>
    </motion.div>
  )
}
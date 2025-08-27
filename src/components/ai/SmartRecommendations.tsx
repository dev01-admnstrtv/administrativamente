'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  Target, 
  Sparkles, 
  Eye, 
  ChevronRight,
  X,
  Settings,
  BarChart3
} from 'lucide-react'
import { useAIPersonalization, useRecommendations, useUserInsights } from './AIPersonalizationProvider'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatConfidence, getRecommendationPriority } from '@/lib/ai/personalization'

interface SmartRecommendationsProps {
  className?: string
  maxRecommendations?: number
  showConfidence?: boolean
  compact?: boolean
}

export function SmartRecommendations({
  className = "",
  maxRecommendations = 5,
  showConfidence = true,
  compact = false
}: SmartRecommendationsProps) {
  const { recommendations, isLoading, profile } = useAIPersonalization()
  const { confidence, hasData } = useUserInsights()
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [dismissedIds, setDismissedIds] = useState<string[]>([])

  const visibleRecommendations = recommendations
    .filter(rec => !dismissedIds.includes(rec.id))
    .slice(0, maxRecommendations)

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id])
  }

  if (isLoading || !hasData || visibleRecommendations.length === 0) {
    return null
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'content': return <Target className="w-4 h-4" />
      case 'feature': return <Sparkles className="w-4 h-4" />
      case 'layout': return <Eye className="w-4 h-4" />
      case 'timing': return <Clock className="w-4 h-4" />
      default: return <Brain className="w-4 h-4" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-500'
    if (confidence >= 0.6) return 'text-yellow-500'
    return 'text-orange-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`smart-recommendations-container ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="ai-thinking-indicator">
            <Brain className="w-4 h-4" />
            <span>IA Personalizada</span>
            <div className="ai-thinking-dots">
              <div className="ai-thinking-dot" />
              <div className="ai-thinking-dot" />
              <div className="ai-thinking-dot" />
            </div>
          </div>
          
          {showConfidence && (
            <div className="personalization-badge">
              <div className="personalization-icon" />
              <span>{Math.round(confidence * 100)}% confiança</span>
            </div>
          )}
        </div>

        {compact && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          </Button>
        )}
      </div>

      {/* Recommendations List */}
      <AnimatePresence mode="popLayout">
        {(!compact || isExpanded) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            {visibleRecommendations.map((recommendation, index) => (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="smart-recommendation"
              >
                <div className="recommendation-header">
                  <div className="flex items-center gap-2">
                    <div className={getConfidenceColor(recommendation.confidence)}>
                      {getRecommendationIcon(recommendation.type)}
                    </div>
                    <span className="recommendation-title">
                      {recommendation.type === 'content' && 'Conteúdo Recomendado'}
                      {recommendation.type === 'feature' && 'Recurso Sugerido'}
                      {recommendation.type === 'layout' && 'Layout Otimizado'}
                      {recommendation.type === 'timing' && 'Melhor Horário'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {showConfidence && (
                      <div className="confidence-indicator">
                        <div 
                          className={`confidence-fill ${formatConfidence(recommendation.confidence)}`}
                          style={{ width: `${recommendation.confidence * 100}%` }}
                        />
                      </div>
                    )}

                    <Badge 
                      variant="secondary"
                      className={`text-xs ${
                        getRecommendationPriority(recommendation) === 'high' ? 'bg-green-100 text-green-700' :
                        getRecommendationPriority(recommendation) === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getRecommendationPriority(recommendation)}
                    </Badge>

                    <button
                      onClick={() => handleDismiss(recommendation.id)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="recommendation-reason">
                  {recommendation.reason}
                </p>

                {/* Action Button */}
                {recommendation.type === 'content' && recommendation.data.topics && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex gap-1">
                      {recommendation.data.topics.slice(0, 3).map((topic: string) => (
                        <Badge key={topic} variant="outline" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                    <Link 
                      href={`/category/${recommendation.data.topics[0]?.toLowerCase()}`}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Explorar
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                {recommendation.type === 'feature' && (
                  <div className="mt-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Ativar {recommendation.data.feature?.replace('_', ' ')}
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Learning Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="learning-indicator mt-4"
      >
        <div className="learning-brain" />
        <span className="learning-text">Aprendendo suas preferências</span>
        <div className="learning-progress">
          <div 
            className="learning-progress-fill" 
            style={{ width: `${Math.min(confidence * 100, 100)}%` }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// Content Discovery Component
interface ContentDiscoveryProps {
  posts: any[]
  className?: string
}

export function ContentDiscovery({ posts, className = "" }: ContentDiscoveryProps) {
  const { engine, preferences } = useAIPersonalization()
  const [adaptedPosts, setAdaptedPosts] = useState(posts)
  const [isAdapting, setIsAdapting] = useState(false)

  useEffect(() => {
    if (engine && posts.length > 0) {
      setIsAdapting(true)
      
      // Simulate AI processing time
      setTimeout(() => {
        const adapted = engine.getAdaptiveContent(posts)
        setAdaptedPosts(adapted)
        setIsAdapting(false)
      }, 1000)
    }
  }, [engine, posts])

  const getDiscoveryReason = (post: any, index: number) => {
    if (!preferences) return ''
    
    if (index === 0) return 'Mais relevante para você'
    if (post.category && preferences.topics.includes(post.category)) return 'Baseado nos seus interesses'
    if (post.readingTime <= 5 && preferences.readingTime === 'short') return 'Leitura rápida'
    if (post.complexity === preferences.complexity) return 'Nível adequado para você'
    
    return 'Recomendação personalizada'
  }

  return (
    <div className={`content-discovery ${className}`}>
      {/* Neural Network Background */}
      <div className="neural-network-bg">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`node-${i}`}
            className="neural-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
        
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`connection-${i}`}
            className="neural-connection"
            style={{
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 60}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {isAdapting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="discovery-hint mb-6"
        >
          <div className="discovery-title">
            <Brain className="w-4 h-4 inline mr-2" />
            Adaptando conteúdo para você...
          </div>
          <div className="discovery-description">
            Nossa IA está analisando suas preferências para personalizar as recomendações
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        {adaptedPosts.slice(0, 6).map((post, index) => (
          <motion.div
            key={post.id || post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`adaptive-container ${
              index < 3 ? 'border-l-4 border-blue-500 pl-4' : ''
            }`}
            data-preference={preferences?.contentType}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm">{post.title}</h3>
              {index < 3 && (
                <div className="personalization-badge">
                  <Sparkles className="w-3 h-3" />
                  <span>IA</span>
                </div>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{post.readingTime} min</span>
                {post.category && (
                  <Badge variant="outline" className="text-xs">
                    {post.category}
                  </Badge>
                )}
              </div>
              
              {index < 3 && (
                <span className="text-xs text-blue-600 font-medium">
                  {getDiscoveryReason(post, index)}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Analytics Widget Component
export function AnalyticsWidget({ className = "" }: { className?: string }) {
  const { getAnalytics } = useAIPersonalization()
  const analytics = getAnalytics()

  if (!analytics) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`analytics-widget ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-blue-500" />
        <span className="font-semibold text-sm">Insights Personalizados</span>
      </div>

      <div className="space-y-3">
        <div className="analytics-metric">
          <span className="metric-label">Confiança do perfil</span>
          <span className="metric-value">
            {Math.round(analytics.profile.confidence * 100)}%
          </span>
          <div className="metric-trend trend-up">
            <TrendingUp className="w-3 h-3" />
            <span>+5%</span>
          </div>
        </div>

        <div className="analytics-metric">
          <span className="metric-label">Ações rastreadas</span>
          <span className="metric-value">{analytics.behavior.totalActions}</span>
        </div>

        <div className="analytics-metric">
          <span className="metric-label">Tempo médio leitura</span>
          <span className="metric-value">
            {Math.round(analytics.behavior.averageReadingTime / 60000)}min
          </span>
        </div>

        <div className="analytics-metric">
          <span className="metric-label">Recomendações ativas</span>
          <span className="metric-value">{analytics.recommendations.total}</span>
          <div className="metric-trend trend-stable">
            <span>estável</span>
          </div>
        </div>
      </div>

      {analytics.behavior.topTopics.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs font-medium mb-2">Tópicos preferidos:</div>
          <div className="flex flex-wrap gap-1">
            {analytics.behavior.topTopics.slice(0, 3).map(([topic, count]: [string, number]) => (
              <Badge key={topic} variant="secondary" className="text-xs">
                {topic} ({count})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  PersonalizationEngine, 
  getPersonalizationEngine, 
  UserPreferences, 
  PersonalizationProfile, 
  Recommendation 
} from '@/lib/ai/personalization'

interface AIPersonalizationContextType {
  engine: PersonalizationEngine | null
  profile: PersonalizationProfile | null
  preferences: UserPreferences | null
  recommendations: Recommendation[]
  isLoading: boolean
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  trackAction: PersonalizationEngine['trackAction']
  getAnalytics: () => any
  clearData: () => void
}

const AIPersonalizationContext = createContext<AIPersonalizationContextType | null>(null)

interface AIPersonalizationProviderProps {
  children: ReactNode
  enableTracking?: boolean
  debugMode?: boolean
}

export function AIPersonalizationProvider({ 
  children, 
  enableTracking = true,
  debugMode = false 
}: AIPersonalizationProviderProps) {
  const [engine, setEngine] = useState<PersonalizationEngine | null>(null)
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize personalization engine
    const initializeEngine = async () => {
      try {
        const personalizationEngine = getPersonalizationEngine()
        setEngine(personalizationEngine)

        // Wait a bit for initialization
        setTimeout(() => {
          const currentProfile = personalizationEngine.getProfile()
          const currentPreferences = personalizationEngine.getPreferences()
          const currentRecommendations = personalizationEngine.getRecommendations()

          setProfile(currentProfile)
          setPreferences(currentPreferences)
          setRecommendations(currentRecommendations)
          setIsLoading(false)

          if (debugMode) {
            console.log('AI Personalization initialized:', {
              profile: currentProfile,
              preferences: currentPreferences,
              recommendations: currentRecommendations
            })
          }
        }, 1000)
      } catch (error) {
        console.error('Failed to initialize AI Personalization:', error)
        setIsLoading(false)
      }
    }

    if (enableTracking) {
      initializeEngine()
    } else {
      setIsLoading(false)
    }
  }, [enableTracking, debugMode])

  // Update recommendations periodically
  useEffect(() => {
    if (!engine || !enableTracking) return

    const interval = setInterval(() => {
      const newRecommendations = engine.getRecommendations()
      setRecommendations(newRecommendations)

      if (debugMode) {
        console.log('Updated recommendations:', newRecommendations)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [engine, enableTracking, debugMode])

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    if (!engine) return

    engine.updatePreferences(newPreferences)
    const updatedProfile = engine.getProfile()
    const updatedPreferences = engine.getPreferences()
    const updatedRecommendations = engine.getRecommendations()

    setProfile(updatedProfile)
    setPreferences(updatedPreferences)
    setRecommendations(updatedRecommendations)

    if (debugMode) {
      console.log('Preferences updated:', {
        new: newPreferences,
        updated: updatedPreferences
      })
    }
  }

  const trackAction: PersonalizationEngine['trackAction'] = (action) => {
    if (!engine || !enableTracking) return

    engine.trackAction(action)

    if (debugMode) {
      console.log('Action tracked:', action)
    }

    // Update recommendations after significant actions
    if (['read', 'search', 'bookmark'].includes(action.type)) {
      setTimeout(() => {
        const newRecommendations = engine.getRecommendations()
        setRecommendations(newRecommendations)
      }, 1000)
    }
  }

  const getAnalytics = () => {
    if (!engine) return null
    return engine.getAnalytics()
  }

  const clearData = () => {
    if (!engine) return

    engine.clearData()
    setProfile(null)
    setPreferences(null)
    setRecommendations([])

    if (debugMode) {
      console.log('AI Personalization data cleared')
    }
  }

  const contextValue: AIPersonalizationContextType = {
    engine,
    profile,
    preferences,
    recommendations,
    isLoading,
    updatePreferences,
    trackAction,
    getAnalytics,
    clearData
  }

  return (
    <AIPersonalizationContext.Provider value={contextValue}>
      {children}
    </AIPersonalizationContext.Provider>
  )
}

// Hook to use AI Personalization
export function useAIPersonalization() {
  const context = useContext(AIPersonalizationContext)
  
  if (!context) {
    throw new Error('useAIPersonalization must be used within AIPersonalizationProvider')
  }
  
  return context
}

// Hook for tracking user actions easily
export function useActionTracking() {
  const { trackAction, isLoading } = useAIPersonalization()
  
  const trackRead = (target: string, data?: Record<string, any>, duration?: number) => {
    trackAction({ 
      type: 'read', 
      target, 
      ...(data !== undefined && { data }),
      ...(duration !== undefined && { duration })
    })
  }
  
  const trackClick = (target: string, data?: Record<string, any>) => {
    trackAction({ 
      type: 'click', 
      target,
      ...(data !== undefined && { data })
    })
  }
  
  const trackSearch = (target: string, data?: Record<string, any>) => {
    trackAction({ 
      type: 'search', 
      target,
      ...(data !== undefined && { data })
    })
  }
  
  const trackShare = (target: string, data?: Record<string, any>) => {
    trackAction({ 
      type: 'share', 
      target,
      ...(data !== undefined && { data })
    })
  }
  
  const trackBookmark = (target: string, data?: Record<string, any>) => {
    trackAction({ 
      type: 'bookmark', 
      target,
      ...(data !== undefined && { data })
    })
  }
  
  const trackHover = (target: string, data?: Record<string, any>, duration?: number) => {
    trackAction({ 
      type: 'hover', 
      target,
      ...(data !== undefined && { data }),
      ...(duration !== undefined && { duration })
    })
  }
  
  const trackScroll = (target: string, data?: Record<string, any>) => {
    trackAction({ 
      type: 'scroll', 
      target,
      ...(data !== undefined && { data })
    })
  }
  
  return {
    trackRead,
    trackClick,
    trackSearch,
    trackShare,
    trackBookmark,
    trackHover,
    trackScroll,
    isTracking: !isLoading
  }
}

// Hook for getting personalized recommendations
export function useRecommendations(type?: Recommendation['type']) {
  const { recommendations } = useAIPersonalization()
  
  if (type) {
    return recommendations.filter(rec => rec.type === type)
  }
  
  return recommendations
}

// Hook for adaptive content
export function useAdaptiveContent<T extends Record<string, any>>(contentList: T[]): T[] {
  const { engine } = useAIPersonalization()
  
  if (!engine || contentList.length === 0) {
    return contentList
  }
  
  return engine.getAdaptiveContent(contentList)
}

// Hook for getting user insights
export function useUserInsights() {
  const { profile, getAnalytics } = useAIPersonalization()
  
  const analytics = getAnalytics()
  
  return {
    profile,
    analytics,
    confidence: profile?.confidence || 0,
    hasData: Boolean(profile && analytics?.behavior.totalActions > 0),
    topTopics: analytics?.behavior.topTopics || [],
    preferredReadingTime: profile?.behavior.averageReadingTime || 0,
    activeHours: analytics?.behavior.activeHours || []
  }
}
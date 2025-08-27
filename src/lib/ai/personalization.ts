/* ========================================
   AI PERSONALIZATION ENGINE - PHASE 3
   ======================================== */

// Types
export interface UserBehavior {
  sessionId: string
  userId?: string
  timestamp: number
  actions: UserAction[]
  preferences: UserPreferences
  context: UserContext
}

export interface UserAction {
  type: 'read' | 'scroll' | 'click' | 'hover' | 'search' | 'share' | 'bookmark'
  target: string
  data?: Record<string, any>
  timestamp: number
  duration?: number
}

export interface UserPreferences {
  readingSpeed: 'slow' | 'medium' | 'fast'
  contentType: 'visual' | 'textual' | 'mixed'
  complexity: 'beginner' | 'intermediate' | 'advanced'
  topics: string[]
  readingTime: 'short' | 'medium' | 'long'
  interactionStyle: 'passive' | 'active' | 'exploratory'
}

export interface UserContext {
  deviceType: 'mobile' | 'tablet' | 'desktop'
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  location?: string
  language: string
  timezone: string
  screenSize: { width: number; height: number }
  connectionSpeed: 'slow' | 'fast'
}

export interface PersonalizationProfile {
  id: string
  userId?: string
  preferences: UserPreferences
  behavior: {
    averageReadingTime: number
    preferredContentLength: number
    engagementPatterns: Record<string, number>
    topicAffinity: Record<string, number>
    timePatterns: Record<string, number>
  }
  confidence: number
  lastUpdated: number
  version: number
}

export interface Recommendation {
  id: string
  type: 'content' | 'feature' | 'layout' | 'timing'
  confidence: number
  reason: string
  data: Record<string, any>
  priority: number
  expiresAt: number
}

// Local Storage Keys
const STORAGE_KEYS = {
  BEHAVIOR: 'ai_user_behavior',
  PROFILE: 'ai_personalization_profile',
  RECOMMENDATIONS: 'ai_recommendations',
  SESSION: 'ai_session_data'
} as const

// Personalization Engine Class
export class PersonalizationEngine {
  private profile: PersonalizationProfile | null = null
  private behavior: UserBehavior | null = null
  private recommendations: Recommendation[] = []
  private isInitialized = false

  constructor() {
    this.initialize()
  }

  // Initialize the personalization engine
  private async initialize(): Promise<void> {
    try {
      // Load existing data from localStorage
      this.loadFromStorage()
      
      // Create new profile if none exists
      if (!this.profile) {
        this.profile = this.createDefaultProfile()
      }

      // Initialize behavior tracking
      if (!this.behavior) {
        this.behavior = this.createInitialBehavior()
      }

      // Start behavior tracking
      this.startBehaviorTracking()
      
      this.isInitialized = true
      
      // Generate initial recommendations
      await this.generateRecommendations()
      
    } catch (error) {
      console.error('Failed to initialize PersonalizationEngine:', error)
    }
  }

  // Create default profile for new users
  private createDefaultProfile(): PersonalizationProfile {
    const defaultPreferences: UserPreferences = {
      readingSpeed: 'medium',
      contentType: 'mixed',
      complexity: 'intermediate',
      topics: [],
      readingTime: 'medium',
      interactionStyle: 'active'
    }

    return {
      id: `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      preferences: defaultPreferences,
      behavior: {
        averageReadingTime: 300000, // 5 minutes in ms
        preferredContentLength: 800, // words
        engagementPatterns: {},
        topicAffinity: {},
        timePatterns: {}
      },
      confidence: 0.3, // Low confidence for new users
      lastUpdated: Date.now(),
      version: 1
    }
  }

  // Create initial behavior tracking object
  private createInitialBehavior(): UserBehavior {
    return {
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      actions: [],
      preferences: this.profile?.preferences || this.createDefaultProfile().preferences,
      context: this.getContextData()
    }
  }

  // Get current context data
  private getContextData(): UserContext {
    const now = new Date()
    const hour = now.getHours()
    
    let timeOfDay: UserContext['timeOfDay']
    if (hour >= 5 && hour < 12) timeOfDay = 'morning'
    else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon'
    else if (hour >= 17 && hour < 21) timeOfDay = 'evening'
    else timeOfDay = 'night'

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent)
    
    let deviceType: UserContext['deviceType']
    if (isMobile) deviceType = 'mobile'
    else if (isTablet) deviceType = 'tablet'
    else deviceType = 'desktop'

    return {
      deviceType,
      timeOfDay,
      language: navigator.language || 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      connectionSpeed: (navigator as any).connection?.effectiveType === '4g' ? 'fast' : 'slow'
    }
  }

  // Track user action
  trackAction(action: Omit<UserAction, 'timestamp'>): void {
    if (!this.isInitialized || !this.behavior) return

    const fullAction: UserAction = {
      ...action,
      timestamp: Date.now()
    }

    this.behavior.actions.push(fullAction)

    // Update profile based on action
    this.updateProfileFromAction(fullAction)

    // Save to storage
    this.saveToStorage()

    // Regenerate recommendations if significant action
    if (['read', 'search', 'bookmark'].includes(action.type)) {
      this.generateRecommendations()
    }
  }

  // Update profile based on user action
  private updateProfileFromAction(action: UserAction): void {
    if (!this.profile) return

    const { behavior } = this.profile

    // Update engagement patterns
    const actionKey = `${action.type}_${action.target}`
    behavior.engagementPatterns[actionKey] = (behavior.engagementPatterns[actionKey] || 0) + 1

    // Update topic affinity for content-related actions
    if (action.type === 'read' && action.data?.category) {
      const category = action.data.category
      behavior.topicAffinity[category] = (behavior.topicAffinity[category] || 0) + 1
    }

    // Update time patterns
    const hour = new Date().getHours()
    const timeKey = `hour_${hour}`
    behavior.timePatterns[timeKey] = (behavior.timePatterns[timeKey] || 0) + 1

    // Update reading time if available
    if (action.type === 'read' && action.duration) {
      behavior.averageReadingTime = (behavior.averageReadingTime + action.duration) / 2
    }

    // Increase confidence as we gather more data
    if (this.behavior && this.behavior.actions.length > 10) {
      this.profile.confidence = Math.min(0.9, this.profile.confidence + 0.01)
    }

    this.profile.lastUpdated = Date.now()
  }

  // Generate AI-powered recommendations
  async generateRecommendations(): Promise<void> {
    if (!this.profile || !this.behavior) return

    try {
      const newRecommendations: Recommendation[] = []

      // Content recommendations based on topic affinity
      const topTopics = Object.entries(this.profile.behavior.topicAffinity)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([topic]) => topic)

      if (topTopics.length > 0) {
        newRecommendations.push({
          id: `content_${Date.now()}`,
          type: 'content',
          confidence: 0.8,
          reason: `Based on your interest in ${topTopics.join(', ')}`,
          data: { topics: topTopics },
          priority: 1,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        })
      }

      // Reading time recommendations
      const avgReadingTime = this.profile.behavior.averageReadingTime
      if (avgReadingTime < 120000) { // Less than 2 minutes
        newRecommendations.push({
          id: `reading_time_${Date.now()}`,
          type: 'feature',
          confidence: 0.7,
          reason: 'Quick reads recommended based on your reading patterns',
          data: { feature: 'quick_reads', maxReadingTime: 2 },
          priority: 2,
          expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
        })
      }

      // Layout recommendations based on device and behavior
      if (this.behavior.context.deviceType === 'mobile') {
        const mobileEngagement = Object.entries(this.profile.behavior.engagementPatterns)
          .filter(([key]) => key.includes('mobile'))
          .reduce((sum, [, value]) => sum + value, 0)

        if (mobileEngagement > 10) {
          newRecommendations.push({
            id: `layout_mobile_${Date.now()}`,
            type: 'layout',
            confidence: 0.6,
            reason: 'Optimized mobile layout for better reading experience',
            data: { layout: 'mobile_optimized' },
            priority: 3,
            expiresAt: Date.now() + (12 * 60 * 60 * 1000) // 12 hours
          })
        }
      }

      // Time-based recommendations
      const currentHour = new Date().getHours()
      const currentTimePattern = this.profile.behavior.timePatterns[`hour_${currentHour}`] || 0

      if (currentTimePattern > 3) {
        newRecommendations.push({
          id: `timing_${Date.now()}`,
          type: 'timing',
          confidence: 0.5,
          reason: `You're most active at this time of day`,
          data: { optimalTime: currentHour },
          priority: 4,
          expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hours
        })
      }

      // Filter out expired recommendations and add new ones
      this.recommendations = this.recommendations
        .filter(rec => rec.expiresAt > Date.now())
        .concat(newRecommendations)
        .sort((a, b) => b.priority - a.priority || b.confidence - a.confidence)
        .slice(0, 10) // Keep only top 10

      this.saveToStorage()

    } catch (error) {
      console.error('Failed to generate recommendations:', error)
    }
  }

  // Get current recommendations
  getRecommendations(type?: Recommendation['type']): Recommendation[] {
    let recs = this.recommendations.filter(rec => rec.expiresAt > Date.now())

    if (type) {
      recs = recs.filter(rec => rec.type === type)
    }

    return recs.sort((a, b) => b.confidence - a.confidence)
  }

  // Get user profile
  getProfile(): PersonalizationProfile | null {
    return this.profile
  }

  // Get user preferences
  getPreferences(): UserPreferences | null {
    return this.profile?.preferences || null
  }

  // Update user preferences
  updatePreferences(preferences: Partial<UserPreferences>): void {
    if (!this.profile) return

    this.profile.preferences = {
      ...this.profile.preferences,
      ...preferences
    }

    this.profile.lastUpdated = Date.now()
    this.saveToStorage()
    this.generateRecommendations()
  }

  // Get adaptive content suggestions
  getAdaptiveContent(contentList: any[]): any[] {
    if (!this.profile || contentList.length === 0) return contentList

    const { topicAffinity } = this.profile.behavior
    const { preferences } = this.profile

    // Score content based on user preferences and behavior
    const scoredContent = contentList.map(content => {
      let score = 0

      // Topic affinity scoring
      if (content.category && topicAffinity[content.category]) {
        score += (topicAffinity[content.category] || 0) * 0.4
      }

      // Reading time preference
      if (content.readingTime) {
        const idealTime = preferences.readingTime === 'short' ? 5 : 
                          preferences.readingTime === 'medium' ? 10 : 15
        const timeDiff = Math.abs(content.readingTime - idealTime)
        score += (10 - timeDiff) * 0.2
      }

      // Content type preference
      if (content.type === preferences.contentType || preferences.contentType === 'mixed') {
        score += 0.3
      }

      // Complexity matching
      if (content.complexity === preferences.complexity) {
        score += 0.1
      }

      return { ...content, aiScore: score }
    })

    // Sort by AI score and return
    return scoredContent
      .sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
      .map(({ aiScore, ...content }) => content)
  }

  // Start behavior tracking
  private startBehaviorTracking(): void {
    // Track scroll behavior
    let scrollTimer: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        this.trackAction({
          type: 'scroll',
          target: 'page',
          data: {
            scrollY: window.scrollY,
            scrollPercent: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
          }
        })
      }, 500)
    })

    // Track click behavior
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement
      const elementInfo = {
        tag: target.tagName.toLowerCase(),
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 50)
      }

      this.trackAction({
        type: 'click',
        target: elementInfo.tag,
        data: elementInfo
      })
    })

    // Track reading time on articles
    let readStartTime: number | null = null
    let isReading = false

    const startReading = () => {
      if (!isReading) {
        readStartTime = Date.now()
        isReading = true
      }
    }

    const stopReading = () => {
      if (isReading && readStartTime) {
        const duration = Date.now() - readStartTime
        if (duration > 10000) { // Only track if read for more than 10 seconds
          this.trackAction({
            type: 'read',
            target: 'article',
            duration,
            data: {
              url: window.location.pathname,
              title: document.title
            }
          })
        }
        isReading = false
        readStartTime = null
      }
    }

    // Detect when user is actively reading
    document.addEventListener('mousemove', startReading)
    document.addEventListener('keydown', startReading)
    window.addEventListener('blur', stopReading)
    window.addEventListener('beforeunload', stopReading)

    // Save behavior data periodically
    setInterval(() => {
      this.saveToStorage()
    }, 30000) // Every 30 seconds
  }

  // Load data from localStorage
  private loadFromStorage(): void {
    try {
      const profileData = localStorage.getItem(STORAGE_KEYS.PROFILE)
      if (profileData) {
        this.profile = JSON.parse(profileData)
      }

      const behaviorData = localStorage.getItem(STORAGE_KEYS.BEHAVIOR)
      if (behaviorData) {
        this.behavior = JSON.parse(behaviorData)
      }

      const recommendationsData = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS)
      if (recommendationsData) {
        this.recommendations = JSON.parse(recommendationsData)
      }
    } catch (error) {
      console.error('Failed to load from storage:', error)
    }
  }

  // Save data to localStorage
  private saveToStorage(): void {
    try {
      if (this.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(this.profile))
      }

      if (this.behavior) {
        localStorage.setItem(STORAGE_KEYS.BEHAVIOR, JSON.stringify(this.behavior))
      }

      if (this.recommendations.length > 0) {
        localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(this.recommendations))
      }
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }

  // Clear all personalization data
  clearData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
    
    this.profile = null
    this.behavior = null
    this.recommendations = []
    this.isInitialized = false
  }

  // Get analytics data
  getAnalytics() {
    if (!this.profile || !this.behavior) return null

    const totalActions = this.behavior.actions.length
    const actionTypes = this.behavior.actions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      profile: {
        confidence: this.profile.confidence,
        preferences: this.profile.preferences,
        lastUpdated: this.profile.lastUpdated
      },
      behavior: {
        totalActions,
        actionTypes,
        averageReadingTime: this.profile.behavior.averageReadingTime,
        topTopics: Object.entries(this.profile.behavior.topicAffinity)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5),
        activeHours: Object.entries(this.profile.behavior.timePatterns)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
      },
      recommendations: {
        total: this.recommendations.length,
        byType: this.recommendations.reduce((acc, rec) => {
          acc[rec.type] = (acc[rec.type] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        averageConfidence: this.recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / this.recommendations.length || 0
      }
    }
  }
}

// Singleton instance
let personalizationEngine: PersonalizationEngine | null = null

// Get personalization engine instance
export function getPersonalizationEngine(): PersonalizationEngine {
  if (!personalizationEngine) {
    personalizationEngine = new PersonalizationEngine()
  }
  return personalizationEngine
}

// Utility functions
export function formatConfidence(confidence: number): string {
  if (confidence >= 0.8) return 'high'
  if (confidence >= 0.6) return 'medium'
  return 'low'
}

export function getRecommendationPriority(recommendation: Recommendation): 'high' | 'medium' | 'low' {
  if (recommendation.confidence >= 0.8 && recommendation.priority <= 2) return 'high'
  if (recommendation.confidence >= 0.6 && recommendation.priority <= 3) return 'medium'
  return 'low'
}
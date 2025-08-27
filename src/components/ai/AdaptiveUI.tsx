'use client'

import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAIPersonalization, useUserInsights } from './AIPersonalizationProvider'
import { 
  Settings, 
  Palette, 
  Type, 
  Layout, 
  Zap,
  Brain,
  Eye,
  Clock,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { MicroCard } from '@/components/ui/MicroInteractions'
import { GlassCard } from '@/components/ui/GlassContainer'
import { Badge } from '@/components/ui/Badge'

interface AdaptiveUIProps {
  children: React.ReactNode
  className?: string
}

interface UIAdaptations {
  fontSize: number
  spacing: number
  contrast: number
  colorScheme: 'warm' | 'cool' | 'neutral'
  layout: 'compact' | 'comfortable' | 'spacious'
  animations: boolean
  focusMode: boolean
}

export function AdaptiveUI({ children, className = "" }: AdaptiveUIProps) {
  const { preferences, profile } = useAIPersonalization()
  const { confidence } = useUserInsights()
  
  const [adaptations, setAdaptations] = useState<UIAdaptations>({
    fontSize: 16,
    spacing: 16,
    contrast: 1,
    colorScheme: 'neutral',
    layout: 'comfortable',
    animations: true,
    focusMode: false
  })

  const [isAdapting, setIsAdapting] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Apply AI-based adaptations
  useEffect(() => {
    if (!preferences || !profile || confidence < 0.3) return

    setIsAdapting(true)

    const newAdaptations = calculateAdaptations()
    
    // Animate the adaptation process
    setTimeout(() => {
      setAdaptations(newAdaptations)
      setIsAdapting(false)
    }, 1000)

  }, [preferences, profile, confidence])

  const calculateAdaptations = (): UIAdaptations => {
    if (!preferences || !profile) return adaptations

    const baseAdaptations = { ...adaptations }

    // Font size adaptation based on reading preferences
    if (preferences.readingSpeed === 'slow') {
      baseAdaptations.fontSize = 18
      baseAdaptations.spacing = 20
    } else if (preferences.readingSpeed === 'fast') {
      baseAdaptations.fontSize = 14
      baseAdaptations.spacing = 14
    }

    // Complexity-based adaptations
    if (preferences.complexity === 'beginner') {
      baseAdaptations.fontSize += 2
      baseAdaptations.spacing += 4
      baseAdaptations.layout = 'spacious'
      baseAdaptations.animations = false
    } else if (preferences.complexity === 'advanced') {
      baseAdaptations.layout = 'compact'
      baseAdaptations.fontSize -= 1
    }

    // Content type adaptations
    if (preferences.contentType === 'visual') {
      baseAdaptations.spacing += 6
      baseAdaptations.layout = 'spacious'
    } else if (preferences.contentType === 'textual') {
      baseAdaptations.contrast += 0.1
      baseAdaptations.fontSize += 1
    }

    // Time-based adaptations
    const hour = new Date().getHours()
    if (hour >= 6 && hour < 12) {
      baseAdaptations.colorScheme = 'warm'
    } else if (hour >= 18 || hour < 6) {
      baseAdaptations.colorScheme = 'cool'
      baseAdaptations.contrast += 0.1
    }

    // Device-based adaptations
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      baseAdaptations.fontSize += 2
      baseAdaptations.spacing += 4
      baseAdaptations.layout = 'comfortable'
    }

    // Behavior-based adaptations
    if (profile.behavior.averageReadingTime < 120000) { // Less than 2 minutes
      baseAdaptations.focusMode = true
      baseAdaptations.animations = false
    }

    return baseAdaptations
  }

  // Apply CSS custom properties
  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    
    // Apply adaptations as CSS custom properties
    container.style.setProperty('--adaptive-font-size', `${adaptations.fontSize}px`)
    container.style.setProperty('--adaptive-spacing', `${adaptations.spacing}px`)
    container.style.setProperty('--adaptive-contrast', adaptations.contrast.toString())
    
    // Apply color scheme
    const colorSchemeClass = `adaptive-${adaptations.colorScheme}`
    container.className = container.className.replace(/adaptive-(warm|cool|neutral)/g, '')
    container.classList.add(colorSchemeClass)

    // Apply layout
    const layoutClass = `adaptive-layout-${adaptations.layout}`
    container.className = container.className.replace(/adaptive-layout-(compact|comfortable|spacious)/g, '')
    container.classList.add(layoutClass)

    // Apply focus mode
    if (adaptations.focusMode) {
      container.classList.add('adaptive-focus-mode')
    } else {
      container.classList.remove('adaptive-focus-mode')
    }

    // Apply animations preference
    if (!adaptations.animations) {
      container.classList.add('adaptive-no-animations')
    } else {
      container.classList.remove('adaptive-no-animations')
    }

  }, [adaptations])

  return (
    <div
      ref={containerRef}
      className={`adaptive-ui-container ${className}`}
      data-adaptive="true"
    >
      {/* Adaptation Indicator */}
      <AnimatePresence>
        {isAdapting && (
          <AdaptationIndicator />
        )}
      </AnimatePresence>

      {/* Adaptive Content */}
      {children}

      {/* AI Insights Overlay */}
      {confidence > 0.7 && (
        <AIInsightsOverlay adaptations={adaptations} />
      )}
    </div>
  )
}

// Adaptation Indicator Component
function AdaptationIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="ai-thinking-indicator">
        <Brain className="w-4 h-4" />
        <span>Adaptando interface...</span>
        <div className="ai-thinking-dots">
          <div className="ai-thinking-dot" />
          <div className="ai-thinking-dot" />
          <div className="ai-thinking-dot" />
        </div>
      </div>
    </motion.div>
  )
}

// AI Insights Overlay Component
interface AIInsightsOverlayProps {
  adaptations: UIAdaptations
}

function AIInsightsOverlay({ adaptations }: AIInsightsOverlayProps) {
  const [showInsights, setShowInsights] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <motion.button
        className="ai-insights-trigger"
        onClick={() => setShowInsights(!showInsights)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="personalization-badge">
          <div className="personalization-icon" />
          <span>IA</span>
        </div>
      </motion.button>

      <AnimatePresence>
        {showInsights && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-12 right-0 w-80 smart-recommendation"
          >
            <div className="recommendation-header">
              <div className="recommendation-title">
                <Brain className="w-4 h-4 inline mr-2" />
                Adaptações Aplicadas
              </div>
            </div>

            <div className="space-y-3 mt-3">
              <AdaptationItem
                icon={<Type className="w-3 h-3" />}
                label="Tamanho da fonte"
                value={`${adaptations.fontSize}px`}
                reason="Baseado na sua velocidade de leitura"
              />
              
              <AdaptationItem
                icon={<Layout className="w-3 h-3" />}
                label="Espaçamento"
                value={adaptations.layout}
                reason="Otimizado para seu nível de experiência"
              />
              
              <AdaptationItem
                icon={<Palette className="w-3 h-3" />}
                label="Esquema de cores"
                value={adaptations.colorScheme}
                reason="Ajustado para o horário do dia"
              />
              
              {adaptations.focusMode && (
                <AdaptationItem
                  icon={<Eye className="w-3 h-3" />}
                  label="Modo foco"
                  value="Ativo"
                  reason="Baseado no seu padrão de leitura rápida"
                />
              )}
            </div>

            <button
              onClick={() => setShowInsights(false)}
              className="mt-4 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              Fechar insights
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Adaptation Item Component
interface AdaptationItemProps {
  icon: React.ReactNode
  label: string
  value: string
  reason: string
}

function AdaptationItem({ icon, label, value, reason }: AdaptationItemProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="text-blue-500 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-blue-600 font-semibold">{value}</span>
        </div>
        <div className="text-xs text-gray-600 mt-0.5">{reason}</div>
      </div>
    </div>
  )
}

// Contextual UI Adapter - adapts based on current page context
interface ContextualAdapterProps {
  pageType: 'home' | 'article' | 'category' | 'search'
  children: React.ReactNode
}

export function ContextualAdapter({ pageType, children }: ContextualAdapterProps) {
  const { preferences, trackAction } = useAIPersonalization()
  const [contextualStyles, setContextualStyles] = useState<React.CSSProperties>({})

  useEffect(() => {
    if (!preferences) return

    const styles: React.CSSProperties = {}

    // Page-specific adaptations
    switch (pageType) {
      case 'home':
        if (preferences.interactionStyle === 'exploratory') {
          styles.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))'
          styles.gap = '2rem'
        }
        break

      case 'article':
        if (preferences.readingSpeed === 'slow') {
          styles.maxWidth = '65ch'
          styles.lineHeight = '1.8'
          styles.fontSize = '1.125rem'
        } else if (preferences.readingSpeed === 'fast') {
          styles.maxWidth = '75ch'
          styles.lineHeight = '1.6'
          styles.fontSize = '0.95rem'
        }
        break

      case 'category':
        if (preferences.contentType === 'visual') {
          styles.display = 'grid'
          styles.gridTemplateColumns = 'repeat(auto-fill, minmax(250px, 1fr))'
        }
        break

      case 'search':
        if (preferences.interactionStyle === 'active') {
          styles.animation = 'fade-in 0.3s ease-out'
        }
        break
    }

    setContextualStyles(styles)

    // Track page adaptation
    trackAction({
      type: 'hover',
      target: `page_${pageType}`,
      data: {
        adaptedStyles: Object.keys(styles),
        preferences: preferences
      }
    })

  }, [pageType, preferences, trackAction])

  return (
    <div 
      className={`contextual-adapter page-${pageType}`}
      style={contextualStyles}
      data-page-type={pageType}
    >
      {children}
    </div>
  )
}

// Smart Content Organizer - reorganizes content based on user behavior
interface SmartContentOrganizerProps {
  items: any[]
  className?: string
}

export function SmartContentOrganizer({ 
  items, 
  className = "" 
}: SmartContentOrganizerProps) {
  const { engine } = useAIPersonalization()
  const [organizedItems, setOrganizedItems] = useState(items)
  const [organizationReason, setOrganizationReason] = useState<string>('')

  useEffect(() => {
    if (!engine || items.length === 0) {
      setOrganizedItems(items)
      return
    }

    // Use AI engine to organize content
    const adaptedItems = engine.getAdaptiveContent(items)
    setOrganizedItems(adaptedItems)

    // Determine organization reason
    const profile = engine.getProfile()
    if (profile) {
      const topTopic = Object.entries(profile.behavior.topicAffinity)[0]
      if (topTopic) {
        setOrganizationReason(`Organizado com base no seu interesse em ${topTopic[0]}`)
      } else {
        setOrganizationReason('Organizado com base nas suas preferências de leitura')
      }
    }
  }, [engine, items])

  return (
    <div className={`smart-content-organizer ${className}`}>
      {organizationReason && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="discovery-hint mb-4"
        >
          <div className="discovery-title">
            <Brain className="w-3 h-3 inline mr-1" />
            Conteúdo personalizado
          </div>
          <div className="discovery-description">{organizationReason}</div>
        </motion.div>
      )}

      <div className="grid gap-4">
        {organizedItems.map((item, index) => (
          <motion.div
            key={item.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={index < 3 ? 'priority-item' : 'regular-item'}
          >
            <MicroCard effect="tilt" intensity="subtle">
              <GlassCard className="group h-full overflow-hidden">
                {/* Image */}
                <div className="micro-image-zoom relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <Badge 
                      variant="secondary" 
                      className="micro-badge-glow text-xs"
                      style={{ 
                        backgroundColor: `${item.category?.color}15`,
                        color: item.category?.color || '#3b82f6',
                        borderColor: `${item.category?.color}30`
                      }}
                    >
                      {item.category?.name}
                    </Badge>
                    <span className="text-xs text-zinc-500">
                      {item.readingTime} min
                    </span>
                  </div>
                  
                  <h3 className="mb-3 line-clamp-2 text-lg font-bold transition-colors group-hover:text-blue-600">
                    <Link href={`/post/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h3>
                  
                  <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {item.excerpt}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    {item.author?.avatar && (
                      <Image
                        src={item.author.avatar}
                        alt={item.author.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        {item.author?.name}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </MicroCard>
            
            {index < 3 && (
              <div className="absolute top-2 right-2">
                <div className="personalization-badge">
                  <Zap className="w-3 h-3" />
                  <span>IA</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Device-Aware Component - adapts to different devices
export function DeviceAwareComponent({ children }: { children: React.ReactNode }) {
  const [deviceInfo, setDeviceInfo] = useState({
    type: 'desktop' as 'mobile' | 'tablet' | 'desktop',
    orientation: 'landscape' as 'portrait' | 'landscape',
    screenSize: { width: 1920, height: 1080 },
    touchCapable: false
  })

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      const type = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
      const orientation = width > height ? 'landscape' : 'portrait'
      const touchCapable = 'ontouchstart' in window

      setDeviceInfo({
        type,
        orientation,
        screenSize: { width, height },
        touchCapable
      })
    }

    updateDeviceInfo()
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)

    return () => {
      window.removeEventListener('resize', updateDeviceInfo)
      window.removeEventListener('orientationchange', updateDeviceInfo)
    }
  }, [])

  const getDeviceIcon = () => {
    switch (deviceInfo.type) {
      case 'mobile': return <Smartphone className="w-3 h-3" />
      case 'tablet': return <Tablet className="w-3 h-3" />
      default: return <Monitor className="w-3 h-3" />
    }
  }

  return (
    <div 
      className={`device-aware ${deviceInfo.type} ${deviceInfo.orientation} ${
        deviceInfo.touchCapable ? 'touch-enabled' : 'mouse-enabled'
      }`}
      data-device-type={deviceInfo.type}
      data-orientation={deviceInfo.orientation}
    >
      {/* Device Indicator (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 left-2 z-50 bg-black/20 text-white text-xs px-2 py-1 rounded">
          {getDeviceIcon()}
          {deviceInfo.type} • {deviceInfo.orientation}
        </div>
      )}
      
      {children}
    </div>
  )
}
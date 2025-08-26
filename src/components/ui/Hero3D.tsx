'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'

interface Hero3DProps {
  title?: string
  subtitle?: string
  backgroundImage?: string
  children?: React.ReactNode
  enableParallax?: boolean
  className?: string
}

interface MousePosition {
  x: number
  y: number
}

export function Hero3D({
  title = "Transforme sua gestão em vantagem competitiva",
  subtitle = "Insights estratégicos, metodologias comprovadas e ferramentas práticas para líderes que buscam excelência operacional.",
  backgroundImage,
  children,
  enableParallax = true,
  className = "",
}: Hero3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  
  const { scrollY } = useScroll()
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150])
  const parallaxRotate = useTransform(scrollY, [0, 500], [0, 5])

  // Mouse tracking for 3D effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const x = (e.clientX - centerX) / rect.width
      const y = (e.clientY - centerY) / rect.height
      
      setMousePosition({ x: x * 10, y: y * 10 })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`hero-3d-container ${className}`}
      style={{
        '--mouse-rotate-x': `${-mousePosition.y}deg`,
        '--mouse-rotate-y': `${mousePosition.x}deg`,
        '--mouse-translate-z': `${Math.abs(mousePosition.x) + Math.abs(mousePosition.y)}px`,
      } as React.CSSProperties}
    >
      {/* 3D Scene Container */}
      <motion.div 
        className="hero-3d-scene"
        style={enableParallax ? { 
          rotateX: parallaxRotate, 
          y: parallaxY 
        } : {}}
      >
        {/* Background Layers */}
        <div className="hero-bg-layer hero-bg-layer-1" />
        <div className="hero-bg-layer hero-bg-layer-2" />
        <div className="hero-bg-layer hero-bg-layer-3" />
        
        {/* Background Image */}
        {backgroundImage && (
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: 'translateZ(-100px) scale(1.2)',
            }}
          />
        )}
        
        {/* Floating 3D Elements */}
        <FloatingElement3D 
          icon={<Sparkles className="w-8 h-8" />}
          className="floating-3d-element floating-3d-element-1"
          delay={0}
        />
        <FloatingElement3D 
          icon={<TrendingUp className="w-6 h-6" />}
          className="floating-3d-element floating-3d-element-2"
          delay={2}
        />
        <FloatingElement3D 
          icon={<Zap className="w-7 h-7" />}
          className="floating-3d-element floating-3d-element-3"
          delay={4}
        />
      </motion.div>

      {/* Hero Content */}
      <div className="hero-content-3d relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, z: -200, rotateX: -20 }}
            animate={isLoaded ? { opacity: 1, z: 100, rotateX: 0 } : {}}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-title-3d"
          >
            <h1 className="heading-hero mb-8 font-serif leading-tight tracking-tight">
              {title}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, z: -100, rotateX: -10 }}
            animate={isLoaded ? { opacity: 1, z: 50, rotateX: 0 } : {}}
            transition={{ duration: 1.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-subtitle-3d"
          >
            <p className="text-xl leading-relaxed text-muted-foreground lg:text-2xl max-w-3xl mx-auto mb-12">
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, z: -50, scale: 0.8 }}
            animate={isLoaded ? { opacity: 1, z: 100, scale: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-cta-3d"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface FloatingElement3DProps {
  icon: React.ReactNode
  className: string
  delay: number
}

function FloatingElement3D({ icon, className, delay }: FloatingElement3DProps) {
  return (
    <motion.div
      className={`${className} glass-layer-2 p-4 rounded-2xl`}
      initial={{ opacity: 0, scale: 0, rotateX: -90 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ 
        duration: 1, 
        delay: delay / 2,
        ease: [0.25, 0.46, 0.45, 0.94] 
      }}
      whileHover={{ 
        scale: 1.1, 
        rotateX: 10, 
        rotateY: 10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="text-primary">
        {icon}
      </div>
    </motion.div>
  )
}

// Hook for parallax effects
export function useParallax3D() {
  const { scrollY } = useScroll()
  
  return {
    background: useTransform(scrollY, [0, 1000], [0, -200]),
    midground: useTransform(scrollY, [0, 1000], [0, -100]),
    foreground: useTransform(scrollY, [0, 1000], [0, -50]),
  }
}
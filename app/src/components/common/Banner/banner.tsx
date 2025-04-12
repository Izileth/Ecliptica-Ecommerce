import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "~/src/lib/utils"

export type BannerTextPosition = "left" | "center" | "right"
export type BannerTextColor = "light" | "dark"
export type BannerSize = "small" | "medium" | "large"
export type BannerSeason = "spring" | "summer" | "autumn" | "winter" | string

interface GlobalBannerProps {
  // Identificação
  title?: string
  subtitle?: string
  description?: string
  
  // Conteúdo
  imageUrl?: string
  videoUrl?: string
  overlayColor?: string
  overlayOpacity?: number
  gradientDirection?: "horizontal" | "vertical" | "radial"
  
  // Estilo
  textPosition?: BannerTextPosition
  textColor?: BannerTextColor
  size?: BannerSize
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "full"
  
  // Metadados
  season?: BannerSeason
  year?: number
  tags?: string[]
  
  // Comportamento
  parallaxIntensity?: number
  autoRotate?: boolean
  rotationInterval?: number
  
  // Children
  className?: string
  children?: React.ReactNode
  cta?: React.ReactNode
}

export function GlobalBanner({
  // Identificação
  title,
  subtitle,
  description,
  
  // Conteúdo
  imageUrl,
  videoUrl,
  overlayColor = "#000",
  overlayOpacity = 0.3,
  gradientDirection = "horizontal",
  
  // Estilo
  textPosition = "left",
  textColor = "light",
  size = "medium",
  rounded = "lg",
  
  // Metadados
  season,
  year = new Date().getFullYear(),
  tags = [],
  
  // Comportamento
  parallaxIntensity = 0,
  autoRotate = false,
  rotationInterval = 5000,
  
  // Children
  className = "",
  children,
  cta,
}: GlobalBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  
  // Configurações de tamanho
  const sizeClasses = {
    small: "h-[240px] md:h-[320px]",
    medium: "h-[320px] md:h-[420px]",
    large: "h-[420px] md:h-[560px]",
  }
  
  // Configurações de borda arredondada
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  }
  
  // Alinhamento de texto
  const textAlignments = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  }
  
  // Cores de texto
  const textColors = {
    light: "text-white",
    dark: "text-gray-900",
  }
  
  // Direção do gradiente
  const gradientDirections = {
    horizontal: {
      left: `linear-gradient(90deg, ${overlayColor} 0%, transparent 100%)`,
      center: `linear-gradient(90deg, ${overlayColor} 0%, transparent 50%, ${overlayColor} 100%)`,
      right: `linear-gradient(270deg, ${overlayColor} 0%, transparent 100%)`,
    },
    vertical: {
      left: `linear-gradient(180deg, ${overlayColor} 0%, transparent 100%)`,
      center: `linear-gradient(180deg, ${overlayColor} 0%, transparent 50%, ${overlayColor} 100%)`,
      right: `linear-gradient(0deg, ${overlayColor} 0%, transparent 100%)`,
    },
    radial: {
      left: `radial-gradient(circle at left, ${overlayColor} 0%, transparent 100%)`,
      center: `radial-gradient(circle, ${overlayColor} 0%, transparent 70%)`,
      right: `radial-gradient(circle at right, ${overlayColor} 0%, transparent 100%)`,
    },
  }
  
  // Efeitos de carregamento
  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.src = imageUrl
      img.onload = () => setIsLoaded(true)
    } else {
      setIsLoaded(true)
    }
    
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [imageUrl])
  
  // Rotação automática de mídia (se aplicável)
  useEffect(() => {
    if (!autoRotate || !Array.isArray(imageUrl)) return
    
    const interval = setInterval(() => {
      setCurrentMediaIndex(prev => (prev + 1) % imageUrl.length)
    }, rotationInterval)
    
    return () => clearInterval(interval)
  }, [autoRotate, rotationInterval, imageUrl])
  
  // Determinar a mídia atual
  const currentMedia = Array.isArray(imageUrl) ? imageUrl[currentMediaIndex] : imageUrl
  
  return (
    <div className={cn("w-full px-4 sm:px-6 md:px-8", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "relative w-full overflow-hidden",
          sizeClasses[size],
          roundedClasses[rounded]
        )}
      >
        {/* Mídia de fundo */}
        {videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: isLoaded ? 1 : 1.1, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: currentMedia ? `url(${currentMedia})` : "none",
              backgroundColor: !currentMedia ? "#f5f5f5" : "transparent",
            }}
          />
        )}
        
        {/* Overlay gradiente */}
        <div
          className="absolute inset-0"
          style={{
            background: gradientDirections[gradientDirection][textPosition],
            opacity: overlayOpacity,
          }}
        />
        
        {/* Conteúdo */}
        <div
          className={cn(
            "relative h-full flex flex-col justify-center p-6 sm:p-8 md:p-12",
            textAlignments[textPosition],
            textColors[textColor]
          )}
        >
          {/* Tags e metadados */}
          {(subtitle || season || tags.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-3 mb-4"
            >
              {textPosition !== "right" && (
                <div className="h-px w-8 bg-current opacity-60" />
              )}
              
              <div className="flex flex-wrap items-center gap-3">
                {subtitle && (
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {subtitle}
                  </span>
                )}
                
                {season && (
                  <span className="text-xs font-light opacity-80">
                    {season} {year}
                  </span>
                )}
                
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-white/10 backdrop-blur-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              {textPosition !== "left" && (
                <div className="h-px w-8 bg-current opacity-60" />
              )}
            </motion.div>
          )}
          
          {/* Título */}
          {title && (
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className={cn(
                "font-light leading-tight tracking-tight my-3",
                size === "small" ? "text-2xl md:text-3xl" :
                size === "medium" ? "text-3xl md:text-4xl" :
                "text-4xl md:text-5xl"
              )}
            >
              {title}
            </motion.h1>
          )}
          
          {/* Descrição */}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className={cn(
                "font-light max-w-md md:max-w-xl opacity-90",
                size === "small" ? "text-sm md:text-base" :
                size === "medium" ? "text-base md:text-lg" :
                "text-lg md:text-xl"
              )}
            >
              {description}
            </motion.p>
          )}
          
          {/* CTA ou conteúdo adicional */}
          {(cta || children) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="mt-6 flex flex-wrap gap-4"
            >
              {cta}
              {children}
            </motion.div>
          )}
        </div>
        
        {/* Indicadores de rotação (para banners com múltiplas imagens) */}
        {autoRotate && Array.isArray(imageUrl) && imageUrl.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {imageUrl.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentMediaIndex 
                    ? "bg-white w-4" 
                    : "bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
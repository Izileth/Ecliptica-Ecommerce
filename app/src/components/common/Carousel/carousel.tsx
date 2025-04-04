import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Types for carousel items
type CarouselItem = {
  id: string | number
  imageUrl: string
  altText?: string
  title?: string
  subtitle?: string
  buttonText?: string
  navigateTo: string
  state?: Record<string, unknown>
  overlayOpacity?: number
}

// Types for component props
interface LuxuryCarouselProps {
  items: CarouselItem[]
  autoplay?: boolean
  autoplaySpeed?: number
  showArrows?: boolean
  showDots?: boolean
  showProgress?: boolean
  height?: string
  className?: string
  contentPosition?: "left" | "center" | "right"
  variant?: "default" | "minimal" | "overlay"
}

const Carousel: React.FC<LuxuryCarouselProps> = ({
  items,
  autoplay = true,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = true,
  showProgress = false,
  height = "h-[70vh]",
  className = "",
  contentPosition = "left",
  variant = "default",
}) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const totalItems = items.length

  // Position classes based on contentPosition prop
  const positionClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  }

  // Variant classes
  const variantClasses = {
    default: "bg-black/30",
    minimal: "bg-transparent",
    overlay: "bg-gradient-to-t from-black/70 via-black/40 to-transparent",
  }

  // Handle navigation
  const goToSlide = (index: number) => {
    let newIndex = index
    if (newIndex < 0) newIndex = totalItems - 1
    if (newIndex >= totalItems) newIndex = 0
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => goToSlide(currentIndex + 1)
  const prevSlide = () => goToSlide(currentIndex - 1)

  // Setup autoplay
  useEffect(() => {
    if (autoplay && !isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        nextSlide()
      }, autoplaySpeed)
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplay, isPaused, currentIndex, autoplaySpeed])

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  return (
    <div
      className={`relative overflow-hidden ${height} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            {/* Image */}
            <img
              src={items[currentIndex].imageUrl || "/placeholder.svg"}
              alt={items[currentIndex].altText || `Slide ${currentIndex + 1}`}
              className="h-full w-full object-cover object-center"
              loading={currentIndex === 0 ? "eager" : "lazy"}
            />

            {/* Content Overlay */}
            <div
              className={`absolute inset-0 ${variantClasses[variant]}`}
              style={{
                opacity: items[currentIndex].overlayOpacity !== undefined ? items[currentIndex].overlayOpacity : 1,
              }}
            ></div>

            {/* Content */}
            {(items[currentIndex].title || items[currentIndex].subtitle || items[currentIndex].buttonText) && (
              <div
                className={`absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24 ${positionClasses[contentPosition]}`}
              >
                <div className="max-w-xl">
                  {items[currentIndex].title && (
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-white mb-4"
                    >
                      {items[currentIndex].title}
                    </motion.h2>
                  )}

                  {items[currentIndex].subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.4 }}
                      className="text-sm md:text-base font-light text-white/90 mb-8 max-w-md"
                    >
                      {items[currentIndex].subtitle}
                    </motion.p>
                  )}

                  {items[currentIndex].buttonText && (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.6 }}
                      onClick={() => navigate(items[currentIndex].navigateTo, { state: items[currentIndex].state })}
                      className="px-8 py-3 bg-white text-black font-light tracking-wide text-sm hover:bg-white/90 transition-colors duration-300"
                    >
                      {items[currentIndex].buttonText}
                    </motion.button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {showArrows && totalItems > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {showDots && totalItems > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white w-6" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {showProgress && totalItems > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{
              width: isPaused ? `${(currentIndex / (totalItems - 1)) * 100}%` : "100%",
            }}
            transition={{
              duration: isPaused ? 0.3 : autoplaySpeed / 1000,
              ease: "linear",
            }}
            key={currentIndex}
          />
        </div>
      )}
    </div>
  )
}
export default Carousel;
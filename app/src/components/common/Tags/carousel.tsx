
import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { cn } from "~/src/lib/utils"

type EnhancedTagCarouselProps = {
  tags: string[]
  itemsPerView?: number
  autoplay?: boolean
  autoplayInterval?: number
  showArrows?: boolean
  showDots?: boolean
  showAutoplayControls?: boolean
  infiniteLoop?: boolean
  className?: string
}

const EnhancedTagCarousel: React.FC<EnhancedTagCarouselProps> = ({
  tags,
  itemsPerView = 3,
  autoplay = true,
  autoplayInterval = 5000,
  showArrows = true,
  showDots = true,
  showAutoplayControls = true,
  infiniteLoop = true,
  className,
}) => {
  // Não permitir menos de 1 item por visualização
  const actualItemsPerView = Math.max(1, itemsPerView)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [visibleItemCount, setVisibleItemCount] = useState(actualItemsPerView)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const isAnimatingRef = useRef(false)

  // Preparar os chunks de tags para cada slide
  const chunkedTags = useMemo(() => {
    const result = []
    for (let i = 0; i < tags.length; i += visibleItemCount) {
      result.push(tags.slice(i, i + visibleItemCount))
    }
    return result
  }, [tags, visibleItemCount])

  // Total de slides reais (sem clones)
  const totalRealSlides = chunkedTags.length

  // Update visible item count based on screen size
  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItemCount(1)
      } else if (window.innerWidth < 768) {
        setVisibleItemCount(Math.min(2, actualItemsPerView))
      } else {
        setVisibleItemCount(actualItemsPerView)
      }
    }

    // Initial update
    updateVisibleItems()

    // Update on resize with debounce
    const debouncedResizeHandler = debounce(updateVisibleItems, 250)
    window.addEventListener("resize", debouncedResizeHandler)
    return () => window.removeEventListener("resize", debouncedResizeHandler)
  }, [actualItemsPerView])

  // Debounce function
  function debounce(fn: Function, ms = 300) {
    let timeoutId: ReturnType<typeof setTimeout>
    return function(this: any, ...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
  }

  // Reset autoplay timer
  const resetAutoplayTimer = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current)
    }

    if (isPlaying && totalRealSlides > 1) {
      autoplayTimerRef.current = setTimeout(() => {
        goToNext()
      }, autoplayInterval)
    }
  }, [isPlaying, autoplayInterval, totalRealSlides])

  // Navegar para o próximo slide suavemente
  const goToNext = useCallback(() => {
    if (isAnimatingRef.current || totalRealSlides <= 1) return

    const nextIndex = (currentIndex + 1) % totalRealSlides
    setCurrentIndex(nextIndex)
    resetAutoplayTimer()
  }, [currentIndex, totalRealSlides, resetAutoplayTimer])

  // Navegar para o slide anterior suavemente
  const goToPrevious = useCallback(() => {
    if (isAnimatingRef.current || totalRealSlides <= 1) return

    const prevIndex = currentIndex === 0 ? totalRealSlides - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    resetAutoplayTimer()
  }, [currentIndex, totalRealSlides, resetAutoplayTimer])

  // Ir para um slide específico
  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimatingRef.current) return

      isAnimatingRef.current = true
      setIsTransitioning(true)

      // Garantir que o índice esteja dentro do intervalo válido
      let targetIndex = index
      if (index < 0) {
        targetIndex = totalRealSlides - 1
      } else if (index >= totalRealSlides) {
        targetIndex = 0
      }

      setCurrentIndex(targetIndex)
      resetAutoplayTimer()

      // Permitir nova animação após a transição
      setTimeout(() => {
        isAnimatingRef.current = false
        setIsTransitioning(false)
      }, 500)
    },
    [totalRealSlides, resetAutoplayTimer]
  )

  const toggleAutoplay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Handle touch events for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 50

    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrevious()
    }
  }

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [goToNext, goToPrevious])

  // Setup and cleanup autoplay timer
  useEffect(() => {
    resetAutoplayTimer()

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current)
      }
    }
  }, [isPlaying, currentIndex, resetAutoplayTimer])

  // Pause autoplay when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (autoplayTimerRef.current) {
          clearTimeout(autoplayTimerRef.current)
        }
      } else {
        resetAutoplayTimer()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [resetAutoplayTimer])

  // Não renderizar se não houver tags
  if (!tags.length) return null

  // Se houver apenas um slide, desative o autoplay
  if (totalRealSlides <= 1 && isPlaying) {
    setIsPlaying(false)
  }

  return (
    <div
      className={cn("relative w-full overflow-hidden rounded-lg", className)}
      aria-roledescription="carousel"
      aria-label="Tag carousel"
      ref={carouselRef}
    >
      {/* Container do carrossel */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {chunkedTags.map((pageItems, pageIndex) => (
          <div
            key={pageIndex}
            className="w-full flex-shrink-0 flex items-center justify-center py-6 px-4 sm:px-8 min-h-24"
            aria-hidden={currentIndex !== pageIndex}
          >
            <div className="flex flex-wrap items-center justify-center w-full gap-3 sm:gap-4">
              {pageItems.map((tag, index) => (
                <span
                  key={`${pageIndex}-${index}`}
                  className="whitespace-nowrap px-4 py-2 bg-gray-100 text-sm font-medium rounded-full hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer select-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Botões de navegação */}
      {showArrows && totalRealSlides > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 z-10",
              !infiniteLoop && currentIndex === 0 && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Previous tags"
            disabled={isTransitioning || (!infiniteLoop && currentIndex === 0)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 z-10",
              !infiniteLoop && currentIndex === totalRealSlides - 1 && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Next tags"
            disabled={isTransitioning || (!infiniteLoop && currentIndex === totalRealSlides - 1)}
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Indicadores */}
      {showDots && totalRealSlides > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {chunkedTags.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-gray-300",
                currentIndex === index ? "bg-gray-800 w-4" : "bg-gray-400 hover:bg-gray-600",
              )}
              aria-label={`Go to tag group ${index + 1}`}
              aria-current={currentIndex === index}
            />
          ))}
        </div>
      )}

      {/* Controles de reprodução automática */}
      {showAutoplayControls && totalRealSlides > 1 && (
        <button
          onClick={toggleAutoplay}
          className="absolute bottom-2 right-2 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-full shadow-sm text-gray-700 hover:bg-white hover:text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 z-10"
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      )}
    </div>
  )
}

export default EnhancedTagCarousel
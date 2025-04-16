import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/src/components/imported/avatar"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "~/src/lib/utils"
import { useMediaQuery } from "~/src/hooks/useMobile"

interface Testimonial {
    id: string | number
    name: string
    role?: string
    content: string
    avatar?: string
    rating?: number
}

    interface TestimonialCarouselProps {
    testimonials: Testimonial[]
    autoPlay?: boolean
    interval?: number
    showControls?: boolean
    showIndicators?: boolean
    className?: string
}

export default function TestimonialCarousel({
    testimonials,
    autoPlay = true,
    interval = 5000,
    showControls = true,
    showIndicators = true,
    className = "",
    }: TestimonialCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)
    const carouselRef = useRef<HTMLDivElement>(null)
    const isMobile = useMediaQuery("(max-width: 640px)")

    // Handle auto-play
    useEffect(() => {
        if (!autoPlay || testimonials.length <= 1) return

        const timer = setInterval(() => {
        goToNext()
        }, interval)

        return () => clearInterval(timer)
    }, [testimonials.length, autoPlay, interval, currentIndex])

    // Navigation functions
    const goToPrev = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
        setTimeout(() => setIsTransitioning(false), 400)
    }

    const goToNext = () => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setTimeout(() => setIsTransitioning(false), 400)
    }

    const goToIndex = (index: number) => {
        if (isTransitioning || index === currentIndex) return
        setIsTransitioning(true)
        setCurrentIndex(index)
        setTimeout(() => setIsTransitioning(false), 400)
    }

    // Touch handlers for swipe functionality
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > 50
        const isRightSwipe = distance < -50

        if (isLeftSwipe) {
        goToNext()
        }
        if (isRightSwipe) {
        goToPrev()
        }

        setTouchStart(null)
        setTouchEnd(null)
    }

    if (testimonials.length === 0) return null

    const currentTestimonial = testimonials[currentIndex]

    const getInitials = (name: string) => {
        return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    }

    return (
        <div
        className={cn("relative w-full overflow-hidden", className)}
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        >
        <div
            className={cn(
            "mx-auto max-w-3xl px-4 py-8 transition-all duration-400 ease-in-out sm:px-6 sm:py-12",
            isTransitioning ? "opacity-0 transform translate-y-2" : "opacity-100 transform translate-y-0",
            )}
        >
            {/* Testimonial content */}
            <blockquote className="mb-6 text-center">
            <p className="text-lg font-light leading-relaxed text-neutral-700 sm:text-xl md:text-2xl">
                {currentTestimonial.content}
            </p>
            </blockquote>

            {/* Author information */}
            <div className="flex flex-col items-center justify-center space-y-3">
            {currentTestimonial.avatar && (
                <Avatar className="h-16 w-16 border border-neutral-100 shadow-sm">
                <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                <AvatarFallback className="bg-neutral-50 text-neutral-500">
                    {getInitials(currentTestimonial.name)}
                </AvatarFallback>
                </Avatar>
            )}
            <div className="text-center">
                <p className="text-base font-medium text-neutral-900 sm:text-lg">{currentTestimonial.name}</p>
                {currentTestimonial.role && <p className="text-sm text-neutral-500">{currentTestimonial.role}</p>}
                {currentTestimonial.rating && (
                <div className="mt-2 flex justify-center">
                    {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={16}
                        className={cn("fill-current", {
                        "text-amber-400": i < currentTestimonial.rating!,
                        "text-neutral-200": i >= currentTestimonial.rating!,
                        })}
                    />
                    ))}
                </div>
                )}
            </div>
            </div>
        </div>

        {/* Navigation controls */}
        {showControls && testimonials.length > 1 && (
            <div className="absolute top-1/2 flex w-full -translate-y-1/2 justify-between px-2 sm:px-4">
            <button
                onClick={goToPrev}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                aria-label="Previous testimonial"
                disabled={isTransitioning}
            >
                <ChevronLeft size={20} />
            </button>
            <button
                onClick={goToNext}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                aria-label="Next testimonial"
                disabled={isTransitioning}
            >
                <ChevronRight size={20} />
            </button>
            </div>
        )}

        {/* Indicator dots */}
        {showIndicators && testimonials.length > 1 && (
            <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
                <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                    "h-1 rounded-full transition-all duration-300 focus:outline-none",
                    index === currentIndex ? "w-8 bg-neutral-800" : "w-2 bg-neutral-300 hover:bg-neutral-400",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
                disabled={isTransitioning}
                />
            ))}
            </div>
        )}
        </div>
    )
}

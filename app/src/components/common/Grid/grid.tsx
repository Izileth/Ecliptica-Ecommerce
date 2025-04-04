

import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

// Types for API
export interface ApiCategory {
  id: string
  nome: string
  imagem: string
  slug: string
  descricao?: string
  novo?: boolean
  quantidade_produtos?: number
}

// Types for component
export interface Category {
  id: string
  name: string
  imageUrl: string
  slug: string
  description?: string
  isNew?: boolean
  productCount?: number
}

interface CategoriesGridProps {
  apiUrl?: string
  categories?: Category[]
  columns?: number
  variant?: "default" | "compact" | "featured"
  title?: string
  subtitle?: string
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
  apiUrl,
  categories: initialCategories,
  columns = 4,
  variant = "default",
  title,
  subtitle,
}) => {
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 768 })
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 })
  const [categories, setCategories] = useState<Category[]>(initialCategories || [])
  const [loading, setLoading] = useState(!initialCategories)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Carousel settings
  const slidesToShow = isMobile ? 1.2 : isTablet ? 2.2 : 3
  const totalSlides = categories.length
  const maxSlideIndex = Math.max(0, Math.ceil(totalSlides / slidesToShow) - 1)

  // Fetch data from API
  useEffect(() => {
    if (apiUrl && !initialCategories) {
      const fetchCategories = async () => {
        try {
          setLoading(true)
          const response = await fetch(apiUrl)

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
          }

          const data: ApiCategory[] = await response.json()

          // Transform API data to component format
          const formattedData = data.map((cat) => ({
            id: cat.id,
            name: cat.nome,
            imageUrl: cat.imagem,
            slug: cat.slug,
            description: cat.descricao,
            isNew: cat.novo,
            productCount: cat.quantidade_produtos,
          }))

          setCategories(formattedData)
        } catch (err) {
          setError(err instanceof Error ? err.message : "Unknown error")
          console.error("Error fetching categories:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchCategories()
    }
  }, [apiUrl, initialCategories])

  // Grid columns configuration
  const gridColumns = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  }

  // Navigation for carousel
  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlideIndex))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0))
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-8 py-8">
        {title && (
          <div className="text-center mb-10">
            <div className="h-6 w-40 bg-gray-100 mx-auto mb-3"></div>
            {subtitle && <div className="h-4 w-64 bg-gray-50 mx-auto"></div>}
          </div>
        )}
        <div className={`grid ${gridColumns[columns as keyof typeof gridColumns]} gap-6`}>
          {[...Array(isMobile ? 2 : columns * 2)].map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-gray-500 font-light mb-4">Não foi possível carregar as categorias.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 border border-gray-200 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Carousel view (for mobile and tablet)
  if (isMobile || isTablet) {
    return (
      <div className="py-12">
        {(title || subtitle) && (
          <div className="text-center mb-10 px-6">
            {title && <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-2">{title}</h2>}
            {subtitle && <p className="text-sm font-light text-gray-500 max-w-md mx-auto">{subtitle}</p>}
          </div>
        )}

        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{ x: `calc(-${(currentSlide * 100) / slidesToShow}%)` }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.5 }}
            >
              {categories.map((category) => (
                <div key={category.id} className="flex-none px-3" style={{ width: `${100 / slidesToShow}%` }}>
                  <CategoryItem category={category} variant={variant} navigate={navigate} />
                </div>
              ))}
            </motion.div>
          </div>

          {totalSlides > slidesToShow && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide >= maxSlideIndex}
                className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Grid view (for desktop)
  return (
    <div className="py-12">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-3">{title}</h2>}
          {subtitle && <p className="text-sm font-light text-gray-500 max-w-md mx-auto">{subtitle}</p>}
        </div>
      )}

      <div className={`grid ${gridColumns[columns as keyof typeof gridColumns]} gap-6 md:gap-8`}>
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} variant={variant} navigate={navigate} />
        ))}
      </div>
    </div>
  )
}

// Category item component
const CategoryItem: React.FC<{
  category: Category
  variant: "default" | "compact" | "featured"
  navigate: ReturnType<typeof useNavigate>
}> = ({ category, variant, navigate }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={() => navigate(`/category/${category.slug}`)}
      role="button"
      tabIndex={0}
      aria-label={`Ver categoria ${category.name}`}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/category/${category.slug}`)}
    >
      <div className="relative overflow-hidden bg-gray-50">
        <div
          className={`
          aspect-[3/4] 
          ${variant === "compact" ? "aspect-square" : ""} 
          ${variant === "featured" ? "aspect-[3/4]" : ""}
        `}
        >
          <img
            src={category.imageUrl || "/placeholder.svg"}
            alt={category.name}
            className="w-full h-full object-cover object-center mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {category.isNew && (
          <div className="absolute top-0 left-0 bg-black text-white text-xs tracking-wider font-light px-4 py-1">
            NOVO
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <h3 className="text-sm font-light tracking-wide uppercase text-gray-900">{category.name}</h3>

        {variant === "default" && category.description && (
          <p className="mt-2 text-xs font-light text-gray-500">{category.description}</p>
        )}

        {category.productCount && variant === "featured" && (
          <p className="mt-2 text-xs font-light text-gray-400">{category.productCount} produtos</p>
        )}
      </div>
    </motion.div>
  )
}

export default CategoriesGrid


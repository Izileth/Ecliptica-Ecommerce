import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "react-responsive"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Atualizei os tipos para melhor alinhamento com seu sistema
export interface Category {
  id: string
  name: string
  imageUrl: string
  slug: string // Este será usado para a navegação
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

  // Definindo as categorias padrão caso não sejam fornecidas
  const defaultCategories: Category[] = [
    {
      id: '1',
      name: 'Camisetas',
      imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/dcea2898-a19f-4e97-81b1-86c20a4e36a2/Leonardo_Kino_XL_Modern_unisex_Tshirt_with_a_straight_fit_and_2.jpg',
      slug: 'shirts',
      description: 'Confira nossa coleção de camisetas',
      productCount: 42
    },
    {
      id: '2',
      name: 'Calças',
      imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/3fc8f78c-1797-4181-abb3-d19bd1971ed7/Leonardo_Kino_XL_Pants_with_a_straight_or_slim_cut_denim_or_tw_3.jpg',
      slug: 'pants',
      description: 'Calças para todos os estilos',
      productCount: 36
    },
    {
      id: '3',
      name: 'Vestidos',
      imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/4555e17c-a49a-49a3-88a5-77b1667f9345/Leonardo_Kino_XL_Elegant_feminine_dress_with_fluid_fit_light_f_0.jpg',
      slug: 'dress',
      description: 'Elegância e conforto',
      isNew: true,
      productCount: 28
    },
    {
      id: '4',
      name: 'Casacos',
      imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/5ba6118e-84f3-48d8-a1f9-463372d5f1a2/Leonardo_Kino_XL_Long_sophisticated_overcoat_in_fullbodied_fab_0.jpg',
      slug: 'accessories',
      description: 'Proteção contra o frio',
      productCount: 19
    }
  ]

  // Carousel settings
  const slidesToShow = isMobile ? 1.2 : isTablet ? 2.2 : 3
  const totalSlides = categories.length
  const maxSlideIndex = Math.max(0, Math.ceil(totalSlides / slidesToShow) - 1)

  // Fetch data from API ou usa as categorias padrão
  useEffect(() => {
    if (apiUrl && !initialCategories) {
      const fetchCategories = async () => {
        try {
          setLoading(true)
          const response = await fetch(apiUrl)

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`)
          }

          const data = await response.json()
          setCategories(data)
        } catch (err) {
          // Em caso de erro, usa as categorias padrão
          setCategories(defaultCategories)
          setError(err instanceof Error ? err.message : "Unknown error")
          console.error("Error fetching categories:", err)
        } finally {
          setLoading(false)
        }
      }

      fetchCategories()
    } else if (!initialCategories) {
      // Se nenhuma categoria for fornecida e nenhuma API URL, usa as padrão
      setCategories(defaultCategories)
      setLoading(false)
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

  // Função de navegação atualizada para usar o slug
  const handleCategoryClick = (slug: string) => {
    // Verifica se a rota existe nas rotas definidas
    const validRoutes = ['shirts', 'pants', 'dress', 'accessories', 'coats']
    
    if (validRoutes.includes(slug)) {
      navigate(`/${slug}`)
    } else {
      // Fallback para rota genérica caso a categoria não tenha página específica
      navigate(`/category/${slug}`)
    }
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
                  <CategoryItem 
                    category={category} 
                    variant={variant} 
                    onClick={() => handleCategoryClick(category.slug)} 
                  />
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
          <CategoryItem 
            key={category.id} 
            category={category} 
            variant={variant} 
            onClick={() => handleCategoryClick(category.slug)} 
          />
        ))}
      </div>
    </div>
  )
}

// Atualizei o CategoryItem para usar onClick em vez de navigate
const CategoryItem: React.FC<{
  category: Category
  variant: "default" | "compact" | "featured"
  onClick: () => void
}> = ({ category, variant, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Ver categoria ${category.name}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
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
import React from "react"
import type { Product } from "~/src/services/type"
import { useNavigate } from "react-router-dom"
import { formatPrice } from "~/src/utils/format"
import { useCart } from "~/src/hooks/useCart"
import { ShoppingCart, Check, Tag, Palette, Ruler, Heart, Eye, Star } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "~/src/components/imported/badge"
import { cn } from "~/src/lib/utils"

interface ProductCardProps {
  product: Product
  compact?: boolean
  featured?: boolean
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false, featured = false }) => {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [loading, setLoading] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const hasDiscount = product.salePrice !== null && product.salePrice < product.price
  const displayPrice = hasDiscount ? product.salePrice! : product.price
  const discountPercentage = hasDiscount ? Math.round((1 - product.salePrice! / product.price) * 100) : 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)

    try {
      await addItem(product.id, 1)
      setAdded(true)

      setTimeout(() => {
        setAdded(false)
      }, 2000)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Implementation for quick view modal would go here
    console.log("Quick view:", product.name)
  }

  // Função para mostrar cores disponíveis
  const renderColors = () => {
    if (!product.colors || product.colors.length === 0) return null

    return (
      <div className="flex items-center gap-1.5 mt-2">
        <Palette className="h-3 w-3 text-gray-400" />
        <div className="flex gap-1">
          {product.colors.slice(0, 4).map((color, index) => (
            <motion.span
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="h-3.5 w-3.5 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: color.colorCode }}
              title={color.colorName}
            />
          ))}
          {product.colors.length > 4 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500">
              +{product.colors.length - 4}
            </motion.span>
          )}
        </div>
      </div>
    )
  }

  // Função para mostrar tamanhos disponíveis
  const renderSizes = () => {
    if (!product.sizes || product.sizes.length === 0) return null

    const availableSizes = product.sizes.filter((size) => size.stock > 0)
    if (availableSizes.length === 0) return null

    return (
      <div className="flex items-center gap-1.5 mt-2">
        <Ruler className="h-3 w-3 text-gray-400" />
        <div className="flex gap-1">
          {availableSizes.slice(0, 4).map((size, index) => (
            <motion.span
              key={index}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="text-xs bg-gray-50 px-1.5 py-0.5 rounded-md border border-gray-100"
              title={`${size.size} (${size.stock} disponíveis)`}
            >
              {size.size}
            </motion.span>
          ))}
          {availableSizes.length > 4 && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500">
              +{availableSizes.length - 4}
            </motion.span>
          )}
        </div>
      </div>
    )
  }

  // Render rating stars (placeholder)
  const renderRating = () => {
    const rating = 4.5 // Placeholder rating
    return (
      <div className="flex items-center gap-1 mt-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "h-3 w-3",
                star <= Math.floor(rating)
                  ? "fill-amber-400 text-amber-400"
                  : star - 0.5 <= rating
                    ? "fill-amber-400/50 text-amber-400"
                    : "text-gray-300",
              )}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">{rating}</span>
      </div>
    )
  }

  return (
    <motion.div
      className={cn(
        "group bg-white rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300",
        featured ? "shadow-md hover:shadow-lg" : "shadow-sm hover:shadow",
        featured && "md:col-span-2 md:row-span-2",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden bg-gray-50"
        style={{
          paddingBottom: featured ? "75%" : compact ? "100%" : "120%",
        }}
      >
        {/* Skeleton loader */}
        {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}

        <motion.img
          src={product.image || "/placeholder.svg?height=400&width=400"}
          alt={product.name}
          className="absolute h-full w-full object-cover transition-opacity"
          style={{ opacity: imageLoaded ? 1 : 0 }}
          animate={{
            scale: isHovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Overlay gradient for better text readability */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <AnimatePresence>
            {hasDiscount && (
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                <Badge className="bg-rose-500 hover:bg-rose-600 text-white border-0 px-2.5 py-1 rounded-full shadow-sm">
                  {discountPercentage}% OFF
                </Badge>
              </motion.div>
            )}
            {product.countInStock < 10 && product.countInStock > 0 && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-0 px-2.5 py-1 rounded-full shadow-sm">
                  Últimas unidades
                </Badge>
              </motion.div>
            )}
            {product.collection && !compact && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-gray-900 hover:bg-gray-800 text-white border-0 px-2.5 py-1 rounded-full shadow-sm">
                  {product.collection}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <motion.button
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-600 hover:text-rose-500 transition-colors"
            onClick={toggleFavorite}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{
              opacity: isHovered || isFavorite ? 1 : 0,
              scale: 1,
              y: 0,
            }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-rose-500 text-rose-500" : "fill-transparent",
              )}
            />
          </motion.button>

          <motion.button
            className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-gray-600 hover:text-gray-900 transition-colors"
            onClick={handleQuickView}
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: 1,
              y: 0,
            }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Visualização rápida"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Quick add to cart button on hover */}
        <motion.div
          className="absolute bottom-0 inset-x-0 p-3 translate-y-full"
          initial={{ y: "100%" }}
          animate={{ y: isHovered ? "0%" : "100%" }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className={cn(
              "w-full text-white py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2",
              loading ? "bg-gray-400 cursor-not-allowed" : added ? "bg-emerald-500" : "bg-gray-900 hover:bg-gray-800",
            )}
            onClick={handleAddToCart}
            disabled={loading || product.countInStock <= 0}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white"></span>
                <span className="text-sm">Aguarde</span>
              </>
            ) : added ? (
              <>
                <Check className="h-4 w-4" />
                <span className="text-sm">Adicionado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span className="text-sm">Adicionar ao Carrinho</span>
              </>
            )}
          </motion.button>
        </motion.div>
      </div>

      <div className={cn("p-4 flex flex-col flex-grow", compact ? "space-y-1" : "space-y-2")}>
        {/* Category & Collection */}
        {!compact && (
          <div className="flex flex-wrap gap-1.5">
            {product.category && (
              <Badge
                variant="outline"
                className="text-xs font-normal px-2 py-0.5 rounded-full text-gray-600 bg-transparent"
              >
                {product.category}
              </Badge>
            )}
            {product.collection && (
              <Badge
                variant="outline"
                className="text-xs font-normal px-2 py-0.5 rounded-full text-gray-600 bg-transparent flex items-center gap-1"
              >
                <Tag className="h-2.5 w-2.5" />
                {product.collection}
              </Badge>
            )}
          </div>
        )}

        {/* Product Name */}
        <h3
          className={cn(
            "font-medium text-gray-900 transition-colors group-hover:text-gray-700",
            compact ? "text-sm line-clamp-1" : featured ? "text-lg line-clamp-2" : "text-base line-clamp-1",
          )}
        >
          {product.name}
        </h3>

        {/* Rating stars */}
        {!compact && renderRating()}

        {/* Description */}
        {!compact && <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{product.description}</p>}

        {/* Prices */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span
            className={cn(
              "font-medium",
              compact ? "text-sm" : featured ? "text-xl" : "text-base",
              hasDiscount ? "text-rose-600" : "text-gray-900",
            )}
          >
            {formatPrice(displayPrice)}
          </span>
          {hasDiscount && <span className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</span>}
        </div>

        {/* Variants */}
        {!compact && (
          <>
            {renderColors()}
            {renderSizes()}
          </>
        )}

        {/* Stock and Buy Button (only visible when not hovered on desktop) */}
        <div
          className={cn(
            "flex items-center justify-between mt-2",
            "md:opacity-100 md:group-hover:opacity-0 md:transition-opacity md:duration-300",
          )}
        >
          <div className="text-xs">
            {product.countInStock > 0 ? (
              <span className="text-emerald-600 font-medium">
                {product.countInStock} disponível{product.countInStock !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-rose-500 font-medium">Esgotado</span>
            )}
          </div>

          <motion.button
            className={cn(
              "text-xs px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5",
              loading
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : added
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-900 text-white hover:bg-gray-800",
            )}
            onClick={handleAddToCart}
            disabled={loading || product.countInStock <= 0}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <>
                <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white"></span>
                <span>Aguarde</span>
              </>
            ) : added ? (
              <>
                <Check className="h-3 w-3" />
                <span>Adicionado</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3" />
                <span>Comprar</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
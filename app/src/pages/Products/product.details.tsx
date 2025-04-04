import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useProducts } from "~/src/hooks/useStorage"
import { useCart } from "~/src/hooks/useCart"
import { formatPrice } from "~/src/utils/format"
import { Button } from "~/src/components/imported/button"
import { ArrowLeft, Minus, Plus, Check, X, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentProduct: product, getProductById, loading, error, clearProduct } = useProducts()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (id) {
      getProductById(id)
    }

    return () => {
      clearProduct()
    }
  }, [id, getProductById, clearProduct])

  useEffect(() => {
    if (product?.image) {
      setSelectedImage(product.image)
    }
  }, [product])

  if (error) {
    console.error("Erro ao carregar detalhes do produto:", error)
    navigate("/404")
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && product && newQuantity <= product.countInStock) {
      setQuantity(newQuantity)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      return new Date(dateString).toLocaleDateString("pt-BR", options)
    } catch (error) {
      return dateString
    }
  }

  const handleAddToCart = async () => {
    if (!product?.id) return

    setAddingToCart(true)
    try {
      await addItem(product.id, quantity)
      setAddedToCart(true)
      
      // Reset the button state after 2 seconds
      setTimeout(() => {
        setAddedToCart(false)
      }, 2000)
    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error)
    } finally {
      setAddingToCart(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 border-t-2 border-b-2 border-black rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-light tracking-wide text-gray-500">Carregando produto</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-8 rounded-none border border-gray-200"
        >
          <h2 className="text-xl font-light tracking-wide text-gray-900 mb-3">Produto não encontrado</h2>
          <p className="text-gray-500 font-light mb-6">
            O produto que você está procurando não está disponível no momento.
          </p>
          <Button
            className="bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-sm px-6 h-10 transition-colors duration-300"
            onClick={() => navigate("/produtos")}
          >
            Explorar Produtos
          </Button>
        </motion.div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mx-auto h-px w-16 bg-black/10 mb-8" />
          <h2 className="text-2xl font-light tracking-wide mb-4">Produto não encontrado</h2>
          <p className="mb-8 text-gray-500 font-light max-w-md mx-auto">
            O produto que você está procurando não está disponível ou foi removido.
          </p>
          <Button
            className="bg-black hover:bg-black/90 text-white rounded-none font-light tracking-wide text-sm px-6 h-10 transition-colors duration-300"
            onClick={() => navigate("/produtos")}
          >
            Explorar Produtos
          </Button>
        </motion.div>
      </div>
    )
  }

  // Verifica se o produto está em promoção
  const isOnPromo = product.promoPrice !== undefined && product.promoPrice < product.price
  const displayPrice = isOnPromo ? product.promoPrice : product.price

  // Imagens do produto (assumindo que pode haver múltiplas no futuro)
  const productImages = product.image ? [product.image] : []

  return (
    <div className="container max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate(-1)}
        className="mb-10 flex items-center text-gray-500 hover:text-black transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-light tracking-wide">Voltar</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Coluna da Imagem */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="sticky top-8">
            {selectedImage ? (
              <div className="overflow-hidden bg-gray-50">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-auto object-contain aspect-square mix-blend-multiply"
                />
              </div>
            ) : (
              <div className="bg-gray-50 aspect-square flex items-center justify-center">
                <span className="text-gray-400 font-light">Imagem não disponível</span>
              </div>
            )}

            {productImages.length > 0 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`border overflow-hidden transition-all ${
                      selectedImage === img ? "border-black" : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} - vista ${index + 1}`}
                      className="w-full h-20 object-cover mix-blend-multiply bg-gray-50"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Coluna de Detalhes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            {product.category && (
              <span className="text-xs font-light tracking-wider uppercase text-gray-500 border-b border-gray-200 pb-0.5">
                {product.category}
              </span>
            )}
            {isOnPromo && (
              <span className="bg-black text-white text-xs font-light px-3 py-1">
                {Math.round((1 - (product.promoPrice || 0) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-gray-900 mb-6">{product.name}</h1>

          <div className="flex items-baseline space-x-4 mb-8">
            <span className={`text-2xl font-light ${isOnPromo ? "text-black" : "text-black"}`}>
              {formatPrice(displayPrice)}
            </span>
            {isOnPromo && (
              <span className="text-gray-400 line-through text-lg font-light">{formatPrice(product.price)}</span>
            )}
          </div>

          <div className="mb-8">
            <p className="text-gray-600 font-light leading-relaxed">{product.description}</p>
          </div>

          <div className="mb-10">
            <div className="h-px w-full bg-gray-100 mb-6" />

            <div className="space-y-4 font-light">
              {product.category && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Categoria</span>
                  <span>{product.category}</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Disponibilidade</span>
                <span className="flex items-center">
                  {product.countInStock > 0 ? (
                    <>
                      <Check className="w-4 h-4 mr-1.5 text-green-500" />
                      <span>{product.countInStock} em estoque</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 mr-1.5 text-red-500" />
                      <span>Esgotado</span>
                    </>
                  )}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">SKU</span>
                <span className="font-mono text-sm">{product.id}</span>
              </div>

              {product.createdAt && (
                <div className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">Adicionado em</span>
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            {product.countInStock > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center">
                  <span className="text-sm font-light text-gray-500 w-24">Quantidade</span>
                  <div className="flex border border-gray-200">
                    <button
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <div className="w-12 h-10 flex items-center justify-center font-light">{quantity}</div>
                    <button
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.countInStock}
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Button
                    className={`w-full text-white rounded-none font-light tracking-wide text-sm h-12 transition-colors duration-300 flex items-center justify-center ${
                      addingToCart ? "bg-gray-400" : 
                      addedToCart ? "bg-green-600 hover:bg-green-700" : 
                      "bg-black hover:bg-black/90"
                    }`}
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Adicionando...
                      </>
                    ) : addedToCart ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Adicionado ao Carrinho
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Adicionar ao Carrinho
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            ) : (
              <Button
                disabled
                className="w-full bg-gray-100 text-gray-400 rounded-none font-light tracking-wide text-sm h-12 cursor-not-allowed"
              >
                Produto Esgotado
              </Button>
            )}

            <p className="text-xs text-gray-400 mt-4 font-light italic">
              * Os preços e a disponibilidade do produto podem variar sem aviso prévio.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetails
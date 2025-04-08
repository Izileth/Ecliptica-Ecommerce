import React, { useMemo } from "react"
import { useFeaturedProducts } from "~/src/hooks/useSortBy"
import ProductCard from "../Card/card"
import { Button } from "~/src/components/imported/button"
import { RefreshCw } from 'lucide-react'
import { Title } from "../../common/Titles/titles"

interface FeaturedProductsProps {
  title?: string
  subtitle?: string
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
}) => {
  const { featuredProducts, loading, error, refreshFeaturedProducts } = useFeaturedProducts()

  // Ensure products have the 'image' property defined to avoid errors
  const safeProducts = useMemo(() => {
    return featuredProducts.map((product) => {
      if (!product.image) {
        return {
          ...product,
          image: "/placeholder-image.jpg",
        }
      }
      return product
    })
  }, [featuredProducts])

  if (loading) {
    return (
      <section className="bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <Title title="Produtos Em Destaque" subtitle="Os produtos mais vendidos em um só lugar" color="dark" />
          </div>
          <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex flex-col space-y-3">
                <div className="aspect-[3/4] w-full animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-4 w-2/3 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-3 w-1/2 animate-pulse rounded-sm bg-neutral-200"></div>
                <div className="h-4 w-1/4 animate-pulse rounded-sm bg-neutral-200"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="bg-neutral-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <Title title="Produtos Em Destaque" subtitle="Os produtos mais vendidos em um só lugar" color="dark" />
            <p className="mx-auto mt-3 max-w-2xl text-sm font-light text-red-400 sm:mt-4">
              Não foi possível carregar os produtos em destaque
            </p>
            <Button
              onClick={refreshFeaturedProducts}
              variant="outline"
              className="mt-8 border-neutral-200 px-6 text-xs font-light text-neutral-800 hover:bg-neutral-900 hover:text-white"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (safeProducts.length === 0) {
    return null
  }

  return (
    <section className=" py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
        <Title title="Produtos Em Destaque" subtitle="Os produtos mais vendidos em um só lugar" color="dark" />
        </div>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {safeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button
            onClick={refreshFeaturedProducts}
            variant="outline"
            size="sm"
            className="group border-neutral-200 px-6 text-xs font-light text-neutral-800 transition-all duration-300 hover:bg-neutral-900 hover:text-white"
          >
            <RefreshCw className="mr-2 h-3 w-3 transition-transform duration-300 group-hover:rotate-180" />
            Atualizar seleção
          </Button>
        </div>
      </div>
    </section>
  )
}

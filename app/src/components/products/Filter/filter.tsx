import type React from "react"
import { useState, useEffect } from "react"
import type { ProductFilterFormValues } from "~/src/services/type"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "~/src/components/imported/slider"
import { Button } from "~/src/components/imported/button"
import { Badge } from "~/src/components/imported/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/imported/select"
import { Switch } from "~/src/components/imported/switch"
import { Label } from "~/src/components/imported/label"
import { Filter, X, Check, ArrowRight } from "lucide-react"
import { cn } from "~/src/lib/utils"

interface ProductFilterProps {
  onFilter: (filters: ProductFilterFormValues) => void
  maxPriceLimit?: number
}

const ProductFilter: React.FC<ProductFilterProps> = ({ onFilter, maxPriceLimit = 1000 }) => {
  // State for filter values
  const [filters, setFilters] = useState<ProductFilterFormValues>({
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false,
  })

  // State for UI
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPriceLimit])
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeFiltersCount, setActiveFiltersCount] = useState(0)
  const [hasChanges, setHasChanges] = useState(false)
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);
  // Available categories
  const categories = ["Camisetas", "Calças", "Vestidos", "Acessórios"]

  // Update price inputs when slider changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    }))
    setHasChanges(true)
  }, [priceRange])

  // Count active filters for badge
  useEffect(() => {
    let count = 0
    if (filters.category) count++
    if (filters.minPrice && Number(filters.minPrice) > 0) count++
    if (filters.maxPrice && Number(filters.maxPrice) < maxPriceLimit) count++
    if (filters.inStock) count++

    setActiveFiltersCount(count)
  }, [filters, maxPriceLimit])

  // Handle form input changes
  const handleChange = (name: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
    setHasChanges(true)
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    handleChange("category", value)
  }

  // Handle price range slider change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  // Handle in stock toggle
  const handleInStockChange = (checked: boolean) => {
    handleChange("inStock", checked)
  }

  // Apply filters
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Remove empty fields before submitting
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "" && value !== false && value !== undefined),
    ) as ProductFilterFormValues

    onFilter(activeFilters)
    setHasChanges(false)

    // Close filter panel on mobile after applying
    if (window.innerWidth < 768) {
      setIsExpanded(false)
    }
    if (isMounted && isMobile) {
      setIsExpanded(false);
    }
    
  }

  // Reset all filters
  const handleReset = () => {
    setPriceRange([0, maxPriceLimit])
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      inStock: false,
    })
    onFilter({})
    setHasChanges(false)
  }

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  return (
    <div className="mb-8 mt-6">
      {/* Mobile filter toggle */}
      <div className="flex items-center justify-between md:hidden mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-gray-900 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="text-gray-500 hover:text-gray-700">
            <X className="h-4 w-4 mr-1" />
            <span>Limpar</span>
          </Button>
        )}
      </div>

      {/* Filter form */}
      <AnimatePresence  mode="wait">
      {(isExpanded || (isMounted && !isMobile)) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="font-medium text-gray-900">Filtros</h2>
                <Button type="button" variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Category filter */}
                  <div className="md:col-span-3">
                    <Label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Categoria
                    </Label>
                    <Select value={filters.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category" className="w-full h-10 rounded-lg border-gray-200">
                        <SelectValue placeholder="Todas categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas categorias</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price range filter */}
                  <div className="md:col-span-6">
                    <div className="flex items-center justify-between mb-1.5">
                      <Label className="text-sm font-medium text-gray-700">Faixa de Preço</Label>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{formatPrice(priceRange[0])}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                    <Slider
                      min={0}
                      max={maxPriceLimit}
                      step={10}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="py-5"
                    />
                  </div>

                  {/* In stock filter and buttons */}
                  <div className="md:col-span-3 flex flex-col justify-end">
                    <div className="flex items-center justify-between mb-4">
                      <Label htmlFor="in-stock" className="text-sm font-medium text-gray-700">
                        Apenas em estoque
                      </Label>
                      <Switch id="in-stock" checked={filters.inStock} onCheckedChange={handleInStockChange} />
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <Button
                        type="submit"
                        className={cn(
                          "flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-lg h-10 transition-all",
                          hasChanges && "relative overflow-hidden",
                        )}
                      >
                        {hasChanges && (
                          <motion.span
                            className="absolute inset-0 bg-gray-700"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        <span className="relative z-10 flex items-center justify-center">
                          <Filter className="h-4 w-4 mr-2" />
                          Aplicar
                        </span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg h-10"
                        disabled={activeFiltersCount === 0}
                      >
                        Limpar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Active filters */}
              <AnimatePresence  mode="wait">
                {activeFiltersCount > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 overflow-hidden"
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-gray-700">Filtros ativos</span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {filters.category && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1 text-xs"
                          >
                            Categoria: {filters.category}
                            <button
                              type="button"
                              onClick={() => handleCategoryChange("")}
                              className="ml-1 text-gray-400 hover:text-gray-700"
                            >
                              <X className="h-3 w-3 inline" />
                            </button>
                          </Badge>
                        )}

                        {filters.minPrice && Number(filters.minPrice) > 0 && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1 text-xs"
                          >
                            Preço mínimo: {formatPrice(Number(filters.minPrice))}
                          </Badge>
                        )}

                        {filters.maxPrice && Number(filters.maxPrice) < maxPriceLimit && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1 text-xs"
                          >
                            Preço máximo: {formatPrice(Number(filters.maxPrice))}
                          </Badge>
                        )}

                        {filters.inStock && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-full px-3 py-1 text-xs"
                          >
                            Apenas em estoque
                            <button
                              type="button"
                              onClick={() => handleInStockChange(false)}
                              className="ml-1 text-gray-400 hover:text-gray-700"
                            >
                              <X className="h-3 w-3 inline" />
                            </button>
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile filter applied indicator */}
      
      <AnimatePresence  mode="wait">
      {(isExpanded || (isMounted && !isMobile)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Check className="h-4 w-4 text-emerald-500 mr-2" />
              <span>
                {activeFiltersCount} {activeFiltersCount === 1 ? "filtro aplicado" : "filtros aplicados"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-gray-500 hover:text-gray-700 -mr-2"
            >
              Editar
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductFilter


import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ProductService } from "~/src/services/produtcService"
import { toast } from "sonner"
import type { ProductFormValues, ProductSize, ProductColor } from "~/src/services/type"
import { productFormSchema } from "~/src/schemas/productSchema"
import { motion, AnimatePresence } from "framer-motion"

// Components from shadcn/ui
import { Button } from "~/src/components/imported/button"
import { Input } from "~/src/components/imported/input"
import { Label } from "~/src/components/imported/label"
import { Textarea } from "~/src/components/imported/textarea"
import { Skeleton } from "~/src/components/imported/skeleton"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "~/src/components/imported/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/imported/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/imported/tabs"
import { Plus, Trash2, X, Info, ImageIcon, Tag, Palette, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Badge } from "~/src/components/imported/badge"
import { ScrollArea } from "~/src/components/imported/scroll-area"
import { Alert, AlertDescription } from "~/src/components/imported/alert"

type ProductCategory = "Camisetas" | "Calças" | "Vestidos" | "Sapatos" | "Acessórios"

type FormErrors = Record<string, string>
type ProductFormErrors = Partial<Record<string, string>>

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState({
    page: true,
    submit: false,
  })
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: null,
    salePrice: "",
    collection: "",
    features: [],
    sizes: [],
    colors: [],
    additionalImages: [],
    additionalImagesFiles: [],
    removedImages: [],
  })
  const [currentImage, setCurrentImage] = useState<string>("")
  const [currentAdditionalImages, setCurrentAdditionalImages] = useState<string[]>([])
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set())
  const [imageChanged, setImageChanged] = useState<boolean>(false)
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({})
  const [activeTab, setActiveTab] = useState("basic")
  const [newFeature, setNewFeature] = useState("")
  const [newSize, setNewSize] = useState<{ size: string; stock: number }>({ size: "", stock: 0 })
  const [newColor, setNewColor] = useState<{
    colorName: string
    colorCode: string
    stock: number
  }>({
    colorName: "",
    colorCode: "#000000",
    stock: 0,
  })

  const categories: ProductCategory[] = ["Camisetas", "Calças", "Vestidos", "Sapatos", "Acessórios"]

  // Carrega os dados do produto
  useEffect(() => {
    const loadProduct = async () => {
      try {
        if (!id) throw new Error("ID do produto não fornecido")

        const product = await ProductService.getById(id)

        if (!product) {
          throw new Error("Produto não encontrado")
        }

        setFormValues({
          name: product.name || "",
          description: product.description || "",
          price: product.price.toString(),
          category: product.category || categories[0],
          countInStock: product.countInStock.toString(),
          image: null,
          salePrice: product.salePrice ? product.salePrice.toString() : "",
          collection: product.collection || "",
          features: product.features || [],
          sizes: product.sizes || [],
          colors: product.colors || [],
          additionalImages: product.images?.map((img) => img.url).filter((url) => url) || [],
          additionalImagesFiles: [],
          removedImages: [],
        })

        if (product.image) {
          setCurrentImage(product.image)
        }

        if (product.images && product.images.length > 0) {
          setCurrentAdditionalImages(product.images.map((img) => img.url))
        }
      } catch (error) {
        console.error("Error loading product:", error)
        toast.error("Falha ao carregar os dados do produto")
        navigate("/profile?tab=products", { replace: true })
      } finally {
        setLoading((prev) => ({ ...prev, page: false }))
      }
    }
    loadProduct()
  }, [id, navigate, categories])

  //Carrega as Imagens
  useEffect(() => {
    return () => {
      formValues.additionalImagesFiles?.forEach(file => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, []);

  const validateForm = (): boolean => {
    try {
      // Filtra additionalImages removendo undefined/null
      const cleanedAdditionalImages = formValues.additionalImages?.filter((img) => img) || []

      const formData = {
        ...formValues,
        price: Number.parseFloat(String(formValues.price)),
        countInStock: Number.parseInt(String(formValues.countInStock)),
        salePrice: formValues.salePrice ? Number.parseFloat(String(formValues.salePrice)) : undefined,
        additionalImages: cleanedAdditionalImages, // Usa o array filtrado
        sizes: formValues.sizes?.map((size) => ({
          ...size,
          stock: Number(size.stock),
        })),
        colors: formValues.colors?.map((color) => ({
          ...color,
          stock: Number(color.stock),
        })),
      }

      const result = productFormSchema.safeParse(formData)

      if (!result.success) {
        const formattedErrors = result.error.flatten().fieldErrors
        const newErrors: Record<string, string> = {}

        Object.entries(formattedErrors).forEach(([key, messages]) => {
          if (messages?.[0]) {
            newErrors[key] = messages[0]
          }
        })

        setFormErrors(newErrors)
        return false
      }

      setFormErrors({})
      return true
    } catch (error) {
      console.error("Validation error:", error)
      return false
    }
  }

  // Funções para manipular os campos existentes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    const allowedFields = ["name", "description", "price", "category", "countInStock", "salePrice", "collection"]

    function isProductField(key: string): key is keyof ProductFormValues {
      return ["name", "description", "price", "category", "countInStock", "salePrice", "collection"].includes(key)
    }

    if (allowedFields.includes(name)) {
      setFormValues((prev) => ({
        ...prev,
        [name]: value,
      }))

      if (isProductField(name)) {
        setChangedFields((prev) => new Set(prev).add(name)) // Tipagem segura
      }

      if (formErrors[name]) {
        setFormErrors((prev) => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    }
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target as { name: "price" | "countInStock" | "salePrice"; value: string }

    if (name === "price" || name === "salePrice") {
      const cleanedValue = value.replace(/[^0-9.]/g, "")
      const parts = cleanedValue.split(".")
      if (parts.length > 1 && parts[1].length > 2) return

      setFormValues((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }))
    } else if (name === "countInStock") {
      const cleanedValue = value.replace(/[^0-9]/g, "")
      setFormValues((prev) => ({
        ...prev,
        [name]: cleanedValue,
      }))
    }

    setChangedFields((prev) => new Set(prev).add(name))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormValues((prev) => ({
        ...prev,
        image: file,
      }))
      setImageChanged(true)
      setFormErrors((prev) => ({ ...prev, image: "" }))
    }
  }

  // Funções para os campos de características
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormValues((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }))
  }

  // Funções para os campos de tamanhos
  const handleAddSize = () => {
    if (newSize.size.trim()) {
      setFormValues((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), { ...newSize, stock: Number(newSize.stock) }],
      }))
      setNewSize({ size: "", stock: 0 })
    }
  }

  const handleRemoveSize = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      sizes: prev.sizes?.filter((_, i) => i !== index),
    }))
  }

  const handleSizeChange = (index: number, field: keyof ProductSize, value: string) => {
    setFormValues((prev) => {
      const newSizes = [...(prev.sizes || [])]
      newSizes[index] = {
        ...newSizes[index],
        [field]: field === "stock" ? Number.parseInt(value) || 0 : value,
      }
      return { ...prev, sizes: newSizes }
    })
  }

  // Funções para os campos de cores
  const handleAddColor = () => {
    if (newColor.colorName.trim()) {
      setFormValues((prev) => ({
        ...prev,
        colors: [
          ...(prev.colors || []),
          {
            ...newColor,
            stock: Number(newColor.stock),
          },
        ],
      }))
      setNewColor({ colorName: "", colorCode: "#000000", stock: 0 })
    }
  }

  const handleRemoveColor = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      colors: prev.colors?.filter((_, i) => i !== index),
    }))
  }

  const handleColorChange = (index: number, field: keyof ProductColor, value: string | File) => {
    setFormValues((prev) => {
      const newColors = [...(prev.colors || [])]
      newColors[index] = {
        ...newColors[index],
        [field]: field === "stock" ? Number.parseInt(value as string) || 0 : value,
      }
      return { ...prev, colors: newColors }
    })
  }

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormValues((prev) => ({
        ...prev,
        additionalImagesFiles: [...(prev.additionalImagesFiles || []), ...files],
      }))
    }
  }

  const handleRemoveAdditionalImage = (index: number, isNew: boolean) => {
    if (isNew) {
      // Libera o object URL da memória
      const file = formValues.additionalImagesFiles?.[index];
      if (file) URL.revokeObjectURL(URL.createObjectURL(file));
      
      setFormValues(prev => ({
        ...prev,
        additionalImagesFiles: prev.additionalImagesFiles?.filter((_, i) => i !== index) || []
      }));
    } else {
      const imageUrl = currentAdditionalImages[index];
      setFormValues(prev => ({
        ...prev,
        additionalImages: prev.additionalImages?.filter(img => img !== imageUrl) || [],
        removedImages: [...(prev.removedImages || []), imageUrl]
      }));
      setCurrentAdditionalImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Find which tab has errors and switch to it
      if (
        formErrors.name ||
        formErrors.description ||
        formErrors.price ||
        formErrors.category ||
        formErrors.countInStock ||
        formErrors.salePrice ||
        formErrors.collection
      ) {
        setActiveTab("basic")
      } else if (formErrors.image || Object.keys(formErrors).some((key) => key.startsWith("additionalImages"))) {
        setActiveTab("images")
      } else if (Object.keys(formErrors).some((key) => key.startsWith("features"))) {
        setActiveTab("features")
      } else if (Object.keys(formErrors).some((key) => key.startsWith("sizes") || key.startsWith("colors"))) {
        setActiveTab("variants")
      }

      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    setLoading((prev) => ({ ...prev, submit: true }))

    try {
      if (!id) throw new Error("ID do produto não fornecido")

      // Não precisa de conversão explícita agora
      const formData = ProductService.toFormData({
        ...formValues,
        price: Number.parseFloat(String(formValues.price)),
        countInStock: Number.parseInt(String(formValues.countInStock)),
        salePrice: formValues.salePrice ? Number.parseFloat(String(formValues.salePrice)) : null,
      })

      await ProductService.update(id, formData)
      toast.success("Produto atualizado com sucesso!")
      navigate("/profile?tab=products")
    } catch (error: any) {
      console.error("Error updating product:", error)
      toast.error(error.response?.data?.message || "Erro ao atualizar produto")
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }))
    }
  }

  if (loading.page) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="max-w-4xl mx-auto border-0 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-4 border-b border-gray-100">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <div className="px-6 py-4">
            <Skeleton className="h-10 w-full max-w-md mx-auto mb-6" />
          </div>
          <CardContent className="space-y-6 px-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    )
  }

  const hasChanges =
    changedFields.size > 0 ||
    imageChanged 

  return (
    <div className="container mx-auto px-4 py-8 mt-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-4xl mx-auto border-0 shadow-sm rounded-xl overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-light tracking-tight">Editar Produto</CardTitle>
                <CardDescription>Atualize as informações do produto</CardDescription>
              </div>
              {hasChanges && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium flex items-center"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Alterações não salvas
                </motion.div>
              )}
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 max-w-2xl mx-auto my-4">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span className="hidden sm:inline">Básico</span>
                </TabsTrigger>
                <TabsTrigger value="images" className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Imagens</span>
                </TabsTrigger>
                <TabsTrigger value="features" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Características</span>
                </TabsTrigger>
                <TabsTrigger value="variants" className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Variantes</span>
                </TabsTrigger>
              </TabsList>

              <CardContent className="p-6">
                <TabsContent value="basic" className="mt-0 space-y-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    {/* Nome e Categoria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Nome do Produto
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                          required
                        />
                        {formErrors.name && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-medium">
                          Categoria
                        </Label>
                        <Select
                          value={formValues.category}
                          onValueChange={(value: string) => {
                            setFormValues((prev) => ({ ...prev, category: value }))
                            setChangedFields((prev) => new Set(prev).add("category"))
                          }}
                          required
                        >
                          <SelectTrigger className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formErrors.category && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2 mb-6">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Descrição
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
                        className="min-h-32 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                        required
                        rows={4}
                      />
                      {formErrors.description && (
                        <p className="text-sm text-rose-500 mt-1 flex items-center">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {formErrors.description}
                        </p>
                      )}
                    </div>

                    {/* Preços e Estoque */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                          Preço
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">R$</span>
                          <Input
                            id="price"
                            name="price"
                            type="text"
                            value={formValues.price}
                            onChange={handleNumberChange}
                            placeholder="0.00"
                            className="pl-8 h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            required
                          />
                        </div>
                        {formErrors.price && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.price}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salePrice" className="text-sm font-medium">
                          Preço Promocional
                        </Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">R$</span>
                          <Input
                            id="salePrice"
                            name="salePrice"
                            type="text"
                            value={formValues.salePrice || ""}
                            onChange={handleNumberChange}
                            placeholder="0.00"
                            className="pl-8 h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                          />
                        </div>
                        {formErrors.salePrice && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.salePrice}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="countInStock" className="text-sm font-medium">
                          Estoque Total
                        </Label>
                        <Input
                          id="countInStock"
                          name="countInStock"
                          type="text"
                          value={formValues.countInStock}
                          onChange={handleNumberChange}
                          className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                          required
                        />
                        {formErrors.countInStock && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.countInStock}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Coleção */}
                    <div className="space-y-2">
                      <Label htmlFor="collection" className="text-sm font-medium">
                        Coleção
                      </Label>
                      <Input
                        id="collection"
                        name="collection"
                        value={formValues.collection || ""}
                        onChange={handleChange}
                        placeholder="Ex: Verão 2023"
                        className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                      />
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="images" className="mt-0 space-y-6">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    {/* Imagem Principal */}
                    <div className="space-y-4 mb-8">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-gray-500" />
                        Imagem Principal
                      </h3>

                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="w-full md:w-1/2">
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                            <Input
                              id="image"
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="image"
                              className="cursor-pointer flex flex-col items-center justify-center gap-2"
                            >
                              <ImageIcon className="h-8 w-8 text-gray-400" />
                              <span className="text-sm text-gray-500">
                                Clique para selecionar ou arraste uma nova imagem
                              </span>
                              <span className="text-xs text-gray-400">JPEG, PNG ou WEBP (máx. 5MB)</span>
                            </label>
                          </div>
                          {formErrors.image && (
                            <p className="text-sm text-rose-500 mt-1 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {formErrors.image}
                            </p>
                          )}
                        </div>

                        <div className="w-full md:w-1/2">
                          <AnimatePresence mode="wait">
                            {currentImage && !imageChanged && (
                              <motion.div
                                key="current"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative group"
                              >
                                <img
                                  src={currentImage || "/placeholder.svg"}
                                  alt="Imagem atual"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                  <Badge className="absolute top-2 left-2 bg-white text-gray-700 font-normal">
                                    Imagem atual
                                  </Badge>
                                </div>
                              </motion.div>
                            )}

                            {formValues.image && imageChanged && (
                              <motion.div
                                key="new"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center relative group"
                              >
                                <img
                                  src={URL.createObjectURL(formValues.image) || "/placeholder.svg"}
                                  alt="Nova imagem"
                                  className="w-full h-full object-contain"
                                />
                                <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                  <Badge className="absolute top-2 left-2 bg-green-50 text-green-700 font-normal">
                                    Nova imagem
                                  </Badge>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Imagens Adicionais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <ImageIcon className="h-5 w-5 text-gray-500" />
                        Imagens Adicionais
                      </h3>

                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <Input
                          id="additionalImages"
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleAdditionalImagesChange}
                          className="hidden"
                          multiple
                        />
                        <label
                          htmlFor="additionalImages"
                          className="cursor-pointer flex flex-col items-center justify-center gap-2"
                        >
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Clique para selecionar ou arraste imagens adicionais
                          </span>
                          <span className="text-xs text-gray-400">JPEG, PNG ou WEBP (máx. 5MB cada)</span>
                        </label>
                      </div>

                      {/* Grid de imagens */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        <AnimatePresence>
                          {/* Imagens existentes */}
                          {currentAdditionalImages.map((img, index) => (
                            <motion.div
                              key={`existing-${index}`}
                              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img 
                                src={img} 
                                alt={`Imagem adicional ${index + 1}`}
                                className="h-full w-full object-cover"
                                />
                              <div className="absolute inset-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalImage(index, false)}
                                  className="bg-white text-rose-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}

                          {/* Novas imagens */}
                          {formValues.additionalImagesFiles?.map((file, index) => (
                            <motion.div
                              key={`new-${index}`}
                              className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                            >
                              <img 
                                src={URL.createObjectURL(file)} 
                                alt={`Nova imagem ${index + 1}`}
                                className="h-full w-full object-cover"
                                />
                              <Badge className="absolute top-2 left-2 bg-green-50 text-green-700 font-normal">
                                Nova
                              </Badge>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAdditionalImage(index, true)}
                                  className="bg-white text-rose-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Tag className="h-5 w-5 text-gray-500" />
                        Características do Produto
                      </h3>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Adicione uma característica"
                            className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleAddFeature()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={handleAddFeature}
                            className="h-11 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <AnimatePresence>
                          {formValues.features && formValues.features.length > 0 ? (
                            <motion.div
                              className="flex flex-wrap gap-2 mt-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {formValues.features.map((feature, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="flex items-center gap-1 py-2 px-3 bg-gray-50 border-gray-200 text-gray-700 rounded-full"
                                >
                                  {feature}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(index)}
                                    className="ml-1 text-gray-400 hover:text-rose-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </motion.div>
                          ) : (
                            <Alert className="bg-gray-50 border-gray-200 text-gray-600 mt-4">
                              <AlertDescription>
                                Nenhuma característica adicionada. Adicione características para destacar os
                                diferenciais do produto.
                              </AlertDescription>
                            </Alert>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="variants" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* Tamanhos */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Tag className="h-5 w-5 text-gray-500" />
                        Tamanhos
                      </h3>

                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <Input
                              placeholder="Tamanho (ex: P, M, G)"
                              value={newSize.size}
                              onChange={(e) => setNewSize({ ...newSize, size: e.target.value })}
                              className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Estoque"
                              min="0"
                              value={newSize.stock}
                              onChange={(e) => setNewSize({ ...newSize, stock: Number.parseInt(e.target.value) || 0 })}
                              className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleAddSize}
                          className="w-full h-10 mt-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Tamanho
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.sizes && formValues.sizes.length > 0 ? (
                          <motion.div
                            className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="text-sm font-medium text-gray-700">Tamanhos Adicionados</h4>
                            <ScrollArea className="h-[200px] pr-4">
                              <div className="space-y-3">
                                {formValues.sizes.map((size, index) => (
                                  <motion.div
                                    key={index}
                                    className="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg shadow-sm"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div className="col-span-2">
                                      <Input
                                        value={size.size}
                                        onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                                        className="h-10 rounded-lg border-gray-200"
                                      />
                                      {formErrors[`sizes[${index}].size`] && (
                                        <p className="text-sm text-rose-500 mt-1">
                                          {formErrors[`sizes[${index}].size`]}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={size.stock}
                                        onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                                        className="h-10 rounded-lg border-gray-200"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => handleRemoveSize(index)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </ScrollArea>
                          </motion.div>
                        ) : (
                          <Alert className="bg-gray-50 border-gray-200 text-gray-600 mt-4">
                            <AlertDescription>
                              Nenhum tamanho adicionado. Adicione tamanhos se o produto possuir variações.
                            </AlertDescription>
                          </Alert>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cores */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Palette className="h-5 w-5 text-gray-500" />
                        Cores
                      </h3>

                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <Input
                              placeholder="Nome da cor"
                              value={newColor.colorName}
                              onChange={(e) => setNewColor({ ...newColor, colorName: e.target.value })}
                              className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 h-11">
                              <Input
                                type="color"
                                value={newColor.colorCode}
                                onChange={(e) => setNewColor({ ...newColor, colorCode: e.target.value })}
                                className="h-11 w-11 p-1 rounded-lg border-gray-200"
                              />
                              <div
                                className="w-11 h-11 rounded-lg border border-gray-200"
                                style={{ backgroundColor: newColor.colorCode }}
                              />
                            </div>
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Estoque"
                              min="0"
                              value={newColor.stock}
                              onChange={(e) =>
                                setNewColor({ ...newColor, stock: Number.parseInt(e.target.value) || 0 })
                              }
                              className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleAddColor}
                          className="w-full h-10 mt-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Cor
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.colors && formValues.colors.length > 0 ? (
                          <motion.div
                            className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="text-sm font-medium text-gray-700">Cores Adicionadas</h4>
                            <ScrollArea className="h-[200px] pr-4">
                              <div className="space-y-3">
                                {formValues.colors.map((color, index) => (
                                  <motion.div
                                    key={index}
                                    className="grid grid-cols-3 gap-3 items-center bg-white p-3 rounded-lg shadow-sm"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <div>
                                      <Input
                                        value={color.colorName}
                                        onChange={(e) => handleColorChange(index, "colorName", e.target.value)}
                                        className="h-10 rounded-lg border-gray-200"
                                      />
                                      {formErrors[`colors[${index}].colorName`] && (
                                        <p className="text-sm text-rose-500 mt-1">
                                          {formErrors[`colors[${index}].colorName`]}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="color"
                                        value={color.colorCode}
                                        onChange={(e) => handleColorChange(index, "colorCode", e.target.value)}
                                        className="h-10 w-10 p-1 rounded-lg border-gray-200"
                                      />
                                      <div
                                        className="w-10 h-10 rounded-lg border border-gray-200"
                                        style={{ backgroundColor: color.colorCode }}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={color.stock}
                                        onChange={(e) => handleColorChange(index, "stock", e.target.value)}
                                        className="h-10 rounded-lg border-gray-200"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => handleRemoveColor(index)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </ScrollArea>
                          </motion.div>
                        ) : (
                          <Alert className="bg-gray-50 border-gray-200 text-gray-600 mt-4">
                            <AlertDescription>
                              Nenhuma cor adicionada. Adicione cores se o produto possuir variações de cor.
                            </AlertDescription>
                          </Alert>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </TabsContent>
              </CardContent>
            </Tabs>

            <CardFooter className="flex justify-between gap-4 p-6 border-t border-gray-100 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/profile?tab=products")}
                disabled={loading.submit}
                className="h-11 px-6 rounded-lg border-gray-300 hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading.submit}
                className="h-11 px-8 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors flex items-center gap-2"
              >
                {loading.submit ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

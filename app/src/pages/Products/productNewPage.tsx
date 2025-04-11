import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import type { ProductFormValues, ProductSize, ProductColor } from "~/src/services/type"
import { useProducts } from "~/src/hooks/useProducts"
import { ProductService } from "~/src/services/produtcService"

// Components
import { Button } from "~/src/components/imported/button"
import { Input } from "~/src/components/imported/input"
import { Label } from "~/src/components/imported/label"
import { Textarea } from "~/src/components/imported/textarea"
import { Spinner } from "~/src/components/ui/Spinner/spinner"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "~/src/components/imported/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/imported/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/imported/tabs"
import { Plus, Trash2, X, ImageIcon, Tag, Ruler, Palette, Info } from "lucide-react"
import { Badge } from "~/src/components/imported/badge"
import { ColorPicker } from "~/src/components/ui/Piker/color.picker"
import { motion, AnimatePresence } from "framer-motion"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]



export default function NewProductPage() {
  const navigate = useNavigate()
  const { addProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: null,
    salePrice: null,
    collection: null,
    features: [],
    sizes: [],
    colors: [],
    additionalImages: [],
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [newFeature, setNewFeature] = useState("")
  const [newSize, setNewSize] = useState<Omit<ProductSize, "id">>({ size: "", stock: 0 })
  const [newColor, setNewColor] = useState<Omit<ProductColor, "id">>({
    colorName: "",
    colorCode: "#000000",
    stock: 0,
  })

  const categories = ["Camisetas", "Calças", "Vestidos", "Sapatos", "Acessórios"]

  const collections = ["Coleção Verão", "Coleção Inverno", "Lançamentos", "Promoções", "Edição Limitada"]

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {}

    // Validações básicas
    if (!formValues.name.trim()) errors.name = "Nome é obrigatório"
    if (formValues.name.length > 100) errors.name = "Nome muito longo (máx. 100 caracteres)"
    if (!formValues.description.trim()) errors.description = "Descrição é obrigatória"

    // Validação de preço
    const priceValue = Number.parseFloat(formValues.price.toString())
    if (isNaN(priceValue)) errors.price = "Preço deve ser um número"
    else if (priceValue <= 0) errors.price = "Preço deve ser maior que zero"

    // Validação de estoque
    const stockValue = Number.parseInt(formValues.countInStock.toString())
    if (isNaN(stockValue)) errors.countInStock = "Estoque deve ser um número"
    else if (stockValue < 0) errors.countInStock = "Estoque não pode ser negativo"

    // Validação de categoria
    if (!formValues.category) errors.category = "Selecione uma categoria"

    // Validação de imagem principal
    if (!formValues.image) errors.image = "Imagem é obrigatória"
    else if (formValues.image instanceof File) {
      if (!ALLOWED_FILE_TYPES.includes(formValues.image.type)) {
        errors.image = "Apenas imagens JPEG, PNG ou WEBP são permitidas"
      }
      if (formValues.image.size > MAX_FILE_SIZE) {
        errors.image = "Imagem muito grande (máx. 5MB)"
      }
    }

    // Validação de preço promocional
    if (formValues.salePrice) {
      const salePriceValue = Number.parseFloat(formValues.salePrice.toString())
      if (isNaN(salePriceValue)) errors.salePrice = "Preço promocional inválido"
      else if (salePriceValue >= priceValue) {
        errors.salePrice = "Preço promocional deve ser menor que o preço normal"
      }
    }

    // Validação de tamanhos
    if (formValues.sizes && formValues.sizes.length > 0) {
      formValues.sizes.forEach((size, index) => {
        if (!size.size) errors[`sizes-${index}`] = "Tamanho é obrigatório"
        if (size.stock === 0) errors[`sizes-stock-${index}`] = "Estoque não pode ser negativo"
      })
    }

    // Validação de cores
    if (formValues.colors && formValues.colors.length > 0) {
      formValues.colors.forEach((color, index) => {
        if (!color.colorName) errors[`colors-${index}`] = "Nome da cor é obrigatório"
        if (color.stock === 0) errors[`colors-stock-${index}`] = "Estoque não pode ser negativo"
      })
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }, [formValues])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setFormValues((prev) => {
      const newValues = { ...prev }

      if (name === "price" || name === "salePrice" || name === "countInStock") {
        // Permite apenas números e ponto decimal para preços
        const cleanedValue = value.replace(/[^0-9.]/g, "")
        const parts = cleanedValue.split(".")

        // Garante no máximo 2 casas decimais
        if (parts.length <= 1 || parts[1].length <= 2) {
          // Tipagem segura para campos numéricos
          if (name === "price" || name === "salePrice") {
            newValues[name] = cleanedValue
          } else if (name === "countInStock") {
            newValues.countInStock = cleanedValue
          }
        }
      } else {
        // Tratamento seguro para outros campos
        switch (name) {
          case "name":
          case "description":
          case "category":
          case "collection":
            newValues[name] = value
            break
          // Adicione outros campos de texto conforme necessário
          default:
            // Para campos não tratados explicitamente
            if (name in newValues) {
              ;(newValues as any)[name] = value
            }
            break
        }
      }

      return newValues
    })

    // Limpa erro ao modificar
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFormErrors((prev) => ({ ...prev, image: "Tipo de arquivo não permitido" }))
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors((prev) => ({ ...prev, image: "Imagem muito grande (máx. 5MB)" }))
        return
      }

      setFormValues((prev) => ({
        ...prev,
        image: file,
      }))
      setFormErrors((prev) => ({ ...prev, image: "" }))
    }
  }
  useEffect(() => {
    return () => {
      // Revoga URLs de imagens adicionais
      formValues.additionalImages?.forEach(url => {
        if (typeof url === 'string' && url.startsWith('blob:')){
          console.log('Imagem Revogada')
        }
      });
      
      // Revoga URL da imagem principal se for File
      if (formValues.image instanceof File) {
        URL.revokeObjectURL(URL.createObjectURL(formValues.image));
      }
    };
  }, [formValues.additionalImages, formValues.image]);

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const MAX_ADDITIONAL_IMAGES = 5;
      
      // Valida os arquivos antes de criar URLs
      const validFiles = files.filter(file => {
        const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE;
        
        if (!isValidType) {
          toast.error(`Arquivo "${file.name}": Apenas imagens JPEG, PNG ou WEBP são permitidas`);
        }
        if (!isValidSize) {
          toast.error(`Arquivo "${file.name}": Imagem muito grande (máx. 5MB)`);
        }
        
        return isValidType && isValidSize;
      });
      
      if (validFiles.length === 0) return;

      if (validFiles.length + (formValues.additionalImages?.length || 0) > MAX_ADDITIONAL_IMAGES) {
        toast.error(`Máximo de ${MAX_ADDITIONAL_IMAGES} imagens adicionais permitidas`);
        return;
      }
      
      // Armazena os Files para upload
      setFormValues(prev => ({
        ...prev,
        additionalImagesFiles: [...(prev.additionalImagesFiles || []), ...validFiles]
      }));
  
      // Cria URLs para pré-visualização
      const urls = validFiles.map(file => URL.createObjectURL(file));
      setFormValues(prev => ({
        ...prev,
        additionalImages: [...(prev.additionalImages || []), ...urls]
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setFormValues((prev) => {
      const newImages = [...(prev.additionalImages || [])];
      // A URL já será revogada no botão de remoção
      newImages.splice(index, 1);
      
      // Remove também o arquivo correspondente
      const newFiles = [...(prev.additionalImagesFiles || [])];
      newFiles.splice(index, 1);
      
      return { 
        ...prev, 
        additionalImages: newImages,
        additionalImagesFiles: newFiles
      };
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      category: value,
    }))
    if (formErrors.category) {
      setFormErrors((prev) => ({ ...prev, category: "" }))
    }
  }

  const handleCollectionChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      collection: value,
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormValues((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormValues((prev) => {
      const newFeatures = [...(prev.features || [])]
      newFeatures.splice(index, 1)
      return { ...prev, features: newFeatures }
    })
  }

  const addSize = () => {
    if (newSize.size.trim()) {
      setFormValues((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), { ...newSize, stock: Number.parseInt(newSize.stock.toString()) || 0 }],
      }))
      setNewSize({ size: "", stock: 0 })
    }
  }

  const updateSize = (index: number, field: keyof ProductSize, value: string | number) => {
    setFormValues((prev) => {
      const newSizes = [...(prev.sizes || [])]
      newSizes[index] = { ...newSizes[index], [field]: value }
      return { ...prev, sizes: newSizes }
    })
  }

  const removeSize = (index: number) => {
    setFormValues((prev) => {
      const newSizes = [...(prev.sizes || [])]
      newSizes.splice(index, 1)
      return { ...prev, sizes: newSizes }
    })
  }

  const addColor = () => {
    if (newColor.colorName.trim()) {
      setFormValues((prev) => ({
        ...prev,
        colors: [
          ...(prev.colors || []),
          {
            ...newColor,
            stock: Number.parseInt(newColor.stock.toString()) || 0,
          },
        ],
      }))
      setNewColor({ colorName: "", colorCode: "#000000", stock: 0 })
    }
  }

  const updateColor = (index: number, field: keyof ProductColor, value: string | number) => {
    setFormValues((prev) => {
      const newColors = [...(prev.colors || [])]
      newColors[index] = { ...newColors[index], [field]: value }
      return { ...prev, colors: newColors }
    })
  }

  const removeColor = (index: number) => {
    setFormValues((prev) => {
      const newColors = [...(prev.colors || [])]
      newColors.splice(index, 1)
      return { ...prev, colors: newColors }
    })
  }
  const logFormData = (formData: FormData) => {
    console.log('=== FormData Contents ===');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(key, `File: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)}MB)`);
      } else {
        console.log(key, value);
      }
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = ProductService.toFormData(formValues);
    logFormData(formData)
    for (let [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : value);
    }

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário")
      return
    }

    setLoading(true)

    try {
      await addProduct(formValues)
      toast.success("Produto criado com sucesso!")
      navigate("/profile?tab=products")
    } catch (error: any) {
      console.error("Error creating product:", error)

      let errorMessage = "Erro ao criar produto"
      if (error.message) {
        errorMessage = error.message

        // Trata erros específicos de campos
        if (error.message.toLowerCase().includes("nome")) {
          setFormErrors((prev) => ({ ...prev, name: error.message }))
        } else if (error.message.toLowerCase().includes("imagem")) {
          setFormErrors((prev) => ({ ...prev, image: error.message }))
        }
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 bg-gradient-to-b from-gray-50 to-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="max-w-4xl mx-auto shadow-sm border-0 overflow-hidden bg-white rounded-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-6">
            <CardTitle className="text-2xl font-light tracking-tight">Adicionar Novo Produto</CardTitle>
            <CardDescription>Preencha os detalhes do produto para adicioná-lo ao catálogo</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="w-full">
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
                <TabsContent value="basic" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
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
                          placeholder="Digite o nome do produto"
                          required
                        />
                        {formErrors.name && <p className="text-sm text-rose-500 mt-1">{formErrors.name}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                          Descrição
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formValues.description}
                          onChange={handleChange}
                          className="min-h-32 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                          placeholder="Descreva o produto em detalhes"
                          required
                          rows={4}
                        />
                        {formErrors.description && (
                          <p className="text-sm text-rose-500 mt-1">{formErrors.description}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              onChange={handleChange}
                              placeholder="0.00"
                              className="pl-8 h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                              required
                            />
                          </div>
                          {formErrors.price && <p className="text-sm text-rose-500 mt-1">{formErrors.price}</p>}
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
                              value={formValues.salePrice?.toString() || ""}
                              onChange={handleChange}
                              placeholder="0.00"
                              className="pl-8 h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            />
                          </div>
                          {formErrors.salePrice && <p className="text-sm text-rose-500 mt-1">{formErrors.salePrice}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="countInStock" className="text-sm font-medium">
                            Estoque Geral
                          </Label>
                          <Input
                            id="countInStock"
                            name="countInStock"
                            type="text"
                            value={formValues.countInStock}
                            onChange={handleChange}
                            className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            placeholder="Quantidade em estoque"
                            required
                          />
                          {formErrors.countInStock && (
                            <p className="text-sm text-rose-500 mt-1">{formErrors.countInStock}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-sm font-medium">
                            Categoria
                          </Label>
                          <Select value={formValues.category} onValueChange={handleCategoryChange} required>
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
                          {formErrors.category && <p className="text-sm text-rose-500 mt-1">{formErrors.category}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="collection" className="text-sm font-medium">
                          Coleção
                        </Label>
                        <Select value={formValues.collection || ""} onValueChange={handleCollectionChange}>
                          <SelectTrigger className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all">
                            <SelectValue placeholder="Selecione uma coleção (opcional)" />
                          </SelectTrigger>
                          <SelectContent>
                            {collections.map((collection) => (
                              <SelectItem key={collection} value={collection}>
                                {collection}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="images" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="image" className="text-sm font-medium">
                          Imagem Principal
                        </Label>
                        <div className="flex flex-col md:flex-row gap-4 items-start">
                          <div className="w-full md:w-1/2">
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                              <Input
                                id="image"
                                type="file"
                                accept={ALLOWED_FILE_TYPES.join(",")}
                                onChange={handleImageChange}
                                className="hidden"
                                required
                              />
                              <label
                                htmlFor="image"
                                className="cursor-pointer flex flex-col items-center justify-center gap-2"
                              >
                                <ImageIcon className="h-8 w-8 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  Clique para selecionar ou arraste a imagem principal
                                </span>
                                <span className="text-xs text-gray-400">JPEG, PNG ou WEBP (máx. 5MB)</span>
                              </label>
                            </div>
                            {formErrors.image && <p className="text-sm text-rose-500 mt-1">{formErrors.image}</p>}
                          </div>

                          {formValues.image && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="w-full md:w-1/2 aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                            >
                              <img
                                src={
                                  formValues.image instanceof File
                                    ? URL.createObjectURL(formValues.image)
                                    : formValues.image
                                }
                                alt="Preview"
                                className="w-full h-full object-contain"
                              />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label htmlFor="additionalImages" className="text-sm font-medium">
                          Imagens Adicionais
                        </Label>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                          <Input
                            id="additionalImages"
                            type="file"
                            accept={ALLOWED_FILE_TYPES.join(",")}
                            onChange={handleAdditionalImagesChange}
                            className="hidden"
                            multiple
                            disabled={loading}
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
                        {formValues.additionalImages && formValues.additionalImages.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                              <AnimatePresence>
                                {formValues.additionalImages.map((img, index) => (
                                  <motion.div
                                    key={index}
                                    className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <img
                                      src={formValues.image instanceof File ? URL.createObjectURL(formValues.image) : formValues.image || ''}
                                      alt={`Imagem adicional ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-transparent flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          // Revoke object URL when removing to prevent memory leaks
                                          if (typeof img === 'string' && img.startsWith('blob:')) {
                                            URL.revokeObjectURL(img);
                                          }
                                          removeAdditionalImage(index);
                                        }}
                                        className="bg-white text-rose-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </div>
                                  </motion.div>
                                ))}
                              </AnimatePresence>
                            </div>
                          )}
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
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Características do Produto</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            placeholder="Adicione uma característica"
                            className="h-11 rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50 transition-all"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addFeature()
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addFeature}
                            className="h-11 px-4 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <AnimatePresence>
                          {formValues.features && formValues.features.length > 0 && (
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
                                    onClick={() => removeFeature(index)}
                                    className="ml-1 text-gray-400 hover:text-rose-500 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </motion.div>
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
                      <div className="flex items-center gap-2">
                        <Ruler className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium">Tamanhos</h3>
                      </div>

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
                          onClick={addSize}
                          className="w-full h-10 mt-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Tamanho
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.sizes && formValues.sizes.length > 0 && (
                          <motion.div
                            className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="text-sm font-medium text-gray-700">Tamanhos Adicionados</h4>
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
                                    onChange={(e) => updateSize(index, "size", e.target.value)}
                                    className="h-10 rounded-lg border-gray-200"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min="0"
                                    value={size.stock}
                                    onChange={(e) => updateSize(index, "stock", Number.parseInt(e.target.value) || 0)}
                                    className="h-10 rounded-lg border-gray-200"
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => removeSize(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Cores */}
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5 text-gray-500" />
                        <h3 className="text-lg font-medium">Cores</h3>
                      </div>

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
                              <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                <ColorPicker
                                  value={newColor.colorCode}
                                  onChange={(color) => setNewColor({ ...newColor, colorCode: color })}
                                />
                              </div>
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
                          onClick={addColor}
                          className="w-full h-10 mt-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Cor
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.colors && formValues.colors.length > 0 && (
                          <motion.div
                            className="space-y-3 mt-4 bg-gray-50 p-4 rounded-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h4 className="text-sm font-medium text-gray-700">Cores Adicionadas</h4>
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
                                    onChange={(e) => updateColor(index, "colorName", e.target.value)}
                                    className="h-10 rounded-lg border-gray-200"
                                  />
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                                    <ColorPicker
                                      value={color.colorCode}
                                      onChange={(value) => updateColor(index, "colorCode", value)}
                                    />
                                  </div>
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
                                    onChange={(e) => updateColor(index, "stock", Number.parseInt(e.target.value) || 0)}
                                    className="h-10 rounded-lg border-gray-200"
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => removeColor(index)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
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
                onClick={() => navigate("/profile")}
                disabled={loading}
                className="h-11 px-6 rounded-lg border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-11 px-8 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors"
              >
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Salvando...
                  </>
                ) : (
                  "Adicionar Produto"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}

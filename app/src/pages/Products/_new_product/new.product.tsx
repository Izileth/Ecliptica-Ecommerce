import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductService } from '~/src/services/produtcService'
import { toast } from 'sonner'
import type { ProductFormValues } from '~/src/services/type'

// Components from shadcn/ui
import { Button } from '~/src/components/imported/button'
import { Input } from '~/src/components/imported/input'
import { Label } from '~/src/components/imported/label'
import { Textarea } from '~/src/components/imported/textarea'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/src/components/imported/select'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']

export default function NewProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: '',
    description: '',
    price: '', // Agora como string
    category: '',
    countInStock: '', // Agora como string
    image: null
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const categories = [
    'Camisetas',
    'Calças',
    'Vestidos',
    'Sapatos',
    'Acessórios'
  ]

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formValues.name.trim()) errors.name = 'Nome é obrigatório'
    if (!formValues.description.trim()) errors.description = 'Descrição é obrigatória'
    
    // Validação de preço
    const priceValue = parseFloat(formValues.price)
    if (isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Preço inválido'
    }
    
    // Validação de estoque
    const stockValue = parseInt(formValues.countInStock)
    if (isNaN(stockValue) || stockValue < 0) {
      errors.countInStock = 'Quantidade inválida'
    }
    
    if (!formValues.category) errors.category = 'Selecione uma categoria'
    
    // Validação da imagem
    if (!formValues.image) {
      errors.image = 'Imagem é obrigatória'
    } else {
      if (!ALLOWED_FILE_TYPES.includes(formValues.image.type)) {
        errors.image = 'Apenas imagens JPEG, PNG ou SVG são permitidas'
      }
      if (formValues.image.size > MAX_FILE_SIZE) {
        errors.image = 'Imagem muito grande (máx. 5MB)'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    if (name === 'price' || name === 'countInStock') {
      // Permite apenas números e ponto decimal para preço
      const cleanedValue = value.replace(/[^0-9.]/g, '')
      
      // Para preço, garante no máximo 2 casas decimais
      if (name === 'price') {
        const parts = cleanedValue.split('.')
        if (parts.length > 1 && parts[1].length > 2) {
          return // Não atualiza se tiver mais de 2 casas decimais
        }
      }
      
      setFormValues(prev => ({
        ...prev,
        [name]: cleanedValue
      }))
    } else {
      setFormValues(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    // Limpa erro ao modificar
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormValues(prev => ({
        ...prev,
        image: file
      }))
      setFormErrors(prev => ({ ...prev, image: '' }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      category: value
    }))
    if (formErrors.category) {
      setFormErrors(prev => ({ ...prev, category: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      // Converte os valores string para números antes de enviar
      const productData: ProductFormValues = {
        name: formValues.name,
        description: formValues.description,
        price: parseFloat(formValues.price) as unknown as string, // conversão de tipo
        countInStock: parseInt(formValues.countInStock) as unknown as string, // conversão de tipo
        category: formValues.category,
        image: formValues.image
      }

      // Usa o método create do ProductService
      await ProductService.create(ProductService.toFormData(productData))
      
      toast.success('Produto criado com sucesso!')
      navigate('/profile?tab=products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      const errorMessage = error.response?.data?.message || 'Erro ao criar produto'
      toast.error(errorMessage)
      
      // Tratamento específico para erros de imagem
      if (error.response?.data?.error?.includes('imagem')) {
        setFormErrors(prev => ({ ...prev, image: errorMessage }))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Adicionar Novo Produto</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
              {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                required
                rows={4}
              />
              {formErrors.description && <p className="text-sm text-red-500">{formErrors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Preço *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">R$</span>
                  <Input
                    id="price"
                    name="price"
                    type="text"
                    value={formValues.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-8"
                    required
                  />
                </div>
                {formErrors.price && (
                  <p className="text-sm text-red-500">{formErrors.price}</p>
                )}
                {formValues.price && !formErrors.price && (
                  <p className="text-sm text-muted-foreground">
                    Valor enviado: R$ {parseFloat(formValues.price).toFixed(2)}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="countInStock">Quantidade em Estoque *</Label>
                <Input
                  id="countInStock"
                  name="countInStock"
                  type="text"
                  value={formValues.countInStock}
                  onChange={handleChange}
                  required
                />
                {formErrors.countInStock && (
                  <p className="text-sm text-red-500">{formErrors.countInStock}</p>
                )}
                {formValues.countInStock && !formErrors.countInStock && (
                  <p className="text-sm text-muted-foreground">
                    Quantidade enviada: {parseInt(formValues.countInStock)}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formValues.category}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.category && <p className="text-sm text-red-500">{formErrors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Imagem do Produto *</Label>
              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/svg+xml"
                onChange={handleImageChange}
                required
              />
              {formValues.image && (
                <div className="mt-2">
                  <img 
                    src={URL.createObjectURL(formValues.image)} 
                    alt="Preview" 
                    className="h-40 object-cover rounded"
                  />
                </div>
              )}
              {formErrors.image && <p className="text-sm text-red-500">{formErrors.image}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/profile')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Adicionar Produto'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
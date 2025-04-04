import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProductService } from '~/src/services/produtcService'
import { toast } from 'sonner'
import type { ProductFormValues } from '~/src/services/type'
import { useProducts } from '~/src/hooks/useStorage'

// Components
import { Button } from '~/src/components/imported/button'
import { Input } from '~/src/components/imported/input'
import { Label } from '~/src/components/imported/label'
import { Textarea } from '~/src/components/imported/textarea'
import { Spinner } from '~/src/components/ui/Spinner/spinner'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/src/components/imported/select'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml']

export default function NewProductPage() {
  const navigate = useNavigate()
  const { addProduct } = useProducts()
  const [loading, setLoading] = useState(false)
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
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
    if (formValues.name.length > 100) errors.name = 'Nome muito longo (máx. 100 caracteres)'
    
    if (!formValues.description.trim()) errors.description = 'Descrição é obrigatória'
    
    const priceValue = parseFloat(formValues.price)
    if (isNaN(priceValue)) {
      errors.price = 'Preço deve ser um número'
    } else if (priceValue <= 0) {
      errors.price = 'Preço deve ser maior que zero'
    }
    
    const stockValue = parseInt(formValues.countInStock)
    if (isNaN(stockValue)) {
      errors.countInStock = 'Estoque deve ser um número'
    } else if (stockValue < 0) {
      errors.countInStock = 'Estoque não pode ser negativo'
    }
    
    if (!formValues.category) errors.category = 'Selecione uma categoria'
    
    if (!formValues.image) {
      errors.image = 'Imagem é obrigatória'
    } else if (formValues.image instanceof File) {
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
    
    if (name === 'price') {
      // Permite apenas números e ponto decimal
      const cleanedValue = value.replace(/[^0-9.]/g, '')
      const parts = cleanedValue.split('.')
      
      // Garante no máximo 2 casas decimais
      if (parts.length > 1 && parts[1].length > 2) {
        return
      }
      
      setFormValues(prev => ({
        ...prev,
        [name]: cleanedValue
      }))
    } else if (name === 'countInStock') {
      // Permite apenas números inteiros
      const cleanedValue = value.replace(/[^0-9]/g, '')
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
      
      // Verificação adicional do tipo
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, image: 'Tipo de arquivo não permitido' }));
        return;
      }
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

      // Verificação adicional da imagem
    if (!formValues.image || !(formValues.image instanceof File)) {
      toast.error('Selecione uma imagem válida');
      return;
    }
      
    setLoading(true)
    
    try {
      await addProduct(formValues)
      
      toast.success('Produto criado com sucesso!')
      navigate('/profile?tab=products')
    } catch (error: any) {
      console.error('Error creating product:', error)
      
      let errorMessage = 'Erro ao criar produto'
      if (error.message.includes('imagem')) {
        errorMessage = 'Erro ao processar imagem'
        setFormErrors(prev => ({ ...prev, image: errorMessage }))
      } else if (error.message.includes('nome')) {
        errorMessage = 'Já existe um produto com este nome'
        setFormErrors(prev => ({ ...prev, name: errorMessage }))
      }
      
      toast.error(errorMessage)
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
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                <Spinner 
                  size="lg" 
                  color="destructive" 
                  variant="dots" 
                  className="my-4"
                  />
                  Salvando...
                </>
              ) : 'Adicionar Produto'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductService } from '~/src/services/produtcService';
import { toast } from 'sonner';
import type { Product, ProductFormValues } from '~/src/services/type';

// Components from shadcn/ui
import { Button } from '~/src/components/imported/button';
import { Input } from '~/src/components/imported/input';
import { Label } from '~/src/components/imported/label';
import { Textarea } from '~/src/components/imported/textarea';
import { Skeleton } from '~/src/components/imported/skeleton';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '~/src/components/imported/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/src/components/imported/select';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/svg+xml'] as const;

type ProductCategory = 'Camisetas' | 'Calças' | 'Vestidos' | 'Sapatos' | 'Acessórios';

type ProductFormErrors = {
    [K in keyof ProductFormValues]?: string;
};

type FullFormErrors = Record<keyof ProductFormValues, string>;
type PartialFormErrors = Partial<FullFormErrors>;

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState({
        page: true,
        submit: false
    });
    const [formValues, setFormValues] = useState<ProductFormValues>({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: null
    });
    const [currentImage, setCurrentImage] = useState<string>('');
    const [changedFields, setChangedFields] = useState<Set<keyof ProductFormValues>>(new Set());
    const [imageChanged, setImageChanged] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<ProductFormErrors>({
        name: '',
        description: '',
        price: '',
        category: '',
        countInStock: '',
        image: ''
    });

    const categories: ProductCategory[] = [
        'Camisetas',
        'Calças',
        'Vestidos',
        'Sapatos',
        'Acessórios'
    ];

    // Carrega os dados do produto
    // Carrega os dados do produto
    useEffect(() => {
        const loadProduct = async () => {
            try {
                if (!id) throw new Error('ID do produto não fornecido');
                
                const product = await ProductService.getById(id);
                console.log("Produto recebido:", product);
                
                // Verificação melhorada
                if (!product) {
                    throw new Error('Produto não encontrado');
                }
                
                // Os valores price e countInStock são números válidos,
                // não precisamos verificar se são undefined
                setFormValues({
                    name: product.name || '',
                    description: product.description || '',
                    price: product.price !== undefined ? product.price.toString() : '',
                    category: product.category || categories[0],
                    countInStock: product.countInStock !== undefined ? product.countInStock.toString() : '',
                    image: null
                });
                
                if (product.image) {
                    setCurrentImage(product.image);
                }
                
            } catch (error) {
                console.error('Error loading product:', error);
                toast.error('Falha ao carregar os dados do produto');
                navigate('/profile?tab=products', { replace: true });
            } finally {
                setLoading(prev => ({ ...prev, page: false }));
            }
        };
        loadProduct();
    }, [id, navigate]);

    const validateForm = (): boolean => {
        const errors: ProductFormErrors = {}; // Use ProductFormErrors aqui
        
        if (!formValues.name.trim()) errors.name = 'Nome é obrigatório';
        if (!formValues.description.trim()) errors.description = 'Descrição é obrigatória';
        
        // Validação de preço
        const priceValue = parseFloat(formValues.price);
        if (isNaN(priceValue)) {
            errors.price = 'Preço inválido';
        } else if (priceValue <= 0) {
            errors.price = 'Preço deve ser maior que zero';
        }
        
        // Validação de estoque
        const stockValue = parseInt(formValues.countInStock);
        if (isNaN(stockValue)) {
            errors.countInStock = 'Quantidade inválida';
        } else if (stockValue < 0) {
            errors.countInStock = 'Estoque não pode ser negativo';
        }
        
        if (!formValues.category) errors.category = 'Selecione uma categoria';
        
        // Validação da imagem se foi alterada
        if (imageChanged && formValues.image) {
            if (!ALLOWED_FILE_TYPES.includes(formValues.image.type as typeof ALLOWED_FILE_TYPES[number])) {
                errors.image = 'Apenas imagens JPEG, PNG ou SVG são permitidas';
            } else if (formValues.image.size > MAX_FILE_SIZE) {
                errors.image = 'Imagem muito grande (máx. 5MB)';
            }
        }
     
        setFormErrors(errors); // Agora isso vai funcionar
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as { name: keyof ProductFormValues; value: string };
        
        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Adiciona o campo à lista de campos alterados
        setChangedFields(prev => new Set(prev).add(name));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target as { name: 'price' | 'countInStock'; value: string };
        
        // Lógica de limpeza de valores (mantenha isso como está)
        if (name === 'price') {
            const cleanedValue = value.replace(/[^0-9.]/g, '');
            const parts = cleanedValue.split('.');
            if (parts.length > 1 && parts[1].length > 2) {
                return;
            }
            
            setFormValues(prev => ({
                ...prev,
                [name]: cleanedValue
            }));
        } else if (name === 'countInStock') {
            const cleanedValue = value.replace(/[^0-9]/g, '');
            setFormValues(prev => ({
                ...prev,
                [name]: cleanedValue
            }));
        }
        
        // Adiciona o campo à lista de campos alterados
        setChangedFields(prev => new Set(prev).add(name));
        
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormValues(prev => ({
                ...prev,
                image: file
            }));
            setImageChanged(true);
            setFormErrors(prev => ({ ...prev, image: '' }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setLoading(prev => ({ ...prev, submit: true }));
    
        try {
            if (!id) throw new Error('ID do produto não fornecido');
            
            // Cria um FormData apenas com os campos alterados
            const formData = new FormData();
            
            // Adiciona apenas os campos que foram alterados
            if (changedFields.has('name')) formData.append('name', formValues.name);
            if (changedFields.has('description')) formData.append('description', formValues.description);
            if (changedFields.has('price')) formData.append('price', formValues.price);
            if (changedFields.has('countInStock')) formData.append('countInStock', formValues.countInStock);
            if (changedFields.has('category')) formData.append('category', formValues.category);
            
            // Adiciona a imagem apenas se foi alterada
            if (imageChanged && formValues.image) {
                formData.append('image', formValues.image);
            }
    
            // Verifica se há pelo menos um campo para atualizar
            if ([...formData.keys()].length === 0 && !imageChanged) {
                toast.info('Nenhuma alteração detectada');
                setLoading(prev => ({ ...prev, submit: false }));
                return;
            }
    
            // Atualiza o produto usando o serviço
            await ProductService.update(id, formData);
            
            toast.success('Produto atualizado com sucesso!');
            navigate('/profile?tab=products');
        } catch (error: any) {
            console.error('Error updating product:', error);
            const errorMessage = error.response?.data?.message || 'Erro ao atualizar produto';
            toast.error(errorMessage);
            
            // Tratamento específico para erros de imagem
            if (error.response?.data?.error?.includes('imagem')) {
                setFormErrors(prev => ({ ...prev, image: errorMessage }));
            }
        } finally {
            setLoading(prev => ({ ...prev, submit: false }));
        }
    };

    if (loading.page) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-1/4" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 mt-16">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Editar Produto</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Nome do Produto */}
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

                        {/* Descrição */}
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

                        {/* Preço e Estoque */}
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
                                        onChange={handleNumberChange}
                                        placeholder="0.00"
                                        className="pl-8"
                                        required
                                    />
                                </div>
                                {formErrors.price ? (
                                    <p className="text-sm text-red-500">{formErrors.price}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Valor enviado: R$ {parseFloat(formValues.price || '0').toFixed(2)}
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
                                    onChange={handleNumberChange}
                                    required
                                />
                                {formErrors.countInStock ? (
                                    <p className="text-sm text-red-500">{formErrors.countInStock}</p>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Quantidade enviada: {parseInt(formValues.countInStock || '0')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Categoria */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria *</Label>
                            <Select
                                value={formValues.category}
                                onValueChange={(value: string) => setFormValues(prev => ({ 
                                    ...prev, 
                                    category: value as ProductCategory 
                                }))}
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

                        {/* Imagem */}
                        <div className="space-y-2">
                            <Label htmlFor="image">Imagem do Produto</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/jpeg,image/png,image/svg+xml"
                                onChange={handleImageChange}
                            />
                            {formErrors.image && <p className="text-sm text-red-500">{formErrors.image}</p>}
                            
                            <div className="flex gap-4 mt-2">
                                {currentImage && !imageChanged && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Imagem atual:</p>
                                        <img 
                                            src={currentImage} 
                                            alt="Imagem atual" 
                                            className="h-40 object-cover rounded"
                                        />
                                    </div>
                                )}
                                {formValues.image && imageChanged && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Nova imagem:</p>
                                        <img 
                                            src={URL.createObjectURL(formValues.image)} 
                                            alt="Preview" 
                                            className="h-40 object-cover rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => navigate('/profile?tab=products')}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading.submit}>
                            {loading.submit ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
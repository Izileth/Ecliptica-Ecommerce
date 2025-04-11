import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ProductService } from "~/src/services/produtcService";
import type { ProductFormValues, ProductSize, ProductColor } from "~/src/services/type";

// Components
import { Button } from "~/src/components/imported/button";
import { Input } from "~/src/components/imported/input";
import { Label } from "~/src/components/imported/label";
import { Textarea } from "~/src/components/imported/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "~/src/components/imported/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/src/components/imported/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/src/components/imported/tabs";
import { Plus, Trash2, X, Info, ImageIcon, Tag, Palette, Save, ArrowLeft, AlertCircle } from "lucide-react";
import { Badge } from "~/src/components/imported/badge";
import { ScrollArea } from "~/src/components/imported/scroll-area";
import { Alert, AlertDescription } from "~/src/components/imported/alert";

type ProductCategory = "Camisetas" | "Calças" | "Vestidos" | "Acessórios";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ProductImagePreview = ({ src, onRemove, isNew }: {
  src: string;
  onRemove?: () => void;
  isNew?: boolean;
}) => {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
      <img
        src={src || 'https://via.placeholder.com/300x300?text=Sem+Imagem'}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/300x300?text=Imagem+Removida';
        }}
      />
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 bg-white text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      {isNew && (
        <Badge className="absolute top-2 left-2 bg-green-50 text-green-700 font-normal">
          Nova
        </Badge>
      )}
    </div>
  );
};

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estados principais
  const [loading, setLoading] = useState({ page: true, submit: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState("basic");
  
  // Estado do formulário
  const [formValues, setFormValues] = useState<ProductFormValues>({
    name: "",
    description: "",
    price: "",
    category: "",
    countInStock: "",
    image: null, // Inicializado como null
    salePrice: "",
    collection: "",
    features: [], // Array vazio em vez de undefined
    sizes: [], // Array vazio em vez de undefined
    colors: [], // Array vazio em vez de undefined
  });

  // Estado das imagens

  const [images, setImages] = useState({
    main: {
      current: "", // URL da imagem atual
      new: null as File | null, // Nova imagem
      newUrl: "" // URL da nova imagem
    },
    additional: {
      current: [] as string[], // URLs das imagens atuais
      new: [] as { file: File; url: string }[], // Novas imagens com suas URLs
      removed: [] as string[] // URLs das imagens removidas
    }
  });
  

  // Estados para novos itens
  const [newFeature, setNewFeature] = useState("");
  const [newSize, setNewSize] = useState<Omit<ProductSize, "id">>({ size: "", stock: 0 });
  const [newColor, setNewColor] = useState<Omit<ProductColor, "id">>({
    colorName: "",
    colorCode: "#000000",
    stock: 0,
  });

  const categories: ProductCategory[] = ["Camisetas", "Calças", "Vestidos", "Acessórios"];
  const collections = ["Coleção Verão", "Coleção Inverno", "Lançamentos", "Promoções", "Edição Limitada"];

  // Carrega os dados do produto
  const loadProduct = useCallback(async () => {
    try {
      if (!id) throw new Error("ID do produto não fornecido");

      const product = await ProductService.getById(id);
      if (!product) throw new Error("Produto não encontrado");

      setFormValues({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        countInStock: product.countInStock.toString(),
        image: product.image, // URL da imagem existente
        salePrice: product.salePrice?.toString() || "",
        collection: product.collection || "",
        features: product.features || [], // Garante array mesmo se undefined
        sizes: product.sizes || [], // Garante array mesmo se undefined
        colors: product.colors || [], // Garante array mesmo se undefined
      });

      setImages({
        main: {
          current: product.image,
          new: null,
          newUrl: product.image,
        },
        additional: {
          current: product.images?.map(img => img.url) || [],
          new: [],
          removed: []
        }
      });

    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Falha ao carregar os dados do produto");
      navigate("/profile?tab=products", { replace: true });
    } finally {
      setLoading(prev => ({ ...prev, page: false }));
    }
  }, [id, navigate]);

  // Efeito para carregar o produto
  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  // Limpeza de URLs temporárias
  useEffect(() => {
    return () => {
      // Limpar URL da imagem principal
      if (images.main.newUrl) {
        URL.revokeObjectURL(images.main.newUrl);
      }
      
      // Limpar URLs das imagens adicionais
      images.additional.new.forEach(item => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, []);  // Dependência vazia para executar apenas na desmontagem

  // Validação do formulário
  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    if (!formValues.name.trim()) errors.name = "Nome é obrigatório";
    if (!formValues.description.trim()) errors.description = "Descrição é obrigatória";

    const price = parseFloat(formValues.price);
    if (isNaN(price)) errors.price = "Preço inválido";
    else if (price <= 0) errors.price = "Preço deve ser maior que zero";

    const stock = parseInt(formValues.countInStock);
    if (isNaN(stock)) errors.countInStock = "Estoque inválido";
    else if (stock < 0) errors.countInStock = "Estoque não pode ser negativo";

    if (!formValues.category) errors.category = "Selecione uma categoria";

    if (formValues.salePrice) {
      const salePrice = parseFloat(formValues.salePrice);
      if (isNaN(salePrice)) errors.salePrice = "Preço promocional inválido";
      else if (salePrice >= price) errors.salePrice = "Preço promocional deve ser menor que o normal";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formValues]);

  // Manipuladores de campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let cleanedValue = value;
    if (name === "price" || name === "salePrice") {
      cleanedValue = value.replace(/[^0-9.]/g, "");
      const parts = cleanedValue.split(".");
      if (parts.length > 1 && parts[1].length > 2) return;
    } else if (name === "countInStock") {
      cleanedValue = value.replace(/[^0-9]/g, "");
    }

    setFormValues(prev => ({ ...prev, [name]: cleanedValue }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: "" }));
  };

  // Manipuladores de imagens
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFormErrors(prev => ({ ...prev, image: "Tipo de arquivo não suportado" }));
        return;
      }
      
      if (file.size > MAX_FILE_SIZE) {
        setFormErrors(prev => ({ ...prev, image: "Arquivo muito grande (máx. 5MB)" }));
        return;
      }
  
      // Revogar URL anterior se existir
      if (images.main.newUrl) {
        URL.revokeObjectURL(images.main.newUrl);
      }
  
      const newUrl = URL.createObjectURL(file);
      
      setImages(prev => ({
        ...prev,
        main: { 
          ...prev.main, 
          new: file,
          newUrl: newUrl
        }
      }));
      setFormErrors(prev => ({ ...prev, image: "" }));
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter(file => {
        const isValidType = ALLOWED_FILE_TYPES.includes(file.type);
        const isValidSize = file.size <= MAX_FILE_SIZE;
        
        if (!isValidType) {
          toast.error(`Arquivo "${file.name}": Tipo não suportado`);
        }
        if (!isValidSize) {
          toast.error(`Arquivo "${file.name}": Tamanho excede 5MB`);
        }
        
        return isValidType && isValidSize;
      });
  
      const newFilesWithUrls = filesArray.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
  
      setImages(prev => ({
        ...prev,
        additional: {
          ...prev.additional,
          new: [...prev.additional.new, ...newFilesWithUrls]
        }
      }));
    }
  };

  const removeAdditionalImage = (index: number) => {
    setImages(prev => {
      if (index < prev.additional.current.length) {
        // Imagem existente
        const imageToRemove = prev.additional.current[index];
        return {
          ...prev,
          additional: {
            current: prev.additional.current.filter((_, i) => i !== index),
            new: prev.additional.new,
            removed: [...prev.additional.removed, imageToRemove]
          }
        };
      } else {
        // Imagem nova
        const newIndex = index - prev.additional.current.length;
        
        // Verificar se o índice é válido
        if (newIndex >= 0 && newIndex < prev.additional.new.length) {
          // Revogar URL do objeto antes de removê-lo
          URL.revokeObjectURL(prev.additional.new[newIndex].url);
          
          return {
            ...prev,
            additional: {
              current: prev.additional.current,
              new: prev.additional.new.filter((_, i) => i !== newIndex),
              removed: prev.additional.removed
            }
          };
        }
        
        return prev; // Retorna o estado inalterado se o índice for inválido
      }
    });
  };

  // Manipuladores de características
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormValues(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormValues(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Manipuladores de tamanhos
  const addSize = () => {
    if (newSize.size.trim()) {
      setFormValues(prev => ({
        ...prev,
        sizes: [...prev.sizes, { ...newSize }]
      }));
      setNewSize({ size: "", stock: 0 });
    }
  };

  const updateSize = (index: number, field: keyof ProductSize, value: string | number) => {
    setFormValues(prev => {
      const newSizes = [...prev.sizes];
      newSizes[index] = {
        ...newSizes[index],
        [field]: field === "stock" ? Number(value) : value
      };
      return { ...prev, sizes: newSizes };
    });
  };

  const removeSize = (index: number) => {
    setFormValues(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  // Manipuladores de cores
  const addColor = () => {
    if (newColor.colorName.trim()) {
      setFormValues(prev => ({
        ...prev,
        colors: [...prev.colors, { ...newColor }]
      }));
      setNewColor({ colorName: "", colorCode: "#000000", stock: 0 });
    }
  };

  const updateColor = (index: number, field: keyof ProductColor, value: string) => {
    setFormValues(prev => {
      const newColors = [...prev.colors];
      newColors[index] = {
        ...newColors[index],
        [field]: field === "stock" ? Number(value) : value
      };
      return { ...prev, colors: newColors };
    });
  };

  const removeColor = (index: number) => {
    setFormValues(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };
  
  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    setLoading(prev => ({ ...prev, submit: true }));

    try {
      if (!id) throw new Error("ID do produto não fornecido");

      const formData = ProductService.toFormData({
        ...formValues,
      });

      // Adicionar imagens ao FormData
      if (images.main.new) {
        formData.append("image", images.main.new);
      }

      images.additional.new.forEach(item => {
        formData.append("additionalImages", item.file);
      });

      images.additional.removed.forEach(url => {
        formData.append("removedImages", url);
      });

      await ProductService.update(id, formData);
      toast.success("Produto atualizado com sucesso!");
      navigate("/profile?tab=products");
    } catch (error: any) {
      console.error("Error updating product:", error);
      
      let errorMessage = "Erro ao atualizar produto";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // Trata erros específicos de campos
        if (error.response.data.errors) {
          const newErrors: Record<string, string> = {};
          Object.entries(error.response.data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages[0]) {
              newErrors[field] = messages[0];
            }
          });
          setFormErrors(newErrors);
        }
      }

      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };


  // Verificação de mudanças
  const hasChanges = useMemo(() => {
    return (
      images.main.new !== null ||
      images.additional.new.length > 0 ||
      images.additional.removed.length > 0 ||
      Object.keys(formValues).some(key => {
        const initialValue = formValues[key as keyof ProductFormValues];
        // Verificar se houve mudança em relação ao valor inicial
        // (implementação simplificada - você pode querer comparar com os valores originais)
        return initialValue !== "" && initialValue !== null && initialValue !== undefined;
      })
    );
  }, [images, formValues]);

  if (loading.page) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16">
        <Card className="max-w-4xl mx-auto border-0 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="pb-4 border-b border-gray-100">
            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 mt-2 bg-gray-200 rounded animate-pulse" />
          </CardHeader>
          <div className="px-6 py-4">
            <div className="h-10 w-full max-w-md mx-auto mb-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <CardContent className="space-y-6 px-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </CardFooter>
        </Card>
      </div>
    );
  }

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
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
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
                        <Label htmlFor="category">Categoria</Label>
                        <Select
                          value={formValues.category}
                          onValueChange={(value) => {
                            setFormValues(prev => ({ ...prev, category: value }));
                          }}
                          required
                        >
                          <SelectTrigger>
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
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formValues.description}
                        onChange={handleChange}
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
                        <Label htmlFor="price">Preço</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">R$</span>
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
                        {formErrors.price && (
                          <p className="text-sm text-rose-500 mt-1 flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {formErrors.price}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="salePrice">Preço Promocional</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">R$</span>
                          <Input
                            id="salePrice"
                            name="salePrice"
                            type="text"
                            value={formValues.salePrice || ""}
                            onChange={handleNumberChange}
                            placeholder="0.00"
                            className="pl-8"
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
                        <Label htmlFor="countInStock">Estoque Total</Label>
                        <Input
                          id="countInStock"
                          name="countInStock"
                          type="text"
                          value={formValues.countInStock}
                          onChange={handleNumberChange}
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
                      <Label htmlFor="collection">Coleção</Label>
                      <Input
                        id="collection"
                        name="collection"
                        value={formValues.collection || ""}
                        onChange={handleChange}
                        placeholder="Ex: Verão 2023"
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
                              id="mainImage"
                              type="file"
                              accept={ALLOWED_FILE_TYPES.join(",")}
                              onChange={handleMainImageChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="mainImage"
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

                        <div className="w-full md:w-1/2 aspect-square">
                          <AnimatePresence mode="wait">
                            {images.main.new ? (
                              <motion.div
                                key="new"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full"
                              >
                                <ProductImagePreview
                                  src={images.main.newUrl}
                                  isNew
                                />
                              </motion.div>
                            ) : images.main.current ? (
                              <motion.div
                                key="current"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="h-full"
                              >
                                <ProductImagePreview src={images.main.current} />
                              </motion.div>
                            ) : (
                              <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-gray-400" />
                              </div>
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
                            accept={ALLOWED_FILE_TYPES.join(",")}
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

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                        <AnimatePresence>
                          {/* Imagens existentes */}
                          {images.additional.current.map((img, index) => (
                            <motion.div
                              key={`current-${img}-${index}`} // Use a URL da imagem na chave
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ProductImagePreview
                                src={img}
                                onRemove={() => removeAdditionalImage(index)}
                              />
                            </motion.div>
                          ))}


                          {/* Novas imagens */}
                          {images.additional.new.map((item, index) => (
                            <motion.div
                              key={`new-${item.file.name}-${index}`} // Use o nome do arquivo na chave
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                            >
                                <ProductImagePreview
                                  src={item.url}  // Use a URL pré-gerada
                                  onRemove={() => removeAdditionalImage(images.additional.current.length + index)}
                                  isNew
                                />
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
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addFeature();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={addFeature}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <AnimatePresence>
                          {formValues.features.length > 0 ? (
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
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Estoque"
                              min="0"
                              value={newSize.stock}
                              onChange={(e) => setNewSize({ ...newSize, stock: Number(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={addSize}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Tamanho
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.sizes.length > 0 ? (
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
                                        onChange={(e) => updateSize(index, "size", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="number"
                                        min="0"
                                        value={size.stock}
                                        onChange={(e) => updateSize(index, "stock", e.target.value)}
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeSize(index)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-rose-500 hover:bg-rose-50"
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
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 h-11">
                              <Input
                                type="color"
                                value={newColor.colorCode}
                                onChange={(e) => setNewColor({ ...newColor, colorCode: e.target.value })}
                                className="h-11 w-11 p-1"
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
                                setNewColor({ ...newColor, stock: Number(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={addColor}
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Cor
                        </Button>
                      </div>

                      <AnimatePresence>
                        {formValues.colors.length > 0 ? (
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
                                        onChange={(e) => updateColor(index, "colorName", e.target.value)}
                                      />
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Input
                                        type="color"
                                        value={color.colorCode}
                                        onChange={(e) => updateColor(index, "colorCode", e.target.value)}
                                        className="h-10 w-10 p-1"
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
                                        onChange={(e) => updateColor(index, "stock", e.target.value)}
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => removeColor(index)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-gray-400 hover:text-rose-500 hover:bg-rose-50"
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
                className="border-gray-300 hover:bg-gray-100 flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <Button
                type="submit"
                disabled={loading.submit || !hasChanges}
                className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
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
  );
}
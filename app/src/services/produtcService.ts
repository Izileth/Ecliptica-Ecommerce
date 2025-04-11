// src/services/productService.ts
import api from './api';
import type {
  Product,
  ProductFormValues,
  ProductFilterApiParams,
  PaginatedResponse
} from './type';

export const ProductService = {
  /**
   * Busca todos os produtos com filtros
   */
  getAll: async (filters?: ProductFilterApiParams): Promise<PaginatedResponse> => {
    try {
      // Normaliza parâmetros booleanos para strings 'true'/'false'
      const normalizedFilters = filters ? {
        ...filters,
        inStock: filters.inStock ? 'true' : undefined,
        hasDiscount: filters.hasDiscount ? 'true' : undefined
      } : undefined;

      const response = await api.get('/products', { 
        params: normalizedFilters,
        paramsSerializer: { indexes: null } // Para arrays formatados corretamente
      });

      return {
        status: response.data.status || 'success',
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  /**
   * Busca produtos do usuário logado
   */
  getUserProducts: async (filters?: Omit<ProductFilterApiParams, 'hasDiscount' | 'collection'>): Promise<PaginatedResponse> => {
    const response = await api.get('/products/user/products', { 
      params: filters 
    });
    return response.data;
  },

  /**
   * Busca produto por ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  /**
   * Cria novo produto
   */
  create: async (formData: FormData): Promise<Product> => {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  /**
   * Atualiza produto existente
   */
  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.data;
  },

  /**
   * Remove produto
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  /**
   * Busca produtos por categoria
   */
  getByCategory: async (
    category: string, 
    filters?: Pick<ProductFilterApiParams, 'page' | 'limit' | 'sortBy' | 'sortOrder'>
  ): Promise<PaginatedResponse> => {
    const response = await api.get(`/products/category/${category}`, { 
      params: filters 
    });
    return response.data;
  },

   /**
   * Busca produtos por Coleção
   */
  getByCollection: async (
    collection: string, 
    page?: number, 
    limit?: number
  ): Promise<PaginatedResponse> => {
    const response = await api.get<PaginatedResponse>(
      `/products/collection/${encodeURIComponent(collection)}`, 
      {
        params: { 
          page, 
          limit,
          // Inclua outros parâmetros de filtro se necessário
        }
      }
    );
    return response.data;
  },
  
  // Opcional: Método para listar todas as coleções disponíveis
  getAllCollections: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/collections/all');
    return response.data;
  },

  /**
   * Converte ProductFormValues para FormData
   */
  toFormData: (values: ProductFormValues): FormData => {
    const formData = new FormData();

    // Campos básicos
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('category', values.category);
    formData.append('countInStock', values.countInStock);

    // Campos opcionais
    if (values.salePrice !== undefined) {
      formData.append('salePrice', values.salePrice || '');
    }
    
    if (values.collection) {
      formData.append('collection', values.collection);
    }

    // Imagem principal
    if (values.image instanceof File) {
      formData.append('image', values.image);
    } else if (typeof values.image === 'string' && values.image) {
      // Se for string (URL existente), não precisa enviar novamente
    }

    // Imagens adicionais
    if (values.additionalImages) {
      values.additionalImages.forEach((img, index) => {
        if (img instanceof File) {
          formData.append('additionalImages', img);
        }
        // URLs existentes são tratadas no backend
      });
    }

    // Imagens removidas
    if (values.removedImages && values.removedImages.length > 0) {
      formData.append('removedImages', JSON.stringify(values.removedImages));
    }

    // Features
    values.features.forEach((feature, index) => {
      formData.append(`features[${index}]`, feature);
    });

    // Tamanhos
    values.sizes.forEach((size, index) => {
      formData.append(`sizes[${index}][size]`, size.size);
      formData.append(`sizes[${index}][stock]`, String(size.stock));
      if (size.id) {
        formData.append(`sizes[${index}][id]`, size.id);
      }
    });

    // Cores
    values.colors.forEach((color, index) => {
      formData.append(`colors[${index}][colorName]`, color.colorName);
      formData.append(`colors[${index}][colorCode]`, color.colorCode);
      formData.append(`colors[${index}][stock]`, String(color.stock));
      if (color.imageUrl) {
        formData.append(`colors[${index}][imageUrl]`, color.imageUrl);
      }
      if (color.id) {
        formData.append(`colors[${index}][id]`, color.id);
      }
    });

    return formData;
  },

  /**
   * Prepara dados iniciais para o formulário
   */
  getInitialFormValues: (product?: Product): ProductFormValues => ({
    id: product?.id,
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '0',
    category: product?.category || '',
    countInStock: product?.countInStock.toString() || '0',
    image: product?.image || null,
    additionalImages: product?.images || [],
    salePrice: product?.salePrice?.toString() || null,
    collection: product?.collection || null,
    features: product?.features || [],
    sizes: product?.sizes?.map(size => ({
      size: size.size,
      stock: size.stock,
      id: size.id
    })) || [],
    colors: product?.colors?.map(color => ({
      colorName: color.colorName,
      colorCode: color.colorCode,
      stock: color.stock,
      imageUrl: color.imageUrl || null,
      id: color.id
    })) || [],
    removedImages: []
  })
};
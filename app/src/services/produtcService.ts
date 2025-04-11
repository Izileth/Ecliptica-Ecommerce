import api from './api';
import type { Product, ProductFormValues } from './type';
import type { PaginatedResponse } from './type';
import type { ProductFilterApiParams } from './type';
interface ProductFilters {
  category?: string;
  minPrice?: number; // Agora como number
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}


export const ProductService = {
  // Listar todos os produtos (com filtros e paginação)
  getAll: async (filters?: ProductFilterApiParams): Promise<PaginatedResponse> => {
    const response = await api.get('/products', { params: filters });
    return {
      status: 'success', // Adicione explicitamente
      data: response.data.data,
      pagination: {
        ...response.data.pagination,
        hasNextPage: response.data.pagination.page < response.data.pagination.pages,
        hasPrevPage: response.data.pagination.page > 1
      }
    };
  },

  // Obter produtos do usuário logado
  getUserProducts: async (filters?: Omit<ProductFilters, 'sortBy' | 'sortOrder'>): Promise<PaginatedResponse> => {
    const response = await api.get<PaginatedResponse>('/products/user/products', { 
      params: filters 
    });
    return response.data;
  },

  // Buscar produto por ID
  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.get(`/products/${id}`);
      if (!response.data || !response.data.data) throw new Error('Produto não encontrado');
      return response.data.data; // Acessa o objeto produto dentro da propriedade data
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  // Criar novo produto (com upload de imagem)
  create: async (formData: FormData) => {
    try {
      console.log('Antes da requisição - FormData:', formData);
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      const response = await api.post('/products', formData);
      return response.data;
    } catch (error: any) {
      console.error('Erro completo:', {
        request: error.request,
        response: error.response,
        config: error.config
      });
      throw error;
    }
  },

  // Atualizar produto (com possibilidade de nova imagem)
  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, formData);
    return response.data;
  },

  // Deletar produto
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Listar por categoria (com paginação)
  getByCategory: async (category: string, page?: number, limit?: number): Promise<PaginatedResponse> => {
    const response = await api.get<PaginatedResponse>(`/products/category/${category}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // Método auxiliar para converter FormValues para FormData
  toFormData: (values: ProductFormValues): FormData => {
    const formData = new FormData();
    
    
    // Campos básicos
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('category', values.category);
    formData.append('countInStock', values.countInStock.toString());
    
    
    // Novos campos
    if (values.salePrice) {
      formData.append('salePrice', parseFloat(values.salePrice).toString());
    }
  
    if (values.collection) {
      formData.append('collection', values.collection);
    }
    
    // Array de features
    if (values.features && values.features.length > 0) {
      values.features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });
    }
    
    // Tamanhos
    
    if (values.sizes && values.sizes.length > 0) {
      values.sizes.forEach((size, index) => {
        formData.append(`sizes[${index}][size]`, size.size);
        formData.append(`sizes[${index}][stock]`, size.stock.toString());
      });
    }
    
    
    // Cores
    if (values.colors && values.colors.length > 0) {
      values.colors.forEach((color, index) => {
        formData.append(`colors[${index}][colorName]`, color.colorName);
        formData.append(`colors[${index}][colorCode]`, color.colorCode);
        formData.append(`colors[${index}][stock]`, color.stock.toString());
        if (color.imageUrl) {
          formData.append(`colors[${index}][imageUrl]`, color.imageUrl);
        }
      });
    }
    // Imagem Principal
    if (values.image) {
      if (values.image instanceof File) {
        formData.append('image', values.image); // Nome exato que o backend espera
      } else {
        // Se for edição e já tiver URL, não precisa enviar novamente
        // Ou implemente lógica para reupload se necessário
      }
    }

    // Imagens adicionais   
    if (values.additionalImagesFiles) { // Adicione este campo ao seu tipo
      values.additionalImagesFiles.forEach(file => {
        formData.append('additionalImages', file); // Nome exato e plural
      });
    }

    // Substitua o trecho de removedImages por:
    if (values.removedImages && Array.isArray(values.removedImages) && values.removedImages.length > 0) {
      // Envia como JSON stringify para garantir o formato
      formData.append('removedImages', JSON.stringify(values.removedImages));
    } else {
      // Envia array vazio explícito para evitar undefined
      formData.append('removedImages', '[]');
    }

    
    
    return formData;
  }  
};
import api from './api';
import type { Product, ProductFormValues } from './type';
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
interface PaginatedResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const ProductService = {
  // Listar todos os produtos (com filtros e paginação)
  getAll: async (filters?: ProductFilterApiParams): Promise<PaginatedResponse> => {
    const response = await api.get<PaginatedResponse>('/products', { 
      params: filters 
    });
    return response.data;
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
      const response = await api.get<Product>(`/products/${id}`);
      if (!response.data) throw new Error('Produto não encontrado');
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw new Error('Failed to fetch product');
    }
  },

  // Criar novo produto (com upload de imagem)
  create: async (formData: FormData) => {
    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true // Importante para requisições protegidas
    });
    return response.data;
  },

  // Atualizar produto (com possibilidade de nova imagem)
  update: async (id: string, formData: FormData): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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
      
    // Adiciona campos básicos
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price);
    formData.append('category', values.category);
    formData.append('countInStock', values.countInStock);
    
    // Adiciona a imagem apenas se existir
    if (values.image instanceof File) {
      formData.append('image', values.image);
    }
  
    return formData;
  }
};
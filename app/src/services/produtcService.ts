import api from './api';
import type { Product, ProductFormValues } from './type';

interface ProductFilters {
  category?: string;
  name?: string;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export const ProductService = {
  // Listar todos os produtos (com filtros opcionais)
  getAll: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products', { params: filters });
    return response.data;
  },

  // Buscar produto por ID
  getById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Criar novo produto (com upload de imagem)
  create: async (formData: FormData): Promise<Product> => {
    const response = await api.post<Product>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Atualizar produto
  update: async (id: string, productData: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Deletar produto
  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  // Listar por categoria
  getByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/category/${category}`);
    return response.data;
  },

  // Método auxiliar para converter FormValues para FormData
  toFormData: (values: ProductFormValues): FormData => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('category', values.category);
    formData.append('countInStock', values.countInStock.toString());
    
    if (values.image) {
      formData.append('image', values.image);
    }
    
    return formData;
  }
};
// src/services/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  isAdmin?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  countInStock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  createdBy?: {
    id: string;
    name: string;
  };
  // Para produtos em promoção
  promoPrice?: number;
  promoEnd?: string;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'shipped';
  createdAt: string;
  updatedAt: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod?: string;
}
export interface ProductFilterFormValues {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProductFilterApiParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Tipo para formulário de produto
export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  countInStock: string;
  image: File | null; // Remova a opção 'string' se não for usada
}

export interface ProfileFormData {
  name: string
  email: string
}

export interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
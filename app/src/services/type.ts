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
  images: ProductImage[];
  category: string;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  sales?: number; // Quantidade de vendas do produto
  createdBy?: {
    id: string;
    name: string;
  };
  // Para produtos em promoção
  promoPrice?: number;
  promoEnd?: string;

  salePrice: number | null;
  collection?: string | null;
  features: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
}
export interface ProductSize {
  id?: string;
  size: string;
  stock: number;
  productId?: string;
}

export interface ProductColor {
  id?: string;
  colorName: string;
  colorCode: string;  // código hexadecimal
  imageUrl?: string | null;
  stock: number;
  productId?: string;
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
  product?: Product; // Produto expandido
  createdAt?: string;
  updatedAt?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt?: string;
  updatedAt?: string;
}

// Tipo para adicionar/atualizar itens
export interface CartItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CheckoutSessionRequest {
  items: CheckoutItem[];
  userId: string;
  // endereço pode ser incluído se necessário
  addressId?: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
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
  sort?: 'price-asc' | 'price-desc' | 'popular' | 'newest';
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;

  collection?: string;
  hasDiscount?: boolean | string;
}

// Tipo para formulário de produto
export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: number | string; // Aceita ambos os tipos
  category: string;
  countInStock: number | string;
  image: File | null; // Remova a opção 'string' se não for usada
  
  // Novas Funções

  additionalImages?: string[]; // URLs para pré-visualização
  additionalImagesFiles?: File[]; // Arquivos para upload
  removedImages?: string[];
  salePrice?: number | string | null;
  collection?: string | null;
  features?: string[];
  sizes?: ProductSize[];
  colors?: ProductColor[];

  // Validação
  isFeatured?: boolean;
  isNewArrival?: boolean;
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

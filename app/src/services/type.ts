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
  image: string;
  images: string[]; // Alterado de ProductImage[] para string[]
  category: string;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: { // Adicionado para refletir a relação com usuário
    id: string;
    name: string;
    email: string;
  };
  salePrice: number | null;
  collection?: string | null;
  features: string[];
  sizes: ProductSize[];
  colors: ProductColor[];
  // Campos removidos que não existem no backend:
  // oldPrice?, promoPrice?, promoEnd?, sales?
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

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedProducts {
  data: Product[];
  pagination: Pagination; // Use a interface unificada
}

export interface PaginatedResponse {
  status: string;
  data: Product[];
  pagination: Pagination; // Use a mesma interface
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
  page?: number;
  limit?: number;
  category?: string;
  name?: string; // Adicionado para busca por nome
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'salePrice';
  sortOrder?: 'asc' | 'desc';
  collection?: string;
  hasDiscount?: boolean;
  searchTerm?: string; // Termo geral de busca
}

// Tipo para formulário de produto
export interface ProductFormValues {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  countInStock: string;
  image: File | string | null;
  additionalImages?: (File | string)[];
  additionalImagesFiles?: File[]; // Adicione esta linha
  removedImages?: string[];
  salePrice?: string | null;
  collection?: string | null;
  features: string[];
  sizes: Array<{
    size: string;
    stock: string | number;
    id?: string; // Para edição
  }>;
  colors: Array<{
    colorName: string;
    colorCode: string;
    stock: string | number;
    imageUrl?: string | null;
    id?: string; // Para edição
  }>;
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


export interface ProductSearchHook {
  searchProducts: (term: string, filters?: Partial<ProductFilterApiParams>) => Promise<void>;
  searchResults: Product[];
  isSearching: boolean;
  error: string | null;
  clearSearch: () => void;
}
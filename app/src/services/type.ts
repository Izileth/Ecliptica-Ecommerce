// src/services/types.ts
export interface User {
  id: string
  name: string // Tornando obrigatório
  email: string
  image?: string
  isAdmin?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  countInStock: number;
  createdAt?: string;
  updatedAt?: string;
  // Para produtos em promoção
  promoPrice?: number;
  promoEnd?: string;
  
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

// Tipos para autenticação
export interface AuthResponse {
  user: User;
  token: string;
}

// Tipo para formulário de produto
export interface ProductFormValues {
  name: string;
  description: string;
  price: string;  // Em número para facilitar validações
  category: string;
  countInStock: string;  // Em número para facilitar validações
  image: File | null;  // Pode ser null até o usuário selecionar
  
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
import api from "./api";
import type { Cart, CartItemRequest } from "../types/type";

interface ApiResponse<T> {
  status: string;
  data: T;
}

export const CartService = {
  // Obter carrinho completo
  getCart: async (): Promise<Cart> => {
    const response = await api.get<ApiResponse<Cart>>("/cart");
    return response.data.data;
  },

  // Adicionar item ao carrinho
  addItem: async (data: CartItemRequest): Promise<Cart> => {
    const response = await api.post<ApiResponse<Cart>>("/cart/items", data);
    return response.data.data;
  },

  // Atualizar quantidade
  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const response = await api.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, {
      quantity,
    });
    return response.data.data;
  },

  // Remover item
  removeItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<ApiResponse<Cart>>(
      `/cart/items/${itemId}`
    );
    return response.data.data;
  },

  // Limpar carrinho
  clearCart: async (): Promise<void> => {
    await api.delete<ApiResponse<void>>("/cart");
    // Nota: Ajuste o endpoint conforme sua API
  },

  // Verificar estoque (opcional)
  checkStock: async (productId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await api.get<ApiResponse<{ available: boolean }>>(
        `/products/${productId}/stock?quantity=${quantity}`
      );
      return response.data.data.available;
    } catch {
      return false;
    }
  },
};

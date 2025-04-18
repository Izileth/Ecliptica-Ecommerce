import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/globalStore";
import { resetCartError } from "../store/cart/cartSlice";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../store/cart/cartThunks";
import type { Cart } from "../types/type";
import { useCallback } from "react";

// Use o hook "useAppDispatch" para ter tipagens melhores
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useCart = () => {
  // Verificação para SSR (Next.js/Gatsby)
  // Corrigindo o retorno padrão para SSR
  if (typeof window === "undefined") {
    return {
      cart: null,
      loading: false,
      error: null,
      itemCount: 0,
      getCart: () => Promise.resolve(null),
      addItem: async () => ({} as Cart),
      updateItem: async () => ({} as Cart),
      removeItem: async () => ({} as Cart),
      clearCart: async () => {},
      clearError: () => {},
    };
  }

  const dispatch = useAppDispatch();
  const { cart, loading, error } = useSelector(
    (state: RootState) => state.cart
  );

  // Ações com memoização para evitar re-renders desnecessários
  const getCart = useCallback(() => {
    try {
      return dispatch(fetchCart());
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
      throw error;
    }
  }, [dispatch]);

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      try {
        return await dispatch(addCartItem({ productId, quantity })).unwrap();
      } catch (error) {
        console.error("Erro ao adicionar item ao carrinho:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        return await dispatch(updateCartItem({ itemId, quantity })).unwrap();
      } catch (error) {
        console.error("Erro ao atualizar item do carrinho:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        return await dispatch(removeCartItem(itemId)).unwrap();
      } catch (error) {
        console.error("Erro ao remover item do carrinho:", error);
        throw error;
      }
    },
    [dispatch]
  );

  const clear = useCallback(async () => {
    try {
      return await dispatch(clearCart()).unwrap();
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(resetCartError());
  }, [dispatch]);

  // Calcula o total de itens (quantidade) com verificação de null safety
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return {
    cart,
    loading,
    error,
    itemCount,
    subtotal: cart?.total || 0, // Adicionando subtotal diretamente no hook
    getCart,
    addItem,
    updateItem,
    removeItem,
    clearCart: clear,
    clearError,
  };
};

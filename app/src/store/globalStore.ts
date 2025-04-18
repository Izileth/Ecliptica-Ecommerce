import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./product/productSlice";
import cartReducer from "./cart/cartSlice"; // Importe o reducer do carrinho

// Função para criar um novo store para cada requisição
export function createStore() {
  return configureStore({
    reducer: {
      products: productReducer,
      cart: cartReducer,
    },
  });
}

// Para uso no cliente
export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

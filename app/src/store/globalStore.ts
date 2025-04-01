import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productStore';

// Função para criar um novo store para cada requisição
export function createStore() {
  return configureStore({
    reducer: {
      products: productReducer,
    },
    // Configurações simplificadas para SSR
  });
}

// Para uso no cliente
export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
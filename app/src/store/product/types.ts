import type { ProductFilterApiParams } from "~/src/types/type";
import type { Product } from "~/src/types/type";

export interface ProductState {
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number; // Remova os valores padrão aqui (só na inicialização)
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: ProductFilterApiParams; // Adicionar para manter estado dos filtros
}
export const initialState: ProductState = {
  products: [],
  userProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    page: 1,
    limit: 10,
  },
};

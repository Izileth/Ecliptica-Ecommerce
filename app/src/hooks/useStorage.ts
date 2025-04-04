import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store/globalStore';
import type { AppDispatch } from '../store/globalStore';
import { 
  fetchProducts, 
  fetchUserProducts, 
  fetchProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  clearCurrentProduct,
  resetProductError
} from '../store/productStore';
import type { ProductFilterApiParams } from '../services/type';
import type { ProductFormValues } from '../services/type';
import { ProductService } from '../services/produtcService';
import { useCallback } from 'react';

export const useProducts = () => {
  // Verificação para SSR (Next.js/Gatsby)
  if (typeof window === 'undefined') {
    return {
      products: [],
      userProducts: [],
      currentProduct: null,
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      getProducts: () => {},
      getUserProducts: () => {},
      getProductById: () => {},
      addProduct: async () => ({}),
      editProduct: async () => ({}),
      removeProduct: async () => ({}),
      clearProduct: () => {},
      clearError: () => {},
    };
  }

  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    userProducts,
    currentProduct,
    loading,
    error,
    pagination
  } = useSelector((state: RootState) => state.products);

  // Busca de produtos com memoização para evitar re-renders desnecessários
  const getProducts = useCallback((page?: number, filters?: ProductFilterApiParams) => {
    return dispatch(fetchProducts({ page, filters }));
  }, [dispatch]);
  
  const getUserProducts = useCallback((page?: number) => {
    return dispatch(fetchUserProducts({ page }));
  }, [dispatch]);

  const getProductById = useCallback((id: string) => {
    try {
      return dispatch(fetchProductById(id));
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
    }
  }, [dispatch]);

  const addProduct = useCallback(async (values: ProductFormValues) => {
    try {
      const formData = ProductService.toFormData(values);
      return await dispatch(createProduct(formData)).unwrap();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  }, [dispatch]);

  const editProduct = useCallback(async (id: string, values: ProductFormValues) => {
    try {
      const formData = ProductService.toFormData(values);
      return await dispatch(updateProduct({ id, formData })).unwrap();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      throw error;
    }
  }, [dispatch]);

  const removeProduct = useCallback(async (id: string) => {
    try {
      return await dispatch(deleteProduct(id)).unwrap();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      throw error;
    }
  }, [dispatch]);

  const clearProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(resetProductError());
  }, [dispatch]);

  return {
    products,
    userProducts,
    currentProduct,
    loading,
    error,
    pagination,
    getProducts,
    getUserProducts,
    getProductById,
    addProduct,
    editProduct,
    removeProduct,
    clearProduct,
    clearError,
  };
};
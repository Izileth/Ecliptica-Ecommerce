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
  resetProductError,
  setFilters
} from '../store/productStore';
import type { ProductFilterApiParams } from '../services/type';
import type { ProductFormValues } from '../services/type';
import { ProductService } from '../services/produtcService';
import type { Product } from '../services/type';
import { useCallback, useMemo } from 'react';
interface UseProductsReturn {
  // Estado
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  filters: ProductFilterApiParams;
  
  // Ações
  getProducts: (page?: number, filters?: ProductFilterApiParams) => void;
  getFeaturedProducts: (count?: number) => Product[];
  getUserProducts: (page?: number) => void;
  getProductById: (id: string) => void;
  addProduct: (values: ProductFormValues) => Promise<Product>;
  editProduct: (id: string, values: ProductFormValues) => Promise<Product>;
  removeProduct: (id: string) => Promise<void>;
  clearProduct: () => void;
  clearError: () => void;
  updateFilters: (filters: Partial<ProductFilterApiParams>) => void;
  resetFilters: () => void;
}

export const useProducts = (): UseProductsReturn => {
  // Verificação para SSR (Next.js/Gatsby)
  if (typeof window === 'undefined') {
    return {
      products: [],
      userProducts: [],
      currentProduct: null,
      loading: false,
      error: null,
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
      filters: { page: 1, limit: 10 },
      getProducts: () => {},
      getUserProducts: () => {},
      getProductById: () => {},
      getFeaturedProducts: () => [],
      addProduct: async () => ({} as Product),
      editProduct: async () => ({} as Product),
      removeProduct: async () => {},
      clearProduct: () => {},
      clearError: () => {},
      updateFilters: () => {},
      resetFilters: () => {},
    };
  }

  const dispatch = useDispatch<AppDispatch>();
  const {
    products,
    userProducts,
    currentProduct,
    loading,
    error,
    pagination,
    filters
  } = useSelector((state: RootState) => state.products);

  // Busca de produtos com memoização
  const getProducts = useCallback((page?: number, filters?: ProductFilterApiParams) => {
    const params = {
      page: page || 1,
      filters: filters || {}
    };
    return dispatch(fetchProducts(params));
  }, [dispatch]);


  const getFeaturedProducts = useCallback((count: number = 4): Product[] => {
    // Garante que o count esteja entre 4 e 8
    const productCount = Math.min(Math.max(count, 4), 8);
    
    // Verificação rigorosa de products
    if (!Array.isArray(products)) return [];
    if (products.length === 0) return [];
    
    // Cria uma cópia segura do array
    const productsCopy = [...products];
    
    // Se tiver menos ou igual ao número solicitado, retorna todos
    if (productsCopy.length <= productCount) return productsCopy;
    
    // Seleção aleatória com Fisher-Yates shuffle
    for (let i = productsCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsCopy[i], productsCopy[j]] = [productsCopy[j], productsCopy[i]];
    }
    
    return productsCopy.slice(0, productCount);
  }, [products]);


  // Produtos do usuário
  const getUserProducts = useCallback((page?: number) => {
    return dispatch(fetchUserProducts({ page }));
  }, [dispatch]);

  // Buscar produto por ID
  const getProductById = useCallback((id: string) => {
    try {
      return dispatch(fetchProductById(id));
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      throw error;
    }
  }, [dispatch]);

  // Adicionar produto
  const addProduct = useCallback(async (values: ProductFormValues) => {
    try {
      const formData = ProductService.toFormData(values);
      return await dispatch(createProduct(formData)).unwrap();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      throw error;
    }
  }, [dispatch]);

  // Editar produto
  const editProduct = useCallback(async (id: string, values: ProductFormValues) => {
    try {
      const formData = ProductService.toFormData(values);
      return await dispatch(updateProduct({ id, formData })).unwrap();
    } catch (error) {
      console.error("Erro ao editar produto:", error);
      throw error;
    }
  }, [dispatch]);

  // Remover produto
  const removeProduct = useCallback(async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (error) {
      console.error("Erro ao remover produto:", error);
      throw error;
    }
  }, [dispatch]);

  // Limpar produto atual
  const clearProduct = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  // Limpar erros
  const clearError = useCallback(() => {
    dispatch(resetProductError());
  }, [dispatch]);

  // Manipulação de filtros
  const updateFilters = useCallback((newFilters: Partial<ProductFilterApiParams>) => {
    dispatch(setFilters({ ...filters, ...newFilters }));
    // Atualiza os produtos automaticamente quando os filtros mudam
    dispatch(fetchProducts({ filters: { ...filters, ...newFilters } }));
  }, [dispatch, filters]);

  const resetFilters = useCallback(() => {
    const defaultFilters = { page: 1, limit: 10 };
    dispatch(setFilters(defaultFilters));
    dispatch(fetchProducts({ filters: defaultFilters }));
  }, [dispatch]);

  // Memoiza valores computados
  const memoizedValues = useMemo(() => ({
    products,
    userProducts,
    currentProduct,
    loading,
    error,
    pagination,
    filters
  }), [products, userProducts, currentProduct, loading, error, pagination, filters]);

  return {
    ...memoizedValues,
    getProducts,
    getFeaturedProducts,
    getUserProducts,
    getProductById,
    addProduct,
    editProduct,
    removeProduct,
    clearProduct,
    clearError,
    updateFilters,
    resetFilters
  };
};
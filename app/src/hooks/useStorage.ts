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
      addProduct: async () => {},
      editProduct: async () => {},
      removeProduct: async () => {},
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

  // Ações
  const getProducts = (page?: number, filters?: ProductFilterApiParams) => {
    dispatch(fetchProducts({ page, filters }));
  };
  const getUserProducts = (page?: number) => {
    dispatch(fetchUserProducts({ page }));
  };

  const getProductById = (id: string) => {
    dispatch(fetchProductById(id));
  };

  const addProduct = async (values: ProductFormValues) => {
    const formData = ProductService.toFormData(values);
    return dispatch(createProduct(formData)).unwrap();
  };

  const editProduct = async (id: string, values: ProductFormValues) => {
    const formData = ProductService.toFormData(values);
    return dispatch(updateProduct({ id, formData })).unwrap();
  };

  const removeProduct = async (id: string) => {
    return dispatch(deleteProduct(id)).unwrap();
  };

  const clearProduct = () => {
    dispatch(clearCurrentProduct());
  };

  const clearError = () => {
    dispatch(resetProductError());
  };

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
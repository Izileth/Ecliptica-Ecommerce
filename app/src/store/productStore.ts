import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ProductService } from '../services/produtcService';
import type { ProductFilterApiParams } from '../services/type';
import type { Product } from '../services/type';


interface ProductState {
  products: Product[];
  userProducts: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;  // Remova os valores padrão aqui (só na inicialização)
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: ProductFilterApiParams; // Adicionar para manter estado dos filtros
}
const initialState: ProductState = {
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
    hasPrevPage: false
  },
  filters: {
    page: 1,
    limit: 10
  }
  
};

// Thunks para operações assíncronas

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: { page?: number; filters?: ProductFilterApiParams }, { rejectWithValue }) => {
    try {
      const response = await ProductService.getAll(params.filters);
      return {
        data: response.data,
        pagination: {
          ...response.pagination,
          hasNextPage: response.pagination.page < response.pagination.pages,
          hasPrevPage: response.pagination.page > 1
        }
      };
    } catch (error) {
      return rejectWithValue('Erro ao buscar produtos');
    }
  }
);
export const fetchUserProducts = createAsyncThunk(
  'products/fetchUserProducts',
  async (params: { page?: number }, { rejectWithValue }) => {
    try {
      const response = await ProductService.getUserProducts(params);
      return {
        data: response.data,
        pagination: {
          ...response.pagination,
          hasNextPage: response.pagination.page < response.pagination.pages,
          hasPrevPage: response.pagination.page > 1
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProductService.getById(id);
      return response; // Aqui já deveria receber o objeto do produto diretamente
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro ao buscar produto');
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await ProductService.create(formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      return await ProductService.update(id, formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await ProductService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    resetProductError(state) {
      state.error = null;
    },
    setFilters(state, action: PayloadAction<ProductFilterApiParams>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = {
          page: action.payload.pagination.page,
          limit: action.payload.pagination.limit,
          total: action.payload.pagination.total,
          pages: action.payload.pagination.pages,
          hasNextPage: action.payload.pagination.page < action.payload.pagination.pages,
          hasPrevPage: action.payload.pagination.page > 1
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User Products
      .addCase(fetchUserProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.userProducts = action.payload.data;
        state.pagination = {
          ...action.payload.pagination,
          hasNextPage: action.payload.pagination.page < action.payload.pagination.pages,
          hasPrevPage: action.payload.pagination.page > 1
        };
      })
      .addCase(fetchUserProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Product By ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products = [action.payload, ...state.products];
        state.userProducts = [action.payload, ...state.userProducts];
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products = state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        );
        state.userProducts = state.userProducts.map(product =>
          product.id === action.payload.id ? action.payload : product
        );
        state.currentProduct = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.products = state.products.filter(product => product.id !== action.payload);
        state.userProducts = state.userProducts.filter(product => product.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, resetProductError, setFilters  } = productSlice.actions;
export default productSlice.reducer;
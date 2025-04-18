import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { ProductFilterApiParams } from "~/src/types/type";
import type { Product } from "~/src/types/type";
import { initialState } from "./types";
import {
  fetchProducts,
  fetchProductById,
  fetchUserProducts,
  fetchProductsByCollection,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./productThunks";
// Thunks para operações assíncronas

const productSlice = createSlice({
  name: "products",
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
        state.pagination = action.payload.pagination;
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
          hasNextPage:
            action.payload.pagination.page < action.payload.pagination.pages,
          hasPrevPage: action.payload.pagination.page > 1,
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
      .addCase(
        fetchProductById.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.currentProduct = action.payload;
        }
      )
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Adicione um caso no extraReducers
      .addCase(fetchProductsByCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductsByCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products = [action.payload, ...state.products];
          state.userProducts = [action.payload, ...state.userProducts];
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products = state.products.map((product) =>
            product.id === action.payload.id ? action.payload : product
          );
          state.userProducts = state.userProducts.map((product) =>
            product.id === action.payload.id ? action.payload : product
          );
          state.currentProduct = action.payload;
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.products = state.products.filter(
            (product) => product.id !== action.payload
          );
          state.userProducts = state.userProducts.filter(
            (product) => product.id !== action.payload
          );
          if (state.currentProduct?.id === action.payload) {
            state.currentProduct = null;
          }
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentProduct, resetProductError, setFilters } =
  productSlice.actions;
export default productSlice.reducer;

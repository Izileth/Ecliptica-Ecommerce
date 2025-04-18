import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProductService } from "~/src/services/produtcService";
import type { ProductFilterApiParams } from "~/src/types/type";
import type { Product } from "~/src/types/type";
import type { Pagination } from "~/src/types/type";

export const fetchProducts = createAsyncThunk<
  { data: Product[]; pagination: Pagination }, // Tipo de retorno
  { page?: number; filters?: ProductFilterApiParams } // Tipo do parâmetro
>("products/fetchAll", async (params) => {
  const response = await ProductService.getAll(params.filters || {});
  return {
    data: response.data,
    pagination: response.pagination,
  };
});

export const fetchUserProducts = createAsyncThunk(
  "products/fetchUserProducts",
  async (params: { page?: number }, { rejectWithValue }) => {
    try {
      const response = await ProductService.getUserProducts(params);
      return {
        data: response.data,
        pagination: {
          ...response.pagination,
          hasNextPage: response.pagination.page < response.pagination.pages,
          hasPrevPage: response.pagination.page > 1,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const fetchProductsByCollection = createAsyncThunk(
  "products/fetchByCollection",
  async (
    params: {
      collection: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await ProductService.getByCollection(
        params.collection,
        params.page,
        params.limit
      );
      return {
        data: response.data,
        pagination: response.pagination,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Erro ao buscar produtos por coleção"
      );
    }
  }
);
export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await ProductService.getById(id);
      return response; // Aqui já deveria receber o objeto do produto diretamente
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Erro ao buscar produto"
      );
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      return await ProductService.create(formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async (
    { id, formData }: { id: string; formData: FormData },
    { rejectWithValue }
  ) => {
    try {
      return await ProductService.update(id, formData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await ProductService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

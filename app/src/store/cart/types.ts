import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { CartService } from "../../services/cartService";
import type { Cart, CartItem } from "../../types/type";

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  // Estados individuais para cada ação
  status: {
    fetch: "idle" | "loading" | "succeeded" | "failed";
    add: "idle" | "loading" | "succeeded" | "failed";
    update: "idle" | "loading" | "succeeded" | "failed";
    remove: "idle" | "loading" | "succeeded" | "failed";
    clear: "idle" | "loading" | "succeeded" | "failed";
  };
}

export const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  status: {
    fetch: "idle",
    add: "idle",
    update: "idle",
    remove: "idle",
    clear: "idle",
  },
};

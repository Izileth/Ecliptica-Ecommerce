import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "../../types/type";
import { initialState } from "./types";
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cartThunks";

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
      // Resetar todos os status de erro
      Object.keys(state.status).forEach((key) => {
        state.status[key as keyof typeof state.status] = "idle";
      });
    },
    // Reducer para limpar o carrinho localmente
    clearCartLocally: (state) => {
      state.cart = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.fetch = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.fetch = "succeeded";
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.fetch = "failed";
      })

      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.add = "loading";
      })
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.add = "succeeded";
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.add = "failed";
      })

      // Update Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.update = "loading";
      })
      .addCase(
        updateCartItem.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
          state.status.update = "succeeded";
        }
      )
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.update = "failed";
      })

      // Remove Item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.remove = "loading";
      })
      .addCase(
        removeCartItem.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
          state.status.remove = "succeeded";
        }
      )
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.remove = "failed";
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.clear = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
        state.status.clear = "succeeded";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.clear = "failed";
      });
  },
});

export const { resetCartError, clearCartLocally } = cartSlice.actions;
export default cartSlice.reducer;

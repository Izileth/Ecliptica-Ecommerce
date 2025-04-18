import { createAsyncThunk } from "@reduxjs/toolkit";
import { CartService } from "../../services/cartService";
import type { Cart } from "../../types/type";

// Thunks com tipagem mais robusta
export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const cart = await CartService.getCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch cart"
      );
    }
  }
);

export const addCartItem = createAsyncThunk<
  Cart,
  { productId: string; quantity: number },
  { rejectValue: string }
>("cart/addItem", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    return await CartService.addItem({ productId, quantity });
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to add item"
    );
  }
});

export const updateCartItem = createAsyncThunk<
  Cart,
  { itemId: string; quantity: number },
  { rejectValue: string }
>("cart/updateItem", async ({ itemId, quantity }, { rejectWithValue }) => {
  try {
    return await CartService.updateItem(itemId, quantity);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to update item"
    );
  }
});

export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>("cart/removeItem", async (itemId, { rejectWithValue }) => {
  try {
    return await CartService.removeItem(itemId);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || error.message || "Failed to remove item"
    );
  }
});

export const clearCart = createAsyncThunk<void, void, { rejectValue: string }>(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await CartService.clearCart();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to clear cart"
      );
    }
  }
);

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CartService } from '../services/cartService';
import type { Cart, CartItem } from '../services/type';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  // Estados individuais para cada ação
  status: {
    fetch: 'idle' | 'loading' | 'succeeded' | 'failed';
    add: 'idle' | 'loading' | 'succeeded' | 'failed';
    update: 'idle' | 'loading' | 'succeeded' | 'failed';
    remove: 'idle' | 'loading' | 'succeeded' | 'failed';
    clear: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  status: {
    fetch: 'idle',
    add: 'idle',
    update: 'idle',
    remove: 'idle',
    clear: 'idle'
  }
};

// Thunks com tipagem mais robusta
export const fetchCart = createAsyncThunk<Cart, void, { rejectValue: string }>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await CartService.getCart();
      return cart;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch cart'
      );
    }
  }
);

export const addCartItem = createAsyncThunk<
  Cart,
  { productId: string; quantity: number },
  { rejectValue: string }
>(
  'cart/addItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      return await CartService.addItem({ productId, quantity });
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to add item'
      );
    }
  }
);

export const updateCartItem = createAsyncThunk<
  Cart,
  { itemId: string; quantity: number },
  { rejectValue: string }
>(
  'cart/updateItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      return await CartService.updateItem(itemId, quantity);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to update item'
      );
    }
  }
);

export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      return await CartService.removeItem(itemId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to remove item'
      );
    }
  }
);

export const clearCart = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await CartService.clearCart();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to clear cart'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCartError: (state) => {
      state.error = null;
      // Resetar todos os status de erro
      Object.keys(state.status).forEach(key => {
        state.status[key as keyof typeof state.status] = 'idle';
      });
    },
    // Reducer para limpar o carrinho localmente
    clearCartLocally: (state) => {
      state.cart = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.fetch = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.fetch = 'succeeded';
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.fetch = 'failed';
      })
      
      // Add Item
      .addCase(addCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.add = 'loading';
      })
      .addCase(addCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.add = 'succeeded';
      })
      .addCase(addCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.add = 'failed';
      })
      
      // Update Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.update = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.update = 'succeeded';
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.update = 'failed';
      })
      
      // Remove Item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.remove = 'loading';
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.status.remove = 'succeeded';
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.remove = 'failed';
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status.clear = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cart = null;
        state.status.clear = 'succeeded';
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.status.clear = 'failed';
      });
  }
});

export const { resetCartError, clearCartLocally } = cartSlice.actions;
export default cartSlice.reducer;
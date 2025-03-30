import api from './api';
import type { CartItem } from './type';

export const getCart = async (): Promise<CartItem[]> => {
    const response = await api.get<CartItem[]>('/cart');
    return response.data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem> => {
    const response = await api.post<CartItem>('/cart', { productId, quantity });
    return response.data;
};

export const removeFromCart = async (itemId: string): Promise<void> => {
    await api.delete(`/cart/${itemId}`);
};
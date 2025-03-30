import api from './api';
import type { Order } from './type';
import type { CartItem } from './type';

export const createOrder = async (orderData: { items: CartItem[] }): Promise<Order> => {
  const response = await api.post<Order>('/orders', orderData);
  return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};
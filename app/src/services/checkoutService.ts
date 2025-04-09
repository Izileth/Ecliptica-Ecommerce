import api from './api';
import type { CheckoutSessionRequest } from './type';
import type { CheckoutSessionResponse } from './type';

export const checkoutService = {
    createSession: async (payload: CheckoutSessionRequest): Promise<CheckoutSessionResponse> => {
        const response = await api.post<CheckoutSessionResponse>('/checkout/create-session', payload);
        return response.data;
    },
};

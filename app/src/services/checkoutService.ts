import api from './api';
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PaymentMethod,
  ShippingAddress
} from './type';

export const checkoutService = {
    /**
     * Cria uma nova sessão de checkout
     * @param payload Dados necessários para iniciar o checkout
     * @returns Promise com a resposta da sessão criada
     */
    createSession: async (
        payload: CheckoutSessionRequest
    ): Promise<CheckoutSessionResponse> => {
        try {
            const response = await api.post('/checkout/create-session', {
        ...payload,
            shippingAddress: payload.shippingAddress
            ? {
                ...payload.shippingAddress,
                isNew: !('id' in payload.shippingAddress)
            }
            : undefined
        });
        return response.data.data;
        } catch (error) {
        console.error('Checkout service error:', error);
        throw new Error('Failed to create checkout session');
        }
    },

    /**
     * Recupera uma sessão de checkout existente
     * @param sessionId ID da sessão
     * @returns Promise com os dados da sessão
     */
    getSession: async (sessionId: string): Promise<CheckoutSessionResponse> => {
        const response = await api.get<{ data: CheckoutSessionResponse }>(
        `/checkout/sessions/${sessionId}`
        );
        return response.data.data;
    },

    /**
     * Atualiza o método de pagamento de uma sessão
     * @param sessionId ID da sessão
     * @param paymentMethod Método de pagamento
     */
    updatePaymentMethod: async (
        sessionId: string,
        paymentMethod: PaymentMethod
    ): Promise<void> => {
        await api.patch(
        `/checkout/sessions/${sessionId}/payment`,
        { paymentMethod }
        );
    },

    /**
     * Atualiza o endereço de entrega
     * @param sessionId ID da sessão
     * @param address Endereço de entrega
     */
    updateShippingAddress: async (
        sessionId: string,
        address: ShippingAddress
    ): Promise<void> => {
        await api.patch(
        `/checkout/sessions/${sessionId}/shipping`,
        { address }
        );
    }
};
// src/hooks/useCheckout.ts
import { useSelector } from 'react-redux';
import type { RootState } from '../store/globalStore';
import { checkoutService } from '../services/checkoutService';
import  type{
  CheckoutSessionResponse,
} from '~/src/services/type';
import type { CartItem } from '~/src/services/type';
import type { User } from '~/src/services/type';
import type { CheckoutItem } from '~/src/services/type';
import type { CheckoutSessionRequest } from '~/src/services/type';


interface UseCheckoutPreviewParams {
    items: CheckoutItem[];
    userId: string;
    addressId?: string;
  }
  
  export const useCheckoutPreview = ({
    items,
    userId,
    addressId,
  }: UseCheckoutPreviewParams) => {
    const initiateCheckout = async (): Promise<void> => {
      const payload: CheckoutSessionRequest = {
        items,
        userId,
        addressId,
      };
  
      try {
        const session: CheckoutSessionResponse = await checkoutService.createSession(payload);
        window.location.href = session.url;
      } catch (error) {
        console.error('Erro ao iniciar o checkout:', error);
        throw error;
      }
    };
  
    return { initiateCheckout };
  };
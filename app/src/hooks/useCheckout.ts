// hooks/useCheckout.ts
import { useState } from 'react';
import type { CheckoutSessionRequest } from '../services/type';
import { checkoutService } from '~/src/services/checkoutService';
import { useNavigate } from 'react-router-dom';

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const initiateCheckout = async (request: CheckoutSessionRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await checkoutService.createSession(request);
      
      // Redirecionar para gateway de pagamento ou página de sucesso
      if (session.url) {
        window.location.href = session.url;
      } else {
        navigate('/checkout/success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { initiateCheckout, loading, error };
};
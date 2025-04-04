
import React from 'react';
import type { Cart } from '~/src/services/type';
import { Button } from '~/src/components/imported/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CartSummaryProps {
    cart?: Cart | null; 
}
  
const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
    // Calcular o subtotal (soma de preço * quantidade para cada item)
    const items = cart?.items || [];
    const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    
    const subtotal = items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);

    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    if (itemCount === 0) {
        return (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 text-center">
            <p className="text-gray-600 mb-4">Seu carrinho está vazio</p>
            <Link to="/products">
            <Button className="w-full">
                Continuar Comprando
            </Button>
            </Link>
        </div>
        );
    }

    

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
            <h2 className="text-lg font-medium mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4">
            <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
                <span className="text-gray-600">Frete</span>
                {shipping === 0 ? (
                <span className="text-green-600">Grátis</span>
                ) : (
                <span>R$ {shipping.toFixed(2)}</span>
                )}
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold text-lg">R$ {total.toFixed(2)}</span>
                </div>
            </div>
            
            {shipping === 0 && (
                <div className="bg-green-50 p-3 text-sm text-green-700 rounded">
                Você ganhou frete grátis!
                </div>
            )}
            
            {shipping > 0 && (
                <div className="text-sm text-gray-500">
                Adicione mais R$ {(100 - subtotal).toFixed(2)} para ganhar frete grátis.
                </div>
            )}
            </div>

            <div className="mt-6">
            <Link 
                to={itemCount > 0 ? "/checkout" : "#"} 
                onClick={(e) => itemCount === 0 && e.preventDefault()}
            >
                <Button 
                className="w-full" 
                size="lg"
                disabled={itemCount === 0}
                >
                Finalizar Compra
                <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </Link>
            </div>
            
            <div className="mt-4">
            <Link to="/products" >
                <Button variant="outline" className="w-full">
                Continuar Comprando
                </Button>
            </Link>
            </div>
        </div>
        </div>
    );
};

export default CartSummary;
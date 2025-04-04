import React from 'react';
import { Image } from '@radix-ui/react-avatar';
import { useCart } from '~/src/hooks/useCart';
import type { CartItem } from '~/src/services/type'
import { Button } from '~/src/components/imported/button';
import { Minus, Plus, X } from 'lucide-react';

interface ImageProps {
    src: string;
    alt: string;
    fill?: boolean; // Corrigindo para boolean
    className?: string;
    sizes?: string;
}


interface CartItemListProps {
    items?: CartItem[]; // Tornando opcional
    onUpdate: (itemId: string, quantity: number) => void;
    onRemove: (itemId: string) => void;
    loading?: boolean;
}
const CartItemList: React.FC<CartItemListProps> = ({
    items = [], 
    onUpdate, 
    onRemove,
    loading = false 
    }) => {

        console.log('Items recebidos no CartItemList:', {
            items,
            type: typeof items,
            isArray: Array.isArray(items)
          });
          
          // Verifique um item específico:
          if (items && items[0]) {
            console.log('Exemplo de item:', {
              id: items[0].id,
              product: !!items[0].product,
              quantity: items[0].quantity
            });
        }     
        const handleQuantityChange = (itemId: string, newQuantity: number) => {
            if (newQuantity <= 0) {
            onRemove(itemId);
            } else {
            onUpdate(itemId, newQuantity);
            }
        };

        if (loading) {
            return (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-100 rounded animate-pulse"></div>
                ))}
              </div>
            );
          }
        
          if (!items || items.length === 0) {
            return (
              <div className="text-center py-8 text-gray-500">
                Nenhum item no carrinho
              </div>
            );
          }


    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
            {items.map((item) => (
            <div key={item.id} className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                {/* Imagem do produto */}
                <div className="w-full sm:w-20 h-20 relative mb-3 sm:mb-0">
                {item.product?.image ? (
                    <img
                    src={item.product.image}
                    alt={item.product.name || 'Produto'}
                    className="w-full h-full object-cover rounded"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">Sem imagem</span>
                    </div>
                )}
                </div>

                {/* Informações do produto */}
                <div className="flex-1 ml-0 sm:ml-4">
                    <div className="flex justify-between mb-2">
                    <h3 className="font-medium text-gray-900">
                        {item.product?.name || 'Produto indisponível'}
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemove(item.id)}
                        className="h-6 w-6 text-gray-500 hover:text-red-500"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                    {item.product?.description?.substring(0, 100) || 'Sem descrição'}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="font-medium text-gray-900 mb-2 sm:mb-0">
                        R$ {(item.product?.price || 0).toFixed(2)}
                    </div>
                    <div className="flex items-center">
                        <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                        <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-3 w-8 text-center">{item.quantity}</span>
                        <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                        <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default CartItemList;
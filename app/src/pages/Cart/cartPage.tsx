import React, { useEffect } from 'react';

import { useCart } from '~/src/hooks/useCart';

import CartItemList from '~/src/components/cart/List/cart.list';
import CartSummary from '~/src/components/cart/Summary/cart.summary';
import { Button } from '~/src/components/ui/Button/button';

import { ShoppingBag, Trash2 } from 'lucide-react';

import { Link } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    loading, 
    error, 
    itemCount, 
    updateItem, 
    removeItem, 
    clearCart, 
    getCart 
  } = useCart();

  useEffect(() => {
    // Só faz fetch se não tiver dados e não estiver carregando
    if (!cart && !loading && !error) {
      getCart();
    }
  }, [cart, loading, error, getCart]);

  if (loading && !cart) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-6">
          Erro ao carregar o carrinho: {error}
        </div>
        <Button onClick={getCart}>Tentar novamente</Button>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-600 mb-6">
            Parece que você ainda não adicionou nenhum produto ao carrinho.
          </p>
          <Link to="/products">
            <Button>Continuar comprando</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seu Carrinho ({itemCount})</h1>
        <Button 
          variant="outline" 
          onClick={() => clearCart()} 
          size="sm"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Limpar Carrinho
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemList 
            items={cart.items} 
            onUpdate={updateItem}
            onRemove={removeItem}
            loading={loading}
          />
        </div>
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
  );
};
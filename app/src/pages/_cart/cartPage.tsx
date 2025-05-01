import React, { useEffect } from 'react';

import { useCart } from '~/src/hooks/useCart';

import Container from '~/src/components/layout/Container/container';
import CartItemList from '~/src/components/cart/List/cart.list';
import CartSummary from '~/src/components/cart/Summary/cart.summary';
import { Button } from '~/src/components/ui/Button/button';

import { ShoppingBag, Trash2, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

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
        <h1 className="text-2xl font-bold mb-6">Seu Carrinho </h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6 text-neutral-900 dark:text-neutral-100">
          Seu Carrinho
        </h1>
        <div className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 mb-6">
          Ocorreu um problema ao carregar seu carrinho. <br />
          <span className="italic">{error}</span>
        </div>
        <Button variant="outline" onClick={getCart}>
          Tentar novamente
        </Button>
      </div>
    );
  }
  
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto p-6  mt-16">
        <h1 className="text-2xl font-light mb-6 text-neutral-900 dark:text-neutral-100">
          Seu Carrinho 
        </h1>
        <div className="bg-neutral-10  p-8 rounded-lg text-center border border-neutral-300 border-none">
          <ShoppingBag className="mx-auto h-16 w-16 font-light text-neutral-400 dark:text-neutral-500 mb-4" />
          <h2 className="text-xl font-medium text-neutral-800 dark:text-neutral-100 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Parece que você ainda não adicionou nenhum produto ao carrinho.
          </p>
          <Link to="/products">
            <Button variant="outline" className='border-none rounded-none font-light hover:bg-transparent'>Continuar comprando <ArrowRight  className='font-light pl-2'/></Button>
          </Link>
        </div>
      </div>
    );
  }
  

  return (
    <Container maxWidth='full' padding={false} className='mt-24 p-6'>
      <div className="flex justify-between items-center mb-6 ">
        <h1 className="text-2xl font-light">Seu Carrinho ({itemCount})</h1>
        <Button 
          variant="outline" 
          onClick={() => clearCart()} 
          size="sm"
          disabled={loading}
          className='rounded-none border-none shadow-none font-light hover:bg-transparent hover:border hover:border-b-zinc-600'
        >
          <Trash2 className="h-4 w-4 mr-2 font-light" />
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
    </Container>
  );
};
import React from 'react';
import ProductCard from '../Card/card';
import type { Product } from '~/src/services/type';
import { useProducts } from '~/src/hooks/useStorage';

const ProductGrid = () => {
  const { products, loading, error, pagination, getProducts } = useProducts();

  React.useEffect(() => {
    getProducts(1); // Carrega a primeira página ao montar
  }, []);

  if (loading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos: {error}</div>;

  return (
        <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))}
        </div>
        
        {/* Paginação */}
        {pagination.pages > 1 && (
            <div className="flex justify-center mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                key={page}
                onClick={() => getProducts(page)}
                className={`mx-1 px-4 py-2 rounded ${pagination.page === page ? 'bg-black text-white' : 'bg-gray-200'}`}
                >
                {page}
                </button>
            ))}
            </div>
        )}
        </div>
  );
};

export default ProductGrid;
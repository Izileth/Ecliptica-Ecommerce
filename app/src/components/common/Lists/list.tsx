// src/components/common/ProductListing/ProductListing.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { listProduct } from '~/src/services/produtcService';

// Tipos para a API
interface ApiProduct {
  id: string;
  nome: string;
  preco: number;
  imagem_principal: string;
  slug: string;
  categoria: string;
  estoque: number;
  promocao?: {
    preco_promocional: number;
    ate: string;
  };
}

// Tipos para o componente
export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  category: string;
  stock: number;
  hasPromo?: boolean;
  promoPrice?: number;
  promoEnd?: string;
}

interface ProductListingProps {
  initialPage?: number;
  itemsPerPage?: number;
  categoryFilter?: string;
}

const ProductListing: React.FC<ProductListingProps> = ({
  initialPage = 1,
  itemsPerPage = 12,
  categoryFilter,
}) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ maxWidth: 1024 });

  // Estados
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Determina colunas baseado no tamanho da tela
  const getGridColumns = () => {
    if (isMobile) return 2;
    if (isTablet) return 3;
    return 4;
  };

  const [columns, setColumns] = useState(getGridColumns());

  // Atualiza colunas quando o tamanho da tela muda
  useEffect(() => {
    setColumns(getGridColumns());
  }, [isMobile, isTablet]);

  // Função para buscar produtos
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await listProduct.getProducts({
        page: currentPage,
        limit: itemsPerPage,
        categoria: categoryFilter,
        busca: searchTerm,
      });

      // Transforma os dados da API
      const formattedProducts: Product[] = response.data.map((prod: ApiProduct) => ({
        id: prod.id,
        name: prod.nome,
        price: prod.preco,
        imageUrl: prod.imagem_principal,
        slug: prod.slug,
        category: prod.categoria,
        stock: prod.estoque,
        hasPromo: !!prod.promocao,
        promoPrice: prod.promocao?.preco_promocional,
        promoEnd: prod.promocao?.ate,
      }));

      setProducts(formattedProducts);
      setTotalPages(response.totalPages);

      // Pré-busca da próxima página
      if (currentPage < response.totalPages) {
        listProduct.getProducts({
          page: currentPage + 1,
          limit: itemsPerPage,
          categoria: categoryFilter,
        });
      }
    } catch (err) {
      setError('Erro ao carregar produtos. Tente novamente mais tarde.');
      console.error('Erro na busca de produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, categoryFilter, searchTerm]);

  // Busca produtos quando os parâmetros mudam
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Manipuladores de eventos
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset para a primeira página em novas buscas
    fetchProducts();
  };

  // Renderização do esqueleto durante loading
  if (loading && products.length === 0) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`}>
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="border rounded-lg p-3">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
            <Skeleton className="mt-1 h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Tratamento de erro
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // Sem resultados
  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum produto encontrado.</p>
        <button
          onClick={() => {
            setSearchTerm('');
            setCurrentPage(1);
          }}
          className="mt-2 px-4 py-2 text-blue-500 underline"
        >
          Limpar filtros
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filtros e busca */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <form onSubmit={handleSearch} className="w-full md:w-1/3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              🔍
            </button>
          </div>
        </form>

        <div className="text-sm text-gray-500">
          Mostrando {products.length} de {totalPages * itemsPerPage} produtos
        </div>
      </div>

      {/* Grid de produtos */}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4`}>
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            onClick={() => navigate(`/produto/${product.slug}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/produto/${product.slug}`)}
          >
            <div className="relative aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {product.hasPromo && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Promo
                </span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
              <div className="mt-1 flex items-center gap-2">
                {product.hasPromo ? (
                  <>
                    <span className="text-lg font-bold text-red-500">
                      R$ {product.promoPrice?.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold">
                    R$ {product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500">{product.category}</span>
                <span className={`text-xs ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {product.stock > 0 ? 'Em estoque' : 'Esgotado'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &lt;
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Lógica para mostrar páginas próximas à atual
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2">...</span>
            )}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 border rounded"
              >
                {totalPages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
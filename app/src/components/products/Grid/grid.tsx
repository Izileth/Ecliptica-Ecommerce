import React from "react";
import ProductCard from "../../products/Card/card";
import type { Product } from "~/src/services/type";
import { useProducts } from "~/src/hooks/useProducts";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "~/src/components/imported/button";

const ProductGrid = () => {
  const { 
    products, 
    loading, 
    error, 
    pagination, 
    getProducts,
    filters 
  } = useProducts();

  React.useEffect(() => {
    getProducts(1, filters);
  }, []);

  const handlePageChange = (page: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    getProducts(page, filters);
  };

  const renderPagination = () => {
    const { page, pages, hasNextPage, hasPrevPage } = pagination;
    const maxVisiblePages = 5;
    let startPage: number, endPage: number;

    if (pages <= maxVisiblePages) {
      startPage = 1;
      endPage = pages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
      
      if (page <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (page + maxPagesAfterCurrent >= pages) {
        startPage = pages - maxVisiblePages + 1;
        endPage = pages;
      } else {
        startPage = page - maxPagesBeforeCurrent;
        endPage = page + maxPagesAfterCurrent;
      }
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-12">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrevPage || loading}
          className="gap-1 px-2.5"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">Anterior</span>
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={loading}
              className="px-3.5"
            >
              1
            </Button>
            {startPage > 2 && <PaginationEllipsis />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((p) => (
          <Button
            key={p}
            variant={page === p ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(p)}
            disabled={loading}
            className="px-3.5"
          >
            {p}
          </Button>
        ))}

        {endPage < pages && (
          <>
            {endPage < pages - 1 && <PaginationEllipsis />}
            <Button
              variant={page === pages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pages)}
              disabled={loading}
              className="px-3.5"
            >
              {pages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNextPage || loading}
          className="gap-1 px-2.5"
        >
          <span className="sr-only sm:not-sr-only">Próximo</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const PaginationEllipsis = () => (
    <Button variant="outline" size="sm" className="px-2.5" disabled>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );

  if (loading && products.length === 0) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorState retry={() => getProducts(1, filters)} />;
  }

  if (products.length === 0) {
    return <EmptyState resetFilters={() => getProducts(1, { ...filters, page: 1 })} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pagination.pages > 1 && renderPagination()}

      <div className="text-center text-sm text-gray-500 mt-4">
        Mostrando {products.length} de {pagination.total} produtos
      </div>
    </div>
  );
};

// Componentes auxiliares
const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-lg aspect-square animate-pulse" />
      ))}
    </div>
  </div>
);

const ErrorState = ({ retry }: { retry: () => void }) => (
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="text-red-500 mb-4">Erro ao carregar produtos</div>
    <Button variant="outline" onClick={retry}>
      Tentar novamente
    </Button>
  </div>
);

const EmptyState = ({ resetFilters }: { resetFilters: () => void }) => (
  <div className="container mx-auto px-4 py-12 text-center">
    <div className="text-gray-500 mb-4">Nenhum produto encontrado</div>
    <Button variant="outline" onClick={resetFilters}>
      Limpar filtros
    </Button>
  </div>
);

export default ProductGrid;
import React from "react";
import ProductCard from "../../products/Card/card";
import type { Product } from "~/src/types/type";
import { useProducts } from "~/src/hooks/useProducts";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "~/src/components/imported/button";

const ProductGrid = () => {
  const {
    products = [],
    loading,
    error,
    pagination = {
      page: 1,
      pages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      total: 0,
      limit: 10,
    },
    getProducts,
    filters,
  } = useProducts();

  // Carrega os produtos inicialmente
  React.useEffect(() => {
    getProducts(1, filters);
  }, [getProducts]);

  // Debug: monitora mudanças na paginação
  React.useEffect(() => {
    console.log("Paginação atualizada:", pagination);
  }, [pagination]);

  const handlePageChange = (page: number) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    getProducts(page, filters);
  };

  React.useEffect(() => {
    console.log("Produtos recebidos:", products);

    // Verificar duplicidade de IDs
    const ids = products.map((p) => p.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.error(
        "ALERTA: IDs duplicados encontrados!",
        ids.filter((id, index) => ids.indexOf(id) !== index)
      );
    }

    // Verificar IDs vazios
    const emptyIds = ids.filter((id) => !id);
    if (emptyIds.length > 0) {
      console.error("ALERTA: IDs vazios ou nulos encontrados!");
    }
  }, [products]);

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
              key="page-btn-1"
            >
              1
            </Button>
            {startPage > 2 && <PaginationEllipsis key="ellipsis-start" />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const pageNum = startPage + i;
          return (
            <Button
              key={`page-btn-${pageNum}`}
              variant={page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              disabled={loading}
              className="px-3.5"
            >
              {pageNum}
            </Button>
          );
        })}

        {endPage < pages && (
          <>
            {endPage < pages - 1 && <PaginationEllipsis key="ellipsis-end" />}
            <Button
              variant={page === pages ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pages)}
              disabled={loading}
              className="px-3.5"
              key={`page-btn-${pages}`}
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

  const PaginationEllipsis = ({ key }: { key: string }) => (
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
    return (
      <EmptyState
        resetFilters={() => getProducts(1, { ...filters, page: 1 })}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={`product-${product.id}`} product={product} />
        ))}
      </div>

      {pagination.pages > 1 && renderPagination()}

      <div className="text-center text-sm text-gray-500 mt-4">
        Mostrando {products.length} de {pagination.total} produtos
        {pagination.total > pagination.limit && (
          <span>
            {" "}
            (Página {pagination.page} de {pagination.pages})
          </span>
        )}
      </div>
    </div>
  );
};

// Componentes auxiliares (mantidos iguais)
const LoadingSkeleton = () => (
  <section className="bg-transparent py-10 sm:py-16">
    <div className="mx-auto max-w-full px-2 sm:px-2 lg:px-4">
      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {[...Array(4)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="flex flex-col space-y-3"
          >
            <div className="aspect-[3/4] w-full animate-pulse rounded-sm bg-neutral-200"></div>
            <div className="h-4 w-2/3 animate-pulse rounded-sm bg-neutral-200"></div>
            <div className="h-3 w-1/2 animate-pulse rounded-sm bg-neutral-200"></div>
            <div className="h-4 w-1/4 animate-pulse rounded-sm bg-neutral-200"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
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

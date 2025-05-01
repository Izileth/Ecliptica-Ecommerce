import React from "react";
import ProductCard from "../../products/Card/card";
import type { Product } from "~/src/types/type";
import { useProducts } from "~/src/hooks/useProducts";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "~/src/components/imported/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import type { PaginationState } from "@tanstack/react-table";
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

  // Estado local para a paginação
  const [tableState, setTableState] = React.useState<PaginationState>({
    pageIndex: pagination.page - 1, // TanStack Table usa base-0 para as páginas
    pageSize: pagination.limit,
  });

  // Sincronizar o estado local com o estado do backend
  React.useEffect(() => {
    setTableState({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  // Configuração da tabela TanStack
  const table = useReactTable({
    data: products,
    columns: [
      {
        id: "product",
        accessorFn: (row) => row,
      },
    ],
    pageCount: pagination.pages,
    state: {
      pagination: tableState,
    },
    onPaginationChange: setTableState,
    manualPagination: true, // Importante para paginação controlada pelo servidor
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Efeito para carregar produtos quando a página muda
  React.useEffect(() => {
    const page = tableState.pageIndex + 1; // Convertendo de volta para base-1
    getProducts(page, filters);
  }, [tableState.pageIndex, getProducts, filters]);

  // Debug: monitor de mudanças na paginação
  React.useEffect(() => {
    console.log("Paginação atualizada:", pagination);
  }, [pagination]);

  // Verifica produtos com problemas de ID
  const hasEmptyIds = products.some((p) => !p.id);
  const hasDuplicateIds =
    new Set(products.map((p) => p.id)).size !== products.length;

  if (hasEmptyIds || hasDuplicateIds) {
    console.error("Problema com IDs:", {
      products,
      emptyIds: products.filter((p) => !p.id).map((p) => p.name),
      duplicateIds: products
        .map((p) => p.id)
        .filter((id, i, arr) => arr.indexOf(id) !== i),
    });
  }

  // Função para gerar chaves seguras
  const getSafeKey = (product: Product, index: number) => {
    if (!product.id) {
      return `product-${index}-${product.name?.substring(0, 20)}-${
        product.price
      }`;
    }
    return `product-${product.id}`;
  };

  // Componente para ellipsis
  const PaginationEllipsis = () => (
    <Button variant="outline" size="sm" className="px-2.5" disabled>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );

  // Manipulador de mudança de página unificado
  const handlePageChange = (newPage: number) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // -1 porque o TanStack Table usa base-0 para páginas
    table.setPageIndex(newPage - 1);
  };

  // Estados de Loading, Error e Empty
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

  // Componente principal com grid e paginação
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {table.getRowModel().rows.map((row, index) => {
          const product = row.original;
          return (
            <ProductCard
              key={getSafeKey(product, index)}
              product={product}
            />
          );
        })}
      </div>

      {/* Paginação do TanStack Table */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-1 mt-12">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || loading}
            className="gap-1 px-2.5"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Anterior</span>
          </Button>

          {/* Primeira página e ellipsis */}
          {table.getPageCount() > 5 && table.getState().pagination.pageIndex > 1 && (
            <>
              <Button
                variant={table.getState().pagination.pageIndex === 0 ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={loading}
                className="px-3.5"
              >
                1
              </Button>
              {table.getState().pagination.pageIndex > 2 && (
                <PaginationEllipsis key="ellipsis-start" />
              )}
            </>
          )}

          {/* Páginas vizinhas */}
          {Array.from({ length: Math.min(5, table.getPageCount()) }, (_, i) => {
            // Cálculo para mostrar as páginas certas
            let pageIndex: number;
            const currentPageIndex = table.getState().pagination.pageIndex;
            const pageCount = table.getPageCount();

            if (pageCount <= 5) {
              // Se temos menos de 5 páginas, mostra todas
              pageIndex = i;
            } else if (currentPageIndex < 2) {
              // Nas primeiras páginas
              pageIndex = i;
            } else if (currentPageIndex > pageCount - 3) {
              // Nas últimas páginas
              pageIndex = pageCount - 5 + i;
            } else {
              // No meio
              pageIndex = currentPageIndex - 2 + i;
            }

            // Garantir que não excedemos os limites
            if (pageIndex < 0 || pageIndex >= pageCount) return null;

            // O número da página para exibir (base-1)
            const pageNumber = pageIndex + 1;

            return (
              <Button
                key={`page-btn-${pageNumber}`}
                variant={currentPageIndex === pageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(pageIndex)}
                disabled={loading}
                className="px-3.5"
              >
                {pageNumber}
              </Button>
            );
          })}

          {/* Última página e ellipsis */}
          {table.getPageCount() > 5 && 
           table.getState().pagination.pageIndex < table.getPageCount() - 2 && (
            <>
              {table.getState().pagination.pageIndex < table.getPageCount() - 3 && (
                <PaginationEllipsis key="ellipsis-end" />
              )}
              <Button
                variant={
                  table.getState().pagination.pageIndex === table.getPageCount() - 1
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={loading}
                className="px-3.5"
              >
                {table.getPageCount()}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || loading}
            className="gap-1 px-2.5"
          >
            <span className="sr-only sm:not-sr-only">Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

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
          <div key={`skeleton-${index}`} className="flex flex-col space-y-3">
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
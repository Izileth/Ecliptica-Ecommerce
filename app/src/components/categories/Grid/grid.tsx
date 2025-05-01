import { useEffect, useState } from "react";
import { useMediaQuery } from "~/src/hooks/useMobile";
import { useProducts } from "~/src/hooks/useProducts";
import type { ProductFilterApiParams } from "~/src/types/type";
import ProductCard from "~/src/components/products/Card/card";
import { Spinner } from "~/src/components/ui/Spinner/spinner";
import { Title } from "~/src/components/hero/Titles/titles";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "~/src/lib/utils";
import { Button } from "~/src/components/imported/button";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import type { PaginationState } from "@tanstack/react-table";

interface CategoryGridProps {
  category: string;
  title?: string;
  description?: string;
  mobileColumns?: number;
  className?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  category,
  title = category,
  description = `Confira nossa coleção de ${category.toLowerCase()}`,
  mobileColumns = 2,
  className = "",
}) => {
  const { products, loading, error, pagination, getProducts } = useProducts();
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Estado local para a paginação
  const [tableState, setTableState] = useState<PaginationState>({
    pageIndex: (pagination?.page || 1) - 1, // TanStack Table usa base-0 para as páginas
    pageSize: pagination?.limit || 10,
  });

  // Sincronizar o estado local com o estado do backend
  useEffect(() => {
    if (pagination) {
      setTableState({
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      });
    }
  }, [pagination?.page, pagination?.limit]);

  // Configuração da tabela TanStack
  const table = useReactTable({
    data: products,
    columns: [
      {
        id: "product",
        accessorFn: (row) => row,
      },
    ],
    pageCount: pagination?.pages || 1,
    state: {
      pagination: tableState,
    },
    onPaginationChange: setTableState,
    manualPagination: true, // Importante para paginação controlada pelo servidor
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Efeito para carregar produtos quando a página muda
  useEffect(() => {
    const page = tableState.pageIndex + 1; // Convertendo de volta para base-1
    getProducts(page, { ...appliedFilters, category });
  }, [tableState.pageIndex, appliedFilters, category, getProducts]);

  const handleFilter = (filters: ProductFilterApiParams) => {
    getProducts(1, filters);
  };

  // Componente para ellipsis
  const PaginationEllipsis = () => (
    <Button variant="outline" size="sm" className="px-2.5" disabled>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        ease: [0.22, 1, 0.36, 1],
        duration: 0.6,
      },
    },
  };

  if (loading && !products.length) {
    return (
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
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn("py-16 text-center", className)}
      >
        <p className="text-sm font-light text-red-500">
          Não foi possível carregar os produtos. Por favor, tente novamente.
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn("mx-auto max-w-full lg:px-4 py-12 sm:px-6 ", className)}>
      {/* Filtro com animação */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        ></motion.div>
      </AnimatePresence>

      {/* Cabeçalho */}
      <AnimatePresence>
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 px-2 text-center"
          >
            {title && <Title align="center" title={title} subtitle={description}></Title>}
          </motion.div>
        )}
      </AnimatePresence>

      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-16 text-center"
        >
          <p className="text-sm font-light text-neutral-500">
            Nenhum produto encontrado nesta categoria.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Grid de produtos com 2 colunas em mobile */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              "grid gap-x-4 gap-y-8 px-2 sm:px-0",
              `grid-cols-${mobileColumns}`,
              "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            )}
          >
            {table.getRowModel().rows.map((row, index) => {
              const product = row.original;
              return (
                <motion.div
                  key={product.id || `product-${index}`}
                  variants={itemVariants}
                  custom={index}
                  className="h-full"
                >
                  <ProductCard product={product} />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Paginação com animação */}
          {pagination?.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex flex-col items-center justify-center gap-4"
            >
              <div className="flex items-center gap-1">
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
                  let pageIndex: number;
                  const currentPageIndex = table.getState().pagination.pageIndex;
                  const pageCount = table.getPageCount();

                  if (pageCount <= 5) {
                    pageIndex = i;
                  } else if (currentPageIndex < 2) {
                    pageIndex = i;
                  } else if (currentPageIndex > pageCount - 3) {
                    pageIndex = pageCount - 5 + i;
                  } else {
                    pageIndex = currentPageIndex - 2 + i;
                  }

                  if (pageIndex < 0 || pageIndex >= pageCount) return null;
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

              <div className="text-center text-sm text-gray-500">
                Mostrando {products.length} de {pagination.total} produtos
                {pagination.total > pagination.limit && (
                  <span>
                    {" "}
                    (Página {pagination.page} de {pagination.pages})
                  </span>
                )}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryGrid;
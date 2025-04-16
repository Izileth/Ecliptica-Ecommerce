import { useEffect, useState } from "react";
import { useMediaQuery } from "~/src/hooks/useMobile";
import { useProducts } from "~/src/hooks/useProducts";

import type { ProductFilterApiParams } from "~/src/services/type";

import ProductCard from "~/src/components/products/Card/card";
import { Spinner } from "~/src/components/ui/Spinner/spinner";
import { Title } from "~/src/components/hero/Titles/titles";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { cn } from "~/src/lib/utils";

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

  useEffect(() => {
    getProducts(1, { ...appliedFilters, category });
  }, [category, appliedFilters, getProducts]);

  const handleFilter = (filters: ProductFilterApiParams) => {
    // No need for adapter anymore as the component returns the correct format
    getProducts(1, filters);
  };
  const handlePageChange = (page: number) => {
    getProducts(page, { ...appliedFilters, category });
  };

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
      <div className={cn("flex justify-center items-center py-24", className)}>
        <Spinner className="h-8 w-8" />
      </div>
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
    <div
      className={cn("mx-auto max-w-full lg:px-4 py-12 sm:px-6 ", className)}
    >
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
            {title && <Title title={title} subtitle={description}></Title>}
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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                custom={index}
                className="h-full"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          {/* Paginação com animação */}
          {pagination.pages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12 flex items-center justify-center"
            >
              <nav
                className="flex items-center space-x-1"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.page - 1))
                  }
                  disabled={pagination.page === 1}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => {
                    const isCurrentPage = pagination.page === page;
                    const isFirstPage = page === 1;
                    const isLastPage = page === pagination.pages;
                    const isNearCurrentPage =
                      Math.abs(page - pagination.page) <= 1;

                    if (isFirstPage || isLastPage || isNearCurrentPage) {
                      return (
                        <motion.button
                          key={page}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          onClick={() => handlePageChange(page)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                            isCurrentPage
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                          aria-current={isCurrentPage ? "page" : undefined}
                        >
                          {page}
                        </motion.button>
                      );
                    } else if (
                      (page === 2 && pagination.page > 3) ||
                      (page === pagination.pages - 1 &&
                        pagination.page < pagination.pages - 2)
                    ) {
                      return (
                        <motion.span
                          key={page}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="inline-flex h-9 w-9 items-center justify-center text-sm text-neutral-400"
                        >
                          …
                        </motion.span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(pagination.pages, pagination.page + 1)
                    )
                  }
                  disabled={pagination.page === pagination.pages}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 transition-colors hover:border-neutral-900 hover:text-neutral-900 disabled:opacity-50"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryGrid;

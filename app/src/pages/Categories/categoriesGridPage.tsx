// CategoryGrid.tsx

import type React from "react";
import { useEffect, useState } from "react";
import { useProducts } from "~/src/hooks/useProducts";
import ProductCard from "~/src/components/products/Card/card";
import ProductFilter from "~/src/components/products/Filter/filter";
import type { ProductFilterFormValues } from "~/src/services/type";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryGridProps {
  category: string;

  //Opicional
  title?: string;
  description?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  category,
  // Opcional
  title = category,
  description = `Confira nossa coleção de ${category.toLowerCase()}`,
}) => {
  const { products, loading, error, pagination, getProducts } = useProducts();
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    getProducts(1, { ...appliedFilters, category });
  }, [category, appliedFilters, getProducts]);

  const handleFilter = (filters: ProductFilterFormValues) => {
    setAppliedFilters(filters);
  };

  const handlePageChange = (page: number) => {
    getProducts(page, { ...appliedFilters, category });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-light text-red-500">
          Não foi possível carregar os produtos. Por favor, tente novamente.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <ProductFilter onFilter={handleFilter} />
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-sm font-light text-neutral-500">
            Nenhum produto encontrado nesta categoria.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="mt-12 flex items-center justify-center">
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
                    // Show limited page numbers with ellipsis for better UX
                    const isCurrentPage = pagination.page === page;
                    const isFirstPage = page === 1;
                    const isLastPage = page === pagination.pages;
                    const isNearCurrentPage =
                      Math.abs(page - pagination.page) <= 1;

                    if (isFirstPage || isLastPage || isNearCurrentPage) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                            isCurrentPage
                              ? "bg-neutral-900 text-white"
                              : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                          aria-current={isCurrentPage ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === 2 && pagination.page > 3) ||
                      (page === pagination.pages - 1 &&
                        pagination.page < pagination.pages - 2)
                    ) {
                      return (
                        <span
                          key={page}
                          className="inline-flex h-9 w-9 items-center justify-center text-sm text-neutral-400"
                        >
                          …
                        </span>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryGrid;

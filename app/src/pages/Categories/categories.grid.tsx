// CategoryGrid.tsx
import React from 'react';
import ProductCard from '~/src/components/Unics/Card/card';
import { useProducts } from '~/src/hooks/useStorage';
import ProductFilter from '~/src/components/Unics/Filter/filter';
import type { ProductFilterFormValues } from '~/src/services/type';

interface CategoryGridProps {
  category: string;
  title?: string;
  description?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ 
    category, 
    title = category,
    description = `Confira nossa coleção de ${category.toLowerCase()}`
    }) => {
    const { products, loading, error, pagination, getProducts } = useProducts();
    const [appliedFilters, setAppliedFilters] = React.useState<Record<string, any>>({});

    React.useEffect(() => {
        getProducts(1, { ...appliedFilters, category });
    }, [category, appliedFilters]);

    const handleFilter = (filters: ProductFilterFormValues) => {
        setAppliedFilters(filters);
    };

    if (loading) return <div className="text-center py-12">Carregando produtos...</div>;
    if (error) return <div className="text-center py-12 text-red-500">Erro ao carregar produtos: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </header>

        <ProductFilter onFilter={handleFilter} />

        {products.length === 0 ? (
            <div className="text-center py-12">
            <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
            </div>
        ) : (
            <>
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
                    onClick={() => getProducts(page, { ...appliedFilters, category })}
                    className={`mx-1 px-4 py-2 rounded ${pagination.page === page ? 'bg-black text-white' : 'bg-gray-200'}`}
                    >
                    {page}
                    </button>
                ))}
                </div>
            )}
            </>
        )}
        </div>
    );
    };

export default CategoryGrid;
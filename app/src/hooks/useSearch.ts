import { useCallback, useState } from 'react';
import { useProducts } from './useProducts';
import type { ProductFilterApiParams, Product } from '../services/type';

export const useProductSearch = () => {
    const { getProducts, loading, error } = useProducts();
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Função auxiliar para validar filtros
    const validateFilters = (filters: Partial<ProductFilterApiParams>): ProductFilterApiParams => {
        return {
            page: 1, // Sempre começa na página 1 para buscas
            limit: 5, // Limite padrão para resultados de busca
            sortBy: 'name',
            sortOrder: 'asc',
            ...filters
        };
    };

    // Função principal de busca
    const searchProducts = useCallback(
        async (searchTerm: string, additionalFilters: Partial<ProductFilterApiParams> = {}) => {
            if (!searchTerm.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const filters = validateFilters({
                    name: searchTerm,
                    ...additionalFilters
                });

                const response = await getProducts(filters);
                setSearchResults(response.data);
            } catch (err) {
                console.error("Search error:", err);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [getProducts]
    );

    // Função para limpar resultados
    const clearSearch = useCallback(() => {
        setSearchResults([]);
    }, []);

    return {
        searchProducts,
        searchResults,
        isSearching: isSearching || loading,
        error,
        clearSearch
    };
};
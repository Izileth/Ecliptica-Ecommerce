import { useCallback, useState, useRef } from 'react';
import { useProducts } from './useProducts';
import type { Product } from '../services/type';

export const useProductSearch = () => {
    const { getProducts } = useProducts();
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchCache = useRef<Record<string, Product[]>>({});
    const lastQuery = useRef<string>('');
    
    const searchProducts = useCallback(
        async (searchTerm: string) => {
            // Se já temos no cache e é a mesma query, evite refazer a busca
            if (searchCache.current[searchTerm]) {
                setSearchResults(searchCache.current[searchTerm]);
                return;
            }
            
            // Evite chamar a API se o termo de busca for muito curto
            if (searchTerm.trim().length < 2) {
                setSearchResults([]);
                return;
            }
            
            // Se a busca é igual à última, não fazemos novamente
            if (searchTerm === lastQuery.current) return;
            
            lastQuery.current = searchTerm;
            
            try {
                setIsSearching(true);
                
                const response = await getProducts(1, {
                    name: searchTerm,
                    limit: 5,
                    sortBy: 'name',
                    sortOrder: 'asc'
                });
                
                // Armazene no cache
                searchCache.current[searchTerm] = response.data;
                setSearchResults(response.data);
            } catch (error) {
                console.error("Search failed:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        [getProducts]
    );
    
    return {
        searchProducts,
        searchResults,
        isSearching
    };
};
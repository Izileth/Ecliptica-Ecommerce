import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from '~/src/hooks/useProducts';
import { useProductSearch } from "~/src/hooks/useSearch";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/src/components/imported/command";

interface SearchResult {
    id: string;
    title: string;
    category: string;
    path: string;
    imageUrl: string;
    price: number;
    salePrice: number | null;
}

export default function SearchComponent() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    
    // Referências para controle de estado e comportamento
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const dialogRef = useRef<HTMLDivElement>(null);
    const lastOpenState = useRef(false);
    
    // Hook de busca
    const { searchResults, searchProducts, isSearching } = useProductSearch();
   
    const { getFeaturedProducts, products, loading: productsLoading } = useProducts();
    const [loadingSuggestions, setLoadingSuggestions] = useState(true);

    const suggestedItems = useMemo(() => {
        if (!productsLoading && products.length > 0) {
            setLoadingSuggestions(false);
            return getFeaturedProducts(6).map(product => ({
                id: product.id,
                title: product.name,
                category: product.category,
                path: `/products/${product.id}`,
                imageUrl: product.image || '/placeholder.svg',
                price: product.price,
                salePrice: product.salePrice
            }));
        }
        return [];
    }, [products, productsLoading, getFeaturedProducts]);

    // Pré-carrega produtos quando o modal abre
    useEffect(() => {
        if (open && products.length === 0) {
            getFeaturedProducts(6);
        }
    }, [open]);
    
    // Função para executar busca com debounce
    const debouncedSearch = useCallback((searchTerm: string) => {
        // Limpa o timeout anterior se existir
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        
        // Cria um novo timeout
        searchTimeoutRef.current = setTimeout(() => {
            if (searchTerm.trim()) {
                searchProducts(searchTerm);
            }
        }, 300);
    }, [searchProducts]);
  

    useEffect(() => {
        // Buscar independentemente se o diálogo está aberto ou não
        debouncedSearch(query);
        
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [query, debouncedSearch]);
    // Efeito para gerenciar events de teclado (atalho Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prevOpen => !prevOpen);
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    useEffect(() => {
        console.log('Search results changed:', searchResults);
    }, [searchResults]);
    
    useEffect(() => {
        console.log('Query changed:', query);
    }, [query]);

    // Efeito para persistir o foco no diálogo
    useEffect(() => {
        if (open && !lastOpenState.current) {
            // Se acabou de abrir, foque no input após uma pequena pausa
            const timer = setTimeout(() => {
                const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                if (input) input.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
        lastOpenState.current = open;
    }, [open]);
    
    // Efeito para limpar a busca quando o modal fecha
    useEffect(() => {
        if (!open) {
            // Não limpe instantaneamente, aguarde a animação de fechamento
            const timer = setTimeout(() => {
                if (!open) setQuery("");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [open]);
    
    // Transforma os resultados de busca
    const results = useMemo(() => {
        return searchResults.map(product => ({
            id: product.id,
            title: product.name,
            category: product.category,
            path: `/products/${product.id}`,
            imageUrl: product.image || '/placeholder.svg',
            price: product.price,
            salePrice: product.salePrice
        }));
    }, [searchResults]);

    // Função para navegar até a rota selecionada (com melhor gerenciamento de eventos)
    const handleSelect = useCallback((result: SearchResult) => {
        navigate(result.path);
        setOpen(false);
    }, [navigate]);

    // Função para gerenciar mudança de valor no input
    const handleValueChange = useCallback((newValue: string) => {
        setQuery(newValue);
    }, []);

    // Função para gerenciar a mudança de estado do modal
    const handleOpenChange = useCallback((newOpenState: boolean) => {
        setOpen(newOpenState);
    }, []);

    // Seções populares fixas
    const popularSections = useMemo(() => [
        { title: "Novidades", path: "releases" },
        { title: "Promoções", path: "colections/mens" },
        { title: "Mais Vendidos", path: "products" },
    ], []);

    return (
        <>
            <motion.button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm border border-neutral-200 rounded-full bg-white hover:bg-neutral-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Search className="h-4 w-4 text-neutral-500" />
                <span className="text-neutral-600">Buscar produtos</span>
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-neutral-200 bg-neutral-50 px-1.5 font-mono text-xs text-neutral-500 ml-2">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </motion.button>

            <CommandDialog 
                open={open} 
                onOpenChange={handleOpenChange}
            >
                <div className="border-b border-neutral-100">
                    <CommandInput
                        placeholder="Busque por produtos, categorias..."
                        value={query}
                        onValueChange={handleValueChange}
                        className="py-4 text-base focus:outline-none"
                    />
                </div>
                <CommandList className="py-2 max-h-[70vh]">
                    <CommandEmpty>
                        <AnimatePresence mode="wait">
                            {isSearching ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-10 text-center"
                                >
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-neutral-400" />
                                    <p className="mt-2 text-sm text-neutral-500">Buscando produtos...</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-10 text-center"
                                >
                                    <p className="text-sm text-neutral-500">
                                        {query ? "Nenhum resultado encontrado." : "Digite para buscar produtos."}
                                    </p>
                                    <p className="text-xs text-neutral-400 mt-1">
                                        {query ? "Tente buscar por outro termo." : "Ex: Camiseta, Calça Jeans"}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CommandEmpty>

                    {!query && results.length === 0 && (
                        <CommandGroup heading="Produtos em Destaque" className="px-2">
                            {loadingSuggestions ? (
                                <div className="py-4 flex justify-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                                </div>
                            ) : suggestedItems.length > 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ staggerChildren: 0.05 }}
                                >
                                    {suggestedItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CommandItem
                                                value={`suggest-${item.id}`}
                                                onSelect={() => handleSelect(item)}
                                                className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-lg hover:bg-neutral-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-800 truncate">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-neutral-500">
                                                            {item.category}
                                                        </p>
                                                        {item.salePrice ? (
                                                            <>
                                                                <span className="text-xs line-through text-neutral-400">
                                                                    R$ {item.price?.toFixed(2)}
                                                                </span>
                                                                <span className="text-xs text-red-500 font-medium">
                                                                    R$ {item.salePrice.toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-neutral-700 font-medium">
                                                                R$ {item.price?.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                            </CommandItem>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="py-4 text-center text-sm text-neutral-500">
                                    Nenhum destaque disponível
                                </div>
                            )}
                        </CommandGroup>
                    )}

                    {results.length > 0 && (
                        <CommandGroup heading="Resultados" className="px-2">
                            <AnimatePresence>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ staggerChildren: 0.05 }}
                                >
                                    {results.map((result) => (
                                        <motion.div
                                            key={result.id}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <CommandItem
                                                value={`result-${result.id}`} // Valor único para cada item
                                                onSelect={() => handleSelect(result)}
                                                className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-lg hover:bg-neutral-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                                                    <img
                                                        src={result.imageUrl || "/placeholder.svg"}
                                                        alt={result.title}
                                                        className="w-full h-full object-cover"
                                                        loading="lazy"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-neutral-800 truncate">
                                                        {result.title}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs text-neutral-500">
                                                            {result.category}
                                                        </p>
                                                        {result.salePrice ? (
                                                            <>
                                                                <span className="text-xs line-through text-neutral-400">
                                                                    R$ {result.price?.toFixed(2)}
                                                                </span>
                                                                <span className="text-xs text-red-500 font-medium">
                                                                    R$ {result.salePrice.toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-neutral-700 font-medium">
                                                                R$ {result.price?.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <ArrowRight className="h-3.5 w-3.5 text-neutral-400 flex-shrink-0" />
                                            </CommandItem>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </CommandGroup>
                    )}
                     
                    <CommandGroup heading="Seções Populares" className="px-2 mt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {popularSections.map((section) => (
                                <CommandItem
                                    key={section.path}
                                    value={`section-${section.path}`} // Valor único para cada seção
                                    onSelect={() => {
                                        navigate(section.path);
                                        setOpen(false);
                                    }}
                                    className="flex items-center justify-center py-3 rounded-lg hover:bg-neutral-50 transition-colors"
                                >
                                    <span className="text-sm text-neutral-700">{section.title}</span>
                                </CommandItem>
                            ))}
                        </div>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
}
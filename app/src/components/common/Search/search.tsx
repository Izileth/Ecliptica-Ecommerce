import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "~/src/hooks/useProducts"; // Ajuste o caminho conforme necessário
import {
  Command,
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
    
    // Use o hook de produtos
    const { products, loading, getProducts } = useProducts();
    
    // Efeito para escutar o atalho de teclado (Ctrl+K ou ⌘+K)
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Busca produtos quando a query muda
    useEffect(() => {
        if (open && query.trim()) {
            getProducts({ name: query, page: 1, limit: 5 });
        }
    }, [query, open, getProducts]);

    

    // Transforma os produtos em resultados de busca
    const results = useMemo<SearchResult[]>(() => {
        return products.map(product => ({
            id: product.id,
            title: product.name,
            category: product.category,
            path: `/products/${product.id}`,
            imageUrl: product.image,
            price: product.price,
            salePrice: product.salePrice
        }));
    }, [products]);

    // Função para navegar até a rota selecionada
    const handleSelect = (result: SearchResult) => {
        navigate(result.path);
        setOpen(false);
        setQuery("");
    };

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

            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="border-b border-neutral-100">
                    <CommandInput
                        placeholder="Busque por produtos, categorias..."
                        value={query}
                        onValueChange={setQuery}
                        className="py-4 text-base focus:outline-none"
                    />
                </div>
                <CommandList className="py-2 max-h-[70vh]">
                    <CommandEmpty>
                        <AnimatePresence mode="wait">
                            {loading ? (
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
                                                onSelect={() => handleSelect(result)}
                                                className="flex items-center gap-3 py-3 px-2 cursor-pointer rounded-lg hover:bg-neutral-50 transition-colors"
                                            >
                                                <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                                                    <img
                                                        src={result.imageUrl || "/placeholder.svg"}
                                                        alt={result.title}
                                                        className="w-full h-full object-cover"
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
                            {[
                                { title: "Novidades", path: "/novidades" },
                                { title: "Promoções", path: "/promocoes" },
                                { title: "Mais Vendidos", path: "/mais-vendidos" },
                            ].map((section) => (
                                <CommandItem
                                    key={section.path}
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
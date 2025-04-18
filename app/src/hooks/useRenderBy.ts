import { useState, useEffect, useCallback } from "react";
import { useProducts } from "./useProducts";
import type { Product } from "../types/type";

export const useLatestReleases = (
  minCount: number = 4,
  maxCount: number = 8
) => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    products,
    getProducts,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  // Função para selecionar e embaralhar parcialmente os lançamentos
  const getLatestProducts = useCallback(
    (productList: Product[], count: number): Product[] => {
      // Ordena por data de criação (mais recentes primeiro)
      const sortedByDate = [...productList].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      // Pega os produtos mais recentes (top 20)
      const newestProducts = sortedByDate.slice(0, 20);

      // Se não temos produtos suficientes, retornamos o que temos
      if (newestProducts.length <= count) {
        return newestProducts;
      }

      // Mantém os primeiros 30% fixos como "destaques garantidos"
      const guaranteedCount = Math.max(1, Math.floor(count * 0.3));
      const guaranteed = newestProducts.slice(0, guaranteedCount);

      // Embaralha o restante para seleção aleatória
      const remainingPool = newestProducts.slice(guaranteedCount);
      const shuffled = [...remainingPool].sort(() => 0.5 - Math.random());

      // Seleciona aleatoriamente os produtos restantes para completar a contagem
      const randomSelection = shuffled.slice(0, count - guaranteedCount);

      // Combina os garantidos com os aleatórios
      return [...guaranteed, ...randomSelection];
    },
    []
  );

  const refreshLatestProducts = useCallback(() => {
    if (products.length > 0) {
      // Determina um número aleatório entre minCount e maxCount
      const randomCount =
        Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
      const selected = getLatestProducts(products, randomCount);
      setLatestProducts(selected);
      setLoading(false);
    }
  }, [products, minCount, maxCount, getLatestProducts]);

  // Carrega os produtos e seleciona os lançamentos
  useEffect(() => {
    const loadLatestProducts = async () => {
      try {
        setLoading(true);

        // Se ainda não temos produtos, buscamos primeiro
        if (products.length === 0 && !productsLoading) {
          await getProducts(1, { sort: "newest" });
        } else if (!productsLoading && products.length > 0) {
          refreshLatestProducts();
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar lançamentos"
        );
        setLoading(false);
      }
    };

    loadLatestProducts();
  }, [products, productsLoading, getProducts, refreshLatestProducts]);

  // Atualiza o erro se houver problema na busca de produtos
  useEffect(() => {
    if (productsError) {
      setError(productsError);
    }
  }, [productsError]);

  return {
    latestProducts,
    loading,
    error,
    refreshLatestProducts,
  };
};

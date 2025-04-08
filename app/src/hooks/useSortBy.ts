import { useState, useEffect, useCallback } from "react";
import { useProducts } from "~/src/hooks/useProducts";
import type { Product } from "../services/type";

export const useFeaturedProducts = (
  minCount: number = 4,
  maxCount: number = 8
) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    products,
    getProducts,
    loading: productsLoading,
    error: productsError,
  } = useProducts();

  // Função para sortear aleatoriamente produtos
  const getRandomProducts = useCallback(
    (productList: Product[], count: number): Product[] => {
      // Assumindo que temos um campo para rastrear vendas (sales) ou popularidade
      const sortedByPopularity = [...productList].sort(
        (a, b) => (b.sales || 0) - (a.sales || 0)
      );

      // Pegamos os produtos mais vendidos (por exemplo, top 20)
      const topProducts = sortedByPopularity.slice(0, 20);

      // Se não temos produtos suficientes, retornamos o que temos
      if (topProducts.length <= count) {
        return topProducts;
      }

      // Embaralhamos e selecionamos a quantidade solicitada
      const shuffled = [...topProducts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    },
    []
  );

  const refreshFeaturedProducts = useCallback(() => {
    if (products.length > 0) {
      // Determina um número aleatório entre minCount e maxCount
      const randomCount =
        Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;
      const selected = getRandomProducts(products, randomCount);
      setFeaturedProducts(selected);
      setLoading(false);
    }
  }, [products, minCount, maxCount, getRandomProducts]);

  // Carrega os produtos e seleciona os destaques
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);

        // Se ainda não temos produtos, buscamos primeiro
        if (products.length === 0 && !productsLoading) {
          await getProducts(1, { sort: "popular" });
        } else if (!productsLoading && products.length > 0) {
          refreshFeaturedProducts();
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar produtos em destaque"
        );
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, [products, productsLoading, getProducts, refreshFeaturedProducts]);

  // Atualiza o erro se houver problema na busca de produtos
  useEffect(() => {
    if (productsError) {
      setError(productsError);
    }
  }, [productsError]);

  return {
    featuredProducts,
    loading,
    error,
    refreshFeaturedProducts,
  };
};

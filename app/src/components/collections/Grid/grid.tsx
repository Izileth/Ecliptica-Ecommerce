import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "~/src/hooks/useProducts";
import ProductCard from "../../products/Card/card";
import { Spinner } from "~/src/components/ui/Spinner/spinner";
import { Button } from "~/src/components/imported/button";
import { Link } from "react-router-dom";
import { useMediaQuery } from "~/src/hooks/useMobile";
import { Title } from "../../hero/Titles/titles";

interface CollectionGridProps {
  collection: string;
  title?: string;
  description?: string;
  showAllLink?: boolean;
  limit?: number;
  className?: string;
  mobileColumns?: number; // Nova prop para controle de colunas mobile
}

export function CollectionGrid({
  collection,
  title,
  description,
  showAllLink = true,
  limit = 8,
  className = "",
  mobileColumns = 2, // Padrão de 2 colunas para mobile
}: CollectionGridProps) {
  const { products, loading, getCollectionProducts, clearError } =
    useProducts();
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    clearError();
    getCollectionProducts(collection, 1, limit);
  }, [collection, limit, getCollectionProducts, clearError]);

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

  // Definição dinâmica das colunas baseada no tamanho da tela
  const gridColumnsClass = isMobile
    ? `grid-cols-${mobileColumns}`
    : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  if (loading && !products.length) {
    return (
      <div className={`flex justify-center items-center max-w-full h-64 ${className}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Spinner className="h-10 w-full text-neutral-300" />
        </motion.div>
      </div>
    );
  }

  if (!products.length && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`text-center py-16 ${className}`}
      >
        <h3 className="text-xl font-medium text-neutral-600">
          Nenhum produto encontrado na coleção "{collection}"
        </h3>
      </motion.div>
    );
  }

  return (
    <section className={`space-y-14 mb-14 px-0 lg:px-4  max-w-full ${className}`}>
      <AnimatePresence>
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-full mx-auto px-2"
          >
            {title && <Title title={title} subtitle={description}></Title>}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`grid grid-cols-${mobileColumns} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10  w-full max-w-full`}
      >
        {products.slice(0, limit).map((product, index) => (
          <motion.div
            key={product.id}
            variants={itemVariants}
            className="h-full w-full"
            custom={index} // Para animação escalonada
          >
            <ProductCard
              product={product}
              // Adiciona margem reduzida apenas entre colunas no mobile
            />
          </motion.div>
        ))}
      </motion.div>

      {showAllLink && products.length > limit && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mt-8 px-4"
        >
          <Button
            asChild
            variant="outline"
            className="rounded-full px-8 py-6 h-auto text-sm font-normal border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
          >
            <Link to={`/collections/${collection}`}>Ver todos os produtos</Link>
          </Button>
        </motion.div>
      )}
    </section>
  );
}

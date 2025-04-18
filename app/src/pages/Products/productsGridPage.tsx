import { useProducts } from "~/src/hooks/useProducts";

import Carousel from "~/src/components/common/Carousel/carousel";
import Container from "~/src/components/layout/Container/container";
import ProductGrid from "~/src/components/products/Grid/grid";
import ProductFilter from "~/src/components/products/Filter/filter";
import BlogBanner from "~/src/components/common/Banner/banner";

import type { ProductFilterApiParams } from "~/src/types/type";

import { DataProducts } from "~/src/data/products/product";

export function Products() {
  const { getProducts } = useProducts();

  const handleFilter = (filters: ProductFilterApiParams) => {
    getProducts(1, filters);
  };
  return (
    <Container maxWidth="full" padding="sm">
      <Carousel
        items={DataProducts}
        variant="overlay"
        contentPosition="right"
        showDots={false}
        showProgress={true}
        height="h-[80vh]"
        className="mt-20"
      />
      <ProductFilter
        onFilter={handleFilter}
        maxPriceLimit={2000}
        initialCategory=""
        collections={["Verão", "Inverno", "Casual", "Fitness"]}
      />
      <ProductGrid />
      <BlogBanner />
    </Container>
  );
}

import Carousel from "~/src/components/common/Carousel/carousel"
import Container from "~/src/components/common/Container/container"
import ProductGrid from "~/src/components/Unics/Grid/grid";
import ProductFilter from "~/src/components/Unics/Filter/filter";
import { useProducts } from "~/src/hooks/useStorage";
import type { ProductFilterFormValues } from '~/src/services/type';
import { FilterAdapter } from '../../utils/filterAdapter';

export function Products() {
    const { getProducts } = useProducts();

    // Tipagem explícita para os filtros
    const handleFilter = (filters: ProductFilterFormValues) => {
        const apiFilters = FilterAdapter.toApi(filters); // Conversão correta
        getProducts(1, apiFilters); 
    };
    const overlayItems = [
        {
            id: 1,
            imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/a25721b4-ddcc-48c3-bf40-27f77e1e2a1d/Leonardo_Kino_XL_A_model_in_a_clean_studio_with_a_light_beige_3.jpg",
            title: "Nova Temporada",
            subtitle: "Descubra as tendências que definirão a próxima estação.",
            buttonText: "Explorar Novidades",
            navigateTo: "/collections/new-season",
        },
        {
            id: 2,
            imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/a25721b4-ddcc-48c3-bf40-27f77e1e2a1d/Leonardo_Kino_XL_A_model_in_a_clean_studio_with_a_light_beige_2.jpg",
            title: "Coleção Exclusiva",
            subtitle: "Peças únicas desenvolvidas pelos nossos designers.",
            buttonText: "Ver Exclusivos",
            navigateTo: "/collections/exclusive",
        },
    ]
      
    return (
        <Container maxWidth="full" padding="sm">
            <Carousel
                items={overlayItems}
                variant="overlay"
                contentPosition="right"
                showDots={false}
                showProgress={true}
                height="h-[80vh]" 
                className="mt-20"
            />
            <ProductFilter  onFilter={handleFilter} />
            <ProductGrid />
        </Container>
    );
  }
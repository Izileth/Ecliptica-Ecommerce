import Carousel from "~/src/components/common/Carousel/carousel"
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
        getProducts(1, apiFilters); // Aqui deve esperar ProductFilterApiParams
      };
      
    return (
       <>
        <Carousel
                items={[
                    {
                        id: 1,
                        imageUrl: 'https://i.ytimg.com/vi/jWzDeLLwdUw/maxresdefault.jpg',
                        title: 'Coleção Verão 2023',
                        subtitle: 'Novos looks para a estação mais quente',
                        buttonText: 'Ver coleção',
                        navigateTo: '/products/summer',
                    },
                    {
                        id: 2,
                        imageUrl: 'https://wallpaperaccess.com/full/5130362.jpg',
                        title: 'Ofertas Especiais',
                        subtitle: 'Até 50% de desconto em itens selecionados',
                        buttonText: 'Comprar agora',
                        navigateTo: '/products',
                        state: { fromBanner: true }, // Estado adicional
                    },
                    {
                        id: 3,
                        imageUrl: 'https://ohmagazinerd.com/wp-content/uploads/2022/03/Desfile-2-2500x1667.jpg',
                        title: 'Coleção Inverno 2024',
                        subtitle: 'Até 20% de desconto em itens selecionados',
                        buttonText: 'Comprar agora',
                        navigateTo: '/products/sale/snown',
                        state: { fromBanner: true }, // Estado adicional
                    }    
                ]}
                className="h-[600px] mb-6 mt-20"
                imageClassName="h-[600px]"
                contentClassName="bg-gradient-to-r from-black/60 to-transparent"
                
            />
            <ProductFilter  onFilter={handleFilter} />
            <ProductGrid />
       </>
    );
  }
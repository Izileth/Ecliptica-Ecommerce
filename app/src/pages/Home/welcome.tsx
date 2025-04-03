import { useState } from "react"
import Carousel from "~/src/components/common/Carousel/carousel"
import CategoriesGrid from "~/src/components/common/Grid/grid"
import type { Category } from "~/src/components/common/Grid/grid"
export default function Welcome(){
    const [products, setProducts] = useState([])
    const categories: Category[] = [
        {
            id: '1',
            name: 'Feminino',
            imageUrl: 'https://dorisantunes.com.br/wp-content/uploads/2020/05/unnamed-6.jpg',
            slug: 'feminino',
            description: 'Looks para todos os momentos',
        },
        {
            id: '2',
            name: 'Masculino',
            imageUrl: 'https://th.bing.com/th/id/OIP.xYS2KClqPvurlcFOB9OobQHaJO?w=640&h=797&rs=1&pid=ImgDetMain',
            slug: 'masculino',
            description: 'Looks para todos os momentos',
            isNew: true,
        },
        {
            id: '3',
            name: 'Casual',
            imageUrl: 'https://i.pinimg.com/originals/08/d5/4e/08d54e874585c6c9e59b262f0a5ddf64.jpg',
            slug: 'Clássico',
            description: 'Looks para todos os momentos',
        },
        {
            id: '4',
            name: 'Moderno',
            imageUrl: 'https://th.bing.com/th/id/OIP.unlLI_YQvwXI08Vy1gOl7AHaLH?w=733&h=1100&rs=1&pid=ImgDetMain',
            slug: 'Estilos',
            description: 'Looks para todos os momentos',
        },
    ];
    // Fetch products from your API or local storage
    //...

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
            <CategoriesGrid categories={categories} />
        </>
        
        
        
    )
}


import { useState } from "react"
import Carousel from "~/src/components/common/Carousel/carousel"
import Container from "~/src/components/common/Container/container"
import CategoriesGrid from "~/src/components/common/Grid/grid"
import type { Category } from "~/src/components/common/Grid/grid"
export default function Welcome(){
    const [products, setProducts] = useState([])
    const categories: Category[] = [
        {
            id: '1',
            name: 'Feminino',
            imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/75a373fc-409b-415f-9ef4-f046e9bdff8c/Leonardo_Kino_XL_A_woman_with_striking_features_poses_in_a_flo_2.jpg',
            slug: 'feminino',
            description: 'Looks para todos os momentos',
        },
        {
            id: '2',
            name: 'Masculino',
            imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/deaae888-2264-4af5-9fa8-3de1fcaab012/Leonardo_Kino_XL_A_stylish_man_poses_against_a_minimalist_urba_3.jpg',
            slug: 'masculino',
            description: 'Looks para todos os momentos',
            isNew: true,
        },
        {
            id: '3',
            name: 'Casual',
            imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/0e8f34bc-10ce-441b-a0d6-606056c78eb9/Leonardo_Kino_XL_A_laidback_young_man_poses_in_a_sunny_environ_3.jpg',
            slug: 'Clássico',
            description: 'Looks para todos os momentos',
        },
        {
            id: '4',
            name: 'Moderno',
            imageUrl: 'https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/bb26ef5d-e797-49b6-bf55-267377efd28c/Leonardo_Kino_XL_A_fashionista_model_poses_in_a_futuristic_env_2.jpg',
            slug: 'Estilos',
            description: 'Looks para todos os momentos',
        },
    ];
    const minimalItems = [
        {
            id: 1,
            imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/ecc296c6-cd21-42ca-9374-b07a6bd5b708/Leonardo_Kino_XL_A_model_with_striking_features_walks_down_a_b_0.jpg",
            title: "Minimalismo Elegante",
            subtitle: "Menos é mais. Descubra nossa coleção de peças minimalistas.",
            buttonText: "Explorar",
            navigateTo: "/collections/minimal",
            overlayOpacity: 0,
        },
        {
            id: 2,
            imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/256bf1f3-8863-4193-bbf4-bf6b8e8fe671/Leonardo_Kino_XL_A_woman_in_a_gold_sequined_couture_dress_pose_3.jpg",
            title: "Essenciais",
            subtitle: "Peças atemporais para um guarda-roupa versátil.",
            buttonText: "Ver Coleção",
            navigateTo: "/collections/essentials",
            overlayOpacity: 0,
        },
        {
            id: 2,
            imageUrl: "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/d61721f8-9ec9-486a-b43b-44e12e509525/Leonardo_Kino_XL_A_sophisticated_woman_with_a_striking_gaze_po_3.jpg",
            title: "Essenciais",
            subtitle: "Peças atemporais para um guarda-roupa versátil.",
            buttonText: "Ver Coleção",
            navigateTo: "/collections/essentials",
            overlayOpacity: 0,
        },
      ]
    // Fetch products from your API or local storage
    //...

    return (
        <Container maxWidth="full" padding="sm">
            <Carousel
            items={minimalItems}
            variant="minimal"
            contentPosition="center"
            showDots={true}
            showProgress={false}
            height="h-[80vh]"
            className="mt-20"
            />
            <CategoriesGrid 
            categories={categories}
            
            />
        </Container>
    )
}


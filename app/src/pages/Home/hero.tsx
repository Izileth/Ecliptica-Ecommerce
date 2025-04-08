import { useState } from "react"
import Carousel from "~/src/components/common/Carousel/carousel"
import Container from "~/src/components/common/Container/container"
import CategoriesGrid from "~/src/components/categories/Grid/grid"
import type { Category } from "~/src/components/categories/Grid/grid"
export default function Welcome(){
    const [products, setProducts] = useState([])
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
            <CategoriesGrid />
        </Container>
    )
}


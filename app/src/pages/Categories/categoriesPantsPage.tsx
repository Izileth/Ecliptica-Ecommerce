// CalcasGrid.tsx
import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "./categoriesGridPage";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
import type { ProductFilterApiParams} from "~/src/services/type"
import { useProducts } from "~/src/hooks/useProducts";
const CalcasGrid = () => {
  return (
    <Container maxWidth="full" padding="sm" className="mt-20">
      <CategoryBanner
        category="Calças"
        title="Conforto em Movimento"
        description="Modelagens inteligentes para acompanhar seu ritmo — do casual ao ousado, sempre com personalidade."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8565d002-4115-465b-ab25-0b402178fa4a/Leonardo_Kino_XL_Fashionforward_person_walking_on_a_clean_city_3.jpg"
        textPosition="center"
        textColor="light"
        overlayOpacity={0.5}
      >
        <Button
          variant="outline"
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          Explore Collection
        </Button>
      </CategoryBanner>
      <CategoryGrid
        category="Calças"
        title="Calças que Acompanham Seu Ritmo"
        description="Estilo e mobilidade para cada passo do seu dia"
      />
    </Container>
  );
};

export default CalcasGrid;

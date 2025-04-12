// CalcasGrid.tsx
import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "./categoriesGridPage";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
const CalcasGrid = () => {
  return (
    <Container maxWidth="full" padding="sm" className="mt-20">
      <CategoryBanner
        category="Calças"
        title="Premium Audio Devices"
        description="Experience sound like never before with our high-fidelity audio collection."
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
        title="Calças Premium"
        description="Conforto e estilo em nossa seleção de calças para todos os momentos"
      />
    </Container>
  );
};

export default CalcasGrid;

// VestidosGrid.tsx
import Container from "~/src/components/common/Container/container";
import CategoryGrid from "./categoriesGridPage";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
const AcessoriosGrid = () => {
  return (
    <Container maxWidth="full" padding="sm" className="mt-20">
      <CategoryBanner
        category="Acessórios"
        title="Premium Audio Devices"
        description="Experience sound like never before with our high-fidelity audio collection."
        imageUrl="/placeholder.svg?height=480&width=1200"
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
        category="Acessórios"
        title="Elegância em Acessórios"
        description="Acessórios para todas as ocasiões, desde o dia a dia até eventos especiais"
      />
    </Container>
  );
};

export default AcessoriosGrid;

// CamisetasGrid.tsx
import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "./categoriesGridPage";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
const CamisetasGrid = () => {
  return (
    <Container maxWidth="full" padding="sm" className="mt-20">
      <CategoryBanner
        category="Camisas"
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
          {" "}
          Explore Collection
        </Button>
      </CategoryBanner>
      <CategoryGrid
        category="Camisetas"
        title="Nossa Coleção de Camisetas"
        description="Descubra as melhores camisetas com designs exclusivos e tecidos de alta qualidade"
      />
    </Container>
  );
};

export default CamisetasGrid;

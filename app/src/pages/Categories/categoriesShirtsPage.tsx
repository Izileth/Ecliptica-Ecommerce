import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const CamisetasGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Camisas"
        title="A Base do Seu Estilo"
        description="Camisetas versáteis que elevam o básico ao extraordinário. Para todos os momentos, todos os dias."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/35ebd228-7835-4ddf-9112-7422e71d695f/Leonardo_Kino_XL_A_young_modern_man_wearing_a_minimalist_cotto_1.jpg"
        textPosition="center"
        textColor="light"
        overlayOpacity={0.5}
      >
          <Button onClick={scrollToContent} variant="outline" className="mt-4 text-zinc-100 bg-transparent border-none rounded-none">
          Explorar Coleção
          <ArrowDown/>
        </Button>
      </CategoryBanner>
      <Container maxWidth="full" className="px-0 mx-0 p-0" padding={false} id="grid">
        <CategoryGrid
          category="Camisetas"
          title="Camisetas que Falam por Você"
          description="Do básico ao ousado, conforto com personalidade"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default CamisetasGrid;

import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const CalcasGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Calças"
        title="Conforto em Movimento"
        description="Modelagens inteligentes para acompanhar seu ritmo — do casual ao ousado, sempre com personalidade."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8565d002-4115-465b-ab25-0b402178fa4a/Leonardo_Kino_XL_Fashionforward_person_walking_on_a_clean_city_3.jpg"
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
          category="Calças"
          title="Calças que Acompanham Seu Ritmo"
          description="Estilo e mobilidade para cada passo do seu dia"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default CalcasGrid;

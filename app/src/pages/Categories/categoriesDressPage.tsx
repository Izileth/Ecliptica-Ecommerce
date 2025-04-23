import Container from "~/src/components/layout/Container/container";
import CategoryGrid from "~/src/components/categories/Grid/grid";
import { CategoryBanner } from "~/src/components/categories/Banner/banner";
import BlogBanner from "~/src/components/common/Banner/banner";
import { Button } from "~/src/components/imported/button";

import { ArrowDown } from "lucide-react";
const VestidosGrid = () => {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CategoryBanner
        category="Vestidos"
        title="Fluidez Que Encanta"
        description="Vestidos que dançam com o corpo, exalam elegância e destacam sua beleza natural."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/ac911869-b1b4-43c0-9cd0-55fa01b5dc91/Leonardo_Kino_XL_Elegant_young_woman_wearing_a_flowy_light_dre_0.jpg"
        textPosition="left"
        textColor="light"
      >
          <Button onClick={scrollToContent} variant="outline" className="mt-4 text-zinc-100 bg-transparent border-none rounded-none">
          Explorar Coleção
          <ArrowDown/>
        </Button>
      </CategoryBanner>
      <Container maxWidth="full" className="px-0 mx-0 p-0" padding={false} id="grid">
        <CategoryGrid
          category="Vestidos"
          title="Vestidos Que Encantam"
          description="Leveza e elegância para todos os momentos"
        />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default VestidosGrid;

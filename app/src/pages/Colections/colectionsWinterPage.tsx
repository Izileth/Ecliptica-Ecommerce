import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";

import BlogBanner from "~/src/components/common/Banner/banner";
import { ArrowDown } from "lucide-react";
const WinterPage = () => {
  
  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding="lg" className="mt-20">
      <CollectionBanner
        collection="Inverno"
        title="Atemporal como o Frio"
        description="Encare a estação com peças elegantes, quentes e irresistíveis. Porque o inverno também é sobre estilo."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8eb00257-c2c1-4c25-9027-2c4ac7712fce/Leonardo_Kino_XL_Stylish_man_and_woman_walking_side_by_side_in_2.jpg"
        season="Inverno"
        year={2025}
        textPosition="center"
        overlayOpacity={0.4}
        className="my-8"
      >
          <Button onClick={scrollToContent} variant="outline" className="mt-4 text-zinc-100 bg-transparent border-none rounded-none">
          Explorar Coleção
          <ArrowDown/>
        </Button>
      </CollectionBanner>
      <Container maxWidth="full" padding="sm" id="grid">
      <CollectionGrid 
        title="Coleção Inverno"
        description="Enfrente o frio com atitude e sofisticação"
        collection="Inverno" />
      </Container>
      <BlogBanner/>  
    </Container>
  );
};

export default WinterPage;

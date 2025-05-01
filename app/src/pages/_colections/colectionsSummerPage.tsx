import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const SummerPage = () => {
  
  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CollectionBanner
        collection="Verão"
        title="Leveza Que Veste Bem"
        description="Cores vibrantes, tecidos frescos e cortes que respiram estilo. Viva o verão com autenticidade."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/a315f284-ae97-4ac0-810a-aa19218089f9/Leonardo_Kino_XL_Group_of_diverse_young_people_smiling_under_b_0.jpg"
        season="Verão"
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
      <Container maxWidth="full" padding={false} id="grid">
      <CollectionGrid 
        title="Coleção Verão"
        description="Leveza, cor e frescor para brilhar sob o sol"
        collection="Verão" />
      </Container>
        <BlogBanner/>
    </Container>
  );
};

export default SummerPage;

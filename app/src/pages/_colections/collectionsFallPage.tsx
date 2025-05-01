import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
import BlogBanner from "~/src/components/common/Banner/banner";

import { ArrowDown } from "lucide-react";
const FallPage = () => {
  
  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container maxWidth="full" padding={false} className="mt-20">
      <CollectionBanner
        collection="Outono"
        title="Sua Essência, Seu Estilo"
        description="Peças que celebram a liberdade, o charme e a força da mulher contemporânea."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/3840eb86-c0c7-41d9-85e2-82b0816b1f00/Leonardo_Kino_XL_Autumninspired_editorial_photo_with_casual_la_3.jpg"
        season="Outono"
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
        collection="Coleção Outono"
        title="A leveza das folhas no seu Estilo"
        description="Estilo, liberdade e elegância em cada detalhe"
      />
      </Container>
      <BlogBanner/>
    </Container>
  );
};

export default FallPage;

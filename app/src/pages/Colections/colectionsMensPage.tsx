import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";

import BlogBanner from "~/src/components/common/Banner/banner";
import { ArrowDown } from "lucide-react";
const MensPage = () => {

  
  const scrollToContent = () => {
    const categoriesSection = document.getElementById("grid");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <Container  maxWidth="full" padding={false} className="mt-20">
      <CollectionBanner
        collection="Masculina"
        title="Estilo que Impõe Presença"
        description="Peças pensadas para o homem moderno: atitude, conforto e autenticidade em cada detalhe."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/c6070fc9-b070-4830-9cbf-ce15fdc24889/Leonardo_Kino_XL_Modern_man_dressed_in_casual_yet_sophisticate_2.jpg"
        season="Primavera"
        year={2025}
        textPosition="center"
        overlayOpacity={0.4}
        className="mb-10"
      >
        <Button onClick={scrollToContent} variant="outline" className="mt-4 text-zinc-100 bg-transparent border-none rounded-none">
          Explorar Coleção
          <ArrowDown/>
        </Button>
      </CollectionBanner>
      <Container maxWidth="full" className="px-0 mx-0 p-0" padding={false} id="grid">
      <CollectionGrid 
        title="Coleção Masculina"
        description="Decubra o poder da Masculinhidade"
        collection="Masculina"
        className="w-full p-0 m-0"
         />
      </Container>
      <BlogBanner/>  
    </Container>
  );
};

export default MensPage;

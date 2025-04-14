import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
const WomanPage = () => {
  return (
    <Container maxWidth="full" padding="lg" className="mt-20">
      <CollectionBanner
        collection="Feminina"
        title="Sua Essência, Seu Estilo"
        description="Peças que celebram a liberdade, o charme e a força da mulher contemporânea."
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/51d9d107-7ec5-447e-ad7c-1dbaba682359/Leonardo_Kino_XL_Confident_woman_in_chic_modern_outfit_standin_1.jpg"
        season="Outono"
        year={2025}
        textPosition="center"
        overlayOpacity={0.4}
        className="my-8"
      >
        <Button variant="outline" className="mt-4 text-zinc-950">
          Explorar Coleção
        </Button>
      </CollectionBanner>
      <CollectionGrid 
        collection="Feminina"
        title="Coleção Feminina"
        description="Estilo, liberdade e elegância em cada detalhe"
      />
    </Container>
  );
};

export default WomanPage;

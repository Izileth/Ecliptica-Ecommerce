import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
const MensPage = () => {
  return (
    <Container maxWidth="full" padding="lg" className="mt-20">
      <CollectionBanner
        collection="Masculina"
        title="Coleção Essencial 2025"
        description="Peças atemporais para compor seu guarda-roupa perfeito"
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/c6070fc9-b070-4830-9cbf-ce15fdc24889/Leonardo_Kino_XL_Modern_man_dressed_in_casual_yet_sophisticate_2.jpg"
        season="Primavera"
        year={2023}
        textPosition="center"
        overlayOpacity={0.4}
        className="my-8"
      >
        <Button variant="outline" className="mt-4 text-zinc-950">
          Explorar Coleção
        </Button>
      </CollectionBanner>
      <CollectionGrid collection="Masculina" />
    </Container>
  );
};

export default MensPage;

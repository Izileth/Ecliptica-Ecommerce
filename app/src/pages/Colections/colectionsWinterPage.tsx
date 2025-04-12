import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
const WinterPage = () => {
  return (
    <Container maxWidth="full" padding="lg" className="mt-20">
      <CollectionBanner
        collection="Inverno"
        title="Coleção Essencial 2025"
        description="Peças atemporais para compor seu guarda-roupa perfeito"
        imageUrl="https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/8eb00257-c2c1-4c25-9027-2c4ac7712fce/Leonardo_Kino_XL_Stylish_man_and_woman_walking_side_by_side_in_2.jpg"
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
      <CollectionGrid collection="Inverno" />
    </Container>
  );
};

export default WinterPage;

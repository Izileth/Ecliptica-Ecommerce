import Container from "~/src/components/layout/Container/container";
import { CollectionGrid } from "~/src/components/collections/Grid/grid";
import { CollectionBanner } from "~/src/components/collections/Banner/banner";
import { Button } from "~/src/components/imported/button";
const SummerPage = () => {
  return (
    <Container maxWidth="full" padding="lg" className="mt-20">
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
        <Button variant="outline" className="mt-4 text-zinc-950">
          Explorar Coleção
        </Button>
      </CollectionBanner>
      <CollectionGrid 
        title="Coleção Verão"
        description="Leveza, cor e frescor para brilhar sob o sol"
        collection="Verão" />
    </Container>
  );
};

export default SummerPage;

//Componentes
import Carousel from "~/src/components/common/Carousel/carousel";
import { FeaturedProducts } from "~/src/components/products/SortBy/sort";
import { Title } from "~/src/components/common/Titles/titles";
import TestimonialCarousel from "~/src/components/common/Testmonials/carousel";
import { DiscountCTA } from "~/src/components/common/Offers/offers";
import CategoriesGrid from "~/src/components/common/Grid/grid";
import Container from "~/src/components/layout/Container/container";
import Section from "~/src/components/common/Section/section";
import EnhancedTagCarousel from "~/src/components/common/Tags/carousel";

//Icones
import { ChevronDown } from "lucide-react";

//Dados Estáticos
import { DataCarousel } from "~/src/data/carousel/carousel";
import { DataTestimonials } from "~/src/data/testmonials/testmonial";
import { DataTags } from "~/src/data/items/items";

export default function Welcome() {

  const scrollToContent = () => {
    const categoriesSection = document.getElementById("categories-section");
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Container maxWidth="full" padding="sm">
      {/* Hero Carousel Section */}
      <Section background="white" padding="sm" className="relative">
        <Carousel
          items={DataCarousel}
          variant="minimal"
          contentPosition="center"
          showDots={true}
          showProgress={false}
          height="h-[80vh]"
          className="absolute inset-0"
        />
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 transform">
          <button
            onClick={scrollToContent}
            className="flex flex-col items-center justify-center text-white transition-opacity duration-300 hover:opacity-70"
            aria-label="Scroll to content"
          >
            <span className="mb-2 font-serif text-sm tracking-widest">
              DESCUBRA
            </span>
            <ChevronDown className="h-6 w-6 animate-bounce" />
          </button>
        </div>
      </Section>

      <Section id="categories-section" background="white" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Title
            title="Categorias"
            subtitle="Desubra o Estilo Perfeito"
            color="dark"
          />
          <CategoriesGrid />
        </div>
      </Section>

      <Section background="white" className="relative">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <FeaturedProducts
            title="Produtos em Destaque"
            subtitle="Selecionados com exclusividade para você"
          />
        </div>
      </Section>

      <Section background="white" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Title
            title="Depoimentos"
            subtitle="Ficou na Duvida na hora de Pedir?, Veja os Relatos dos Compradores"
            color="dark"
          />
          <TestimonialCarousel testimonials={DataTestimonials} />
        </div>
      </Section>

      <Section background="white" className="relative">
        <div className="mx-auto max-w-7xl  px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Title
              title="Destaques e promoções"
              subtitle="Desubra o Estilo Perfeito"
              color="dark"
            />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <DiscountCTA
              variant="elegant"
              title="Coleção Verão"
              subtitle="Peças selecionadas com preços especiais"
              offerText="Até 30% OFF"
              navigateTo="colections/summer"
            />

            <DiscountCTA
              variant="primary"
              title="Acessórios"
              subtitle="Complementos perfeitos para seu estilo"
              offerText="Até 40% OFF"
              navigateTo="coletions/winter"
            />

            <DiscountCTA
              variant="secondary"
              title="Edição Limitada"
              subtitle="Peças exclusivas por tempo limitado"
              offerText="Novidades"
              navigateTo="colections/mens"
            />
          </div>
        </div>
      </Section>

      <Section background="white" className="relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
          <Title
              title="Fique Por Dentro"
              subtitle="Principais tendencias da Temporada"
              color="dark"
            />
            <EnhancedTagCarousel tags={DataTags.slice(0, 10)} itemsPerView={1} autoplayInterval={3000} />
          </div>
        </div>
      </Section>
    </Container>
  );
}

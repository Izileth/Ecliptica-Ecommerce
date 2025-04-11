import Carousel from "~/src/components/common/Carousel/carousel";
import { FeaturedProducts } from "~/src/components/products/SortBy/sort";
import TestimonialCarousel from "~/src/components/common/Testmonials/carousel";
import { DiscountCTA } from "~/src/components/common/Offers/offers";
import CategoriesGrid from "~/src/components/categories/Grid/grid";
import Container from "~/src/components/layout/Container/container";
import Section from "~/src/components/common/Section/section";
import { ChevronDown } from "lucide-react";
import { Title } from "~/src/components/common/Titles/titles";

export default function Welcome() {
  const minimalItems = [
    {
      id: 1,
      imageUrl:
        "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/ecc296c6-cd21-42ca-9374-b07a6bd5b708/Leonardo_Kino_XL_A_model_with_striking_features_walks_down_a_b_0.jpg",
      title: "Minimalismo Elegante",
      subtitle: "Menos é mais. Descubra nossa coleção de peças minimalistas.",
      buttonText: "Explorar",
      navigateTo: "/collections/minimal",
      overlayOpacity: 0,
    },
    {
      id: 2,
      imageUrl:
        "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/256bf1f3-8863-4193-bbf4-bf6b8e8fe671/Leonardo_Kino_XL_A_woman_in_a_gold_sequined_couture_dress_pose_3.jpg",
      title: "Essenciais",
      subtitle: "Peças atemporais para um guarda-roupa versátil.",
      buttonText: "Ver Coleção",
      navigateTo: "/collections/essentials",
      overlayOpacity: 0,
    },
    {
      id: 3,
      imageUrl:
        "https://cdn.leonardo.ai/users/c60a0145-a4a8-4ee5-91cf-76495889e8b2/generations/d61721f8-9ec9-486a-b43b-44e12e509525/Leonardo_Kino_XL_A_sophisticated_woman_with_a_striking_gaze_po_3.jpg",
      title: "Nova Coleção",
      subtitle: "Descubra as últimas tendências da estação.",
      buttonText: "Ver Coleção",
      navigateTo: "/collections/new",
      overlayOpacity: 0,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sofia Oliveira",
      role: "Cliente Premium",
      content:
        "A qualidade e elegância dos produtos superaram todas as minhas expectativas. Cada detalhe reflete um compromisso com a excelência que raramente encontro em outras marcas.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 2,
      name: "Rafael Mendes",
      role: "Colecionador",
      content:
        "Impressionado com a atenção aos detalhes e o acabamento impecável. A experiência de compra foi tão refinada quanto os próprios produtos.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 5,
    },
    {
      id: 3,
      name: "Isabela Costa",
      role: "Estilista",
      content:
        "Como profissional da moda, reconheço o valor do design atemporal e da qualidade duradoura. Esta marca consegue unir tradição e contemporaneidade de forma única.",
      avatar: "/placeholder.svg?height=80&width=80",
      rating: 4,
    },
  ];

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
          items={minimalItems}
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
          <TestimonialCarousel testimonials={testimonials} />
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
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 font-serif text-3xl font-light tracking-wide text-neutral-900 sm:text-4xl">
              Fique por dentro
            </h2>
            <p className="mb-8 text-sm font-light text-neutral-500">
              Cadastre-se para receber novidades, lançamentos e ofertas
              exclusivas.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <input
                type="email"
                placeholder="Seu e-mail"
                className="w-full border-b border-neutral-300 bg-transparent px-4 py-2 text-sm font-light text-neutral-900 outline-none transition-colors focus:border-neutral-900 sm:w-72"
              />
              <button className="w-full border border-neutral-900 bg-neutral-900 px-6 py-2 text-xs font-light tracking-wider text-white transition-colors hover:bg-transparent hover:text-neutral-900 sm:w-auto">
                ASSINAR
              </button>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}

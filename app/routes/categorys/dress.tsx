import type { Route } from "./+types/dress";
import VestidosGrid from "~/src/pages/Categories/categoriesDressPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vestidos | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Dress() {
  return <VestidosGrid />;
}

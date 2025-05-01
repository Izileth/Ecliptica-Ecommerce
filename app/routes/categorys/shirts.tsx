import type { Route } from "./+types/shirts";
import CamisetasGrid from "~/src/pages/_categories/categoriesShirtsPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Camisas | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Shirts() {
  return <CamisetasGrid />;
}

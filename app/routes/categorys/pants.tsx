import type { Route } from "./+types/pants";
import CalcasGrid from "~/src/pages/_categories/categoriesPantsPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Calças | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Pants() {
  return <CalcasGrid />;
}

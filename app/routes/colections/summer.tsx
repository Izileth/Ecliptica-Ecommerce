import type { Route } from "./+types/summer";
import SummerPage from "~/src/pages/_colections/colectionsSummerPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Temporada de Verão | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Unisex() {
  return <SummerPage />;
}

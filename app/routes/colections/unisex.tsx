import type { Route } from "./+types/unisex";
import SummerPage from "~/src/pages/Colections/colectionsSummerPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Temporada de Verão | Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Unisex() {
  return (
    <SummerPage/>
  );
}

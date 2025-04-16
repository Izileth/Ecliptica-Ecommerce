import { Wine } from "lucide-react";
import type { Route } from "./+types/winter";
import WinterPage from "~/src/pages/Colections/colectionsWinterPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Temporada De Inverno | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Seasson() {
  return (
    <WinterPage/>
  );
}

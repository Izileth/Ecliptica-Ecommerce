import type { Route } from "./+types/girls";
import WomanPage from "~/src/pages/Colections/colectionsWomenPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Moda Feminina | Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Woman() {
  return (
    <WomanPage/>
  )
}

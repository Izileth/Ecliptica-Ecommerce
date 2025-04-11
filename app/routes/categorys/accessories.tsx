import type { Route } from "./+types/accessories";
import AcessoriosGrid from "~/src/pages/Categories/categoritesAcessoriesPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Acessórios| Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Acessories() {
  return <AcessoriosGrid />;
}

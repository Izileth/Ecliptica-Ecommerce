import type { Route } from "./+types/accessories";
import VestidosGrid from "~/src/pages/Categories/categories.dress";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Acessórios| Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Acessories() {
  return <VestidosGrid />;
}

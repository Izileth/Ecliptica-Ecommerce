import type { Route } from "./+types/mens";
import MensPage from "~/src/pages/Colections/colectionsMensPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Moda Masculina | Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Mens() {
  return (
    <MensPage/>
  );
}

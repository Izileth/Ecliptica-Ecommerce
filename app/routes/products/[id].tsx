import type { Route } from "./+types/[id]";
import ProductDetails from "~/src/pages/Products/[id]/productDetailsPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Visualização do Produto | Ecliptica" },
        { name: "description", content: "Altere as Configurações Do Seu Produto" },
    ];
}

export default function Details() {
  return <ProductDetails />;
}

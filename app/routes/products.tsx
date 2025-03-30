import type { Route } from "./+types/home";
import { Products } from "~/src/pages/Products/products";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Produtos | STUDIO +" },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Product() {
  return <Products />;
}

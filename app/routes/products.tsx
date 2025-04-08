import type { Route } from "./products/+types/edit";
import { Products } from "~/src/pages/Products/products.grid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Produtos | Ecliptica " },
    { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
  ];
}

export default function Product() {
  return <Products />;
}

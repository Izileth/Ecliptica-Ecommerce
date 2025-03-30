
import type { Route } from "./+types/new";
import NewProductPage from "~/src/pages/Products/_new_product/new.product";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Novo Produto | Seu E-commerce" },
    { name: "description", content: "Crie e Lançe Um Novo Produto Hoje" },
  ];
}

export default function newProduct() {
  return <NewProductPage/> ;
}
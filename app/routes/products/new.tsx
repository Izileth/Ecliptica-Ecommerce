
import type { Route } from "./+types/new";
import NewProductPage from "~/src/pages/Products/productNewPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Novo Produto | Ecliptica" },
    { name: "description", content: "Crie e Lançe Um Novo Produto Hoje" },
  ];
}

export default function newProduct() {
  return <NewProductPage/> ;
}
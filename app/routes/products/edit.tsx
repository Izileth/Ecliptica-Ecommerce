import type { Route } from "../+types/home";
import EditProductPage from "~/src/pages/Products/product.update";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Atualização de Produto | Ecliptica" },
    { name: "description", content: "Altere as Configurações Do Seu Produto" },
  ];
}

export default function Edit() {
  return <EditProductPage />;
}

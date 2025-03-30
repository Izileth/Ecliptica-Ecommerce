import type { Route } from "../+types/home";
import EditProductPage from "~/src/pages/Products/_update_product/product.update";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Atualização de Produto" },
    { name: "description", content: "Altere as Configurações Do Seu Produto" },
  ];
}

export default function Edit() {
  return <EditProductPage />;
}

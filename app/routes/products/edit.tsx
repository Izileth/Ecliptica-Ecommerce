import type { Route } from "./+types/edit";
import EditProductPage from "~/src/pages/Products/[id]/productUpdatePage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Atualização de Produto | Ecliptica" },
    { name: "description", content: "Altere as Configurações Do Seu Produto" },
  ];
}

export default function Edit() {
  return <EditProductPage />;
}

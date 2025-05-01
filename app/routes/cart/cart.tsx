import type { Route } from "./+types/cart";
import { CartPage } from "~/src/pages/_cart/cartPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Visualização do Pedido| Ecliptica" },
    { name: "description", content: "Altere as Configurações Do Seu Produto" },
  ];
}

export default function Cart() {
  return <CartPage />;
}

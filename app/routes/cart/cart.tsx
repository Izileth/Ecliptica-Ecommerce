import type { Route } from "./+types/cart";
import { CartPage } from "~/src/pages/Cart/cartPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Visualização do Carrinho | Ecliptica" },
        { name: "description", content: "Altere as Configurações Do Seu Produto" },
    ];
}

export default function Cart() {
  return <CartPage />;
}

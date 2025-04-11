import type { Route } from "./+types/checkout";
import CheckoutPage from "~/src/pages/Cart/checkoutPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Pagamento de Pedidos | Ecliptica" },
        { name: "description", content: "Altere as Configurações Do Seu Produto" },
    ];
}

export default function Cart() {
  return <CheckoutPage />;
}
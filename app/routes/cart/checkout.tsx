import type { Route } from "./+types/checkout";
import CheckoutPage from "~/src/pages/Cart/checkoutPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Pagamento de Pedidos | Ecliptica" },
        { name: "description", content: "Adiquira um Produto Ecliptica" },
    ];
}

export default function Cart() {
  return <CheckoutPage />;
}
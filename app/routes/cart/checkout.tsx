import type { Route } from "./+types/checkout";
import CheckoutPage from "~/src/pages/_cart/checkoutPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout de Pedido | Ecliptica" },
    { name: "description", content: "Adiquira um Produto Ecliptica" },
  ];
}

export default function Cart() {
  return <CheckoutPage />;
}

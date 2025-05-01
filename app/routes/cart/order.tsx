import type { Route } from "./+types/checkout";
import OrderSuccessPage from "~/src/pages/_cart/orderPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Rastreamento de Pedido | Ecliptica" },
        { name: "description", content: "Seu Pedido Chegará em Breve!" },
    ];
}

export default function Cart() {
    return <OrderSuccessPage />;
}

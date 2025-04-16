import type { Route } from "./+types/fall";
import FallPage from "~/src/pages/Colections/collectionsFallPage";
export function meta({}: Route.MetaArgs) {
    return [
        { title: " Temporada de Outono| Ecliptica " },
        { name: "description", content: "Todos Os NossoS Produtos Em Um Só Lugar" },
    ];
}

export default function Fall() {
    return (
        <FallPage/>
    )
}

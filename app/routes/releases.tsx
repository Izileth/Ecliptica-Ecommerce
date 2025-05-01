import type { Route } from "./+types/releases";
import DestactsPage from "~/src/pages/_destacts/destactsPage";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Lançamentos | Ecliptica " },
        { name: "description", content: "Os lançementos mais recentes em um só lugar!" },
    ];
}

export default function Release() {
    return <DestactsPage/> ;
}

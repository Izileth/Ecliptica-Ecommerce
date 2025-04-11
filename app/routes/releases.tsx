import type { Route } from "./+types/releases";
import LatestReleasesPage from "~/src/pages/Releases/releasesPage";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Lançamentos | Ecliptica " },
        { name: "description", content: "Os lançementos mais recentes em um só lugar!" },
    ];
}

export default function Release() {
    return <LatestReleasesPage/> ;
}

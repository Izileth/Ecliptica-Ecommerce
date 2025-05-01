import type { Route } from "./+types/releases";
import ContactPage from "~/src/pages/_contact/contactPage";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Contato | Ecliptica " },
        { name: "description", content: "Duvidas, o Nosso Time Está A Postos!" },
    ];
}

export default function Contact() {
    return <ContactPage/> ;
}

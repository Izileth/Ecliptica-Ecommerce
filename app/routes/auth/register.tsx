import type { Route } from "../+types/home";
import { Registers } from "~/src/pages/Resgister/resgister";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resgistro | Ecliptica " },
    { name: "description", content: "Começe a Publicar Ainda Hoje!" },
  ];
}

export default function Register() {
  return <Registers />;
}

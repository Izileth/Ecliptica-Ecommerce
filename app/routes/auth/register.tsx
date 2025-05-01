import type { Route } from "./+types/register";
import { Registers } from "~/src/pages/_auth/resgisterPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resgistro | Ecliptica " },
    { name: "description", content: "Começe a Publicar Ainda Hoje!" },
  ];
}

export default function Register() {
  return <Registers />;
}

import type { Route } from "../+types/home";
import { ForgotPassword } from "~/src/pages/Auth/password";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redefiniçaõ de Senha | Ecliptica " },
    { name: "description", content: "Redefina a Sua Senha" },
  ];
}

export default function Forgot() {
  return <ForgotPassword />;
}

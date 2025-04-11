import type { Route } from "./+types/password";
import { ForgotPassword } from "~/src/pages/Auth/passwordPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redefiniçaõ de Senha | Ecliptica " },
    { name: "description", content: "Redefina a Sua Senha" },
  ];
}

export default function Forgot() {
  return <ForgotPassword />;
}

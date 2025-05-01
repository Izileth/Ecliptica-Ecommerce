import type { Route } from "./+types/password";
import { ForgotPassword } from "~/src/pages/_auth/passwordPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redefiniçaõ de Senha | Ecliptica " },
    { name: "description", content: "Redefina a Sua Senha" },
  ];
}

export default function Forgot() {
  return <ForgotPassword />;
}

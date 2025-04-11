import type { Route } from "./+types/reset";
import { ResetPassword } from "~/src/pages/Auth/resetPage";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Redefiniçaõ de Senha | Ecliptica " },
    { name: "description", content: "Redefina a Sua Senha" },
  ];
}

export default function Forgot() {
  return <ResetPassword />;
}

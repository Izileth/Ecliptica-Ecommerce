import type { Route } from "./+types/login";
import { Login } from "~/src/pages/_auth/loginPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | Ecliptica " },
    { name: "description", content: "Faça login para acessar sua conta" },
  ];
}

export default function SignIn() {
  return <Login />;
}

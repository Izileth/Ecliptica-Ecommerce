
import type { Route } from "./+types/home";
import { Login } from "~/src/pages/Login/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login | STUDIO +" },
    { name: "description", content: "Faça login para acessar sua conta" },
  ];
}

export default function SignIn() {
  return <Login/> ;
}
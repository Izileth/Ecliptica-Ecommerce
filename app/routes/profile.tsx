import type { Route } from "./+types/home";
import Profile from "~/src/pages/_profile/profilePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Perfil | Ecliptica " },
    { name: "description", content: "Adicione, Edite e Delete Seus Dados" },
  ];
}

export default function Profiles() {
  return <Profile/> ;
}

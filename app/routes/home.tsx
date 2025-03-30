import type { Route } from "./+types/home";
import Welcome from "~/src/pages/Welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "STUDIO +" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}

import type { Route } from "./+types/home";
import Welcome from "~/src/pages/Home/welcomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ecliptica " },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Welcome />;
}

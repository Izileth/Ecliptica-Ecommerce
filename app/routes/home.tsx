import type { Route } from "./+types/home";
import Hero from "~/src/pages/Hero/heroPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ecliptica " },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Hero />;
}

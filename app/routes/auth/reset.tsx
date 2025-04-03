import type { Route } from "../+types/home";
import { ResetPassword } from '~/src/pages/Forgot/reset';
export function meta({}: Route.MetaArgs) {
    return [
        { title: "Redefiniçaõ de Senha | Ecliptica " },
        { name: "description", content: "Redefina a Sua Senha" },
    ];
}

export default function Forgot() {
    return <ResetPassword />;
}

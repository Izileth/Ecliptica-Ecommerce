import { useForm } from "react-hook-form";

import { useAuthUser } from "../../hooks/useUser";
import { useNavigate } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import { Label } from "~/src/components/ui/Label/label";

import { Loader2 } from "lucide-react";

import { Link } from "react-router-dom";

// Schema de validação com Zod
const registerSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("E-mail inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const Registers = () => {
    const { register: registerUser, isLoading, error, clearError } = useAuthUser();
    const navigate = useNavigate();

    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        clearError();
        try {
            await registerUser({
                name: data.name,
                email: data.email,
                password: data.password
            });
            navigate("/profile");
        } catch (err) {
            // O erro já é tratado pelo hook
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Crie sua conta</h1>
                    <p className="mt-2 text-gray-600">Preencha os dados para se registrar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nome Completo</Label>
                            <Input
                                id="name"
                                type="text"
                                {...register("name")}
                                placeholder="Seu nome"
                                error={errors.name?.message}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="seu@email.com"
                                error={errors.email?.message}
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="••••••••"
                                error={errors.password?.message}
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirme sua Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                                placeholder="••••••••"
                                error={errors.confirmPassword?.message}
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Registrar
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-600">
                        Já tem uma conta?{" "}
                        <Link
                            to="/login"
                            className="font-medium text-zinc-950 hover:text-zinc-700"
                        >
                            Faça login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
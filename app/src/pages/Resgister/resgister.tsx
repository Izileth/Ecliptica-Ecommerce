import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
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
    const { register: registerUser, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
        await registerUser({
            name: data.name,
            email: data.email,
            password: data.password
        });
        navigate("/profile");
        } catch (err) {
        console.error("Registration error:", err);
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
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome Completo
                </Label>
                <Input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Seu nome"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
                </div>

                <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-mail
                </Label>
                <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="seu@email.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
                </div>

                <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                </Label>
                <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="••••••••"
                />
                {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                </div>

                <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirme sua Senha
                </Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...register("confirmPassword")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="••••••••"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
                </div>
            </div>

            <div>
                <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:inset-ring-zinc-700"
                disabled={isLoading}
                >
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
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
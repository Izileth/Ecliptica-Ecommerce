import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import { Label } from "~/src/components/ui/Label/label";
import { Loader2 } from "lucide-react";

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
    const { login, isLoading, error } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            await login(data);
            // Só navega se não houver erro
            navigate('/profile');
        } catch (err) {
          // O erro já é tratado pelo useAuth e exibido na interface
          // Não precisa fazer nada adicional aqui
        }
     };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
                    <p className="mt-2 text-gray-600">Entre na sua conta para continuar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
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
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                Lembrar de mim
                            </Label>
                        </div>

                        <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Esqueceu sua senha?
                        </a>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:inset-ring-zinc-800"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Entrar
                        </Button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 rounded-md text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="text-center text-sm text-gray-600">
                        Não tem uma conta?{" "}
                        <a
                            href="/register"
                            className="font-medium text-zinc-950 hover:text-zinc-900"
                        >
                            Registre-se
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

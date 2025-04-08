import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthUser } from "../../hooks/useUser";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import { Label } from "~/src/components/ui/Label/label";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Constantes para limitar tentativas automáticas
const MAX_AUTO_LOGIN_ATTEMPTS = 2;
const LOGIN_ATTEMPT_INTERVAL = 5000; // 5 segundos

export const Login = () => {
    const { login, isLoading, error, clearError, isAuthenticated, logout } = useAuthUser();
    const navigate = useNavigate();
    const [autoLoginAttempts, setAutoLoginAttempts] = useState(0);
    const [manualLoginRequired, setManualLoginRequired] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Verifica se há tentativas automáticas de login em excesso
    useEffect(() => {
        // Armazena a última tentativa para evitar loop
        const lastLoginAttempt = localStorage.getItem('lastLoginAttempt');
        const currentTime = Date.now();
        
        if (lastLoginAttempt && (currentTime - parseInt(lastLoginAttempt)) < LOGIN_ATTEMPT_INTERVAL) {
            setAutoLoginAttempts(prev => prev + 1);
        } else {
            setAutoLoginAttempts(1);
        }
        
        localStorage.setItem('lastLoginAttempt', currentTime.toString());
        
        // Se exceder o limite de tentativas, requer login manual
        if (autoLoginAttempts >= MAX_AUTO_LOGIN_ATTEMPTS) {
            setManualLoginRequired(true);
            // Limpa qualquer estado de autenticação que possa estar causando loops
            logout();
            localStorage.removeItem('authToken');
            sessionStorage.removeItem('authToken');
        }
    }, []);

    // Função para tratar o envio do formulário
    const onSubmit = async (data: LoginFormData) => {
        clearError(); // Limpa erros anteriores
        try {
            await login(data);
            // Reseta contadores de tentativas após login bem-sucedido
            setAutoLoginAttempts(0);
            setManualLoginRequired(false);
            localStorage.removeItem('lastLoginAttempt');
            navigate('/profile');
        } catch (err) {
            // O erro já é tratado pelo hook e exibido no estado
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo de volta</h1>
                    <p className="mt-2 text-gray-600">Entre na sua conta para continuar</p>
                </div>

                {manualLoginRequired && (
                    <div className="p-3 bg-yellow-50 rounded-md text-yellow-700 text-sm">
                        Detectamos várias tentativas automáticas de login. Por favor, faça login manualmente para continuar.
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4">
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
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <Label htmlFor="remember-me" className="ml-2">
                                Lembrar de mim
                            </Label>
                        </div>

                        <Link
                            to="/forgot-password"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Esqueceu sua senha?
                        </Link>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
                        <Link
                            to="/register"
                            className="font-medium text-zinc-950 hover:text-zinc-900"
                        >
                            Registre-se
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
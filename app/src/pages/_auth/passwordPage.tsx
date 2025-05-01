import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuthUser } from "~/src/hooks/useUser";

import { Button } from "~/src/components/imported/button";
import { Input } from "~/src/components/ui/Input/input";
import { Label } from "~/src/components/imported/label";
import { Loader2 } from "lucide-react";

import { Link } from "react-router-dom";

const forgotPasswordSchema = z.object({
    email: z.string().email("E-mail inválido"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword = () => {
    const { requestPasswordReset, isLoading, error, clearError } = useAuthUser();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        clearError();
        try {
        await requestPasswordReset(data.email);
        } catch (err) {
        // Erro já é tratado pelo store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 ">Redefinir senha</h1>
            <p className="mt-2 text-gray-600  ">
                Digite seu e-mail para receber o link de redefinição
            </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-4">
                <div>
                <Label htmlFor="email" className="mb-3">E-mail</Label>
                <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="seu@email.com"
                    error={errors.email?.message}
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
                Enviar link
                </Button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-md text-red-600 text-sm">
                {error}
                </div>
            )}

            <div className="text-center text-sm text-gray-600">
                Lembrou sua senha?{" "}
                <Link
                to="/login"
                className="font-medium text-zinc-950 hover:text-zinc-900"
                >
                Faça login
                </Link>
            </div>
            </form>
        </div>
        </div>
  );
};
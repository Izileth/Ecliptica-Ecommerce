import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuthUser } from "~/src/hooks/useUser";
import { Button } from "~/src/components/ui/Button/button";
import { Input } from "~/src/components/ui/Input/input";
import { Label } from "~/src/components/imported/label";

import { Loader2 } from "lucide-react";

import { Link, useSearchParams } from "react-router-dom";

const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token inválido"),
    newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = () => {
    const { resetPassword, isLoading, error, clearError } = useAuthUser();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
        token,
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        clearError();
        try {
        await resetPassword({
            token: data.token,
            newPassword: data.newPassword,
        });
        } catch (err) {
        // Erro já é tratado pelo store
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
            <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Redefinir senha</h1>
            <p className="mt-2 text-gray-600">
                Digite sua nova senha
            </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <input type="hidden" {...register("token")} />
            
            <div className="space-y-4">
                <div>
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...register("newPassword")}
                    placeholder="••••••••"
                    error={errors.newPassword?.message}
                />
                </div>

                <div>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
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
                Redefinir senha
                </Button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-md text-red-600 text-sm">
                {error}
                </div>
            )}

            <div className="text-center text-sm text-gray-600">
                <Link
                to="/login"
                className="font-medium text-zinc-950 hover:text-zinc-900"
                >
                Voltar para login
                </Link>
            </div>
            </form>
        </div>
        </div>
  );
};
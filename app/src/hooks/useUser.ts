// src/hooks/useAuthUser.ts
import { useAuthStore } from "../store/auth/authStore";

export const useAuthUser = () => {
  const {
    user,
    isLoading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    updatePassword,
    requestPasswordReset,
    resetPassword,
    clearError,
  } = useAuthStore();

  return {
    // Estado
    user,
    isLoading,
    error,

    // Autenticação
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
    login,
    register,
    logout,

    //Redefiniçaõ de Senha

    requestPasswordReset,
    resetPassword,

    // Perfil
    fetchProfile,
    updateProfile,
    updatePassword,

    // Utilitários
    clearError,
  };
};

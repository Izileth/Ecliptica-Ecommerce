// src/hooks/useAuthUser.ts
import { useAuthStore } from '../store/authStore';

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
    clearError
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
    
    // Perfil
    fetchProfile,
    updateProfile,
    updatePassword,
    
    // Utilitários
    clearError
  };
};
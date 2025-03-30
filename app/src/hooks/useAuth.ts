import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { 
    user, 
    isLoading, 
    error,
    login, 
    register, 
    logout, 
    isAuthenticated 
  } = useAuthStore();

  return {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin: user?.isAdmin || false,
  };
};

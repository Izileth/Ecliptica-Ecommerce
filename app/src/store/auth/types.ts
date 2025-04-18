import type { User } from "~/src/types/type";

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Autenticação
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: (options?: { silent?: boolean }) => Promise<void>;

  //Recuperação de senha
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (data: {
    token: string;
    newPassword: string;
  }) => Promise<void>;

  // Perfil
  fetchProfile: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string }) => Promise<User>;
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;

  // Utilitários
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
  clearError: () => void;
}

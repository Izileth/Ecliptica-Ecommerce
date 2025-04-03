import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUserService } from '../services/userService';
import type { User } from '../services/type';
import { toast } from 'sonner';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    
    // Autenticação
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: { name: string; email: string; password: string }) => Promise<void>;
    logout: (options?: { silent?: boolean }) => Promise<void>;
    
    //Recuperação de senha
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (data: { token: string; newPassword: string }) => Promise<void>;
    
    
    // Perfil
    fetchProfile: () => Promise<void>;
    updateProfile: (data: { name?: string; email?: string }) => Promise<User>;
    updatePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
    
    // Utilitários
    isAuthenticated: () => boolean;
    isAdmin: () => boolean;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
        user: null,
        isLoading: false,
        error: null,

        // Autenticação
        login: async (credentials) => {
            set({ isLoading: true, error: null });
            try {
            const { user } = await AuthUserService.login(credentials);
            set({ 
                user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
                },
                isLoading: false 
            });
            toast.success('Login realizado com sucesso');
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error; // Re-throw para tratamento adicional se necessário
            }
        },

        register: async (userData) => {
            set({ isLoading: true, error: null });
            try {
            const { user } = await AuthUserService.register(userData);
            set({ 
                user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
                },
                isLoading: false 
            });
            toast.success('Registro realizado com sucesso');
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error;
            }
        },

        logout: async (options = { silent: false }) => {
            try {
            await AuthUserService.logout();
            } finally {
            set({ user: null });
            if (!options.silent) {
                toast.success('Logout realizado com sucesso');
            }
            }
        },

        // Perfil
        fetchProfile: async () => {
            set({ isLoading: true });
            try {
            const user = await AuthUserService.getProfile();
            set({ 
                user: {
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin || false
                },
                isLoading: false 
            });
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            // Não mostrar toast para evitar poluição em loads automáticos
            }
        },

        updateProfile: async (data) => {
            set({ isLoading: true, error: null });
            try {
            const user = await AuthUserService.updateProfile(data);
            const updatedUser = {
                ...get().user,
                ...user,
                isAdmin: user.isAdmin || false
            };
            
            set({ 
                user: updatedUser,
                isLoading: false 
            });
            toast.success('Perfil atualizado com sucesso');
            return updatedUser;
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error;
            }
        },

        updatePassword: async ({ currentPassword, newPassword }) => {
            set({ isLoading: true, error: null });
            try {
            await AuthUserService.updatePassword({ currentPassword, newPassword });
            set({ isLoading: false });
            toast.success('Senha atualizada com sucesso');
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error;
            }
        },
        requestPasswordReset: async (email) => {
            set({ isLoading: true, error: null });
            try {
            await AuthUserService.requestPasswordReset(email);
            set({ isLoading: false });
            toast.success('E-mail de redefinição enviado com sucesso');
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error;
            }
        },

        resetPassword: async ({ token, newPassword }) => {
            set({ isLoading: true, error: null });
            try {
            await AuthUserService.resetPassword({ token, newPassword });
            set({ isLoading: false });
            toast.success('Senha redefinida com sucesso');
            } catch (error: any) {
            set({ 
                error: error.message,
                isLoading: false 
            });
            toast.error(error.message);
            throw error;
            }
        },

        // Utilitários
        isAuthenticated: () => !!get().user,
        isAdmin: () => get().user?.isAdmin || false,
        clearError: () => set({ error: null })
        }),
        {
        name: 'auth-storage',
        partialize: (state) => ({ 
            user: state.user 
        }),
        version: 1 // Incrementar se mudar a estrutura
        }
    )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginService, register as registerService, logout as logoutService } from '../services/authService'; // Adicionei o logoutService
import type { User } from '../services/type';
import { toast } from 'sonner';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: { name: string; email: string; password: string }) => Promise<void>;
    logout: (options?: { silent?: boolean }) => Promise<void>; // Mudei para async
    isAuthenticated: () => boolean;
    resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoading: false,
            error: null,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await loginService(credentials);
                    if (!response.user) {
                        throw new Error('Dados do usuário não retornados pela API');
                    }
                    
                    set({
                        user: {
                            id: response.user.id,
                            name: response.user.name,
                            email: response.user.email,
                            isAdmin: response.user.isAdmin ?? false, // Fallback seguro para boolean
                        },
                        isLoading: false,
                        error: null
                    });

                    toast.success('Login realizado com sucesso');
                } catch (error: any) {
                    let errorMessage = 'Erro durante o login';
                    
                    if (error.response) {
                        errorMessage = error.response.data?.message || error.response.statusText;
                    } else if (error.request) {
                        errorMessage = 'Não foi possível conectar ao servidor';
                    } else {
                        errorMessage = error.message || errorMessage;
                    }
                    
                    set({ 
                        error: errorMessage,
                        isLoading: false 
                    });
                    
                    toast.error(errorMessage);
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const { user } = await registerService(userData);
                    set({ 
                        user,
                        isLoading: false 
                    });
                    toast.success('Registro realizado com sucesso');
                } catch (error: any) {
                    const errorMessage = error.response?.data?.message 
                        || error.message 
                        || 'Erro desconhecido durante o registro';
                    
                    set({ 
                        error: errorMessage,
                        isLoading: false 
                    });

                    toast.error(errorMessage);
                    throw error;
                }
            },

            logout: async (options = { silent: false }) => {
                try {
                    await logoutService(); // Chama o endpoint de logout no backend
                } finally {
                    // Sempre limpa o estado, mesmo se a chamada falhar
                    set({ 
                        user: null,
                        error: null
                    });

                    if (!options.silent) {
                        toast.success('Logout realizado com sucesso');
                    }
                }
            },

            isAuthenticated: () => {
                const { user } = get();
                return !!user;
            },

            resetError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ 
                user: state.user 
            }),
            version: 0
        }
    )
);
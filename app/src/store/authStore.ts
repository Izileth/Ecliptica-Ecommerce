import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { login as loginService, register as registerService } from '../services/authService';
import type { User } from '../services/type';
import { toast } from 'sonner'; // Importando o toaster

interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    register: (userData: { name: string; email: string; password: string }) => Promise<void>;
    logout: (options?: { silent?: boolean }) => void; // Adicionado opção silent
    isAuthenticated: () => boolean;
    resetError: () => void; // Nova função para resetar erros
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
                    const { user } = await loginService(credentials);
                    set({
                        user: {
                            id: user?.id || 'temp-id',
                            name: user?.name || credentials.email.split('@')[0] || 'Usuário',
                            email: user?.email || credentials.email,
                            isAdmin: user?.isAdmin || false,
                        },
                        isLoading: false,
                        error: null
                    });

                    toast.success('Login realizado com sucesso');
                } catch (error: any) {
                    let errorMessage = 'Erro durante o login';
                    
                    if (error.response) {
                        // Erro da API com resposta
                        errorMessage = error.response.data?.message || error.response.statusText;
                    } else if (error.request) {
                        // Erro de conexão
                        errorMessage = 'Não foi possível conectar ao servidor';
                    } else {
                        // Outros erros
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

            logout: (options = { silent: false }) => {
                // Limpeza do usuário
                set({ 
                    user: null,
                    error: null // Limpa qualquer erro ao fazer logout
                });

                if (!options.silent) {
                    toast.success('Logout realizado com sucesso');
                }
            },

            isAuthenticated: () => {
                const { user } = get();
                return !!user; // Se o usuário estiver presente, está autenticado
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

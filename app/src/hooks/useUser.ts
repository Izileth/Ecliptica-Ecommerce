// src/hooks/useUser.ts
import { useAuthStore } from '~/src/store/authStore'

export const useUser = () => {
    return useAuthStore((state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated(),
        isLoading: state.isLoading,
        error: state.error,
        login: state.login,
        logout: state.logout,
        register: state.register
    }))
}
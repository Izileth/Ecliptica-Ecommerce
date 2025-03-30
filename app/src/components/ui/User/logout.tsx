// src/components/LogoutButton.tsx
import { useAuthStore } from "~/src/store/authStore"
import { toast } from "sonner"
import { LogOut } from "lucide-react" // Importe o ícone de logout

// src/components/LogoutButton.tsx
export const LogoutButton = () => {
        const logout = useAuthStore((state) => state.logout)
    
        const handleLogout = () => {
        logout()
        toast.success("Até breve!")
        }
    
        return (
        <button
            onClick={handleLogout}
            className="w-full px-6 py-3 flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-300 group"
        >
            <LogOut className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            <span>Sair da conta</span>
        </button>
        )
    }    
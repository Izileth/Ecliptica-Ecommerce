// src/components/UserProfile.tsx
import { useAuthStore } from '~/src/store/authStore'
import { UserAvatar } from '../Avatar/avatar';

export const UserProfile = () => {
  const { user} = useAuthStore();
  // Fallback seguro para o nome
  const userName = user?.name || 'Usuário';
  
  return (
        <div className="flex items-center gap-4">
        <UserAvatar size="lg" />
        
        <div className="flex-1 min-w-0">
            <h4 className="font-medium  truncate">
            {userName}
            </h4>
            <p className="text-muted-foreground text-xs truncate">
            {user?.email || 'email@exemplo.com'}
            </p>
        </div>
        </div>
    );
};
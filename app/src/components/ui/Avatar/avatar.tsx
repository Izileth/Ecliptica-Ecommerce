// src/components/UserAvatar.tsx
import { Avatar, AvatarImage, AvatarFallback } from '~/src/components/imported/avatar'
import { useAuthStore } from '~/src/store/authStore'
import { cn } from '~/src/lib/utils'

interface UserAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UserAvatar = ({ className, size = 'md' }: UserAvatarProps) => {
    const user = useAuthStore((state) => state.user);
    
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    // Função segura para obter a inicial
    const getSafeInitial = (name?: string) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
    };

    return (
        <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarImage src={user?.image} />
        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
            {getSafeInitial(user?.name)}
        </AvatarFallback>
        </Avatar>
    );
};
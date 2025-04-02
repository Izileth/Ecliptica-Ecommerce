// src/components/ui/Avatar/avatar.tsx
import { Avatar, AvatarImage, AvatarFallback } from '~/src/components/imported/avatar';
import { useAuthUser } from '~/src/hooks/useUser';
import { cn } from '~/src/lib/utils';

interface UserAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean; // Nova prop para mostrar o nome ao lado
}

export const UserAvatar = ({ 
  className, 
  size = 'md',
  showName = false 
}: UserAvatarProps) => {
    const { user } = useAuthUser();
    
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base'
    };

    const getInitial = (name?: string) => {
        if (!name?.trim()) return 'U';
        const names = name.split(' ');
        let initials = names[0].charAt(0).toUpperCase();
        if (names.length > 1) {
            initials += names[names.length - 1].charAt(0).toUpperCase();
        }
        return initials;
    };

    return (
        <div className={cn("flex items-center gap-2", showName ? 'w-full' : 'w-auto')}>
            <Avatar className={cn(
                sizeClasses[size], 
                className,
                "flex-shrink-0"
            )}>
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                    {getInitial(user?.name)}
                </AvatarFallback>
            </Avatar>
            
            {showName && (
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">
                        {user?.name || 'Usuário'}
                    </h4>
                    <p className="text-muted-foreground text-xs truncate">
                        {user?.email || 'email@exemplo.com'}
                    </p>
                </div>
            )}
        </div>
    );
};
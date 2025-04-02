// src/components/ui/LogoutButton/logout-button.tsx
import { useAuthUser } from '~/src/hooks/useUser';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import { Button } from '../Button/button';
import { cn } from '~/src/lib/utils';

interface LogoutButtonProps {
  variant?: 'text' | 'button';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const LogoutButton = ({
  variant = 'button',
  className = '',
  showIcon = true,
  showText = true,
}: LogoutButtonProps) => {
  const { logout, isLoading } = useAuthUser();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Até breve!');
    } catch (error) {
      toast.error('Ocorreu um erro ao sair');
    }
  };

  if (variant === 'text') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors',
          className
        )}
      >
        {showIcon && <LogOut className="h-4 w-4" />}
        {showText && <span>Sair</span>}
      </button>
    );
  }

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      disabled={isLoading}
      className={cn(
        'w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50',
        className
      )}
    >
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && <span>Sair da conta</span>}
    </Button>
  );
};
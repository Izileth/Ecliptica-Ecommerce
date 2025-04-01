
import { cn } from '~/src/lib/utils' 

interface SpinnerProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'destructive' | 'muted';
    variant?: 'default' | 'dots' | 'bars' | 'pulse';
}

    export function Spinner({
    className,
    size = 'md',
    color = 'primary',
    variant = 'default',
    }: SpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-10 w-10',
    };

    const colorClasses = {
        primary: 'text-primary-foreground',
        secondary: 'text-secondary-foreground',
        destructive: 'text-destructive-foreground',
        muted: 'text-muted-foreground',
    };

    // Spinner padrão (circle)
    if (variant === 'default') {
        return (
        <svg
            className={cn(
            'animate-spin',
            sizeClasses[size],
            colorClasses[color],
            className
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            ></circle>
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        );
    }

    // Variante dots
    if (variant === 'dots') {
        return (
        <div
            className={cn(
            'flex items-center justify-center space-x-1',
            sizeClasses[size],
            colorClasses[color],
            className
            )}
        >
            {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="h-1/2 w-1/2 rounded-full bg-current opacity-0"
                style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
                }}
            />
            ))}
        </div>
        );
    }

    // Variante bars
    if (variant === 'bars') {
        return (
        <div
            className={cn(
            'flex items-center justify-center space-x-1',
            sizeClasses[size],
            colorClasses[color],
            className
            )}
        >
            {[...Array(3)].map((_, i) => (
            <div
                key={i}
                className="h-full w-1 bg-current"
                style={{
                animation: `stretch 1.5s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
                transformOrigin: 'bottom center',
                }}
            />
            ))}
        </div>
        );
    }

    // Variante pulse
    if (variant === 'pulse') {
        return (
        <div
            className={cn(
            'rounded-full bg-current',
            sizeClasses[size],
            colorClasses[color],
            className
            )}
            style={{
            animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
        />
        );
    }

    return null;
}

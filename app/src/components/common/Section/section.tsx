import React from 'react';
import type { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
    background?: 'white' | 'light' | 'dark' | 'primary' | 'secondary' | 'none';
    padding?: boolean | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    testId?: string;
}

const Section: React.FC<SectionProps> = ({
    children,
    className = '',
    id,
    background = 'white',
    padding = 'lg',
    fullWidth = false,
    testId,
    }) => {
    const getBackgroundClass = (): string => {
        switch (background) {
        case 'white':
            return 'bg-white';
        case 'light':
            return 'bg-gray-100';
        case 'dark':
            return 'bg-gray-800 text-white';
        case 'primary':
            return 'bg-blue-600 text-white';
        case 'secondary':
            return 'bg-purple-600 text-white';
        case 'none':
            return '';
        default:
            return 'bg-white';
        }
    };

    const getPaddingClass = (): string => {
        if (padding === false) return '';
        if (padding === true) return 'py-8 px-4';
        if (padding === 'sm') return 'py-4 px-2';
        if (padding === 'md') return 'py-6 px-3';
        if (padding === 'lg') return 'py-12 px-4';
        if (padding === 'xl') return 'py-16 px-6';
        return 'py-8 px-4';
    };

    const fullWidthClass = fullWidth ? 'w-full' : '';

    const sectionClasses = `${getBackgroundClass()} ${getPaddingClass()} ${fullWidthClass} ${className}`.trim();

    return (
        <section 
        className={sectionClasses}
        id={id}
        data-testid={testId}
        >
        {children}
        </section>
  );
};

export default Section;
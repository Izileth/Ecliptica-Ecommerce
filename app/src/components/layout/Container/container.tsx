import React from 'react';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  id?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'auto';
  padding?: boolean | 'sm' | 'md' | 'lg';
  margin?: boolean | 'sm' | 'md' | 'lg';
  testId?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  id,
  maxWidth = 'lg',
  padding = true,
  margin = true,
  testId,
}) => {
  const getMaxWidthClass = (): string => {
    switch (maxWidth) {
      case 'xs':
        return 'max-w-xs';
      case 'sm':
        return 'max-w-sm';
      case 'md':
        return 'max-w-md';
      case 'lg':
        return 'max-w-lg';
      case 'xl':
        return 'max-w-xl';
      case 'full':
        return 'max-w-full';
      case 'auto':
        return '';
      default:
        return 'max-w-lg';
    }
  };

  const getPaddingClass = (): string => {
    if (padding === false) return '';
    if (padding === true) return 'px-4 py-2';
    if (padding === 'sm') return 'px-2 py-1';
    if (padding === 'md') return 'px-4 py-2';
    if (padding === 'lg') return 'px-6 py-4';
    return 'px-4 py-2';
  };

  const getMarginClass = (): string => {
    if (margin === false) return '';
    if (margin === true) return 'my-4 mx-auto';
    if (margin === 'sm') return 'my-2 mx-auto';
    if (margin === 'md') return 'my-4 mx-auto';
    if (margin === 'lg') return 'my-6 mx-auto';
    return 'my-4 mx-auto';
  };

  const containerClasses = `${getMaxWidthClass()} ${getPaddingClass()} ${getMarginClass()} ${className}`.trim();

  return (
    <div 
      className={containerClasses}
      id={id}
      data-testid={testId}
    >
      {children}
    </div>
  );
};

export default Container;
import React from 'react';
import type { ReactNode } from 'react';

    interface FlexBoxProps {
    children: ReactNode;
    className?: string;
    id?: string;
    direction?: 'row' | 'col';
    gap?: 'none' | 'sm' | 'md' | 'lg';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    wrap?: boolean;
    padding?: boolean | 'sm' | 'md' | 'lg';
    testId?: string;
}

const FlexBox: React.FC<FlexBoxProps> = ({
    children,
    className = '',
    id,
    direction = 'row',
    gap = 'md',
    justify = 'start',
    align = 'start',
    wrap = false,
    padding = false,
    testId,
    }) => {
    const getDirectionClass = (): string => {
        return direction === 'col' ? 'flex-col' : 'flex-row';
    };

    const getGapClass = (): string => {
        switch (gap) {
        case 'none':
            return '';
        case 'sm':
            return 'gap-2';
        case 'md':
            return 'gap-4';
        case 'lg':
            return 'gap-6';
        default:
            return 'gap-4';
        }
    };

    const getJustifyClass = (): string => {
        switch (justify) {
        case 'start':
            return 'justify-start';
        case 'center':
            return 'justify-center';
        case 'end':
            return 'justify-end';
        case 'between':
            return 'justify-between';
        case 'around':
            return 'justify-around';
        case 'evenly':
            return 'justify-evenly';
        default:
            return 'justify-start';
        }
    };

    const getAlignClass = (): string => {
        switch (align) {
        case 'start':
            return 'items-start';
        case 'center':
            return 'items-center';
        case 'end':
            return 'items-end';
        case 'stretch':
            return 'items-stretch';
        case 'baseline':
            return 'items-baseline';
        default:
            return 'items-start';
        }
    };

    const getWrapClass = (): string => {
        return wrap ? 'flex-wrap' : '';
    };

    const getPaddingClass = (): string => {
        if (padding === false) return '';
        if (padding === true) return 'p-4';
        if (padding === 'sm') return 'p-2';
        if (padding === 'md') return 'p-4';
        if (padding === 'lg') return 'p-6';
        return '';
    };

    const flexClasses = `flex ${getDirectionClass()} ${getGapClass()} ${getJustifyClass()} ${getAlignClass()} ${getWrapClass()} ${getPaddingClass()} ${className}`.trim();

    return (
        <div
        className={flexClasses}
        id={id}
        data-testid={testId}
        >
        {children}
        </div>
    );
};

export default FlexBox;
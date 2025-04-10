import React from 'react';
import type { CSSProperties } from 'react';

// Tipos para as props
interface CategoryBannerProps {
    // Conteúdo
    title: string;
    subtitle?: string;
    description?: string;
    ctaText?: string;
    
    // Imagens e cores
    backgroundImage?: string;
    backgroundColor?: string;
    overlayColor?: string;
    textColor?: string; // Cor em formato hexadecimal ou nome
    
    // Layout
    textPosition?: 'left' | 'center' | 'right';
    height?: string | number;
    contentWidth?: string | number;
    
    // Estilos customizados
    containerStyle?: CSSProperties;
    contentStyle?: CSSProperties;
    titleStyle?: CSSProperties;
    subtitleStyle?: CSSProperties;
    descriptionStyle?: CSSProperties;
    buttonStyle?: CSSProperties;
    
    // Ações
    onCtaClick?: () => void;
    
    // Children para máxima flexibilidade
    children?: React.ReactNode;
}

export const CategoryBanner: React.FC<CategoryBannerProps> = ({
    title,
    subtitle,
    description,
    ctaText,
    backgroundImage,
    backgroundColor,
    overlayColor = 'rgba(0, 0, 0, 0.4)',
    textColor = '#ffffff',
    textPosition = 'left',
    height = '400px',
    contentWidth = '80%',
    onCtaClick,
    containerStyle = {},
    contentStyle = {},
    titleStyle = {},
    subtitleStyle = {},
    descriptionStyle = {},
    buttonStyle = {},
    children,
    }) => {
    // Estilos baseados nas props
    const containerStyles: CSSProperties = {
        position: 'relative',
        height: typeof height === 'number' ? `${height}px` : height,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundColor: backgroundColor || undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        ...containerStyle,
    };

    const overlayStyles: CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: overlayColor,
        zIndex: 1,
    };

    const contentStyles: CSSProperties = {
        position: 'relative',
        zIndex: 2,
        width: typeof contentWidth === 'number' ? `${contentWidth}px` : contentWidth,
        maxWidth: '1200px',
        textAlign: textPosition,
        display: 'flex',
        flexDirection: 'column',
        alignItems: textPosition === 'center' ? 'center' : 
                textPosition === 'right' ? 'flex-end' : 'flex-start',
        color: textColor,
        padding: '2rem',
        ...contentStyle,
    };

    const titleStyles: CSSProperties = {
        fontSize: 'clamp(2rem, 5vw, 3rem)',
        fontWeight: 'bold',
        marginBottom: '1rem',
        ...titleStyle,
    };

    const subtitleStyles: CSSProperties = {
        fontSize: '1rem',
        fontWeight: 600,
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        ...subtitleStyle,
    };

    const descriptionStyles: CSSProperties = {
        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
        marginBottom: '2rem',
        maxWidth: '600px',
        ...descriptionStyle,
    };

    const buttonStyles: CSSProperties = {
        padding: '0.75rem 2rem',
        backgroundColor: textColor === '#ffffff' ? '#ffffff' : '#000000',
        color: textColor === '#ffffff' ? '#000000' : '#ffffff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '1rem',
        transition: 'background-color 0.3s ease',
        ...buttonStyle,
    };

    return (
        <div style={containerStyles}>
        <div style={overlayStyles} />
        
        <div style={contentStyles}>
            {subtitle && (
            <h3 style={subtitleStyles}>
                {subtitle}
            </h3>
            )}
            
            <h2 style={titleStyles}>
            {title}
            </h2>
            
            {description && (
            <p style={descriptionStyles}>
                {description}
            </p>
            )}
            
            {ctaText && (
            <button 
                style={buttonStyles}
                onClick={onCtaClick}
            >
                {ctaText}
            </button>
            )}
            
            {/* Slot para conteúdo totalmente customizado */}
            {children}
        </div>
        </div>
    );
};
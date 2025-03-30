import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SafeSlider from './SafeSlider';

// Tipagem dos itens do carrossel
type CarouselItem = {
    id: string | number;
    imageUrl: string;
    altText?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    navigateTo: string;
    state?: Record<string, unknown>;
};

// Tipagem das props do componente
interface CarouselProps {
    items: CarouselItem[];
    settings?: Settings;
    showArrows?: boolean;
    showDots?: boolean;
    autoplay?: boolean;
    className?: string;
    itemClassName?: string;
    imageClassName?: string;
    contentClassName?: string;
}

// Componente principal com tipagem segura
const Carousel: React.FC<CarouselProps> = ({
    items,
    settings,
    showArrows = true,
    showDots = true,
    autoplay = true,
    className = '',
    itemClassName = '',
    imageClassName = '',
    contentClassName = '',
}) => {
    const navigate = useNavigate();
    
    // Configurações com tipagem explícita
    const defaultSettings: Settings = {
        dots: showDots,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay,
        autoplaySpeed: 5000,
        arrows: showArrows,
        ...settings,
    };

    return (
        <div className={`relative ${className}`}>
        {/* Slider com tipagem garantida */}
        <SafeSlider {...defaultSettings}>
            {items.map((item) => (
            <div key={item.id} className={`relative ${itemClassName}`}>
                <img
                src={item.imageUrl}
                alt={item.altText || `Carousel item ${item.id}`}
                className={`w-full object-cover ${imageClassName}`}
                loading="lazy"
                />
                {(item.title || item.subtitle || item.buttonText) && (
                <div className={`absolute inset-0 flex flex-col justify-center items-start p-8 md:p-16 ${contentClassName}`}>
                    {item.title && <h2 className="text-4xl md:text-6xl font-bold text-white mb-2">{item.title}</h2>}
                    {item.subtitle && <p className="text-lg md:text-xl text-white mb-4 max-w-lg">{item.subtitle}</p>}
                    {item.buttonText && (
                    <button
                        onClick={() => navigate(item.navigateTo, { state: item.state })}
                        className="px-6 py-2 bg-white text-gray-900 font-medium rounded hover:bg-gray-100 transition-colors"
                    >
                        {item.buttonText}
                    </button>
                    )}
                </div>
                )}
            </div>
            ))}
        </SafeSlider>
        </div>
    );
};

export default Carousel;
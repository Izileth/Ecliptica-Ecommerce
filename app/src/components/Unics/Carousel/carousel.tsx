import React from "react";

interface CarouselProps {
    images: string[];
    className?: string;
}

export const Carousel: React.FC<CarouselProps> = ({ images, className }) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);

    return (
        <div className={`relative ${className}`}>
        <div className="overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ 
            transform: `translateX(-${currentIndex * 100}%)` 
            }}>
            {images.map((img, i) => (
                <div key={i} className="w-full flex-shrink-0">
                <img 
                    src={img} 
                    alt={`Product view ${i + 1}`} 
                    className="w-full h-auto object-cover"
                />
                </div>
            ))}
            </div>
        </div>
        
        {images.length > 1 && (
            <div className="flex justify-center mt-2 space-x-1">
            {images.map((_, i) => (
                <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full ${i === currentIndex ? 'bg-black' : 'bg-gray-300'}`}
                />
            ))}
            </div>
        )}
        </div>
    );
};
import React, { useState, useEffect, useRef } from 'react';

interface WordCarouselProps {
  words: string[];
  speed?: number;
  className?: string;
  separator?: string;
}

const WordCarousel: React.FC<WordCarouselProps> = ({ 
  words = [],
  speed = 50,
  className = '',
  separator = ' • '
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [position, setPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Prepara o conteúdo duplicado para o efeito infinito
  const duplicatedWords = [...words, ...words];
  const contentString = duplicatedWords.join(separator);

  // Atualiza as dimensões quando as palavras mudam
  useEffect(() => {
    if (contentRef.current && containerRef.current) {
      setContentWidth(contentRef.current.scrollWidth / 2);
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, [words, separator]);

  // Animação do carrossel
  useEffect(() => {
    if (isHovered) return; // Pausa quando hover

    let animationFrameId: number;
    let lastTimestamp: number;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      setPosition(prev => {
        const newPos = prev - (speed * delta) / 1000;
        return newPos <= -contentWidth ? 0 : newPos;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [contentWidth, speed, isHovered]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden whitespace-nowrap ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={contentRef}
        className="inline-block"
        style={{
          transform: `translateX(${position}px)`,
          transition: isHovered ? 'transform 0.5s ease' : 'none'
        }}
      >
        <span className="inline-block px-2">{contentString}</span>
        <span className="inline-block px-2">{contentString}</span>
      </div>
      
      {/* Gradiente para efeito de desvanecimento */}
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
    </div>
  );
};

export default WordCarousel;
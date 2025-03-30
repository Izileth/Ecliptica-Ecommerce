// src/components/common/SafeSlider.tsx
import React from 'react';
import SliderLib from 'react-slick';
import type { Settings } from 'react-slick';

const SafeSlider: React.FC<Settings> = (props) => {
    // Verificação em runtime para garantir que SliderLib é um componente válido
    const SliderComponent = React.useMemo(() => {
        return (SliderLib as any).default || SliderLib;
    }, []);

    return <SliderComponent {...props} />;
};

export default SafeSlider;
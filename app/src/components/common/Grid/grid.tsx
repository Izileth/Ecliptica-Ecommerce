// src/components/common/CategoriesGrid/CategoriesGrid.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Tipos para a API
export interface ApiCategory {
    id: string;
    nome: string;
    imagem: string;
    slug: string;
    descricao?: string;
    novo?: boolean;
    quantidade_produtos?: number;
}

// Tipos para o componente
export interface Category {
    id: string;
    name: string;
    imageUrl: string;
    slug: string;
    description?: string;
    isNew?: boolean;
    productCount?: number;
}

interface CategoriesGridProps {
    apiUrl?: string; // Opcional: URL para fetch dos dados
    categories?: Category[]; // Opcional: Dados locais
    columns?: number;
    variant?: 'default' | 'compact' | 'featured';
}

// Configurações do carrossel para mobile
const mobileSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1.5,
    slidesToScroll: 1,
    centerMode: true,
    arrows: false,
};

const CategoriesGrid: React.FC<CategoriesGridProps> = ({
    apiUrl,
    categories: initialCategories,
    columns = 4,
    variant = 'default',
}) => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [categories, setCategories] = useState<Category[]>(initialCategories || []);
    const [loading, setLoading] = useState(!initialCategories);
    const [error, setError] = useState<string | null>(null);

    // Fetch dos dados da API
    useEffect(() => {
        if (apiUrl && !initialCategories) {
        const fetchCategories = async () => {
            try {
            setLoading(true);
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data: ApiCategory[] = await response.json();
            
            // Transforma os dados da API para o formato do componente
            const formattedData = data.map((cat) => ({
                id: cat.id,
                name: cat.nome,
                imageUrl: cat.imagem,
                slug: cat.slug,
                description: cat.descricao,
                isNew: cat.novo,
                productCount: cat.quantidade_produtos,
            }));

            setCategories(formattedData);
            } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
            console.error('Erro ao buscar categorias:', err);
            } finally {
            setLoading(false);
            }
        };

        fetchCategories();
        }
    }, [apiUrl, initialCategories]);

    // Estilos e configurações
    const gridStyles = {
        default: 'gap-6',
        compact: 'gap-4',
        featured: 'gap-8',
    };

    const itemStyles = {
        default: 'p-4',
        compact: 'p-2',
        featured: 'p-6',
    };

    const gridColumns = {
        2: 'grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
        5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
    };

    // Renderização do esqueleto durante loading
    if (loading) {
        return (
        <div className={`grid ${gridColumns[columns as keyof typeof gridColumns]} ${gridStyles[variant]} mt-6`}>
            {[...Array(columns * 2)].map((_, i) => (
            <div key={i} className={itemStyles[variant]}>
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="mt-2 h-4 w-3/4 mx-auto" />
                {variant === 'default' && <Skeleton className="mt-1 h-3 w-1/2 mx-auto" />}
            </div>
            ))}
        </div>
        );
    }

    // Tratamento de erro
    if (error) {
        return (
        <div className="text-center py-8 text-red-500">
            <p>Falha ao carregar categorias.</p>
            <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-gray-100 rounded"
            >
            Tentar novamente
            </button>
        </div>
        );
    }

    // Renderização mobile (carrossel)
    if (isMobile) {
        return (
        <div className="px-4 py-6">
            <Slider {...mobileSliderSettings}>
            {categories.map((category) => (
                <div key={category.id} className="px-2">
                <CategoryItem 
                    category={category} 
                    variant={variant}
                    navigate={navigate}
                    itemStyles={itemStyles}
                />
                </div>
            ))}
            </Slider>
        </div>
        );
    }

    // Renderização desktop (grid)
    return (
        <div className={`grid ${gridColumns[columns as keyof typeof gridColumns]} ${gridStyles[variant]}`}>
        {categories.map((category) => (
            <CategoryItem
            key={category.id}
            category={category}
            variant={variant}
            navigate={navigate}
            itemStyles={itemStyles}
            />
        ))}
        </div>
    );
    };

    // Componente de item separado para reutilização
    const CategoryItem: React.FC<{
    category: Category;
    variant: 'default' | 'compact' | 'featured';
    navigate: ReturnType<typeof useNavigate>;
    itemStyles: Record<string, string>;
    }> = ({ category, variant, navigate, itemStyles }) => {
    return (
        <div
        className={`relative group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${itemStyles[variant]}`}
        onClick={() => navigate(`/category/${category.slug}`)}
        role="button"
        tabIndex={0}
        aria-label={`Ver categoria ${category.name}`}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/category/${category.slug}`)}
        >
        <div className="relative aspect-square overflow-hidden">
            <img
            src={category.imageUrl}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            />
            {category.isNew && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Novo
            </span>
            )}
        </div>
        <div className="mt-3 text-center">
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            {variant === 'default' && category.description && (
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
            )}
            {category.productCount && variant === 'featured' && (
            <p className="mt-1 text-sm text-gray-500">
                {category.productCount} produtos
            </p>
            )}
        </div>
        </div>
    );
};

export default CategoriesGrid;
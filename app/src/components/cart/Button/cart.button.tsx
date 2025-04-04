import React, { useState } from 'react';
import { useCart } from '~/src/hooks/useCart';
import { Button } from '~/src/components/imported/button';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
    productId: string;
    variant?: 'default' | 'outline';
    size?: 'default' | 'sm' | 'lg';
    className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
    productId, 
    variant = 'default',
    size = 'default',
    className 
    }) => {
    const { addItem } = useCart();
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState(false);

    const handleAddToCart = async () => {
        setLoading(true);
        try {
        await addItem(productId, 1);
        setAdded(true);
        
        // Reset the "added" state after 2 seconds
        setTimeout(() => {
            setAdded(false);
        }, 2000);
        } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        } finally {
        setLoading(false);
        }
    };

    return (
        <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleAddToCart}
        disabled={loading}
        >
        {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2" />
        ) : added ? (
            <Check className="mr-2 h-4 w-4" />
        ) : (
            <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {added ? 'Adicionado' : 'Adicionar ao Carrinho'}
        </Button>
    );
};

export default AddToCartButton;

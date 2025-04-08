import React from 'react';
import type { Product } from '~/src/services/type';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '~/src/utils/format';
import { useCart } from '~/src/hooks/useCart';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [loading, setLoading] = React.useState(false);
    const [added, setAdded] = React.useState(false);
    
    const isOnPromo = product.promoPrice && product.promoPrice < product.price;
    const displayPrice = isOnPromo ? product.promoPrice : product.price;
    
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setLoading(true);
        
        try {
            await addItem(product.id, 1);
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
        <div 
         className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
        onClick={() => navigate(`/products/${product.id}`)}
        >
        <div className="relative pb-[120%] overflow-hidden">
            <img
            src={product.image}
            alt={product.name}
            className="absolute h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {isOnPromo && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {Math.round((1 - product.promoPrice!/product.price) * 100)}% OFF
                </span>
            )}
            {product.countInStock < 10 && (
                <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                Últimas unidades
                </span>
            )}
            </div>
        </div>
        
        <div className="p-4">
            <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg mb-1 truncate flex-1">{product.name}</h3>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {product.category}
            </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            
            <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
                <span className={`font-bold text-lg ${isOnPromo ? 'text-red-500' : 'text-black'}`}>
                {formatPrice(displayPrice)}
                </span>
                {isOnPromo && (
                <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.price)}
                </span>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                {product.countInStock > 0 ? (
                    <span className="text-green-500">Disponível ({product.countInStock})</span>
                ) : (
                    <span className="text-red-500">Esgotado</span>
                )}
                </div>
                
                <button 
                 className={`text-xs px-3 py-1 rounded transition flex items-center ${
                     loading ? 'bg-gray-400 cursor-not-allowed' : 
                     added ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-gray-800'
                 }`}
                onClick={handleAddToCart}
                disabled={loading || product.countInStock <= 0}
                >
                {loading ? (
                    <>
                        <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></span>
                        <span>Aguarde</span>
                    </>
                ) : added ? (
                    <>
                        <Check className="h-3 w-3 mr-1" />
                        <span>Adicionado</span>
                    </>
                ) : (
                    <>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        <span>Comprar</span>
                    </>
                )}
                </button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default ProductCard;
import React from 'react';
import type { Product } from '~/src/services/type';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '~/src/utils/format';
interface ProductCardProps {
  product: Product; // Usando seu tipo Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    // Mostrar preço promocional se disponível
    const displayPrice = product.promoPrice ? product.promoPrice : product.price;
    const isOnPromo = !!product.promoPrice;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative pb-[100%] overflow-hidden">
            <img
            src={product.image} // Agora usando product.image direto
            alt={product.name}
            className="absolute h-full w-full object-cover"
            />
            {isOnPromo && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                PROMO
            </div>
            )}
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
            <div className="flex justify-between items-center">
            <span className={`font-bold text-lg ${isOnPromo ? 'text-red-500' : 'text-black'}`}>
                R$ {formatPrice(product.price)}
            </span>
            {isOnPromo && (
                <span className="text-sm text-gray-500 line-through">
                R$ {formatPrice(product.price)}
                </span>
            )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
            Estoque: {product.countInStock}
            </div>
        </div>
        </div>
    );
};

export default ProductCard;

import React from 'react';
import type { Product } from '../types';
import StarRating from './StarRating';

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}

const AddToCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
    return (
        <div 
            onClick={() => onViewDetails(product)}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer"
        >
            <div className="relative">
                <img className="h-48 w-full object-cover" src={product.image} alt={product.name} />
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                    {product.tags?.includes('oferta') && <span className="bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Oferta</span>}
                    {product.tags?.includes('nuevo') && <span className="bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Nuevo</span>}
                </div>
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <h5 className="text-xl font-semibold tracking-tight text-text-primary dark:text-gray-100 mb-1">{product.name}</h5>
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-2">{product.category}</p>
                 <div className="flex items-center mb-4">
                    <StarRating rating={product.rating} />
                    <span className="text-xs text-text-secondary dark:text-gray-400 ml-2">({product.reviews.length} reseñas)</span>
                </div>
                <div className="flex-grow"></div>
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-3xl font-bold text-text-primary dark:text-white">${product.price.toFixed(2)}</span>
                     <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                        }} 
                        className="text-white bg-primary hover:bg-primary-dark focus:ring-4 focus:outline-none focus:ring-primary-light font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center transition-colors"
                    >
                        <AddToCartIcon />
                        Añadir
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
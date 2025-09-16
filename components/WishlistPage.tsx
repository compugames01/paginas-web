
import React from 'react';
import type { Product } from '../types';
import ProductCard from './ProductCard';

interface WishlistPageProps {
    products: Product[];
    onToggleWishlist: (productId: number) => void;
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}

const HeartCrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const WishlistPage: React.FC<WishlistPageProps> = ({ products, onToggleWishlist, onAddToCart, onViewDetails }) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-text-primary dark:text-gray-100 mb-4">Tu lista de deseos está vacía</h1>
                <p className="text-text-secondary dark:text-gray-400">Guarda los productos que te interesan para verlos aquí.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-4xl font-extrabold text-text-primary dark:text-gray-100 mb-2">Mi Lista de Deseos</h1>
                <p className="text-text-secondary dark:text-gray-400">Tus productos favoritos en un solo lugar.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="relative group">
                        <ProductCard product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
                        <button
                            onClick={() => onToggleWishlist(product.id)}
                            className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm text-red-500 hover:bg-red-500 hover:text-white rounded-full p-2 transition-all opacity-0 group-hover:opacity-100 dark:bg-gray-900/50 dark:hover:bg-red-500"
                            aria-label="Quitar de la lista de deseos"
                        >
                           <HeartCrossIcon />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WishlistPage;
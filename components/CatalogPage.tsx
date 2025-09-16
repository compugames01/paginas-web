
import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface CatalogPageProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}

const CATEGORIES = ['Todas', 'Frutas y Verduras', 'Lácteos y Huevos', 'Carnes y Pescados', 'Panadería', 'Despensa'];

const CatalogPage: React.FC<CatalogPageProps> = ({ products, onAddToCart, onViewDetails }) => {
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchTerm]);

    return (
        <div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                <h1 className="text-4xl font-extrabold text-text-primary dark:text-gray-100 mb-2">Nuestro Catálogo</h1>
                <p className="text-text-secondary dark:text-gray-400">Encuentra todo lo que necesitas para tu despensa.</p>
                 <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="md:w-1/4">
                    <div className="sticky top-24">
                        <h3 className="text-xl font-bold mb-4 text-text-primary dark:text-gray-300">Categorías</h3>
                        <div className="flex flex-col items-start space-y-2">
                            {CATEGORIES.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${selectedCategory === category ? 'bg-primary text-white font-bold' : 'text-text-secondary dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="md:w-3/4">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <h3 className="text-2xl font-semibold text-text-primary dark:text-gray-300">No se encontraron productos</h3>
                            <p className="text-text-secondary dark:text-gray-400 mt-2">Intenta ajustar tu búsqueda o selección de categoría.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CatalogPage;
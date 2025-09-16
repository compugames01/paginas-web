
import React from 'react';
import Carousel from './Carousel';
import ProductCard from './ProductCard';
import type { Product } from '../types';

interface HomePageProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    onViewDetails: (product: Product) => void;
}

const carouselImages = [
    { src: 'https://picsum.photos/id/1015/1200/400', alt: 'Productos frescos y de calidad' },
    { src: 'https://picsum.photos/id/1040/1200/400', alt: 'Las mejores ofertas para tu hogar' },
    { src: 'https://picsum.photos/id/211/1200/400', alt: 'Visítanos y sorpréndete' },
];

const ProductSection: React.FC<{ title: string; products: Product[]; onAddToCart: (product: Product) => void; onViewDetails: (product: Product) => void; }> = ({ title, products, onAddToCart, onViewDetails }) => (
    <section className="mb-12">
        <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6 border-l-4 border-primary pl-4">{title}</h2>
        {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
                ))}
            </div>
        ) : (
            <p className="text-text-secondary dark:text-gray-400">No hay productos en esta sección por el momento.</p>
        )}
    </section>
);


const HomePage: React.FC<HomePageProps> = ({ products, onAddToCart, onViewDetails }) => {
    const featuredProducts = products.filter(p => p.tags?.includes('destacado')).slice(0, 4);
    const offerProducts = products.filter(p => p.tags?.includes('oferta')).slice(0, 4);
    const newProducts = products.filter(p => p.tags?.includes('nuevo')).slice(0, 4);

    return (
        <div className="space-y-12">
            <Carousel images={carouselImages} />
            
            <ProductSection title="Productos Destacados" products={featuredProducts} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
            <ProductSection title="Ofertas Actuales" products={offerProducts} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
            <ProductSection title="Nuevos Productos" products={newProducts} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
        </div>
    );
};

export default HomePage;
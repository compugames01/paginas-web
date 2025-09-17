import React, { useState, useRef, useEffect } from 'react';
import type { Product, User } from '../types';
import StarRating from './StarRating';
import ProductCard from './ProductCard';

interface ProductDetailPageProps {
    product: Product;
    allProducts: Product[];
    onAddToCart: (product: Product) => void;
    onBack: () => void;
    currentUser: User | null;
    onSubmitReview: (productId: number, review: { rating: number; comment: string }) => void;
    onViewDetails: (product: Product) => void;
    wishlist: number[];
    onToggleWishlist: (productId: number) => void;
}

const AddToCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
);

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${filled ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`} fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
    </svg>
);


const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, allProducts, onAddToCart, onBack, currentUser, onSubmitReview, onViewDetails, wishlist, onToggleWishlist }) => {
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(false);
    const mainAddToCartButtonRef = useRef<HTMLButtonElement>(null);

    // State for image zoom
    const [showZoom, setShowZoom] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);


    useEffect(() => {
        const handleScroll = () => {
            if (mainAddToCartButtonRef.current) {
                const { top } = mainAddToCartButtonRef.current.getBoundingClientRect();
                // Approx height of the sticky header
                const headerHeight = 64; 
                setIsFloatingButtonVisible(top < headerHeight);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initial check in case the element is already out of view on load
        handleScroll(); 
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') {
            alert('Por favor, escribe un comentario.');
            return;
        }
        onSubmitReview(product.id, { rating: newRating, comment: newComment });
        setNewComment('');
        setNewRating(5);
    };
    
    const relatedProducts = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    // Handlers for image zoom
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!imageRef.current) return;
        
        const { left, top, width, height } = imageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            setZoomPosition({ x, y });
            setShowZoom(true);
        } else {
            // Hide zoom if cursor leaves the image boundaries slightly but is still over the container
            setShowZoom(false);
        }
    };

    const handleMouseLeave = () => {
        setShowZoom(false);
    };

    // Zoom calculation constants
    const lensSize = 100;
    const zoomLevel = 2.5;

    // Calculate lens position, clamped to image bounds
    const lensX = Math.max(0, Math.min(zoomPosition.x - lensSize / 2, (imageRef.current?.width ?? 0) - lensSize));
    const lensY = Math.max(0, Math.min(zoomPosition.y - lensSize / 2, (imageRef.current?.height ?? 0) - lensSize));

    // Calculate background position for the zoomed image
    const backgroundPosX = -((zoomPosition.x * zoomLevel) - lensSize * zoomLevel / 2 + lensSize);
    const backgroundPosY = -((zoomPosition.y * zoomLevel) - lensSize * zoomLevel / 2 + lensSize);

    const isInWishlist = wishlist.includes(product.id);


    return (
        <div className="space-y-12">
            <button onClick={onBack} className="text-primary hover:text-primary-dark font-medium flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al catálogo
            </button>

            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div 
                    className="relative"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    <img 
                        ref={imageRef}
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-auto object-cover rounded-lg shadow-lg cursor-crosshair" 
                    />
                    
                    {showZoom && imageRef.current && window.innerWidth >= 768 && (
                        <>
                             {/* Zoom Lens */}
                             <div
                                style={{
                                    position: 'absolute',
                                    left: `${lensX}px`,
                                    top: `${lensY}px`,
                                    width: `${lensSize}px`,
                                    height: `${lensSize}px`,
                                    border: '2px solid #FFC107',
                                    pointerEvents: 'none',
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                }}
                            />

                            {/* Zoomed Image Pane */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: '105%',
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${product.image})`,
                                    backgroundPosition: `${backgroundPosX}px ${backgroundPosY}px`,
                                    backgroundSize: `${imageRef.current.width * zoomLevel}px ${imageRef.current.height * zoomLevel}px`,
                                    backgroundRepeat: 'no-repeat',
                                    border: '1px solid #BDBDBD',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    pointerEvents: 'none',
                                    zIndex: 10,
                                }}
                            />
                        </>
                    )}
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary dark:text-white">{product.name}</h1>
                    <p className="text-lg text-text-secondary dark:text-gray-400 mt-2">{product.category}</p>
                    <div className="flex items-center my-4">
                        <StarRating rating={product.rating} />
                        <span className="text-text-secondary dark:text-gray-400 ml-3">({product.rating.toFixed(1)} de 5) - {product.reviews.length} reseñas</span>
                    </div>
                    <p className="text-text-primary dark:text-gray-300 leading-relaxed my-4">{product.description}</p>
                    <div className="flex items-baseline space-x-4 my-4">
                        <span className="text-4xl md:text-5xl font-bold text-text-primary dark:text-white">${product.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                        <button 
                            ref={mainAddToCartButtonRef}
                            onClick={() => onAddToCart(product)} 
                            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center">
                            <AddToCartIcon />
                            Añadir al carrito
                        </button>
                        <button
                            onClick={() => onToggleWishlist(product.id)}
                            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
                        >
                            <HeartIcon filled={isInWishlist} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6">Opiniones de Clientes</h2>
                {/* Review Submission Form */}
                {currentUser ? (
                    <form onSubmit={handleReviewSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border dark:border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-text-primary dark:text-gray-200">Deja tu reseña</h3>
                        <div className="mb-4">
                            <label className="block text-text-secondary dark:text-gray-400 mb-2">Tu calificación</label>
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none">
                                        <svg className={`w-8 h-8 ${star <= newRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="comment" className="block text-text-secondary dark:text-gray-400 mb-2">Tu comentario</label>
                            <textarea id="comment" rows={4} value={newComment} onChange={e => setNewComment(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white" required></textarea>
                        </div>
                        <button type="submit" className="bg-accent hover:bg-yellow-500 text-text-primary font-bold py-2 px-6 rounded-lg">Enviar Reseña</button>
                    </form>
                ) : (
                    <div className="text-center p-6 bg-gray-100 dark:bg-gray-700/50 rounded-lg mb-8">
                        <p className="text-text-secondary dark:text-gray-400">Debes <span className="font-bold">iniciar sesión</span> para poder dejar una reseña.</p>
                    </div>
                )}
                
                {/* List of Reviews */}
                <div className="space-y-6">
                    {product.reviews.length > 0 ? product.reviews.map(review => (
                        <div key={review.id} className="border-b dark:border-gray-700 pb-4">
                            <div className="flex items-center mb-2">
                                <StarRating rating={review.rating} />
                                <p className="ml-4 font-bold text-text-primary dark:text-gray-200">{review.author}</p>
                            </div>
                            <p className="text-text-secondary dark:text-gray-300">{review.comment}</p>
                        </div>
                    )) : <p className="text-text-secondary dark:text-gray-400">Este producto aún no tiene reseñas. ¡Sé el primero en opinar!</p>}
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div>
                    <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-6 border-l-4 border-primary pl-4">Productos Relacionados</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(related => (
                            <ProductCard key={related.id} product={related} onAddToCart={onAddToCart} onViewDetails={onViewDetails} />
                        ))}
                    </div>
                </div>
            )}

            {/* Floating Add to Cart Bar */}
            <div
                className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_-2px_10px_rgba(255,255,255,0.05)] z-40 transition-transform duration-300 ease-in-out ${isFloatingButtonVisible ? 'translate-y-0' : 'translate-y-full'}`}
                aria-hidden={!isFloatingButtonVisible}
            >
                <div className="container mx-auto flex items-center justify-between gap-4">
                    <div className="flex-shrink min-w-0">
                        <p className="font-bold text-base sm:text-lg text-text-primary dark:text-gray-200 truncate">{product.name}</p>
                        <p className="text-lg sm:text-xl font-bold text-text-primary dark:text-white">${product.price.toFixed(2)}</p>
                    </div>
                     <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                            onClick={() => onToggleWishlist(product.id)}
                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            aria-label={isInWishlist ? 'Quitar de la lista de deseos' : 'Añadir a la lista de deseos'}
                        >
                            <HeartIcon filled={isInWishlist} />
                        </button>
                        <button 
                            onClick={() => onAddToCart(product)} 
                            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 sm:px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
                        >
                            <AddToCartIcon />
                            <span className="hidden sm:inline ml-2">Añadir</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
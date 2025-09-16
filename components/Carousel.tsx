
import React, { useState, useEffect, useCallback } from 'react';

interface CarouselProps {
    images: { src: string; alt: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, [images.length]);

    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg shadow-2xl">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                         <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
                            {image.alt}
                        </h2>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 text-gray-800 font-bold p-3 rounded-full transition"
            >
                &#10094;
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 text-gray-800 font-bold p-3 rounded-full transition"
            >
                &#10095;
            </button>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}></button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        title: 'Unleash Your Performance',
        description: 'Discover our high-performance sportswear, engineered for victory.',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
        link: '/shop/men/Apparel/Sports',
        buttonText: 'Shop Sports'
    },
    {
        title: 'Style That Moves With You',
        description: 'Explore our latest fashion collection. Where comfort meets chic.',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
        link: '/shop/women/Apparel/Fashion',
        buttonText: 'Shop Fashion'
    },
    {
        title: 'Durable. Reliable. Ready for Work.',
        description: 'Built to last. Our workwear and safety gear keeps you protected on the job.',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop',
        link: '/shop/men/Apparel/Workwears',
        buttonText: 'Shop Workwear'
    }
];

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

const HeroSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    };

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    useEffect(() => {
        const sliderInterval = setInterval(nextSlide, 5000);
        return () => clearInterval(sliderInterval);
    }, [nextSlide]);

    return (
        <div className="relative h-screen w-full overflow-hidden" role="region" aria-roledescription="carousel">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    aria-hidden={index !== currentIndex}
                    role="group"
                    aria-roledescription="slide"
                >
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center">
                        <div className="relative z-10 px-4">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                                {slide.title}
                            </h1>
                            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
                                {slide.description}
                            </p>
                            <Link
                                to={slide.link}
                                className="mt-8 inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-transform hover:scale-105"
                            >
                                {slide.buttonText}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            <button
                onClick={prevSlide}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50 transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Previous slide"
            >
                <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 p-2 rounded-full text-white hover:bg-white/50 transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Next slide"
            >
                <ChevronRightIcon className="h-6 w-6" />
            </button>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${index + 1}`}
                        aria-current={index === currentIndex ? 'true' : 'false'}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
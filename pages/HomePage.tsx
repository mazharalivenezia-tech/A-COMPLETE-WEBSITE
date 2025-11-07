import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';
import QuickViewModal from '../components/QuickViewModal';
import { Product } from '../types';
import AnimatedDiv from '../components/AnimatedDiv';

const CategoryGrid: React.FC = () => {
    const categories = [
        { name: 'Sports Wears', link: '/shop/men/Apparel/Sports', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop' },
        { name: 'Fashion Wears', link: '/shop/women/Apparel/Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Safety Wears', link: '/shop/men/Apparel/Safety-Wears', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop' },
    ];
    return (
        <div className="bg-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <AnimatedDiv>
                    <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Shop by Category</h2>
                </AnimatedDiv>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                         <AnimatedDiv key={cat.name} staggerIndex={index}>
                            <Link to={cat.link} className="group relative block">
                                <div className="overflow-hidden rounded-lg aspect-w-4 aspect-h-3">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                                    <h3 className="text-2xl font-bold text-white">{cat.name}</h3>
                                </div>
                            </Link>
                         </AnimatedDiv>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NewArrivals: React.FC<{ onQuickViewClick: (product: Product) => void }> = ({ onQuickViewClick }) => {
  const { products } = useProducts();
  const newProducts = products.filter(p => p.isNew).slice(0, 8);
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimatedDiv>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">New Arrivals</h2>
        </AnimatedDiv>
        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {newProducts.map((product, index) => (
            <AnimatedDiv key={product.id} staggerIndex={index}>
                <ProductCard product={product} onQuickViewClick={onQuickViewClick} />
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </div>
  );
};


const ManufacturingHighlight: React.FC = () => (
    <div className="bg-dark text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
            <AnimatedDiv className="md:w-1/2" initialClass="opacity-0 -translate-x-10">
                <img src="https://picsum.photos/id/122/800/600" alt="Manufacturing process" className="rounded-lg shadow-2xl"/>
            </AnimatedDiv>
            <AnimatedDiv className="md:w-1/2 text-center md:text-left" initialClass="opacity-0 translate-x-10" delay={200}>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Your Vision, Our Expertise</h2>
                <p className="text-lg text-gray-300 mb-6">
                    From custom team uniforms to large-scale production runs, Faskicks Sports is your trusted manufacturing partner. We bring quality, scale, and ethical production to every project.
                </p>
                <Link to="/manufacturing" className="inline-block bg-white text-dark font-bold py-3 px-8 rounded-md hover:bg-gray-200 transition-colors">
                    Partner with Us
                </Link>
            </AnimatedDiv>
        </div>
    </div>
);

const HomePage: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  return (
    <>
      <div>
        <HeroSlider />
        <CategoryGrid />
        <NewArrivals onQuickViewClick={setQuickViewProduct} />
        <ManufacturingHighlight />
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
};

export default HomePage;

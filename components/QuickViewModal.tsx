
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.82 3.748 4.13.602c.728.106 1.018.996.49 1.512l-2.988 2.91.705 4.114c.124.725-.635 1.286-1.288.944L10 15.347l-3.696 1.942c-.653.342-1.412-.219-1.288-.944l.705-4.114-2.988-2.91c-.528-.516-.238-1.406.49-1.512l4.13-.602 1.82-3.748z" clipRule="evenodd" />
    </svg>
);

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setMainImage(product.images[0]);
      setSelectedColor(product.colors[0] || '');
      setSelectedSize(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (product) {
      addToCart(product, 1, selectedColor, selectedSize);
      alert(`${product.name} has been added to your cart.`);
      onClose(); // Close modal after adding
    }
  };

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`quick-view-title-${product.id}`}
    >
      <style>{`.animate-fadeIn { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-scaleUp { animation: scaleUp 0.3s ease-out; } @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-20 p-2"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        <div className="overflow-y-auto">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start p-6">
            {/* Image gallery */}
            <div className="flex flex-col-reverse">
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                  {product.images.map((image) => (
                    <button
                      key={image}
                      onClick={() => setMainImage(image)}
                      className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-primary ${mainImage === image ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    >
                      <span className="absolute inset-0 rounded-md overflow-hidden">
                        <img src={image} alt="" className="w-full h-full object-center object-cover" />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full aspect-w-1 aspect-h-1">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-center object-cover sm:rounded-lg"
                />
              </div>
            </div>

            {/* Product info */}
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 id={`quick-view-title-${product.id}`} className="text-2xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
              <div className="mt-3">
                <p className="text-2xl text-gray-900">${product.price.toFixed(2)}</p>
              </div>
              <div className="mt-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                   <a href="#" className="ml-3 text-sm font-medium text-primary hover:text-blue-600">
                    {product.reviewCount} reviews
                  </a>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-base text-gray-700">{product.description}</p>
              </div>

              <form className="mt-6" onSubmit={handleAddToCart}>
                {/* Colors */}
                <div>
                  <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {product.colors.map(color => (
                       <button
                          type="button"
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-8 h-8 rounded-full border border-gray-300 ${selectedColor === color ? 'ring-2 ring-offset-1 ring-primary' : ''}`}
                          style={{ backgroundColor: color.toLowerCase() }}
                          aria-label={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-5 mt-4">
                    {product.sizes.map(size => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`group relative border rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4">
                  <button
                    type="submit"
                    className="w-full bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!selectedSize}
                  >
                    Add to cart
                  </button>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="w-full bg-white border border-gray-300 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Full Details
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;

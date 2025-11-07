
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onQuickViewClick: (product: Product) => void;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-4 h-4 ${className}`}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.82 3.748 4.13.602c.728.106 1.018.996.49 1.512l-2.988 2.91.705 4.114c.124.725-.635 1.286-1.288.944L10 15.347l-3.696 1.942c-.653.342-1.412-.219-1.288-.944l.705-4.114-2.988-2.91c-.528-.516-.238-1.406.49-1.512l4.13-.602 1.82-3.748z" clipRule="evenodd" />
  </svg>
);


const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickViewClick }) => {
  return (
    <div className="group relative">
      <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75 transition-all duration-500 ease-in-out group-hover:scale-110"
        />
        {product.images.length > 1 && (
             <img
                src={product.images[1]}
                alt={`${product.name} alternate view`}
                className="h-full w-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-110"
            />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onQuickViewClick(product);
                }}
                className="text-white bg-primary py-2 px-4 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                aria-label={`Quick view ${product.name}`}
            >
                Quick View
            </button>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <div>
            <h3 className="text-sm text-gray-700">
                <Link to={`/product/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                </Link>
            </h3>
            <p className="mt-1 text-sm text-gray-500">{product.productType}</p>
        </div>
        <p className="text-sm font-medium text-gray-900">${product.price.toFixed(2)}</p>
      </div>
       <div className="mt-1 flex items-center">
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                ))}
            </div>
            <p className="ml-2 text-sm text-gray-500">{product.reviewCount} reviews</p>
        </div>
    </div>
  );
};

export default ProductCard;

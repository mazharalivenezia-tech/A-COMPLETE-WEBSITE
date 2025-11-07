
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import { Product } from '../types';

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
      <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.82 3.748 4.13.602c.728.106 1.018.996.49 1.512l-2.988 2.91.705 4.114c.124.725-.635 1.286-1.288.944L10 15.347l-3.696 1.942c-.653.342-1.412-.219-1.288-.944l.705-4.114-2.988-2.91c-.528-.516-.238-1.406.49-1.512l4.13-.602 1.82-3.748z" clipRule="evenodd" />
    </svg>
);
  
const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  const [mainImage, setMainImage] = useState(product?.images[0]);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  React.useEffect(() => {
    if (product) {
        setMainImage(product.images[0]);
        setSelectedColor(product.colors[0] || '');
        setSelectedSize(null);
    }
  }, [product]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSize) {
      alert('Please select a size.');
      return;
    }
    if (product) {
      addToCart(product, 1, selectedColor, selectedSize);
      alert(`${product.name} has been added to your cart.`);
    }
  };

  if (!product) {
    return <div className="text-center py-20">Product not found</div>;
  }
  
  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <>
      <div className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24">
          {/* Main product section */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            {/* Image gallery */}
            <div className="flex flex-col-reverse">
              {/* Image selector */}
              <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                  {product.images.map((image) => (
                    <button
                      key={image}
                      onClick={() => setMainImage(image)}
                      className={`relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-primary ${mainImage === image ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    >
                      <span className="sr-only">{product.name}</span>
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
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl text-gray-900">${product.price.toFixed(2)}</p>
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="sr-only">{product.rating} out of 5 stars</p>
                  <a href="#" className="ml-3 text-sm font-medium text-primary hover:text-blue-600">
                    {product.reviewCount} reviews
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <p className="text-base text-gray-700 space-y-6">{product.description}</p>
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
                <div className="mt-10">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                    <Link to="/size-guide" className="text-sm font-medium text-primary hover:text-blue-600">
                      Size guide
                    </Link>
                  </div>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4 mt-4">
                    {product.sizes.map(size => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`group relative border rounded-md py-3 px-4 flex items-center justify-center text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex">
                  <button
                    type="submit"
                    className="w-full bg-primary border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!selectedSize}
                  >
                    Add to cart
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                  <p>Free shipping on orders over $50</p>
                  <p>Easy 30-day returns</p>
              </div>
            </div>
          </div>

          {/* Details section */}
          <div className="mt-16">
              <h3 className="text-xl font-bold mb-4">Product Details</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                  ))}
              </ul>
          </div>
          
          {/* Related products */}
          <div className="mt-24">
              <h2 className="text-2xl font-bold tracking-tight text-center mb-12">You Might Also Like</h2>
              <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                  {relatedProducts.map(p => <ProductCard key={p.id} product={p} onQuickViewClick={setQuickViewProduct}/>)}
              </div>
          </div>
        </div>
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
};

export default ProductDetailPage;

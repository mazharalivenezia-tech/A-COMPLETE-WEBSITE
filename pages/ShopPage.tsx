import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import QuickViewModal from '../components/QuickViewModal';
import AnimatedDiv from '../components/AnimatedDiv';

const FilterSidebar: React.FC = () => {
    // This is a visual placeholder. State management would be lifted up.
    return (
        <aside className="w-full lg:w-64 xl:w-72 lg:pr-8">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Size</h3>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                        {['XS', 'S', 'M', 'L', 'XL', '7', '8', '9', '10', '11', '12'].map(size => (
                            <button key={size} className="border rounded py-1 px-2 hover:bg-gray-100 focus:bg-primary focus:text-white focus:border-primary">{size}</button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Red', 'Blue', 'Green', 'Black', 'White', 'Pink', 'Grey'].map(color => (
                            <button key={color} className="w-8 h-8 rounded-full border" style={{backgroundColor: color.toLowerCase()}} aria-label={color}></button>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Price Range</h3>
                    <div className="flex items-center space-x-2">
                        <input type="number" placeholder="$ Min" className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                        <span>-</span>
                        <input type="number" placeholder="$ Max" className="w-full border-gray-300 rounded-md shadow-sm text-sm p-2"/>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Sport/Activity</h3>
                    <div className="space-y-2 text-sm">
                        {['Running', 'Training', 'Basketball', 'Trail', 'Yoga'].map(sport => (
                            <div key={sport} className="flex items-center">
                                <input id={sport} type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded"/>
                                <label htmlFor={sport} className="ml-3 text-gray-600">{sport}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
}

const ShopPage: React.FC = () => {
  const { category, subcategory, subsubcategory, fashioncategory } = useParams<{ category: 'men' | 'women' | 'kids', subcategory?: string, subsubcategory?: string, fashioncategory?: string }>();
  const [sortOption, setSortOption] = useState('newest');
  const { products: allProducts } = useProducts();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const products = useMemo(() => {
    let filteredProducts = category ? allProducts.filter(p => p.category === category) : allProducts;

    if (subcategory) {
        filteredProducts = filteredProducts.filter(p => p.productType.toLowerCase() === subcategory.toLowerCase());
    }
    
    if (subsubcategory) {
        const formattedSubSub = subsubcategory.replace(/-/g, ' ').toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.subCategory?.toLowerCase() === formattedSubSub);
    }
    
    if (fashioncategory) {
        const formattedFashion = fashioncategory.replace(/-/g, ' ').toLowerCase();
        filteredProducts = filteredProducts.filter(p => p.fashionCategory?.toLowerCase() === formattedFashion);
    }
    
    return filteredProducts.sort((a, b) => {
        switch (sortOption) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'best-selling':
                return (b.reviewCount * b.rating) - (a.reviewCount * a.rating);
            case 'newest':
            default:
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        }
    });
  }, [allProducts, category, subcategory, subsubcategory, fashioncategory, sortOption]);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products';
  const formatTitle = (s: string) => s.replace(/-/g, ' ');

  const pageTitle = [
    `${categoryTitle}'s`,
    subcategory ? formatTitle(subcategory) : null,
    subsubcategory ? `- ${formatTitle(subsubcategory)}` : null,
    fashioncategory ? `- ${formatTitle(fashioncategory)}` : null
  ].filter(Boolean).join(' ');


  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border-b pb-4 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">{pageTitle}</h1>
        </div>
        
        <div className="flex flex-col lg:flex-row">
          <FilterSidebar />
          
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">{products.length} Products</p>
              <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border-gray-300 rounded-md shadow-sm text-sm p-2 focus:ring-primary focus:border-primary"
              >
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-2 xl:grid-cols-3 xl:gap-x-8">
              {products.map((product, index) => (
                <AnimatedDiv key={product.id} staggerIndex={index % 3} delay={Math.floor(index / 3) * 150}>
                    <ProductCard product={product} onQuickViewClick={setQuickViewProduct} />
                </AnimatedDiv>
              ))}
            </div>
          </div>
        </div>
      </div>
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </>
  );
};

export default ShopPage;

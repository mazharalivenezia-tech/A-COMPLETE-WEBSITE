import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { Product } from '../types';

const SearchIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus input when overlay opens
      inputRef.current?.focus();
      // Disable body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Reset state and re-enable scroll when closing
      setQuery('');
      setResults([]);
      document.body.style.overflow = '';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const lowerCaseQuery = query.toLowerCase();
      const filteredResults = products.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.productType.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
      );
      setResults(filteredResults);
    } else {
      setResults([]);
    }
  }, [query, products]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center items-start pt-16 sm:pt-24"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="block w-full text-lg py-4 pl-12 pr-12 border-b border-gray-200 focus:ring-primary focus:border-primary rounded-t-lg"
          />
          <button
            onClick={onClose}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-800"
            aria-label="Close search"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length > 1 && results.length === 0 && (
            <div className="text-center p-8 text-gray-500">
              <p>No products found for "{query}"</p>
            </div>
          )}
          {results.length > 0 && (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center p-4 hover:bg-gray-100 transition-colors"
                  >
                    <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-4" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.productType}</p>
                    </div>
                    <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {query.length <= 1 && (
             <div className="text-center p-8 text-gray-400">
              <p>Start typing to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
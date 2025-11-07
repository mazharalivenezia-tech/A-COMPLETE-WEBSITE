import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => void;
  deleteProduct: (productId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'faskicks_products';

export const ProductProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load products from localStorage on initial mount
  useEffect(() => {
    try {
      const storedProducts = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        // If nothing is in storage, initialize it with the default products
        setProducts(INITIAL_PRODUCTS);
      }
    } catch (error) {
      console.error("Error reading products from localStorage, falling back to default.", error);
      // If storage is corrupted or there's an error, use defaults
      setProducts(INITIAL_PRODUCTS);
    }
    setIsInitialized(true);
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save products to localStorage whenever the products state changes
  useEffect(() => {
    // We only want to save after the initial state has been loaded from storage
    if (isInitialized) {
      try {
        window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (error) {
        console.error("Error saving products to localStorage", error);
      }
    }
  }, [products, isInitialized]);


  const addProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `p${products.length + 1}-${Date.now()}`, // Create a more unique ID
      rating: 0,
      reviewCount: 0,
    };
    setProducts(prevProducts => [...prevProducts, newProduct]);
  };

  const deleteProduct = (productId: string) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

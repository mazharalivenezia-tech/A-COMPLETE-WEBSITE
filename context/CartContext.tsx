
import React, { createContext, useState, useContext, PropsWithChildren, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
  id: string; // A unique identifier for the cart item, e.g., `${product.id}-${color}-${size}`
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedColor: string, selectedSize: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'faskicks_cart';

export const CartProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error("Error saving cart to localStorage", error);
    }
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, selectedColor: string, selectedSize: string) => {
    const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { id: cartItemId, product, quantity, selectedColor, selectedSize }];
      }
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

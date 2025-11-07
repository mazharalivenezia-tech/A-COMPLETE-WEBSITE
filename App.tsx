
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ManufacturingPage from './pages/ManufacturingPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import SizeGuidePage from './pages/SizeGuidePage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <ProductProvider>
      <CartProvider>
        <HashRouter>
          <ScrollToTop />
          <div className="bg-white text-dark font-sans flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop/:category/:subcategory?/:subsubcategory?/:fashioncategory?" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/manufacturing" element={<ManufacturingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/size-guide" element={<SizeGuidePage />} />
                <Route path="/contact" element={<div className="p-8 text-center"><h1>Contact Us</h1><p>Coming Soon</p></div>} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </CartProvider>
    </ProductProvider>
  );
};

export default App;
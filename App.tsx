
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import AIChat from './components/AIChat.tsx';
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login.tsx';
import ForgotPassword from './pages/ForgotPassword.tsx';
import Orders from './pages/Orders.tsx';
import Profile from './pages/Profile.tsx';
import Checkout from './pages/Checkout.tsx';
import Receipt from './pages/Receipt.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { StoreProvider } from './context/StoreContext.tsx';

const App: React.FC = () => {
  useEffect(() => {
    // إخفاء شاشة التحميل بعد تحميل المكونات
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <CartProvider>
            <Router>
              <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-brand-black text-slate-800 dark:text-slate-200 selection:bg-brand-bronze/30 transition-colors duration-300">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/receipt/:orderId" element={<Receipt />} />
                  </Routes>
                </main>
                <AIChat />
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

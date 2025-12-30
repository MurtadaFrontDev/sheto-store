
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, UserCircle, Settings, ArrowLeft, History, Home as HomeIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { totalItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { siteSettings, products } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Live Search Logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, products]);

  // Close search/menu on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white/95 dark:bg-brand-black/95 backdrop-blur-xl sticky top-0 z-[60] border-b border-slate-200 dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Right Section: Logo & Desktop Links */}
          <div className="flex items-center gap-2 sm:gap-8">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
            >
              <Menu size={22} />
            </button>

            <Link to="/" className="flex items-center gap-2 group">
              {siteSettings.logoType === 'text' ? (
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-l from-brand-bronze to-slate-800 dark:to-white bg-clip-text text-transparent transition-all duration-500">
                  {siteSettings.logoText}
                </span>
              ) : (
                <img src={siteSettings.logoImage} alt="logo" className="h-8 sm:h-10 w-auto object-contain" />
              )}
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-black text-slate-500 dark:text-slate-400">
              <Link to="/" className={`hover:text-brand-bronze transition-colors ${location.pathname === '/' ? 'text-brand-bronze' : ''}`}>الرئيسية</Link>
              <Link to="/products" className={`hover:text-brand-bronze transition-colors ${location.pathname === '/products' ? 'text-brand-bronze' : ''}`}>المتجر</Link>
            </div>
          </div>

          {/* Left Section: Search & Actions */}
          <div className="flex items-center gap-1 sm:gap-3 text-slate-600 dark:text-slate-300">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Intelligent Search Dropdown */}
            <div className="relative" ref={searchRef}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)} 
                className={`p-2 transition-all duration-300 rounded-xl ${isSearchOpen ? 'bg-brand-bronze text-white shadow-lg shadow-brand-bronze/20' : 'hover:bg-brand-bronze/10 hover:text-brand-bronze'}`}
              >
                <Search size={20} />
              </button>
              
              {isSearchOpen && (
                <div className="fixed sm:absolute top-[64px] sm:top-full left-1/2 sm:left-0 -translate-x-1/2 sm:translate-x-0 sm:mt-4 w-full sm:w-[400px] bg-white dark:bg-[#151515] border-b sm:border border-slate-200 dark:border-white/10 sm:rounded-[2rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.4)] overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                  <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 flex items-center gap-3">
                    <input 
                      autoFocus 
                      type="text" 
                      placeholder="ابحث عن قطعة، إضاءة، أو تصنيف..." 
                      className="flex-1 bg-slate-50 dark:bg-black/30 border-none outline-none text-slate-900 dark:text-white text-right font-bold py-2 sm:py-3 px-4 rounded-xl text-sm" 
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <button type="submit" className="bg-brand-bronze p-2.5 sm:p-3 rounded-xl text-white hover:bg-brand-bronze/80">
                      <Search size={18} />
                    </button>
                  </form>

                  <div className="max-h-[60vh] sm:max-h-[350px] overflow-y-auto no-scrollbar">
                    {searchQuery.length > 1 ? (
                      suggestions.length > 0 ? (
                        <div className="p-2">
                          {suggestions.map(product => (
                            <Link key={product.id} to={`/product/${product.id}`} className="flex items-center gap-4 p-3 hover:bg-brand-bronze/5 dark:hover:bg-brand-bronze/10 rounded-2xl transition-colors">
                              <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                              <div className="flex-1 text-right">
                                <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">{product.name}</h4>
                                <p className="text-[10px] text-brand-bronze font-bold mt-1">{product.price.toLocaleString()} د.ع</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-10 text-center opacity-50">
                          <p className="text-xs font-bold">لا توجد نتائج مطابقة</p>
                        </div>
                      )
                    ) : (
                      <div className="p-6 text-right">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">اقتراحات سريعة</p>
                         <div className="flex flex-wrap justify-end gap-2">
                           {products.slice(0, 3).map(p => (
                             <button key={p.id} onClick={() => setSearchQuery(p.name)} className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 rounded-lg text-[10px] font-black text-slate-500 hover:text-brand-bronze transition-all">
                               {p.name}
                             </button>
                           ))}
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/cart" className="p-2 hover:bg-brand-bronze/10 hover:text-brand-bronze rounded-xl transition-all relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-brand-bronze text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-black animate-in zoom-in duration-300 shadow-lg shadow-brand-bronze/40">
                  {totalItems}
                </span>
              )}
            </Link>

            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => isAuthenticated ? setIsUserMenuOpen(!isUserMenuOpen) : navigate('/login')} 
                className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-xl transition-all ${isAuthenticated ? 'bg-brand-bronze/10 text-brand-bronze' : 'hover:bg-brand-bronze/10 hover:text-brand-bronze'}`}
              >
                <User size={20} />
                {isAuthenticated && <span className="hidden lg:block text-xs font-black truncate max-w-[80px]">{user?.name}</span>}
              </button>

              {isAuthenticated && isUserMenuOpen && (
                <div className="absolute top-full left-0 mt-4 w-52 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[100] animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-white/5 mb-2 text-right">
                    <p className="text-[10px] font-black text-slate-400 mb-1">مرحباً بك</p>
                    <p className="text-xs font-black text-slate-800 dark:text-white truncate">{user?.name}</p>
                  </div>
                  <Link to="/profile" className="flex items-center justify-end gap-3 p-3 hover:bg-brand-bronze/5 rounded-xl text-xs font-black transition-colors">الملف الشخصي <UserCircle size={16} /></Link>
                  <Link to="/orders" className="flex items-center justify-end gap-3 p-3 hover:bg-brand-bronze/5 rounded-xl text-xs font-black transition-colors">طلباتي <Package size={16} /></Link>
                  <button onClick={handleLogout} className="w-full flex items-center justify-end gap-3 p-3 hover:bg-red-500/5 text-red-500 rounded-xl text-xs font-black transition-colors">خروج <LogOut size={16} /></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu (Drawer) - Solid Background Fix */}
      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100]" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-brand-black z-[110] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in slide-in-from-right duration-300 border-l border-white/5">
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-10">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl"><X size={24} /></button>
                <span className="text-xl font-black text-brand-bronze uppercase tracking-tighter">{siteSettings.logoText}</span>
              </div>
              
              <div className="flex flex-col gap-2 flex-grow text-right">
                <Link to="/" className="flex items-center justify-end gap-4 p-4 hover:bg-brand-bronze/5 rounded-2xl font-black text-lg">الرئيسية <HomeIcon size={20} /></Link>
                <Link to="/products" className="flex items-center justify-end gap-4 p-4 hover:bg-brand-bronze/5 rounded-2xl font-black text-lg">كل المنتجات <Package size={20} /></Link>
                <Link to="/cart" className="flex items-center justify-end gap-4 p-4 hover:bg-brand-bronze/5 rounded-2xl font-black text-lg relative">
                  السلة 
                  {totalItems > 0 && <span className="bg-brand-bronze text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-auto mr-0">{totalItems}</span>}
                  <ShoppingCart size={20} />
                </Link>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/5 flex flex-col gap-4">
                <div className="flex items-center justify-between flex-row-reverse bg-slate-50 dark:bg-white/5 p-4 rounded-2xl">
                  <span className="font-black text-sm">مظهر الموقع</span>
                  <ThemeToggle />
                </div>
                {isAuthenticated ? (
                  <button onClick={handleLogout} className="w-full p-4 bg-red-500/5 text-red-500 font-black rounded-2xl flex items-center justify-center gap-2">تسجيل الخروج <LogOut size={20} /></button>
                ) : (
                  <Link to="/login" className="w-full p-4 bg-brand-bronze text-white font-black rounded-2xl flex items-center justify-center gap-2">دخول اللاعبين <User size={20} /></Link>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;


import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Search as SearchIcon, LayoutGrid, Filter, SlidersHorizontal, Package } from 'lucide-react';

const Products: React.FC = () => {
  const location = useLocation();
  const { products, categories } = useStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('الكل');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('search');
    const cat = params.get('category');
    if (query) setSearchFilter(query);
    if (cat) setActiveCategory(cat);
  }, [location.search]);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (activeCategory !== 'الكل') {
      result = result.filter(p => p.category === activeCategory);
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [searchFilter, activeCategory, products]);

  return (
    <div className="min-h-screen pt-6 sm:pt-16 pb-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        <header className="mb-8 sm:mb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-bronze/10 border border-brand-bronze/20 rounded-full text-brand-bronze text-[10px] sm:text-xs font-black mb-4 uppercase tracking-widest">
            <Package size={12} />
            <span>قائمة التجهيزات</span>
          </div>
          <h1 className="text-2xl sm:text-6xl font-black text-slate-900 dark:text-white">تصفح بذكاء</h1>
        </header>

        {/* Categories Bar - Mobile Horizontal Scroll */}
        <div className="sticky top-16 sm:top-20 z-40 bg-white/80 dark:bg-brand-black/80 backdrop-blur-md py-4 mb-8 -mx-3 px-3 sm:mx-0 sm:px-0 flex items-center gap-3 overflow-x-auto no-scrollbar border-b border-slate-100 dark:border-white/5">
          <div className="flex gap-2 min-w-max">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 sm:px-8 sm:py-3 rounded-xl font-black text-[11px] sm:text-sm transition-all border ${activeCategory === cat ? 'bg-brand-bronze text-white border-brand-bronze shadow-lg shadow-brand-bronze/20' : 'bg-white dark:bg-brand-dark text-slate-500 border-slate-200 dark:border-white/5 hover:border-brand-bronze'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((product, idx) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 sm:py-40 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-slate-50 dark:bg-white/5">
            <SearchIcon size={48} className="text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">لم نجد ما تبحث عنه</h3>
            <p className="text-slate-500 font-bold mb-8 text-sm">جرب استخدام كلمات بحث مختلفة أو تصفح الأقسام.</p>
            <button 
              onClick={() => { setSearchFilter(''); setActiveCategory('الكل'); }} 
              className="px-8 py-3 bg-brand-bronze text-white font-black rounded-xl"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

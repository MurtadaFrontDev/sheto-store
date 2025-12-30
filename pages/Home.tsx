
import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Home: React.FC = () => {
  const { products } = useStore();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="pb-20">
      <Hero />
      <Features />
      
      {/* Featured Products */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">منتجات مميزة</h2>
            <div className="w-20 h-1.5 bg-brand-bronze rounded-full"></div>
          </div>
          <Link to="/products" className="flex items-center gap-2 text-brand-bronze hover:text-brand-bronze/80 font-bold transition-colors">
            عرض الكل
            <ArrowLeft size={20} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

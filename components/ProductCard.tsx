
import React from 'react';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const isSoldOut = product.stock <= 0;

  return (
    <div className={`group relative bg-white dark:bg-[#111] border border-slate-100 dark:border-white/5 rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col h-full ${isSoldOut ? 'opacity-80' : 'hover:border-brand-bronze/40 shadow-sm hover:shadow-2xl hover:shadow-brand-bronze/10'}`}>
      
      {/* Product Image Section */}
      <div className="relative m-2 sm:m-3 rounded-[1rem] sm:rounded-[1.5rem] overflow-hidden aspect-square bg-slate-50 dark:bg-black">
        <Link to={`/product/${product.id}`} className={`block h-full w-full ${isSoldOut ? 'cursor-default' : ''}`}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-700 ${isSoldOut ? 'grayscale' : 'group-hover:scale-110'}`}
          />
        </Link>
        
        {isSoldOut && (
          <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center p-2 text-center backdrop-blur-[2px]">
            <span className="text-white text-[10px] sm:text-xs font-black tracking-widest uppercase py-1.5 px-4 border border-white/20 rounded-lg">
              نفذت الكمية
            </span>
          </div>
        )}

        {/* Quick Actions Hover - Desktop Only */}
        {!isSoldOut && (
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-all duration-500 hidden md:flex gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
             <Link to={`/product/${product.id}`} className="flex-1 h-11 bg-white text-brand-black font-black rounded-xl flex items-center justify-center gap-2 hover:bg-brand-bronze hover:text-white transition-all shadow-lg active:scale-95">
                <Eye size={18} />
                <span className="text-xs">تفاصيل</span>
             </Link>
             <button 
              onClick={(e) => { e.preventDefault(); addToCart(product); }} 
              className="w-11 h-11 bg-brand-bronze text-white rounded-xl flex items-center justify-center hover:bg-black transition-all shadow-lg active:scale-90"
              title="أضف للسلة"
             >
                <ShoppingCart size={20} />
             </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] sm:text-[10px] font-black text-brand-bronze/60 uppercase tracking-tighter">{product.category}</span>
          <div className="flex items-center gap-1 opacity-80">
            <Star size={10} className="fill-brand-bronze text-brand-bronze" />
            <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold">{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`} className="flex-grow">
          <h3 className={`text-[12px] sm:text-lg font-black mb-3 sm:mb-5 text-right transition-colors line-clamp-2 leading-tight ${isSoldOut ? 'text-slate-500' : 'text-slate-900 dark:text-white group-hover:text-brand-bronze'}`}>
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
          {!isSoldOut && (
            <button 
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-brand-bronze text-white rounded-xl active:scale-90 transition-all shadow-md shadow-brand-bronze/20"
            >
              <ShoppingCart size={16} />
            </button>
          )}

          <div className="text-right flex-1">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-[14px] sm:text-2xl font-black text-slate-900 dark:text-white">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[9px] sm:text-xs text-brand-bronze font-black uppercase">د.ع</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

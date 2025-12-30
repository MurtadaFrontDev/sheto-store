
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight, Minus, Plus, ShieldCheck, Truck, RefreshCcw, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useStore } from '../context/StoreContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-800 dark:text-white font-black text-xl px-10 text-center">
        عذراً.. هذا المنتج لم يعد متوفراً حالياً
      </div>
    );
  }

  const isSoldOut = product.stock <= 0;
  const currentImage = activeImage || product.image;
  const galleryImages = [product.image, ...(product.gallery || [])];

  return (
    <div className="pt-4 sm:pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-brand-bronze mb-6 transition-colors group font-black text-sm"
        >
          <ArrowRight size={18} />
          العودة
        </button>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-20 items-start">
          
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className={`aspect-square rounded-[1.5rem] sm:rounded-[3rem] overflow-hidden bg-slate-50 dark:bg-black border border-slate-100 dark:border-white/5 relative shadow-xl ${isSoldOut ? 'grayscale' : ''}`}>
              <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                   <span className="text-white text-xl font-black uppercase tracking-widest border-2 border-white/20 px-6 py-2 rounded-xl">نفذت الكمية</span>
                </div>
              )}
            </div>
            
            {galleryImages.length > 1 && (
              <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-2">
                {galleryImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(img)}
                    className={`flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all ${currentImage === img ? 'border-brand-bronze' : 'border-transparent opacity-60'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="text-right flex flex-col h-full animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-end">
              <span className="px-2.5 py-0.5 bg-brand-bronze/10 text-brand-bronze text-[10px] font-black rounded-lg border border-brand-bronze/10">
                {product.category}
              </span>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 px-2 py-0.5 rounded-lg">
                <span className="text-slate-900 dark:text-white font-black text-[11px]">{product.rating}</span>
                <Star size={12} className="fill-brand-bronze text-brand-bronze" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-5xl font-black mb-4 leading-tight text-slate-900 dark:text-white">{product.name}</h1>
            
            <div className="mb-6 sm:mb-10 flex items-end justify-end gap-1.5">
              <span className="text-[10px] text-slate-400 font-black mb-1">د.ع</span>
              <p className="text-3xl sm:text-6xl font-black text-brand-bronze">
                {product.price.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-white/5 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-white/5 mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">عن المنتج</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg leading-relaxed font-bold">
                {product.description}
              </p>
            </div>

            {!isSoldOut && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
                  <div className="flex items-center bg-white dark:bg-brand-black rounded-xl border border-slate-200 dark:border-white/10 p-1 w-full sm:w-auto justify-between">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-brand-bronze"><Minus size={18} /></button>
                    <span className="w-10 text-center font-black text-lg">{quantity}</span>
                    <button disabled={quantity >= product.stock} onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-brand-bronze"><Plus size={18} /></button>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(product, quantity)}
                    className="w-full flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-brand-bronze text-white font-black text-lg rounded-2xl transition-all shadow-xl shadow-brand-bronze/20 active:scale-95"
                  >
                    <ShoppingCart size={22} />
                    أضف للحقيبة
                  </button>
                </div>
              </div>
            )}

            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: <Truck size={18} />, title: "توصيل سريع", desc: "لباب البيت" },
                { icon: <ShieldCheck size={18} />, title: "ضمان شيتو", desc: "استبدال فوري" },
                { icon: <RefreshCcw size={18} />, title: "دفع آمن", desc: "عند الاستلام" },
              ].map((benefit, i) => (
                <div key={i} className="flex flex-row-reverse items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                  <div className="text-brand-bronze">{benefit.icon}</div>
                  <div className="text-right">
                    <h4 className="text-[11px] font-black text-slate-800 dark:text-white">{benefit.title}</h4>
                    <p className="text-[9px] text-slate-500 font-bold">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

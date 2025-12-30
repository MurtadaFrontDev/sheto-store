
import React from 'react';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, Minus, Plus, Trash2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SHIPPING_COST = 5000;

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();
  
  const finalTotal = totalPrice + SHIPPING_COST;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <div className="w-20 h-20 bg-brand-bronze/10 rounded-full flex items-center justify-center text-brand-bronze mb-6">
          <ShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">الحقيبة فارغة حالياً</h2>
        <p className="text-slate-500 mb-8 font-bold">يبدو أنك لم تضف أي تجهيزات بعد.</p>
        <Link 
          to="/products" 
          className="px-10 py-4 bg-brand-bronze text-white font-black rounded-xl shadow-xl shadow-brand-bronze/20 transition-all active:scale-95"
        >
          استكشف المتجر
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white mb-8 text-right flex items-center justify-end gap-3">
          سلة التسوق ({totalItems})
          <Package className="text-brand-bronze" />
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[1.5rem] p-4 flex gap-4 sm:gap-6 items-center flex-row-reverse shadow-sm">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-black flex-shrink-0 border border-slate-100 dark:border-white/5">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 text-right min-w-0">
                  <h3 className="text-sm sm:text-lg font-black text-slate-900 dark:text-white truncate mb-1">{item.name}</h3>
                  <p className="text-brand-bronze font-black text-sm">{item.price.toLocaleString()} د.ع</p>
                  
                  <div className="flex items-center justify-end gap-3 mt-3">
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500/60 hover:text-red-500 p-1.5 transition-colors">
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex items-center bg-slate-50 dark:bg-black/40 rounded-lg border border-slate-100 dark:border-white/5 p-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-slate-400 hover:text-brand-bronze"><Minus size={14} /></button>
                      <span className="w-8 text-center font-black text-xs text-slate-900 dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-slate-400 hover:text-brand-bronze"><Plus size={14} /></button>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-lg font-black text-slate-900 dark:text-white">{(item.price * item.quantity).toLocaleString()} د.ع</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#111] border border-slate-100 dark:border-white/10 rounded-[2rem] p-8 sticky top-28 shadow-xl">
              <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 text-right">ملخص الدفع</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center flex-row-reverse text-sm">
                  <span className="text-slate-500 font-bold">المجموع</span>
                  <span className="text-slate-900 dark:text-white font-black">{totalPrice.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between items-center flex-row-reverse text-sm">
                  <span className="text-slate-500 font-bold">التوصيل</span>
                  <span className="text-slate-900 dark:text-white font-black">{SHIPPING_COST.toLocaleString()} د.ع</span>
                </div>
                <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex justify-between items-center flex-row-reverse">
                  <span className="text-slate-900 dark:text-white font-black">الإجمالي</span>
                  <span className="text-2xl font-black text-brand-bronze">{finalTotal.toLocaleString()} د.ع</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-brand-bronze text-white font-black rounded-xl shadow-lg shadow-brand-bronze/20 transition-all active:scale-95 mb-4"
              >
                إتمام الطلب
              </button>
              
              <Link to="/products" className="flex items-center justify-center gap-2 text-slate-400 hover:text-brand-bronze transition-colors text-xs font-black">
                متابعة التسوق
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

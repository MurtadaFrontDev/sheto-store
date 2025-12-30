
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Calendar, CreditCard, ReceiptText, AlertCircle } from 'lucide-react';

const Orders: React.FC = () => {
  const { orders, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">يجب تسجيل الدخول أولاً</h2>
        <Link to="/login" className="px-8 py-3 bg-brand-bronze text-white font-bold rounded-xl">تسجيل الدخول</Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 max-w-4xl mx-auto px-4 text-right">
      <div className="flex items-center justify-between mb-12 flex-row-reverse">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">طلباتي</h1>
        <ReceiptText size={32} className="text-brand-bronze" />
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-brand-dark/40 border border-dashed border-slate-200 dark:border-white/10 rounded-[32px] p-16 text-center">
          <Package size={64} className="text-slate-300 mx-auto mb-6" />
          <p className="text-slate-500 mb-8 font-medium">لا توجد طلبات سابقة.</p>
          <Link to="/products" className="text-brand-bronze font-black hover:underline">استكشف المنتجات</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-brand-dark/60 border border-slate-100 dark:border-white/10 rounded-[32px] overflow-hidden shadow-sm backdrop-blur-xl">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex flex-wrap justify-between items-center gap-4 flex-row-reverse">
                <div className="space-y-1 text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase">رقم الطلب</p>
                  <p className="text-slate-900 dark:text-white font-mono font-bold">#{order.id.slice(0, 8)}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${
                  order.status === 'تم التوصيل' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                  order.status === 'ملغي' ? 'bg-slate-500/10 text-slate-500 border-slate-500/20' :
                  order.status === 'مرفوض' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-orange-500/10 text-orange-500 border-orange-500/20'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 flex-row-reverse">
                      <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 text-right">
                        <h4 className="text-slate-900 dark:text-white font-black text-sm">{item.name}</h4>
                        <p className="text-slate-500 text-xs font-bold">الكمية: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center flex-row-reverse">
                  <p className="text-2xl font-black text-brand-bronze">{order.totalPrice.toLocaleString()} د.ع</p>
                  <div className="text-[10px] text-slate-400 font-bold italic">
                    {order.status === 'قيد التنفيذ' ? 'الطلب قيد المراجعة من قبل الإدارة' : 'تم تحديث حالة الطلب'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

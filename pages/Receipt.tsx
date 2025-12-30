
import React, { useRef, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Download, CheckCircle2, Home, Package, Truck, Phone, MapPin, Calendar, ClipboardList, Loader2, Image as ImageIcon } from 'lucide-react';
import { toBlob } from 'https://esm.sh/html-to-image@1.11.11';

const Receipt: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return <Navigate to="/orders" />;
  }

  const handleSaveImage = async () => {
    if (receiptRef.current === null) return;
    
    setIsSaving(true);
    try {
      // إيقاف بسيط للسماح بتحميل الصور بشكل كامل
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const blob = await toBlob(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        // هذا الخيار مهم جداً للسماح بالصور من روابط خارجية
        includeQueryParams: true,
      });
      
      if (!blob) throw new Error('Failed to generate image');

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Sheeto-Order-${order.id}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Save failed:', err);
      alert('عذراً، نظام الحماية في المتصفح قد يمنع حفظ الصور الخارجية تلقائياً. يرجى أخذ لقطة شاشة (Screenshot) للفاتورة لحفظها بأمان.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pt-12 pb-24 max-w-3xl mx-auto px-4">
      {/* Success Banner */}
      <div className="text-center mb-12 animate-in fade-in zoom-in-95 print:hidden">
        <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
          <CheckCircle2 size={48} className="animate-bounce-slow" />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">تم تأكيد الأسطورة!</h1>
        <p className="text-slate-400 text-lg mb-2">طلبك برقم <span className="text-white font-mono">#{order.id.slice(0,8)}</span> جاهز للتنفيذ.</p>
        <p className="text-slate-500 text-sm">سيقوم فريقنا بالتواصل معك قريباً لتأكيد تفاصيل التوصيل.</p>
      </div>

      {/* The Actual Receipt Card */}
      <div className="relative">
        <div 
          ref={receiptRef}
          className="bg-white text-slate-900 rounded-[40px] overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="bg-brand-black p-10 text-white flex justify-between items-center">
            <div className="text-right">
              <h2 className="text-4xl font-black mb-1">فاتورة شراء</h2>
              <p className="text-brand-bronze font-bold text-sm tracking-widest uppercase">Sheeto Store - 2025</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">رقم الطلب</p>
              <p className="text-2xl font-mono font-black">#{order.id}</p>
            </div>
          </div>

          <div className="p-10 sm:p-14 space-y-12">
            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-10 text-sm">
              <div className="space-y-5 text-right">
                <h3 className="font-black text-slate-400 uppercase tracking-tighter text-xs flex items-center justify-end gap-2 mb-4">
                  <Truck size={16} />
                  بيانات المشحن
                </h3>
                <div className="space-y-3">
                  <p className="font-black text-slate-800 text-lg">{order.customerInfo.fullName}</p>
                  <p className="font-mono text-slate-600">{order.customerInfo.phone}</p>
                  <p className="text-slate-500 leading-relaxed">{order.customerInfo.province}، {order.customerInfo.address}</p>
                </div>
              </div>
              <div className="space-y-5 text-right">
                <h3 className="font-black text-slate-400 uppercase tracking-tighter text-xs flex items-center justify-end gap-2 mb-4">
                  <Calendar size={16} />
                  معلومات الفاتورة
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between flex-row-reverse border-b border-slate-50 pb-2">
                    <span className="text-slate-400">تاريخ الطلب</span>
                    <span className="font-bold">{order.date}</span>
                  </div>
                  <div className="flex justify-between flex-row-reverse border-b border-slate-50 pb-2">
                    <span className="text-slate-400">طريقة الدفع</span>
                    <span className="font-bold text-brand-bronze">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between flex-row-reverse">
                    <span className="text-slate-400">حالة الدفع</span>
                    <span className="font-black text-green-600">بانتظار الاستلام</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border-t border-slate-100 pt-10 text-right">
              <h3 className="font-black text-slate-400 uppercase tracking-tighter text-xs flex items-center justify-end gap-2 mb-8">
                <Package size={16} />
                قائمة التجهيزات
              </h3>
              <div className="space-y-6">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between flex-row-reverse">
                    <div className="flex items-center gap-5 flex-row-reverse">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm">
                        <img 
                          src={item.image} 
                          className="w-full h-full object-cover" 
                          crossOrigin="anonymous" 
                        />
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-400 font-bold">الكمية: {item.quantity} × {item.price.toLocaleString()} د.ع</p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-lg">{(item.price * item.quantity).toLocaleString()} د.ع</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-slate-50 rounded-3xl p-8 space-y-4 text-right">
              <div className="flex justify-between text-sm flex-row-reverse">
                <span className="text-slate-500 font-bold">المجموع الفرعي</span>
                <span className="font-bold text-slate-800">{(order.totalPrice - order.shippingCost).toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between text-sm flex-row-reverse">
                <span className="text-slate-500 font-bold">أجور التوصيل</span>
                <span className="font-bold text-slate-800">{order.shippingCost.toLocaleString()} د.ع</span>
              </div>
              <div className="border-t border-slate-200 pt-6 mt-2 flex justify-between flex-row-reverse items-center">
                <span className="text-xl font-black text-slate-900">المبلغ الكلي</span>
                <span className="text-3xl font-black text-brand-bronze">{order.totalPrice.toLocaleString()} د.ع</span>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-dashed border-slate-200">
              <p className="text-xs text-slate-400 font-bold mb-1">شكراً لاختيارك شيتو لتجهيز سيت-أب أحلامك</p>
              <p className="text-[10px] text-slate-300 font-black tracking-[0.2em] uppercase">Level Up Your Game</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={handleSaveImage}
          disabled={isSaving}
          className="flex items-center justify-center gap-3 px-12 py-5 bg-white text-brand-black font-black rounded-2xl hover:bg-slate-100 transition-all disabled:opacity-50 shadow-xl group"
        >
          {isSaving ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <ImageIcon size={24} className="group-hover:scale-110 transition-transform" />
          )}
          {isSaving ? 'جاري الحفظ...' : 'حفظ الوصل كصورة'}
        </button>
        <Link 
          to="/orders"
          className="flex items-center justify-center gap-3 px-12 py-5 bg-brand-bronze text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-bronze/30"
        >
          <ClipboardList size={24} />
          تتبع الطلبات
        </Link>
      </div>
    </div>
  );
};

export default Receipt;

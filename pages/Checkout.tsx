
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { User, Phone, MapPin, Truck, ChevronRight, AlertCircle, CreditCard, ShoppingBag, Loader2 } from 'lucide-react';

const PROVINCES = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'النجف', 'كربلاء', 'ذي قار', 'بابل', 
  'الأنبار', 'كركوك', 'ديالى', 'المثنى', 'القادسية', 'ميسان', 'واسط', 'صلاح الدين', 'دهوك', 'السليمانية'
];

const SHIPPING_COST = 5000;

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, addOrder, isAuthenticated } = useAuth();
  const { decrementStock } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: '',
    province: '',
    address: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'دفع عند الاستلام' | 'دفع إلكتروني'>('دفع عند الاستلام');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isDone && !isSubmitting && cart.length === 0) {
      navigate('/cart');
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
    }
  }, [cart.length, isAuthenticated, navigate, isSubmitting, isDone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validate = () => {
    if (!formData.fullName || formData.fullName.length < 3) return "يرجى إدخال الاسم الكامل بشكل صحيح";
    if (!formData.phone || formData.phone.length < 10) return "يرجى إدخال رقم هاتف صالح";
    if (!formData.province) return "يرجى اختيار المحافظة";
    if (!formData.address || formData.address.length < 5) return "يرجى إدخال العنوان بالتفصيل";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('ar-IQ', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      }),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalPrice: totalPrice + SHIPPING_COST,
      shippingCost: SHIPPING_COST,
      paymentMethod,
      status: 'قيد التنفيذ' as const,
      customerInfo: formData
    };

    // خصم المخزون
    cart.forEach(item => {
      decrementStock(item.id, item.quantity);
    });

    addOrder(newOrder);
    setIsDone(true);
    clearCart();
    
    navigate(`/receipt/${orderId}`);
  };

  return (
    <div className="pt-12 pb-24 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-slate-500 mb-8 text-sm font-bold justify-end">
          <span className="text-white">معلومات الشحن</span>
          <ChevronRight size={16} />
          <Link to="/cart" className="hover:text-white transition-colors">السلة</Link>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-brand-dark/40 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center justify-end gap-3">
                معلومات التوصيل
                <Truck className="text-brand-bronze" />
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-center justify-end gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                  <p className="text-red-500 text-sm font-bold">{error}</p>
                  <AlertCircle className="text-red-500 shrink-0" size={20} />
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 mr-2">الاسم الكامل</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-bronze transition-colors" size={20} />
                    <input 
                      disabled={isSubmitting}
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-brand-black border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all disabled:opacity-50 text-right"
                      placeholder="اسم المستلم"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 mr-2">رقم الهاتف</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-bronze transition-colors" size={20} />
                    <input 
                      disabled={isSubmitting}
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-brand-black border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all text-left disabled:opacity-50 font-mono"
                      dir="ltr"
                      placeholder="07XX XXX XXXX"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-400 mr-2">المحافظة</label>
                  <div className="relative group">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-bronze transition-colors" size={20} />
                    <select 
                      disabled={isSubmitting}
                      name="province"
                      value={formData.province}
                      onChange={handleInputChange}
                      className="w-full bg-brand-black border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all appearance-none cursor-pointer disabled:opacity-50 text-right"
                    >
                      <option value="">اختر المحافظة</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-slate-400 mr-2">العنوان بالتفصيل</label>
                  <div className="relative group">
                    <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-brand-bronze transition-colors" size={20} />
                    <input 
                      disabled={isSubmitting}
                      type="text" 
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full bg-brand-black border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all disabled:opacity-50 text-right"
                      placeholder="اسم الحي، الزقاق، الدار، أقرب نقطة دالة"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-dark/40 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">
              <h2 className="text-2xl font-black text-white mb-8 flex items-center justify-end gap-3">
                طريقة الدفع
                <CreditCard className="text-brand-bronze" />
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <button 
                  disabled={isSubmitting}
                  type="button"
                  onClick={() => setPaymentMethod('دفع عند الاستلام')}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all flex-row-reverse ${paymentMethod === 'دفع عند الاستلام' ? 'bg-brand-bronze/10 border-brand-bronze text-brand-bronze shadow-[0_0_20px_rgba(146,99,61,0.15)]' : 'bg-brand-black border-white/5 text-slate-400 hover:border-slate-500'}`}
                >
                  <span className="font-black">الدفع عند الاستلام</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'دفع عند الاستلام' ? 'border-brand-bronze' : 'border-slate-600'}`}>
                    {paymentMethod === 'دفع عند الاستلام' && <div className="w-2.5 h-2.5 bg-brand-bronze rounded-full"></div>}
                  </div>
                </button>
                
                <div 
                  className="flex items-center justify-between p-5 rounded-2xl border bg-brand-black/40 border-white/5 text-slate-600 cursor-not-allowed opacity-40 grayscale select-none relative group flex-row-reverse"
                >
                  <div className="flex flex-col text-right">
                    <span className="font-black">دفع إلكتروني</span>
                    <span className="text-[10px] font-bold text-slate-500">غير متوفر حالياً</span>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 flex items-center justify-center"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-brand-dark border border-white/10 rounded-[32px] p-8 sticky top-32 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-bronze"></div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-end gap-2">
                ملخص الطلب
                <ShoppingBag size={20} className="text-brand-bronze" />
              </h2>
              
              <div className="max-h-60 overflow-y-auto mb-6 pl-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0 flex-row-reverse">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 text-right">
                      <h4 className="text-white text-xs font-bold line-clamp-1">{item.name}</h4>
                      <p className="text-slate-500 text-[10px]">الكمية: {item.quantity}</p>
                    </div>
                    <p className="text-white text-xs font-black">{(item.price * item.quantity).toLocaleString()} د.ع</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm flex-row-reverse">
                  <span className="text-slate-500 text-right">المجموع الفرعي</span>
                  <span className="text-white font-bold">{totalPrice.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between items-center text-sm flex-row-reverse">
                  <span className="text-slate-500 text-right">التوصيل ({formData.province || 'لم تحدد'})</span>
                  <span className="text-white font-bold">{SHIPPING_COST.toLocaleString()} د.ع</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center flex-row-reverse">
                  <span className="text-white font-bold text-right">الإجمالي الكلي</span>
                  <span className="text-2xl font-black text-brand-bronze">{(totalPrice + SHIPPING_COST).toLocaleString()} د.ع</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-brand-bronze hover:bg-brand-bronze/90 text-white font-black rounded-xl transition-all shadow-xl shadow-brand-bronze/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    جاري معالجة الطلب...
                  </>
                ) : (
                  'تأكيد الطلب الآن'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;

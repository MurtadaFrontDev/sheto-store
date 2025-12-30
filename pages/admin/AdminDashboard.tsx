
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ListTree, ShoppingCart, 
  Settings, LogOut, Plus, Trash2, Edit3, X, Menu,
  Bell, MapPin, Phone, Clock, CheckCircle, 
  AlertCircle, Boxes, AlertTriangle, GripVertical, Image as ImageIcon, Sun, Moon,
  ClipboardList, Info, DollarSign, CreditCard, Copy, UserCheck, XCircle
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Product, Order, SiteSettings } from '../../types';
import { compressImage } from '../../utils/db';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { products, categories, siteSettings, addProduct, updateProduct, deleteProduct, updateCategories, updateSettings } = useStore();
  const { orders, updateOrderStatus } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'categories' | 'orders' | 'inventory' | 'settings'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // DnD States
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('sheeto_admin_token');
    if (!token) navigate('/admin/login');

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('sheeto_admin_token');
    navigate('/');
  };

  const handleUpdateStatus = (id: string, status: Order['status']) => {
    updateOrderStatus(id, status);
    setSelectedOrderDetails(null); // إغلاق النافذة فوراً بعد التحديث
  };

  // --- Category DnD Logic ---
  const handleDragStart = (idx: number) => setDraggedIdx(idx);
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === idx) return;
    const newCats = [...categories];
    const draggedItem = newCats[draggedIdx];
    newCats.splice(draggedIdx, 1);
    newCats.splice(idx, 0, draggedItem);
    setDraggedIdx(idx);
    updateCategories(newCats);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // --- Alerts Logic ---
  const soldOutProducts = products.filter(p => p.stock <= 0);
  const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 5);
  const pendingOrders = orders.filter(o => o.status === 'قيد التنفيذ');
  const totalAlerts = soldOutProducts.length + lowStockProducts.length + pendingOrders.length;

  const getTabTitle = () => {
    switch(activeTab) {
      case 'stats': return 'لوحة القيادة';
      case 'inventory': return 'إدارة المستودع';
      case 'categories': return 'تبويبات المتجر';
      case 'orders': return 'سجل المبيعات';
      case 'settings': return 'تخصيص الواجهة';
      default: return 'الأدمن';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row text-right transition-colors duration-300 ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f8fafc] text-slate-800'}`}>
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-5 sticky top-0 bg-white/95 dark:bg-black/95 backdrop-blur-md z-50 border-b border-slate-200 dark:border-white/5">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 bg-brand-bronze/10 text-brand-bronze rounded-xl">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-black text-brand-bronze tracking-tighter">شيتو <span className="text-slate-900 dark:text-white">آدمن</span></h1>
        <div className="w-10 h-10 bg-brand-bronze rounded-full flex items-center justify-center text-white">
          <Settings size={20} />
        </div>
      </header>

      {/* Sidebar */}
      <>
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
        )}
        <aside className={`fixed inset-y-0 right-0 w-80 z-[110] transform transition-transform duration-500 flex flex-col p-8 md:relative md:translate-x-0 md:z-auto ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} ${theme === 'dark' ? 'bg-brand-black border-l border-white/5' : 'bg-white border-l border-slate-200 shadow-2xl md:shadow-none'}`}>
          <div className="mb-12 flex items-center justify-end gap-5">
            <div className="text-right">
              <h1 className="text-2xl font-black">إدارة <span className="text-brand-bronze">شيتو</span></h1>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">Admin Suite V2.5</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400"><X size={24} /></button>
          </div>

          <nav className="flex-1 space-y-3">
            {[
              { id: 'stats', label: 'الإحصائيات', icon: <LayoutDashboard size={20} /> },
              { id: 'inventory', label: 'المخزون', icon: <Boxes size={20} /> },
              { id: 'categories', label: 'التصنيفات', icon: <ListTree size={20} /> },
              { id: 'orders', label: 'المبيعات', icon: <ShoppingCart size={20} /> },
              { id: 'settings', label: 'الإعدادات', icon: <Settings size={20} /> },
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id as any)} 
                className={`w-full flex items-center justify-end gap-5 px-6 py-4 rounded-2xl font-black transition-all ${
                  activeTab === item.id 
                    ? 'bg-brand-bronze text-white shadow-lg' 
                    : 'text-slate-400 hover:text-brand-bronze hover:bg-brand-bronze/5'
                }`}
              >
                <span className="text-sm">{item.label}</span>
                {item.icon}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col gap-4">
             <button onClick={toggleTheme} className={`w-full flex items-center justify-end gap-5 px-6 py-4 rounded-2xl font-black transition-all ${theme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <span className="text-sm">تبديل المظهر</span>
                {theme === 'dark' ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-indigo-600" />}
             </button>
             <button onClick={handleLogout} className="w-full flex items-center justify-end gap-5 px-6 py-4 text-red-500 font-black hover:bg-red-500/5 rounded-2xl">خروج <LogOut size={20} /></button>
          </div>
        </aside>
      </>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 lg:p-16 overflow-y-auto h-[calc(100vh-64px)] md:h-screen custom-scrollbar relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 gap-6">
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className={`h-12 w-12 border rounded-xl flex items-center justify-center transition-all relative ${
                  theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'
                }`}
              >
                <Bell size={20} />
                {totalAlerts > 0 && <span className="absolute -top-1 -left-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-black">{totalAlerts}</span>}
              </button>
            </div>
            {activeTab === 'inventory' && (
              <button className="h-12 px-6 bg-brand-bronze text-white font-black rounded-xl flex items-center gap-2 text-sm shadow-lg shadow-brand-bronze/20">إضافة قطعة <Plus size={18} /></button>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-2xl md:text-5xl font-black tracking-tight">{getTabTitle()}</h2>
          </div>
        </header>

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-slate-400 font-black">لا توجد مبيعات حالياً</div>
            ) : (
              orders.map(order => (
                <div key={order.id} className={`group border rounded-[2.5rem] p-8 flex flex-col md:flex-row gap-8 items-center flex-row-reverse text-right transition-all hover:border-brand-bronze/30 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-6 flex-row-reverse">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">رقم الطلب</p>
                        <h4 className="font-mono font-black text-sm">#{order.id.slice(0,8)}</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الحالة</p>
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black ${
                          order.status === 'تم التوصيل' ? 'bg-emerald-500/10 text-emerald-500' : 
                          order.status === 'ملغي' ? 'bg-slate-500/10 text-slate-500' : 
                          order.status === 'مرفوض' ? 'bg-red-500/10 text-red-500' :
                          'bg-orange-500/10 text-orange-500'
                        }`}>{order.status}</span>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المبلغ</p>
                        <p className="text-sm font-black text-brand-bronze">{order.totalPrice.toLocaleString()} د.ع</p>
                     </div>
                  </div>
                  <button onClick={() => setSelectedOrderDetails(order)} className="w-full md:w-auto px-8 py-4 bg-brand-bronze text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-bronze/20 hover:scale-105 transition-all">إدارة الطلب</button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal: Detailed Order Management */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
            {/* Close Button (X) */}
            <button 
              onClick={() => setSelectedOrderDetails(null)} 
              className="fixed top-6 left-6 z-[210] p-4 bg-red-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all"
            >
              <X size={32} />
            </button>

            <div className={`w-full max-w-2xl rounded-[3rem] border shadow-2xl overflow-hidden flex flex-col text-right animate-in zoom-in-95 ${theme === 'dark' ? 'bg-[#0f0f0f] border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center flex-row-reverse bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="text-2xl font-black">إدارة الطلب</h3>
                <p className="text-xs text-slate-500 font-black">رقم: #{selectedOrderDetails.id.toUpperCase()}</p>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black mb-1">الزبون</p>
                    <p className="text-sm font-black">{selectedOrderDetails.customerInfo.fullName}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl">
                    <p className="text-[10px] text-slate-500 font-black mb-1">الحالة الحالية</p>
                    <p className="text-sm font-black text-brand-bronze">{selectedOrderDetails.status}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-black text-slate-400">تحديث الحالة:</p>
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'تم التوصيل')}
                      className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all"
                    >
                      تأكيد التوصيل <CheckCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'مرفوض')}
                      className="w-full py-4 bg-red-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
                    >
                      رفض الطلب <XCircle size={18} />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedOrderDetails.id, 'قيد التنفيذ')}
                      className="w-full py-4 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/20 transition-all"
                    >
                      إعادة لـ "قيد التنفيذ" <Clock size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-white/5 text-center">
                 <button onClick={() => setSelectedOrderDetails(null)} className="text-slate-400 font-black text-sm hover:text-red-500">إلغاء وإغلاق</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;


import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Footer: React.FC = () => {
  const { siteSettings, categories } = useStore();

  return (
    <footer className="bg-brand-black border-t border-white/5 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 text-right">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black bg-gradient-to-l from-brand-bronze to-white/50 bg-clip-text text-transparent inline-block">
              {siteSettings.logoType === 'text' ? siteSettings.logoText : 'شيتو.'}
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              {siteSettings.footerDescription}
            </p>
            <div className="flex gap-4 justify-start">
              <a href={siteSettings.socialLinks.facebook} className="p-2.5 bg-brand-dark text-slate-400 hover:text-brand-bronze hover:scale-110 transition-all rounded-xl border border-white/5"><Facebook size={20} /></a>
              <a href={siteSettings.socialLinks.instagram} className="p-2.5 bg-brand-dark text-slate-400 hover:text-brand-bronze hover:scale-110 transition-all rounded-xl border border-white/5"><Instagram size={20} /></a>
              <a href={siteSettings.socialLinks.twitter} className="p-2.5 bg-brand-dark text-slate-400 hover:text-brand-bronze hover:scale-110 transition-all rounded-xl border border-white/5"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black text-white mb-8 border-r-4 border-brand-bronze pr-4">روابط سريعة</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              <li><Link to="/" className="hover:text-brand-bronze transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-brand-bronze transition-colors">جميع المنتجات</Link></li>
              <li><Link to="/orders" className="hover:text-brand-bronze transition-colors">تتبع طلبي</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-black text-white mb-8 border-r-4 border-brand-bronze pr-4">الأقسام</h4>
            <ul className="space-y-4 text-slate-400 font-bold">
              {categories.slice(1, 5).map(cat => (
                <li key={cat}><Link to={`/products?category=${cat}`} className="hover:text-brand-bronze transition-colors">{cat}</Link></li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-10 text-center">
          <div className="inline-block px-8 py-3 bg-white/5 rounded-full border border-white/5">
            <p className="text-sm text-slate-500 font-black">
              جميع حقوق النشر محفوظة - {siteSettings.logoText} © 2025
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

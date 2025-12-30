
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Target, Gamepad2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Hero: React.FC = () => {
  const { siteSettings } = useStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (siteSettings.heroSlider.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % siteSettings.heroSlider.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [siteSettings.heroSlider]);

  return (
    <div className="relative min-h-[60vh] sm:min-h-[85vh] flex items-center overflow-hidden bg-white dark:bg-brand-black transition-colors duration-300">
      {/* Decorative Glows */}
      <div className="absolute top-[-5%] right-[-5%] w-[250px] sm:w-[600px] h-[250px] sm:h-[600px] bg-brand-bronze/10 rounded-full blur-[80px] sm:blur-[150px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 sm:py-20">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          
          <div className="text-right order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-bronze/10 border border-brand-bronze/20 rounded-full text-brand-bronze text-[10px] sm:text-xs font-black mb-4 sm:mb-8 animate-pulse">
              <Target size={14} />
              <span>احترافك يبدأ من هنا</span>
            </div>
            
            <h1 className="text-3xl sm:text-6xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 sm:mb-8">
              {siteSettings.heroTitle}
            </h1>
            
            <p className="text-xs sm:text-xl text-slate-600 dark:text-slate-400 mb-6 sm:mb-12 max-w-xl leading-relaxed font-bold">
              {siteSettings.heroSubtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-start">
              <Link 
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 sm:py-5 bg-brand-bronze text-white text-base sm:text-lg font-black rounded-2xl transition-all hover:bg-slate-900 dark:hover:bg-white dark:hover:text-black shadow-xl shadow-brand-bronze/20"
              >
                استعرض التجهيزات
                <ChevronLeft size={20} />
              </Link>
            </div>
          </div>
          
          <div className="order-1 lg:order-2 relative group px-2 sm:px-0">
            <div className="relative rounded-[2rem] sm:rounded-[3.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 aspect-[16/10] sm:aspect-[4/3]">
              {siteSettings.heroSlider.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Slider" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;

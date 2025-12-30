
import React from 'react';
import { ShieldCheck, Zap, TicketPercent, Headphones, Trophy, Box, ShieldAlert, BadgeCheck } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    { 
      icon: <Trophy className="text-brand-bronze" size={32} />, 
      title: "معايير النخبة", 
      desc: "كل قطعة تمر باختبارات جودة صارمة لتناسب ساعات اللعب الطويلة للمحترفين." 
    },
    { 
      icon: <Zap className="text-brand-bronze" size={32} />, 
      title: "شحن توربو", 
      desc: "نظام لوجستي متطور يضمن وصول طلبك خلال أقل من 48 ساعة لباب منزلك." 
    },
    { 
      icon: <TicketPercent className="text-brand-bronze" size={32} />, 
      title: "قيمة حقيقية", 
      desc: "نوفر لك أفضل الأسعار مقابل الجودة، لأننا ندرك أن السيت-أب هو استثمار في شغفك." 
    },
    { 
      icon: <Headphones className="text-brand-bronze" size={32} />, 
      title: "دعم 24/7", 
      desc: "فريق من الجيمرز المتخصصين متواجدين لمساعدتك في التخطيط لسيت-أب أحلامك." 
    },
  ];

  const trustBadges = [
    {
      icon: <BadgeCheck size={28} className="text-brand-bronze" />,
      text: "منتجات أصلية 100%",
      subtext: "نضمن لك الجودة والمصدر"
    },
    {
      icon: <Box size={28} className="text-brand-bronze" />,
      text: "تغليف احترافي آمن",
      subtext: "تصلك القطعة كما خرجت من المصنع"
    },
    {
      icon: <ShieldAlert size={28} className="text-brand-bronze" />,
      text: "ضمان استرجاع حقيقي",
      subtext: "حقك محفوظ في حال وجود أي خلل"
    }
  ];

  return (
    <section className="relative py-24 bg-white dark:bg-brand-black overflow-hidden border-t border-slate-200 dark:border-white/5 transition-colors duration-300">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-bronze/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">ميثاق <span className="text-brand-bronze">شيتو</span> للاحتراف</h2>
          <div className="w-24 h-1.5 bg-brand-bronze mx-auto rounded-full"></div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group p-10 bg-slate-50 dark:bg-brand-dark/30 border border-slate-200 dark:border-white/5 rounded-[40px] hover:border-brand-bronze/40 transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
            >
              <div className="mb-8 w-16 h-16 bg-white dark:bg-brand-black rounded-2xl border border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-bronze/20 group-hover:scale-110 transition-all duration-500 shadow-lg">
                {feature.icon}
              </div>
              <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-brand-bronze transition-colors">
                {feature.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Redesigned Trust Tabs Section */}
        <div className="pt-16 border-t border-slate-200 dark:border-white/5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="group relative flex items-center gap-5 p-6 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-3xl hover:bg-brand-bronze/10 hover:border-brand-bronze/30 transition-all duration-500 cursor-default"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-white dark:bg-brand-black rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 border border-slate-200 dark:border-white/5">
                  {badge.icon}
                </div>
                <div className="text-right">
                  <h5 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-brand-bronze transition-colors duration-300">
                    {badge.text}
                  </h5>
                  <p className="text-xs text-slate-500 font-bold group-hover:text-slate-700 dark:group-hover:text-slate-400 transition-colors">
                    {badge.subtext}
                  </p>
                </div>
                {/* Subtle side indicator */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-bronze rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

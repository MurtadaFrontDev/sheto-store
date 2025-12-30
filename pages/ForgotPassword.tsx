
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Gamepad2, AlertCircle, CheckCircle2 } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('البريد الإلكتروني المدخل غير صالح');
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brand-black transition-colors duration-500">
      <div className="max-w-md w-full space-y-12 bg-white dark:bg-brand-dark/80 p-10 sm:p-16 rounded-[4rem] border border-slate-200 dark:border-white/10 backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] dark:shadow-none relative overflow-hidden transition-all duration-500">
        
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-bronze/10 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="text-center relative z-10">
          <div className="mx-auto h-28 w-28 bg-brand-bronze flex items-center justify-center rounded-[2.8rem] shadow-2xl shadow-brand-bronze/40 mb-10 transform -rotate-3 hover:rotate-0 transition-all duration-700 cursor-default">
            <Gamepad2 className="text-white h-14 w-14" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">استعادة العضوية</h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-bold text-lg leading-relaxed">
            سنرسل لك شيفرة سحرية للعودة إلى حسابك
          </p>
        </div>

        {isSubmitted ? (
          <div className="relative z-10 space-y-10 animate-in fade-in zoom-in-95">
            <div className="bg-green-500/10 border border-green-500/30 p-12 rounded-[3rem] text-center space-y-6 shadow-inner">
              <CheckCircle2 className="text-green-500 mx-auto" size={80} />
              <div className="space-y-4">
                <h3 className="text-slate-900 dark:text-white font-black text-3xl">تفقد البريد</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed font-bold">
                  تم إرسال الرابط إلى <br/>
                  <span className="text-brand-bronze text-xl underline decoration-2 underline-offset-8">{email}</span>
                </p>
              </div>
            </div>
            <Link
              to="/login"
              className="w-full h-20 bg-brand-bronze hover:bg-slate-900 dark:hover:bg-white text-white dark:hover:text-brand-black font-black rounded-[2rem] transition-all shadow-2xl shadow-brand-bronze/30 flex items-center justify-center gap-4 group text-2xl"
            >
              العودة للدخول
              <ArrowRight size={28} className="rotate-180 transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="relative z-10 bg-red-500/10 border border-red-500/30 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="text-red-500 shrink-0" size={24} />
                <p className="text-red-500 text-sm font-black leading-snug">{error}</p>
              </div>
            )}

            <form className="mt-12 space-y-10 relative z-10" onSubmit={handleSubmit} noValidate>
              <div className="relative group">
                <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-bronze transition-all" size={26} />
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="w-full h-20 bg-slate-100 dark:bg-brand-black/60 border-2 border-transparent dark:border-white/5 rounded-[2rem] pr-16 pl-8 text-slate-900 dark:text-white text-xl focus:border-brand-bronze dark:focus:border-brand-bronze focus:bg-white dark:focus:bg-brand-black focus:ring-8 focus:ring-brand-bronze/10 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700 font-black shadow-inner"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full h-20 bg-brand-bronze hover:bg-slate-900 dark:hover:bg-white text-white dark:hover:text-brand-black font-black rounded-[2rem] transition-all shadow-2xl shadow-brand-bronze/30 transform active:scale-[0.96] flex items-center justify-center gap-4 text-2xl"
              >
                إرسال الرابط
              </button>

              <div className="text-center pt-6">
                <Link
                  to="/login"
                  className="text-slate-500 dark:text-slate-400 hover:text-brand-bronze transition-all flex items-center gap-3 mx-auto font-black group w-fit px-10 py-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 text-lg"
                >
                  <ArrowRight size={26} className="transition-transform group-hover:translate-x-2" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

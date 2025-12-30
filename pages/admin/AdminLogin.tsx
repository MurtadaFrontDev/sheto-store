
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Lock, User, Gamepad2, ArrowRight, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // محاكاة تأخير بسيط للتحقق
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('sheeto_admin_token', 'logged_in_hero');
      navigate('/admin/dashboard');
    } else {
      setError('بيانات الدخول غير صحيحة، الوصول محظور!');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-bronze/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-bronze/5 rounded-full blur-[120px]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-bronze mb-8 transition-all font-bold group"
        >
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          العودة للمتجر
        </Link>

        <div className="bg-white/5 backdrop-blur-2xl p-10 sm:p-14 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-bronze to-[#7a4f2f] rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-bronze/40 rotate-12 hover:rotate-0 transition-all duration-500">
                <ShieldCheck className="text-white" size={48} />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black border-4 border-[#1a1a1a] rounded-full flex items-center justify-center text-brand-bronze">
                <Lock size={16} />
              </div>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">بوابة المدير</h1>
            <p className="text-slate-500 font-bold mt-3 uppercase tracking-[0.2em] text-xs">Command Center Access</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-5 rounded-2xl text-red-500 text-xs font-black mb-8 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <ShieldAlert size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-bronze transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="اسم المستخدم"
                  className="w-full h-[72px] bg-black/40 border border-white/5 rounded-2xl pr-14 pl-6 text-white focus:border-brand-bronze focus:bg-black/60 outline-none font-bold transition-all placeholder:text-slate-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-bronze transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="كلمة السر"
                  className="w-full h-[72px] bg-black/40 border border-white/5 rounded-2xl pr-14 pl-6 text-white focus:border-brand-bronze focus:bg-black/60 outline-none font-bold transition-all placeholder:text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full h-[72px] bg-brand-bronze hover:bg-white text-white hover:text-brand-black font-black rounded-3xl transition-all shadow-2xl shadow-brand-bronze/20 flex items-center justify-center gap-4 text-xl active:scale-95 disabled:opacity-50 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-brand-black/20 border-t-brand-black rounded-full animate-spin"></div>
              ) : (
                <>
                  دخول للنظام
                  <Gamepad2 size={24} className="group-hover:rotate-12 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] text-slate-600 font-black uppercase tracking-widest">
            Security Protocol 2.4.0 Active
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

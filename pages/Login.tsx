
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, ArrowLeft, Gamepad2, AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      if (name.length < 3) {
        setError('يرجى إدخال اسمك الكامل');
        setIsLoading(false);
        return;
      }
      result = await register(email, password, name);
    }

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-brand-black">
      <div className="max-w-md w-full space-y-12 bg-white dark:bg-brand-dark/80 p-10 rounded-[3.5rem] border border-slate-200 dark:border-white/10 shadow-2xl relative">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-brand-bronze flex items-center justify-center rounded-3xl mb-8 shadow-xl">
            <Gamepad2 className="text-white h-10 w-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            {isLogin ? 'تسجيل دخول' : 'حساب جديد'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
            <AlertCircle className="text-red-500 shrink-0" size={18} />
            <p className="text-red-500 text-[10px] font-black">{error}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="الاسم الكامل"
              className="w-full h-16 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-6 text-slate-900 dark:text-white outline-none focus:border-brand-bronze transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            className="w-full h-16 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-6 text-slate-900 dark:text-white outline-none focus:border-brand-bronze transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="كلمة المرور"
            className="w-full h-16 bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/5 rounded-2xl px-6 text-slate-900 dark:text-white outline-none focus:border-brand-bronze transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 bg-brand-bronze text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:scale-105 transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : isLogin ? 'دخول' : 'إنشاء الحساب'}
            {!isLoading && <ArrowLeft size={20} />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-white/5">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-slate-500 text-xs font-black hover:text-brand-bronze transition-all"
          >
            {isLogin ? 'لا تملك حساباً؟ انضم الآن' : 'لديك حساب بالفعل؟ سجل دخول'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

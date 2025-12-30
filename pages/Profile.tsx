
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile: React.FC = () => {
  const { user, changePassword, isAuthenticated } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  if (!isAuthenticated) {
    return <div className="text-center py-20 text-white">يجب تسجيل الدخول</div>;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمات المرور غير متطابقة' });
      return;
    }

    setIsChanging(true);
    const success = await changePassword(newPassword);
    setIsChanging(false);

    if (success) {
      setMessage({ type: 'success', text: 'تم تحديث كلمة المرور بنجاح' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="pt-12 pb-24 max-w-2xl mx-auto px-4">
      <div className="bg-brand-dark/40 border border-white/10 rounded-[32px] p-8 sm:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-bronze/10 rounded-full blur-[60px]"></div>
        
        <header className="text-center mb-12 relative z-10">
          <div className="w-24 h-24 bg-brand-bronze/20 border-2 border-brand-bronze rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-brand-bronze" />
          </div>
          <h1 className="text-3xl font-black text-white">{user?.name}</h1>
          <p className="text-slate-500">{user?.email}</p>
        </header>

        <section className="space-y-8 relative z-10">
          <div className="space-y-4">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck size={20} className="text-brand-bronze" />
              تغيير كلمة المرور
            </h2>
            
            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/50 text-green-500' : 'bg-red-500/10 border border-red-500/50 text-red-500'}`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-bronze transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  className="w-full bg-brand-black/50 border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-bronze transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  className="w-full bg-brand-black/50 border border-white/5 rounded-xl py-4 pr-12 pl-4 text-white focus:border-brand-bronze outline-none transition-all placeholder:text-slate-600 font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                disabled={isChanging}
                className="w-full py-4 bg-brand-bronze hover:bg-brand-bronze/90 text-white font-black rounded-xl transition-all shadow-xl shadow-brand-bronze/20 disabled:opacity-50 flex items-center justify-center"
              >
                {isChanging ? 'جاري التحديث...' : 'حفظ التغييرات'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;

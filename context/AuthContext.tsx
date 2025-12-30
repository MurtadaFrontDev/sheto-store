
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { Order } from '../types';

interface AuthContextType {
  user: any;
  orders: Order[];
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => void;
  addOrder: (order: Order) => Promise<void>;
  // Fix: Adding updateOrderStatus to interface
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  // Fix: Adding changePassword to interface
  changePassword: (password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // التحقق من الجلسة الحالية عند تشغيل الموقع
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserOrders(session.user.id);
      setIsLoading(false);
    });

    // الاستماع لتغييرات حالة تسجيل الدخول
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchUserOrders(session.user.id);
      else setOrders([]);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (!error && data) setOrders(data);
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  };

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    });
    return { error: error ? error.message : null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
  };

  // Fix: Implement changePassword
  const changePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return !error;
  };

  // Fix: Implement updateOrderStatus
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (!error && user) {
      fetchUserOrders(user.id);
    }
  };

  const addOrder = async (order: Order) => {
    if (!user) return;
    const { error } = await supabase.from('orders').insert([{
      user_id: user.id,
      customer_info: order.customerInfo,
      items: order.items,
      total_price: order.totalPrice,
      status: 'قيد التنفيذ'
    }]);
    if (!error) fetchUserOrders(user.id);
  };

  return (
    <AuthContext.Provider value={{ 
      user, orders, login, register, logout, addOrder, updateOrderStatus, changePassword,
      isAuthenticated: !!user, isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

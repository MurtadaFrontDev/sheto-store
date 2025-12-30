
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase';
import { Product, SiteSettings } from '../types';

interface StoreContextType {
  products: Product[];
  categories: string[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  decrementStock: (productId: string, quantity: number) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateCategories: (categories: string[]) => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
}

const DEFAULT_SETTINGS: SiteSettings = {
  logoType: 'text',
  logoText: 'شيتو.',
  heroTitle: 'حول غرفتك إلى منصة أبطال',
  heroSubtitle: 'في شيتو، نصمم بيئة اللعب التي تمنحك التركيز والراحة للسيطرة على كل "لوبي".',
  heroSlider: [
    'https://images.unsplash.com/photo-1614018424573-675283959b3d?q=80&w=1400',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400'
  ],
  footerDescription: 'متجرك الأول لتجهيز غرف الألعاب في العراق. نحن نؤمن بأن كل لاعب يستحق مساحة مريحة ومنظمة للإبداع والتميز.',
  socialLinks: { facebook: '#', instagram: '#', twitter: '#' }
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['الكل']);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const { data: productsData, error: pError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsData) {
        setProducts(productsData);
        // تم استخدام as string[] لحل مشكلة النوع غير المعروف (Unknown)
        const cats = ['الكل', ...Array.from(new Set(productsData.map((p: any) => String(p.category))))] as string[];
        setCategories(cats);
      }
      setSiteSettings(DEFAULT_SETTINGS);
    } catch (e) {
      console.error("Fetch Error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const { data, error } = await supabase.from('products').insert([productData]).select();
    if (!error && data) setProducts(prev => [data[0], ...prev]);
  };

  const updateProduct = async (product: Product) => {
    const { error } = await supabase.from('products').update(product).eq('id', product.id);
    if (!error) setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (productId: string) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (!error) setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const updateCategories = async (newCategories: string[]) => setCategories(newCategories);
  const updateSettings = async (settings: SiteSettings) => setSiteSettings(settings);

  const decrementStock = async (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const newStock = Math.max(0, product.stock - quantity);
    const { error } = await supabase.from('products').update({ stock: newStock }).eq('id', productId);
    if (!error) setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p));
  };

  return (
    <StoreContext.Provider value={{ 
      products, categories, siteSettings, isLoading, decrementStock,
      addProduct, updateProduct, deleteProduct, updateCategories, updateSettings 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};

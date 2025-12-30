
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  gallery?: string[]; // صور إضافية للمنتج
  category: string;
  rating: number;
  ratingCount: number;
  description: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  province: string;
  address: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: 'دفع عند الاستلام' | 'دفع إلكتروني';
  status: 'قيد التنفيذ' | 'تم التوصيل' | 'ملغي' | 'مرفوض';
  customerInfo: CustomerInfo;
  shippingCost: number;
}

export interface SiteSettings {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroSlider: string[];
  footerDescription: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

export type Category = 'الكل' | string;

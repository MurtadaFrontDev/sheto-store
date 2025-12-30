
import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'لوح تنظيم الجدار الفاخر V2',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fce66?q=80&w=800&auto=format&fit=crop',
    category: 'لوح تنظيم',
    rating: 5,
    ratingCount: 128,
    description: 'لوح تنظيم جداري عصري مصمم ليناسب غرف الألعاب والمكاتب الاحترافية بمواد عالية المتانة.',
    // Adding required stock property
    stock: 15
  },
  {
    id: '2',
    name: 'هوك تعليق السماعات المغناطيسي',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1544244015-0cd4b3ff569d?q=80&w=800&auto=format&fit=crop',
    category: 'إكسسوارات',
    rating: 4.2,
    ratingCount: 85,
    description: 'قطعة معدنية قوية لتعليق السماعات بذكاء وتوفير مساحة على الطاولة، مع حماية ضد الخدش.',
    // Adding required stock property
    stock: 25
  },
  {
    id: '3',
    name: 'صندوق تخزين الأقراص الذكي',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1589190282375-f1ae0b3bb88c?q=80&w=800&auto=format&fit=crop',
    category: 'لوح تنظيم',
    rating: 4.5,
    ratingCount: 42,
    description: 'صندوق أنيق لتنظيم الألعاب والأقراص المدمجة على الجدار بلمسة نهائية مطفية.',
    // Adding required stock property
    stock: 8
  },
  {
    id: '4',
    name: 'شريط إضاءة RGB النيون',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    category: 'إضاءة',
    rating: 4.9,
    ratingCount: 210,
    description: 'إضاءة خلفية غامرة تدعم المزامنة مع الموسيقى والألعاب مع تطبيق للتحكم الكامل.',
    // Adding required stock property
    stock: 12
  },
  {
    id: '5',
    name: 'منظم كابلات "ستانلس ستيل"',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop',
    category: 'تنظيم كابلات',
    rating: 4.1,
    ratingCount: 56,
    description: 'تخلص من فوضى الأسلاك تماماً مع هذا المنظم المعدني القوي الذي يتحمل أوزان المحولات الكبيرة.',
    // Adding required stock property (setting 0 to test sold out UI)
    stock: 0
  },
  {
    id: '6',
    name: 'حامل وحدة التحكم المزدوج',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=800&auto=format&fit=crop',
    category: 'إكسسوارات',
    rating: 4.8,
    ratingCount: 94,
    description: 'حامل أنيق ليد التحكم (PS5/Xbox) يعلق مباشرة على لوح التنظيم بتصميم انسيابي.',
    // Adding required stock property
    stock: 20
  }
];

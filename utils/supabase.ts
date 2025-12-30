
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// يرجى استبدال هذه القيم من لوحة تحكم Supabase الخاصة بك
const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';

// منع الانهيار في حال كانت الروابط غير صالحة
const createSafeClient = () => {
  try {
    if (supabaseUrl.includes('YOUR_PROJECT_URL')) {
      console.warn("Supabase is not configured yet. Using mock mode.");
      return {
        from: () => ({
          select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
          insert: () => Promise.resolve({ data: [], error: null }),
          update: () => ({ eq: () => Promise.resolve({ error: null }) }),
          delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
          upsert: () => Promise.resolve({ error: null }),
        }),
        auth: {
          getSession: () => Promise.resolve({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase Not Configured' } }),
          signUp: () => Promise.resolve({ error: { message: 'Supabase Not Configured' } }),
          signOut: () => Promise.resolve({}),
          updateUser: () => Promise.resolve({ error: { message: 'Supabase Not Configured' } }),
        }
      } as any;
    }
    return createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.error("Failed to initialize Supabase client", e);
    return {} as any;
  }
};

export const supabase = createSafeClient();

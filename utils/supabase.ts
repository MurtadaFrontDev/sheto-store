
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

const supabaseUrl = 'https://PLACEHOLDER.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy';

const createSafeClient = () => {
  const mockClient = {
    from: () => ({
      select: () => ({ 
        order: () => Promise.resolve({ data: [], error: null }), 
        eq: () => ({ 
          order: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null })
        }) 
      }),
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

  try {
    if (!supabaseUrl || supabaseUrl.includes('PLACEHOLDER')) {
      return mockClient;
    }
    return createClient(supabaseUrl, supabaseKey);
  } catch (e) {
    console.warn("Supabase initialization failed, using mock client.");
    return mockClient;
  }
};

export const supabase = createSafeClient();


import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// يرجى استبدال هذه القيم من لوحة تحكم Supabase الخاصة بك (Settings > API)
// إذا بقيت كما هي، سيعمل الموقع لكنه لن يعرض أي منتجات أو يسجل دخول
const supabaseUrl = 'https://YOUR_PROJECT_URL.supabase.co';
const supabaseKey = 'YOUR_ANON_PUBLIC_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

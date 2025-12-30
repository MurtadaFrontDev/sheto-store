import { createClient } from "@supabase/supabase-js";

// ملاحظة: يجب وضع القيم الحقيقية من إعدادات مشروعك في Supabase (Project Settings > API)
const supabaseUrl = "https://kvrkiydvccrjunyknwwv.supabase.co";
const supabaseKey = "sb_publishable_JB-fez2zUEGT5NQsZyHmUg_Hi1m8QYB";

export const supabase = createClient(supabaseUrl, supabaseKey);

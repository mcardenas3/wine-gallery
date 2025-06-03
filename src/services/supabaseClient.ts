import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// For debugging
console.log("Supabase URL:", supabaseUrl ? "configured" : "not configured");
console.log("Supabase Key:", supabaseAnonKey ? "configured" : "not configured");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
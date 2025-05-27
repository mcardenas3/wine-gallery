// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Para depuración
console.log("Supabase URL:", supabaseUrl ? "configurado" : "no configurado");
console.log("Supabase Key:", supabaseAnonKey ? "configurado" : "no configurado");

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


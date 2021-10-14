import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://localhost:8000";
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

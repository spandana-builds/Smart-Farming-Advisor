import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const EDGE_FUNCTION_URL = `${supabaseUrl}/functions/v1/farming-advisor`;

export function getSessionId(): string {
  let id = localStorage.getItem('farming_session_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('farming_session_id', id);
  }
  return id;
}

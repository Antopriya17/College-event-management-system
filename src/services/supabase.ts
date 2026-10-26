import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'campusconnect_supabase_url';
const STORAGE_KEY_ANON = 'campusconnect_supabase_anon';

export function getSupabaseCredentials() {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const envAnon = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localAnon = localStorage.getItem(STORAGE_KEY_ANON) || '';

  const url = localUrl || envUrl;
  const anonKey = localAnon || envAnon;

  const isConfigured = Boolean(url && anonKey && url.includes('supabase.co'));

  return { url, anonKey, isConfigured };
}

export function isConfigured(): boolean {
  return getSupabaseCredentials().isConfigured;
}

export async function testSupabaseConnection(url: string, key: string): Promise<{ success: boolean; message: string }> {
  try {
    const testClient = createClient(url, key);
    const { data, error } = await testClient.from('departments').select('count', { count: 'exact', head: true });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase PostgreSQL database!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection test failed.' };
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseCredentials();

  if (!isConfigured) {
    return null;
  }

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    } catch (err) {
      console.warn('Could not instantiate Supabase client:', err);
      return null;
    }
  }

  return supabaseInstance;
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  supabaseInstance = null; // reset to force re-instantiation
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
  supabaseInstance = null;
}


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: Missing Supabase credentials in .env file. The app will fail to fetch data.');
}

// Fallback to prevent crash on initialization, allowing ErrorBoundary to show a helpful message instead of white screen
// We use a dummy valid URL format to satisfy the library validator if needed, but usually empty string is handled but might throw.
// Using a placeholder ensures createClient doesn't throw immediately.
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseKey || 'placeholder-key';

export const supabase = createClient(validUrl, validKey);

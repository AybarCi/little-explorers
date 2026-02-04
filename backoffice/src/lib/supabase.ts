const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// API helper for backoffice edge function
export async function backofficeApi<T>(action: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${supabaseUrl}/functions/v1/backoffice-data`);
    url.searchParams.set('action', action);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
    }

    return response.json();
}

// Direct Supabase client for supervisors table only
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

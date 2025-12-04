import { createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { AuthSession, User } from '@/types/auth';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (Constants.expoConfig?.extra as any)?.supabaseUrl;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey;

interface RefreshResponse {
  session: AuthSession;
  user: User;
  error?: string;
}

export const refreshSession = createAsyncThunk(
  'auth/refreshSession',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      console.log('Attempting to refresh session...');
      
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = (await response.json()) as RefreshResponse;

      if (!response.ok) {
        console.error('Refresh failed:', data.error);
        return rejectWithValue(data.error || 'Session refresh failed');
      }

      // Store the new session
      await SecureStore.setItemAsync('auth_session', JSON.stringify(data.session));
      await SecureStore.setItemAsync('auth_user', JSON.stringify(data.user));

      console.log('Session refreshed successfully');
      return { session: data.session, user: data.user };
    } catch (error) {
      console.error('Refresh error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Refresh failed');
    }
  }
);
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { User, AuthSession } from '@/types/auth';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  initialized: false,
};

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const storedSession = await SecureStore.getItemAsync('auth_session');
      const storedUser = await SecureStore.getItemAsync('auth_user');

      if (storedSession && storedUser) {
        return {
          session: JSON.parse(storedSession) as AuthSession,
          user: JSON.parse(storedUser) as User,
        };
      }

      return { session: null, user: null };
    } catch (error) {
      return rejectWithValue('Failed to restore session');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (
    payload: {
      email: string;
      password: string;
      fullName: string;
      ageGroup?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          full_name: payload.fullName,
          age_group: payload.ageGroup || '8-10',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Signup failed');
      }

      const user: User = data.user;
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));

      return { user };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Signup failed');
    }
  }
);

export const signin = createAsyncThunk(
  'auth/signin',
  async (
    payload: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/auth-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Sign in failed');
      }

      const session: AuthSession = data.session;
      const user: User = data.user;

      await SecureStore.setItemAsync('auth_session', JSON.stringify(session));
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));

      return { session, user };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Sign in failed'
      );
    }
  }
);

export const signout = createAsyncThunk(
  'auth/signout',
  async (_, { rejectWithValue }) => {
    try {
      await SecureStore.deleteItemAsync('auth_session');
      await SecureStore.deleteItemAsync('auth_user');
      return null;
    } catch (error) {
      return rejectWithValue('Signout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(signout.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

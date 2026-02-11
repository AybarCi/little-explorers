import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { User, AuthSession } from '@/types/auth';

// Session management constants
const SESSION_MAX_AGE = 180 * 24 * 60 * 60 * 1000; // 180 days in milliseconds
const INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Custom session validation functions
const isSessionTooOld = (sessionCreatedAt: number): boolean => {
  const now = Date.now();
  return (now - sessionCreatedAt) > SESSION_MAX_AGE;
};

const isSessionInactive = (lastActivityAt: number): boolean => {
  const now = Date.now();
  return (now - lastActivityAt) > INACTIVITY_TIMEOUT;
};

const getSessionMetadata = async (): Promise<{ createdAt: number; lastActivityAt: number } | null> => {
  try {
    const metadata = await SecureStore.getItemAsync('auth_session_metadata');
    return metadata ? JSON.parse(metadata) : null;
  } catch {
    return null;
  }
};

const updateSessionActivity = async (): Promise<void> => {
  try {
    const metadata = await getSessionMetadata();
    const now = Date.now();
    const newMetadata = {
      createdAt: metadata?.createdAt || now,
      lastActivityAt: now
    };
    await SecureStore.setItemAsync('auth_session_metadata', JSON.stringify(newMetadata));
  } catch (error) {
    console.warn('Failed to update session activity:', error);
  }
};

const SUPABASE_URL =
  (Constants.expoConfig?.extra as any)?.supabaseUrl ||
  process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

interface AuthState {
  user: User | null;
  session: AuthSession | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
  requiresRelogin: boolean;
  verificationRequired: boolean;
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: false,
  error: null,
  initialized: false,
  requiresRelogin: false,
  verificationRequired: false,
};

interface SignupResponse {
  session: AuthSession | null;
  user: User;
  verificationRequired?: boolean;
  error?: string;
}

interface SigninResponse {
  session: AuthSession;
  user: User;
  error?: string;
}

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('Attempting to restore session...');
      const storedSession = await SecureStore.getItemAsync('auth_session');
      const storedUser = await SecureStore.getItemAsync('auth_user');

      console.log('Stored session found:', !!storedSession);
      console.log('Stored user found:', !!storedUser);

      if (storedSession && storedUser) {
        const session = JSON.parse(storedSession) as AuthSession;
        const user = JSON.parse(storedUser) as User;

        console.log('Session details:', {
          hasAccessToken: !!session.access_token,
          hasRefreshToken: !!session.refresh_token,
          refreshTokenPreview: session.refresh_token ? session.refresh_token.substring(0, 10) + '...' : 'none',
          expiresAt: session.expires_at,
          currentTime: Math.floor(Date.now() / 1000),
          isExpired: session.expires_at <= Math.floor(Date.now() / 1000)
        });

        // Check if session is expired
        if (session.expires_at <= Math.floor(Date.now() / 1000)) {
          console.log('Session is expired, attempting to refresh...');

          // Try to refresh session using refresh token
          if (session.refresh_token) {
            console.log('Attempting refresh with token:', session.refresh_token.substring(0, 10) + '...');
            try {
              const refreshResult = await dispatch(refreshSession(session.refresh_token)).unwrap();
              console.log('Session refreshed successfully');
              return { session: refreshResult.session, user: refreshResult.user };
            } catch (refreshError) {
              console.error('Session refresh failed:', refreshError);
              console.error('Refresh error details:', {
                message: refreshError instanceof Error ? refreshError.message : String(refreshError),
                type: typeof refreshError,
                stack: refreshError instanceof Error ? refreshError.stack : 'No stack',
                payload: refreshError instanceof Error ? refreshError : JSON.stringify(refreshError)
              });

              // Check if it's a network error or auth error
              if (refreshError instanceof Error) {
                if (refreshError.message.includes('fetch')) {
                  console.error('Network error during refresh');
                } else if (refreshError.message.includes('401')) {
                  console.error('Unauthorized - refresh token may be expired');
                }
              }

              console.log('Clearing stored data after failed refresh');

              // Provide more specific error information
              let errorMessage = 'Oturumunuz süresi dolmuş. Lütfen tekrar giriş yapın.';
              if (refreshError instanceof Error) {
                if (refreshError.message.includes('Invalid refresh token')) {
                  errorMessage = 'Oturum bilgileriniz geçersiz. Lütfen tekrar giriş yapın.';
                } else if (refreshError.message.includes('Network error')) {
                  errorMessage = 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.';
                }
              }

              // Store the error message for potential display to user
              await SecureStore.deleteItemAsync('auth_session');
              await SecureStore.deleteItemAsync('auth_user');
              await SecureStore.deleteItemAsync('auth_session_metadata');

              // Return error information that can be used to show user-friendly messages
              return { session: null, user: null, error: errorMessage, requiresRelogin: true };
            }
          } else {
            console.log('No refresh token available, clearing stored data');
            await SecureStore.deleteItemAsync('auth_session');
            await SecureStore.deleteItemAsync('auth_user');
            await SecureStore.deleteItemAsync('auth_session_metadata');
            return { session: null, user: null, error: 'Oturum bilgileriniz eksik. Lütfen tekrar giriş yapın.' };
          }
        }

        // Check custom session timeouts
        const metadata = await getSessionMetadata();
        if (metadata) {
          console.log('Session metadata:', metadata);

          // Check if session is too old (180 days)
          if (isSessionTooOld(metadata.createdAt)) {
            console.log('Session is too old (180 days), clearing stored data');
            await SecureStore.deleteItemAsync('auth_session');
            await SecureStore.deleteItemAsync('auth_user');
            await SecureStore.deleteItemAsync('auth_session_metadata');
            return { session: null, user: null, error: 'Oturumunuz çok uzun süre aktif olmadı. Lütfen tekrar giriş yapın.' };
          }

          // Check if session is inactive (7 days)
          if (isSessionInactive(metadata.lastActivityAt)) {
            console.log('Session is inactive (7 days), clearing stored data');
            await SecureStore.deleteItemAsync('auth_session');
            await SecureStore.deleteItemAsync('auth_user');
            await SecureStore.deleteItemAsync('auth_session_metadata');
            // Silently return null - user will be redirected to login
            return { session: null, user: null, error: undefined };
          }
        } else {
          // No metadata found, create it
          await updateSessionActivity();
        }

        // Always refresh to get latest user data from database (including diamonds, energy, etc.)
        console.log('Session valid, refreshing to get latest user data from DB...');
        if (session.refresh_token) {
          try {
            const refreshResult = await dispatch(refreshSession(session.refresh_token)).unwrap();
            console.log('User data refreshed from DB, diamonds:', refreshResult.user?.diamonds);
            return { session: refreshResult.session, user: refreshResult.user, error: undefined };
          } catch (refreshError) {
            // If refresh fails, fall back to cached user data
            console.warn('Failed to refresh user data, using cached:', refreshError);
            return { session, user, error: undefined };
          }
        }

        return { session, user, error: undefined };
      }

      // No session found - silently return null (user will be redirected to login)
      return { session: null, user: null, error: undefined };
    } catch (error) {
      console.error('Failed to restore session:', error);
      return rejectWithValue('Failed to restore session');
    }
  }
);

export const updateUserStats = createAsyncThunk(
  'auth/updateUserStats',
  async (
    payload: { points: number; completedGames?: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) {
        return rejectWithValue('No user logged in');
      }

      // Local state'i güncelle
      const updatedUser = {
        ...user,
        total_points: (user.total_points || 0) + payload.points,
        completed_games_count: (user.completed_games_count || 0) + (payload.completedGames || 0)
      };

      // SecureStore'u güncelle
      await SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update user stats');
    }
  }
);

// Async thunk to SET total points to a specific value (used for challenge rewards)
export const setUserTotalPoints = createAsyncThunk(
  'auth/setUserTotalPoints',
  async (
    newTotalPoints: number,
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) {
        return rejectWithValue('No user logged in');
      }

      // Update user with new total points
      const updatedUser = {
        ...user,
        total_points: newTotalPoints,
      };

      // Persist to SecureStore
      await SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to set user total points');
    }
  }
);

// Delete user account and all data
export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) {
        return rejectWithValue('No user logged in');
      }

      const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ user_id: user.id }),
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        return rejectWithValue(data.error || 'Failed to delete account');
      }

      // Clear all local storage
      await SecureStore.deleteItemAsync('auth_session');
      await SecureStore.deleteItemAsync('auth_user');
      await SecureStore.deleteItemAsync('auth_session_metadata');

      return { success: true };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete account');
    }
  }
);

// Async thunk to save diamonds and persist to SecureStore
export const saveUserDiamonds = createAsyncThunk(
  'auth/saveUserDiamonds',
  async (newDiamonds: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const { user } = state.auth;

      if (!user) {
        return rejectWithValue('No user logged in');
      }

      // Update user with new diamonds
      const updatedUser = {
        ...user,
        diamonds: newDiamonds,
      };

      // Persist to SecureStore
      await SecureStore.setItemAsync('auth_user', JSON.stringify(updatedUser));
      console.log('User diamonds persisted to SecureStore:', newDiamonds);

      return updatedUser;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save user diamonds');
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
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }
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

      const data = (await response.json()) as SignupResponse;

      if (!response.ok) {
        return rejectWithValue(data.error || 'Signup failed');
      }

      const user: User = data.user;
      const session: AuthSession | null = data.session;
      const verificationRequired = data.verificationRequired || false;

      // Session varsa kaydet
      if (session) {
        await SecureStore.setItemAsync('auth_session', JSON.stringify(session));
        await updateSessionActivity();
      }

      // User data her durumda (session olmasa bile profiling için) kaydedilebilir
      // Ancak email doğrulanmamışsa bazı kısıtlamalar olabilir
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));

      return { session, user, verificationRequired };
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
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }
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

      const data = (await response.json()) as SigninResponse;

      if (!response.ok) {
        return rejectWithValue(data.error || 'Sign in failed');
      }

      const session: AuthSession = data.session;
      const user: User = data.user;

      await SecureStore.setItemAsync('auth_session', JSON.stringify(session));
      await SecureStore.setItemAsync('auth_user', JSON.stringify(user));
      // Create session metadata for custom timeout tracking
      await updateSessionActivity();

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

export const ensureValidSession = createAsyncThunk(
  'auth/ensureValidSession',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      let currentSession = state.auth.session;
      if (!currentSession) {
        const restored = await dispatch(restoreSession()).unwrap();
        currentSession = restored.session;
      }
      if (!currentSession || !currentSession.access_token) {
        return rejectWithValue('No valid session');
      }
      const now = Math.floor(Date.now() / 1000);
      if (currentSession.expires_at && currentSession.expires_at <= now) {
        if (!currentSession.refresh_token) {
          return rejectWithValue('Missing refresh token');
        }
        const refreshed = await dispatch(refreshSession(currentSession.refresh_token)).unwrap();
        return refreshed.session;
      }
      await updateSessionActivity();
      return currentSession;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to ensure session');
    }
  }
);

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
          apikey: `${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
        }),
      });

      const data = await response.json() as any;
      console.log('RefreshSession response status:', response.status, 'ok:', response.ok);
      console.log('RefreshSession response body:', data);

      if (!response.ok) {
        console.error('Refresh failed:', data?.error || data?.message);
        return rejectWithValue(data?.error || data?.message || 'Session refresh failed');
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.verificationRequired = false;
    },
    updateUserPoints: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.total_points = action.payload;
      }
    },
    updateUserDiamonds: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.diamonds = action.payload;
      }
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
        // Set error if present in payload
        if (action.payload.error) {
          state.error = action.payload.error;
        }
        // Set requiresRelogin if present in payload
        if (action.payload.requiresRelogin) {
          state.requiresRelogin = true;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verificationRequired = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.verificationRequired) {
          // Email doğrulaması gerekiyor - user/session'ı state'e KAYDETME
          // Böylece routing guard anasayfaya yönlendirmez
          state.verificationRequired = true;
          state.user = null;
          state.session = null;
        } else {
          state.session = action.payload.session;
          state.user = action.payload.user;
          state.verificationRequired = false;
        }
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
        state.verificationRequired = false;
      })
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.session = action.payload.session;
        state.user = action.payload.user;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // If refresh fails, clear session
        state.session = null;
        state.user = null;
      })
      .addCase(updateUserStats.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(setUserTotalPoints.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.error = null;
      })
      .addCase(saveUserDiamonds.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError, updateUserPoints, updateUserDiamonds } = authSlice.actions;
export default authSlice.reducer;

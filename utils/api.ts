import { refreshSession } from '@/store/slices/authSlice';
import { AuthSession } from '@/types/auth';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {},
  thunkAPI: any
) => {
  const state = thunkAPI.getState();
  let session = state.auth.session as AuthSession | null;
  let accessToken = session?.access_token;

  // Helper to make the actual request
  const makeRequest = async (token: string | undefined) => {
    const headers = {
      ...options.headers,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  try {
    let response = await makeRequest(accessToken);

    // If 401, try to refresh token
    if (response.status === 401) {
      console.log('Received 401, attempting to refresh token...');
      
      const refreshToken = session?.refresh_token;
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Attempt refresh
      const refreshResult = await thunkAPI.dispatch(refreshSession(refreshToken));

      if (refreshSession.fulfilled.match(refreshResult)) {
        // Refresh successful, get new token
        const newSession = refreshResult.payload.session;
        accessToken = newSession.access_token;
        
        // Retry original request
        console.log('Token refreshed, retrying request...');
        response = await makeRequest(accessToken);
      } else {
        // Refresh failed
        console.error('Token refresh failed:', refreshResult.error);
        throw new Error('Session expired');
      }
    }

    return response;
  } catch (error) {
    throw error;
  }
};

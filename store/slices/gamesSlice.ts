import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClient } from '@supabase/supabase-js';
import { fetchWithAuth } from '@/utils/api';
import { Game, GameCategory, SaveProgressPayload } from '@/types/game';
import { RootState } from '../index';
import Constants from 'expo-constants';

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (Constants.expoConfig?.extra as any)?.supabaseUrl;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  (Constants.expoConfig?.extra as any)?.supabaseAnonKey;

interface GamesState {
  games: Game[];
  selectedGame: Game | null;
  loading: boolean;
  error: string | null;
  selectedCategory: GameCategory | 'all';
}

const initialState: GamesState = {
  games: [],
  selectedGame: null,
  loading: false,
  error: null,
  selectedCategory: 'all',
};

interface GamesListResponse {
  games: Game[];
  error?: string;
}

interface SaveProgressResponse {
  progress: {
    id: string;
    user_id: string;
    game_id: string;
    score: number;
    completed: boolean;
    time_spent: number;
    progress_data: Record<string, any>;
    created_at: string;
    updated_at: string;
  };
  error?: string;
}

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (
    payload: { category?: GameCategory | 'all'; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }
      let url = `${SUPABASE_URL}/functions/v1/games-list?`;

      if (payload.category && payload.category !== 'all') {
        url += `category=${payload.category}&`;
      }

      if (payload.userId) {
        url += `user_id=${payload.userId}`;
      }

      console.log('Fetching games with URL:', url);
      console.log('User ID:', payload.userId);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = (await response.json()) as GamesListResponse;
      console.log('Games API Response:', data);
      console.log('Games count:', data.games?.length);
      if (data.games && data.games.length > 0) {
        console.log('First game user_progress:', data.games[0].user_progress);
        console.log('Sample of user_progress values:', data.games.map(g => g.user_progress).slice(0, 3));
      }

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch games');
      }
      return data.games as Game[];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch games'
      );
    }
  }
);

export const fetchGameById = createAsyncThunk(
  'games/fetchGameById',
  async (
    payload: { gameId: string; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }
      let url = `${SUPABASE_URL}/functions/v1/games-list`;

      if (payload.userId) {
        url += `?user_id=${payload.userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = (await response.json()) as GamesListResponse;

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch game');
      }

      const game = data.games?.find((g: Game) => g.id === payload.gameId);

      if (!game) {
        return rejectWithValue('Game not found');
      }

      return game as Game;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch game'
      );
    }
  }
);

export const saveGameProgress = createAsyncThunk(
  'games/saveProgress',
  async (
    payload: SaveProgressPayload & { userId: string },
    thunkAPI
  ) => {
    const { rejectWithValue } = thunkAPI;
    try {
      if (!SUPABASE_URL) {
        return rejectWithValue('Missing Supabase configuration');
      }
      const { userId, ...progressData } = payload;
      console.log('Supabase URL exists:', !!SUPABASE_URL);
      console.log('Supabase ANON KEY exists:', !!SUPABASE_ANON_KEY);

      console.log('SaveGameProgress request:', {
        user_id: userId,
        game_id: (progressData as any).game_id,
        score: (progressData as any).score,
        completed: (progressData as any).completed,
        time_spent: (progressData as any).time_spent,
      });

      const response = await fetchWithAuth(
        `${SUPABASE_URL}/functions/v1/games-progress`,
        {
          method: 'POST',
          headers: {
            apikey: `${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            user_id: userId,
            ...progressData
          }),
        },
        thunkAPI
      );

      const data = (await response.json()) as SaveProgressResponse;

      console.log('SaveGameProgress response status:', response.status, 'ok:', response.ok);
      console.log('SaveGameProgress response:', data);

      if (!response.ok) {
        console.error('Failed to save progress:', data.error || response.statusText);
        return rejectWithValue(data.error || 'Failed to save progress');
      }

      return data.progress;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to save progress'
      );
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  'games/fetchUserProgress',
  async (
    payload: { userId: string },
    { getState, rejectWithValue }
  ) => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return rejectWithValue('Missing Supabase configuration');
      }
      const state = getState() as any;
      const session = state.auth?.session;
      if (!session?.access_token || !session?.refresh_token) {
        return rejectWithValue('Missing session');
      }
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
      } as any);
      const { data, error } = await supabase
        .from('game_progress')
        .select('game_id, score, completed, time_spent')
        .eq('user_id', payload.userId);
      if (error) {
        return rejectWithValue(error.message);
      }
      return data as Array<{ game_id: string; score: number; completed: boolean; time_spent: number }>;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user progress');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearSelectedGame: (state) => {
      state.selectedGame = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        const merged = action.payload.map((g) => {
          const prev = state.games.find((pg) => pg.id === g.id);
          return {
            ...g,
            user_progress: g.user_progress ?? prev?.user_progress ?? null,
          } as any;
        });
        state.games = merged as any;
        console.log('Games state updated, count:', action.payload?.length);
        if (action.payload && action.payload.length > 0) {
          console.log('First game in state:', action.payload[0].title, 'user_progress:', action.payload[0].user_progress);
          const completedGames = action.payload.filter(g => g.user_progress?.completed).length;
          console.log('Completed games count from payload:', completedGames);
        }
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchGameById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveGameProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveGameProgress.fulfilled, (state, action) => {
        state.loading = false;
        // Store'daki ilgili oyunun user_progress verisini güncelle
        const updatedProgress = action.payload;
        const gameIndex = state.games.findIndex(game => game.id === updatedProgress.game_id);
        if (gameIndex !== -1) {
          state.games[gameIndex] = {
            ...state.games[gameIndex],
            user_progress: {
              score: updatedProgress.score,
              completed: updatedProgress.completed,
              time_spent: updatedProgress.time_spent
            }
          };
        }
      })
      .addCase(saveGameProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        const progressList = action.payload as Array<{ game_id: string; score: number; completed: boolean; time_spent: number }>;
        if (progressList && progressList.length) {
          const map = new Map(progressList.map(p => [p.game_id, p]));
          state.games = state.games.map(g => ({
            ...g,
            user_progress: map.has(g.id)
              ? {
                score: map.get(g.id)!.score,
                completed: map.get(g.id)!.completed,
                time_spent: map.get(g.id)!.time_spent,
              }
              : g.user_progress ?? null,
          })) as any;
        }
      });
  },
});

export const { setSelectedCategory, clearSelectedGame, clearError } =
  gamesSlice.actions;
export default gamesSlice.reducer;

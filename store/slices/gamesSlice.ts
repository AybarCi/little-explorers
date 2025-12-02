import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Game, GameCategory, SaveProgressPayload } from '@/types/game';
import { RootState } from '../index';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

export const fetchGames = createAsyncThunk(
  'games/fetchGames',
  async (
    payload: { category?: GameCategory | 'all'; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      let url = `${SUPABASE_URL}/functions/v1/games-list?`;

      if (payload.category && payload.category !== 'all') {
        url += `category=${payload.category}&`;
      }

      if (payload.userId) {
        url += `user_id=${payload.userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();

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
      let url = `${SUPABASE_URL}/functions/v1/games-list`;

      if (payload.userId) {
        url += `?user_id=${payload.userId}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      const data = await response.json();

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
    payload: SaveProgressPayload & { accessToken: string },
    { rejectWithValue }
  ) => {
    try {
      const { accessToken, ...progressData } = payload;

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/games-progress`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(progressData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
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
        state.games = action.payload;
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
      .addCase(saveGameProgress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveGameProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedCategory, clearSelectedGame, clearError } =
  gamesSlice.actions;
export default gamesSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import gamesReducer from './slices/gamesSlice';
import currencyReducer from './slices/currencySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    currency: currencyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const STORAGE_KEY = '@little_explorers_currency';

const SUPABASE_URL =
    (Constants.expoConfig?.extra as any)?.supabaseUrl ||
    process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
    (Constants.expoConfig?.extra as any)?.supabaseAnonKey ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const MAX_ENERGY = 5;
const ENERGY_REGEN_TIME_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
const ENERGY_REFILL_COST = 50; // diamonds
const AD_REWARD_DIAMONDS = 5;

interface CurrencyState {
    energy: number;
    diamonds: number;
    lastEnergyUpdate: number; // timestamp
    isInitialized: boolean;
}

const initialState: CurrencyState = {
    energy: MAX_ENERGY,
    diamonds: 0,
    lastEnergyUpdate: Date.now(),
    isInitialized: false,
};

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        // Initialize from AsyncStorage
        initializeCurrency: (state, action: PayloadAction<{
            energy: number;
            diamonds: number;
            lastEnergyUpdate: number;
        }>) => {
            const { energy, diamonds, lastEnergyUpdate } = action.payload;

            // Calculate regenerated energy since last update
            const now = Date.now();
            const timePassed = now - lastEnergyUpdate;
            const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_TIME_MS);

            state.energy = Math.min(energy + energyToAdd, MAX_ENERGY);
            state.diamonds = diamonds;
            state.lastEnergyUpdate = energyToAdd > 0 ? now : lastEnergyUpdate;
            state.isInitialized = true;
        },

        // Consume 1 energy for playing a game
        consumeEnergy: (state) => {
            if (state.energy > 0) {
                state.energy -= 1;
                // If was full, start regen timer now
                if (state.energy === MAX_ENERGY - 1) {
                    state.lastEnergyUpdate = Date.now();
                }
            }
        },

        // Regenerate energy (called by timer)
        regenerateEnergy: (state) => {
            if (state.energy < MAX_ENERGY) {
                const now = Date.now();
                const timePassed = now - state.lastEnergyUpdate;
                const energyToAdd = Math.floor(timePassed / ENERGY_REGEN_TIME_MS);

                if (energyToAdd > 0) {
                    state.energy = Math.min(state.energy + energyToAdd, MAX_ENERGY);
                    state.lastEnergyUpdate = now;
                }
            }
        },

        // Add diamonds (from watching ads)
        addDiamonds: (state, action: PayloadAction<number>) => {
            state.diamonds += action.payload;
        },

        // Refill energy using diamonds
        refillEnergyWithDiamonds: (state) => {
            if (state.diamonds >= ENERGY_REFILL_COST && state.energy < MAX_ENERGY) {
                state.diamonds -= ENERGY_REFILL_COST;
                state.energy = MAX_ENERGY;
                state.lastEnergyUpdate = Date.now();
            }
        },

        // Set initialization flag
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.isInitialized = action.payload;
        },

        // Reset currency state (for logout)
        resetCurrency: (state) => {
            state.energy = MAX_ENERGY;
            state.diamonds = 0;
            state.lastEnergyUpdate = Date.now();
            state.isInitialized = false;
        },
    },
});

// Async thunk-like function to save to AsyncStorage
export const saveCurrencyToStorage = async (state: {
    energy: number;
    diamonds: number;
    lastEnergyUpdate: number;
}) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving currency to storage:', error);
    }
};

// Clear currency from AsyncStorage (for logout)
export const clearCurrencyFromStorage = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        console.log('Currency cleared from AsyncStorage');
    } catch (error) {
        console.error('Error clearing currency from storage:', error);
    }
};

// Async thunk to save diamonds to Supabase database
export const saveDiamondsToDatabase = createAsyncThunk(
    'currency/saveDiamondsToDatabase',
    async (
        payload: { userId: string; diamonds: number },
        { getState, rejectWithValue }
    ) => {
        try {
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                return rejectWithValue('Missing Supabase configuration');
            }

            const state = getState() as any;
            const session = state.auth?.session;

            if (!session?.access_token || !session?.refresh_token) {
                console.warn('No session available, diamonds will sync on next login');
                return rejectWithValue('No session available');
            }

            const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            } as any);

            const { error } = await supabase
                .from('users')
                .update({
                    diamonds: payload.diamonds,
                    updated_at: new Date().toISOString()
                })
                .eq('id', payload.userId);

            if (error) {
                console.error('Failed to save diamonds to database:', error);
                return rejectWithValue(error.message);
            }

            console.log('Diamonds synced to database:', payload.diamonds);
            return payload.diamonds;
        } catch (error) {
            console.error('Error saving diamonds to database:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to save diamonds');
        }
    }
);

// Async thunk to save energy to Supabase database
export const saveEnergyToDatabase = createAsyncThunk(
    'currency/saveEnergyToDatabase',
    async (
        payload: { userId: string; energy: number; lastEnergyUpdate: number },
        { getState, rejectWithValue }
    ) => {
        try {
            if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
                return rejectWithValue('Missing Supabase configuration');
            }

            const state = getState() as any;
            const session = state.auth?.session;

            if (!session?.access_token || !session?.refresh_token) {
                console.warn('No session available, energy will sync on next login');
                return rejectWithValue('No session available');
            }

            const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            await supabase.auth.setSession({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
            } as any);

            const { error } = await supabase
                .from('users')
                .update({
                    energy: payload.energy,
                    last_energy_update: payload.lastEnergyUpdate,
                    updated_at: new Date().toISOString()
                })
                .eq('id', payload.userId);

            if (error) {
                console.error('Failed to save energy to database:', error);
                return rejectWithValue(error.message);
            }

            console.log('Energy synced to database:', payload.energy);
            return payload.energy;
        } catch (error) {
            console.error('Error saving energy to database:', error);
            return rejectWithValue(error instanceof Error ? error.message : 'Failed to save energy');
        }
    }
);

// Async thunk-like function to load from AsyncStorage
export const loadCurrencyFromStorage = async (): Promise<{
    energy: number;
    diamonds: number;
    lastEnergyUpdate: number;
} | null> => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error loading currency from storage:', error);
        return null;
    }
};

export const {
    initializeCurrency,
    consumeEnergy,
    regenerateEnergy,
    addDiamonds,
    refillEnergyWithDiamonds,
    setInitialized,
    resetCurrency,
} = currencySlice.actions;

export const CURRENCY_CONSTANTS = {
    MAX_ENERGY,
    ENERGY_REGEN_TIME_MS,
    ENERGY_REFILL_COST,
    AD_REWARD_DIAMONDS,
};

export default currencySlice.reducer;

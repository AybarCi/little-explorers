import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@little_explorers_currency';
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
} = currencySlice.actions;

export const CURRENCY_CONSTANTS = {
    MAX_ENERGY,
    ENERGY_REGEN_TIME_MS,
    ENERGY_REFILL_COST,
    AD_REWARD_DIAMONDS,
};

export default currencySlice.reducer;

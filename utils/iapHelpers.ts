import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Check if running in Expo Go (where native modules aren't available)
const isExpoGo = Constants.appOwnership === 'expo';

// Conditionally import react-native-iap only in non-Expo Go environments
let RNIap: any = null;
if (!isExpoGo) {
    try {
        RNIap = require('react-native-iap');
    } catch (e) {
        console.warn('react-native-iap not available:', e);
    }
}

// Product IDs - these must match App Store Connect / Google Play Console
export const DIAMOND_PRODUCTS = {
    DIAMONDS_100: '100_diamonds',
    DIAMONDS_500: '500_diamonds',
    DIAMONDS_1000: '1000_diamonds',
};

export const ALL_PRODUCT_IDS = [
    DIAMOND_PRODUCTS.DIAMONDS_100,
    DIAMOND_PRODUCTS.DIAMONDS_500,
    DIAMOND_PRODUCTS.DIAMONDS_1000,
];

// Map product IDs to diamond amounts
export const PRODUCT_DIAMOND_MAP: Record<string, number> = {
    [DIAMOND_PRODUCTS.DIAMONDS_100]: 100,
    [DIAMOND_PRODUCTS.DIAMONDS_500]: 500,
    [DIAMOND_PRODUCTS.DIAMONDS_1000]: 1000,
};

let isConnected = false;
let purchaseUpdateSubscription: { remove: () => void } | null = null;
let purchaseErrorSubscription: { remove: () => void } | null = null;

export interface IAPProduct {
    productId: string;
    title: string;
    localizedPrice: string;
    price: string;
    currency: string;
}

export interface IAPPurchase {
    productId: string;
    transactionId?: string;
    transactionReceipt?: string;
}

/**
 * Check if IAP is supported (not in Expo Go)
 */
export const isIAPSupported = (): boolean => {
    return !isExpoGo && RNIap !== null;
};

/**
 * Connect to the in-app purchase service
 */
export const connectToStore = async (): Promise<boolean> => {
    if (!isIAPSupported()) {
        console.log('IAP not supported in Expo Go, using mock mode');
        return false;
    }

    if (isConnected) return true;

    try {
        const result = await RNIap.initConnection();
        isConnected = true;
        console.log('Connected to IAP store:', result);
        return true;
    } catch (error) {
        console.error('Failed to connect to IAP store:', error);
        return false;
    }
};

/**
 * Disconnect from the in-app purchase service
 */
export const disconnectFromStore = async (): Promise<void> => {
    if (!isIAPSupported() || !isConnected) return;

    try {
        // Remove listeners
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }

        await RNIap.endConnection();
        isConnected = false;
        console.log('Disconnected from IAP store');
    } catch (error) {
        console.error('Failed to disconnect from IAP store:', error);
    }
};

/**
 * Fetch available products from the store
 */
export const fetchProducts = async (): Promise<IAPProduct[]> => {
    if (!isIAPSupported()) {
        console.log('IAP not supported, returning empty products');
        return [];
    }

    try {
        if (!isConnected) {
            await connectToStore();
        }

        const products = await RNIap.getProducts({ skus: ALL_PRODUCT_IDS });
        console.log('Fetched products:', products);

        // Map to our interface
        return (products || []).map((product: any) => ({
            productId: product.productId,
            title: product.title || product.name || '',
            localizedPrice: product.localizedPrice || '',
            price: product.price || '',
            currency: product.currency || '',
        }));
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
};

/**
 * Purchase a product
 */
export const purchaseProduct = async (productId: string): Promise<boolean> => {
    if (!isIAPSupported()) {
        console.log('IAP not supported in Expo Go');
        return false;
    }

    try {
        if (!isConnected) {
            const connected = await connectToStore();
            if (!connected) {
                console.error('Failed to connect to store');
                return false;
            }
        }

        console.log('Attempting to purchase product:', productId);
        console.log('Platform:', Platform.OS);

        if (Platform.OS === 'ios') {
            await RNIap.requestPurchase({ sku: productId });
        } else {
            await RNIap.requestPurchase({ skus: [productId] });
        }

        // The actual result will be handled by the purchase listener
        return true;
    } catch (error: any) {
        console.error('Failed to purchase product:', error);
        console.error('Error code:', error?.code);
        console.error('Error message:', error?.message);
        return false;
    }
};

/**
 * Finish a purchase transaction (consume the consumable)
 */
export const finishTransaction = async (purchase: IAPPurchase): Promise<void> => {
    if (!isIAPSupported()) return;

    try {
        await RNIap.finishTransaction({ purchase: purchase as any, isConsumable: true });
        console.log('Transaction finished:', purchase.productId);
    } catch (error) {
        console.error('Failed to finish transaction:', error);
    }
};

/**
 * Set up purchase listeners
 */
export const setPurchaseListener = (
    onSuccess: (purchase: IAPPurchase) => void,
    onError: (error: any) => void
): void => {
    if (!isIAPSupported()) return;

    // Remove existing listeners
    if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
    }
    if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
    }

    // Set up new listeners
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener((purchase: any) => {
        console.log('Purchase updated:', purchase);
        const mapped: IAPPurchase = {
            productId: purchase.productId,
            transactionId: purchase.transactionId,
            transactionReceipt: purchase.transactionReceipt,
        };
        onSuccess(mapped);
    });

    purchaseErrorSubscription = RNIap.purchaseErrorListener((error: any) => {
        console.log('Purchase error:', error);
        if (error.code !== 'E_USER_CANCELLED') {
            onError(error);
        }
    });
};

/**
 * Get the diamond amount for a product
 */
export const getDiamondAmount = (productId: string): number => {
    return PRODUCT_DIAMOND_MAP[productId] || 0;
};

/**
 * Check if IAP is available and connected
 */
export const isIAPAvailable = (): boolean => {
    return isIAPSupported() && isConnected;
};

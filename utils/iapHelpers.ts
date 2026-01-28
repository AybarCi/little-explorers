import * as InAppPurchases from 'expo-in-app-purchases';
import { Platform } from 'react-native';

// Product IDs defined in App Store Connect
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

/**
 * Connect to the in-app purchase service
 */
export const connectToStore = async (): Promise<boolean> => {
    if (isConnected) return true;

    try {
        await InAppPurchases.connectAsync();
        isConnected = true;
        console.log('Connected to IAP store');
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
    if (!isConnected) return;

    try {
        await InAppPurchases.disconnectAsync();
        isConnected = false;
        console.log('Disconnected from IAP store');
    } catch (error) {
        console.error('Failed to disconnect from IAP store:', error);
    }
};

/**
 * Fetch available products from the store
 */
export const fetchProducts = async (): Promise<InAppPurchases.IAPItemDetails[]> => {
    try {
        if (!isConnected) {
            await connectToStore();
        }

        const { results } = await InAppPurchases.getProductsAsync(ALL_PRODUCT_IDS);
        console.log('Fetched products:', results);
        return results || [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
};

/**
 * Purchase a product
 */
export const purchaseProduct = async (productId: string): Promise<boolean> => {
    try {
        if (!isConnected) {
            await connectToStore();
        }

        await InAppPurchases.purchaseItemAsync(productId);
        // The actual result will be handled by the purchase listener
        return true;
    } catch (error) {
        console.error('Failed to purchase product:', error);
        return false;
    }
};

/**
 * Finish a purchase transaction (consume the consumable)
 */
export const finishTransaction = async (purchase: InAppPurchases.InAppPurchase): Promise<void> => {
    try {
        await InAppPurchases.finishTransactionAsync(purchase, true);
        console.log('Transaction finished:', purchase.productId);
    } catch (error) {
        console.error('Failed to finish transaction:', error);
    }
};

/**
 * Set up a purchase listener
 */
export const setPurchaseListener = (
    onSuccess: (purchase: InAppPurchases.InAppPurchase) => void,
    onError: (error: InAppPurchases.IAPResponseCode) => void
): void => {
    InAppPurchases.setPurchaseListener(({ responseCode, results }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results?.forEach((purchase) => {
                if (!purchase.acknowledged) {
                    onSuccess(purchase);
                }
            });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log('User canceled the purchase');
        } else {
            onError(responseCode);
        }
    });
};

/**
 * Get the diamond amount for a product
 */
export const getDiamondAmount = (productId: string): number => {
    return PRODUCT_DIAMOND_MAP[productId] || 0;
};

import { Platform } from 'react-native';

// AdMob IDs - Replace with actual IDs before production
const AD_UNIT_IDS = {
    rewarded: {
        ios: '', // Add iOS rewarded ad unit ID
        android: '', // Add Android rewarded ad unit ID
    },
};

// Flag to check if ads are supported (requires development build)
let adsSupported = false;
let RewardedAd: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;

// Try to import AdMob - will fail in Expo Go
try {
    const admob = require('react-native-google-mobile-ads');
    RewardedAd = admob.RewardedAd;
    RewardedAdEventType = admob.RewardedAdEventType;
    TestIds = admob.TestIds;
    adsSupported = true;
    console.log('AdMob: Module loaded successfully');
} catch (error) {
    console.warn('AdMob: Native module not available. Ads will be simulated in Expo Go.');
    adsSupported = false;
}

// Get the appropriate ad unit ID based on platform
const getRewardedAdUnitId = (): string => {
    if (!adsSupported) return 'test-ad';

    const id = Platform.select({
        ios: AD_UNIT_IDS.rewarded.ios,
        android: AD_UNIT_IDS.rewarded.android,
    });

    // Fall back to test ID if no production ID is set
    if (!id || id === '') {
        console.warn('AdMob: Using test ad unit ID. Set production IDs before release.');
        return TestIds?.REWARDED || 'test-ad';
    }

    return id;
};

let rewardedAd: any = null;
let isAdLoading = false;
let isAdLoaded = false;

// Check if ads are available
export const isAdsSupported = (): boolean => adsSupported;

// Load a rewarded ad
export const loadRewardedAd = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!adsSupported) {
            // Simulate ad loading in Expo Go
            console.log('AdMob: Simulating ad load (Expo Go mode)');
            setTimeout(() => {
                isAdLoaded = true;
                resolve();
            }, 500);
            return;
        }

        if (isAdLoading || isAdLoaded) {
            resolve();
            return;
        }

        isAdLoading = true;
        const adUnitId = getRewardedAdUnitId();

        rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
            requestNonPersonalizedAdsOnly: true,
        });

        const unsubscribeLoaded = rewardedAd.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                isAdLoading = false;
                isAdLoaded = true;
                unsubscribeLoaded();
                resolve();
            }
        );

        rewardedAd.load();

        // Timeout after 10 seconds
        setTimeout(() => {
            if (isAdLoading) {
                isAdLoading = false;
                reject(new Error('Ad loading timeout'));
            }
        }, 10000);
    });
};

// Show the loaded rewarded ad
export const showRewardedAd = (
    onRewarded: () => void,
    onClosed: () => void,
    onError: (error: Error) => void
): void => {
    if (!adsSupported) {
        // Simulate ad watching in Expo Go
        console.log('AdMob: Simulating ad view (Expo Go mode)');
        setTimeout(() => {
            onRewarded();
            onClosed();
            isAdLoaded = false;
        }, 1500); // Simulate 1.5 second ad
        return;
    }

    if (!rewardedAd || !isAdLoaded) {
        onError(new Error('Ad not loaded'));
        return;
    }

    const unsubscribeEarned = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
            onRewarded();
            unsubscribeEarned();
        }
    );

    rewardedAd
        .show()
        .then(() => {
            isAdLoaded = false;
            rewardedAd = null;
            onClosed();
            // Pre-load next ad
            loadRewardedAd().catch(() => { });
        })
        .catch((error: Error) => {
            isAdLoaded = false;
            rewardedAd = null;
            onError(error);
        });
};

// Check if ad is ready
export const isRewardedAdReady = (): boolean => {
    return isAdLoaded;
};

// Pre-load ad on app start
export const initializeAds = async (): Promise<void> => {
    try {
        await loadRewardedAd();
        console.log('AdMob: Rewarded ad pre-loaded');
    } catch (error) {
        console.warn('AdMob: Failed to pre-load rewarded ad:', error);
    }
};

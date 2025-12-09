import { Platform } from 'react-native';

// AdMob Configuration
const AD_UNIT_IDS = {
    rewarded: {
        ios: 'ca-app-pub-1743455537598911/7436080385',
        android: 'ca-app-pub-1743455537598911/6387379138',
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
    console.warn('AdMob: Native module not available. Ads will be simulated.');
    adsSupported = false;
}

// Get the appropriate ad unit ID based on platform
const getRewardedAdUnitId = (): string => {
    if (!adsSupported) return 'test-ad';

    const id = Platform.select({
        ios: AD_UNIT_IDS.rewarded.ios,
        android: AD_UNIT_IDS.rewarded.android,
    });

    if (!id || id === '') {
        console.warn('AdMob: Using test ad unit ID.');
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
            // Simulate ad loading
            console.log('AdMob: Simulating ad load');
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
        console.log('AdMob: Loading ad with unit ID:', adUnitId);

        try {
            rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
                requestNonPersonalizedAdsOnly: true,
            });

            const unsubscribeLoaded = rewardedAd.addAdEventListener(
                RewardedAdEventType.LOADED,
                () => {
                    isAdLoading = false;
                    isAdLoaded = true;
                    unsubscribeLoaded();
                    console.log('AdMob: Ad loaded successfully');
                    resolve();
                }
            );

            rewardedAd.load();

            // Timeout after 10 seconds
            setTimeout(() => {
                if (isAdLoading) {
                    isAdLoading = false;
                    console.warn('AdMob: Ad loading timeout');
                    reject(new Error('Ad loading timeout'));
                }
            }, 10000);
        } catch (error) {
            isAdLoading = false;
            console.error('AdMob: Error loading ad:', error);
            reject(error);
        }
    });
};

// Show the loaded rewarded ad
export const showRewardedAd = (
    onRewarded: () => void,
    onClosed: () => void,
    onError: (error: Error) => void
): void => {
    if (!adsSupported) {
        // Simulate ad watching
        console.log('AdMob: Simulating ad view');
        setTimeout(() => {
            onRewarded();
            onClosed();
            isAdLoaded = false;
        }, 1500);
        return;
    }

    if (!rewardedAd || !isAdLoaded) {
        onError(new Error('Ad not loaded'));
        return;
    }

    const unsubscribeEarned = rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        () => {
            console.log('AdMob: Reward earned');
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
            console.error('AdMob: Error showing ad:', error);
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

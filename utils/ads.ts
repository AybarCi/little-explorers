// AdMob is disabled - using simulation mode for now
// To enable AdMob:
// 1. Add real App IDs to app.json
// 2. Uncomment the AdMob require below
// 3. Rebuild the app

// Flag to check if ads are supported
const adsSupported = false; // Set to true when AdMob is properly configured

let isAdLoaded = false;

// Check if ads are available
export const isAdsSupported = (): boolean => adsSupported;

// Load a rewarded ad (simulated)
export const loadRewardedAd = (): Promise<void> => {
    return new Promise((resolve) => {
        console.log('AdMob: Simulating ad load (AdMob disabled)');
        setTimeout(() => {
            isAdLoaded = true;
            resolve();
        }, 500);
    });
};

// Show the loaded rewarded ad (simulated)
export const showRewardedAd = (
    onRewarded: () => void,
    onClosed: () => void,
    _onError: (error: Error) => void
): void => {
    console.log('AdMob: Simulating ad view (AdMob disabled)');
    setTimeout(() => {
        onRewarded();
        onClosed();
        isAdLoaded = false;
    }, 1500); // Simulate 1.5 second ad
};

// Check if ad is ready
export const isRewardedAdReady = (): boolean => {
    return isAdLoaded;
};

// Pre-load ad on app start
export const initializeAds = async (): Promise<void> => {
    try {
        await loadRewardedAd();
        console.log('AdMob: Ad pre-loaded (simulation mode)');
    } catch (error) {
        console.warn('AdMob: Failed to pre-load ad:', error);
    }
};

/**
 * Meta Pixel (Facebook Pixel) tracking utilities
 */

type StorePlatform = 'AppStore' | 'PlayStore';

/**
 * Tracks outbound clicks to store download buttons
 * @param platform - 'AppStore' or 'PlayStore'
 */
export function trackOutboundClick(platform: StorePlatform): void {
    const eventName = `Click_${platform}`;

    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('trackCustom', eventName, {
            platform,
            timestamp: new Date().toISOString(),
        });
        console.log(`[Meta Pixel] Tracked: ${eventName}`);
    } else {
        console.warn(`[Meta Pixel] fbq not available, event not tracked: ${eventName}`);
    }
}

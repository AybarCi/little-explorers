import { useWindowDimensions, Platform, PixelRatio } from 'react-native';

// Device breakpoints
export const BREAKPOINTS = {
    PHONE_SMALL: 375,
    PHONE: 430,
    TABLET_MINI: 768,
    TABLET: 834,
    TABLET_PRO: 1024,
};

// Screen size categories
export type ScreenSize = 'phoneSmall' | 'phone' | 'phoneLarge' | 'tabletMini' | 'tablet' | 'tabletPro';

// Get screen size category based on width
export const getScreenSize = (width: number): ScreenSize => {
    if (width < BREAKPOINTS.PHONE_SMALL) return 'phoneSmall';
    if (width < BREAKPOINTS.PHONE) return 'phone';
    if (width < BREAKPOINTS.TABLET_MINI) return 'phoneLarge';
    if (width < BREAKPOINTS.TABLET) return 'tabletMini';
    if (width < BREAKPOINTS.TABLET_PRO) return 'tablet';
    return 'tabletPro';
};

// Check if device is a tablet
export const isTabletSize = (width: number): boolean => {
    return width >= BREAKPOINTS.TABLET_MINI;
};

// Hook for responsive values
export const useResponsive = () => {
    const { width, height } = useWindowDimensions();
    const screenSize = getScreenSize(width);
    const isTablet = isTabletSize(width);
    const isLandscape = width > height;

    // Scale factor based on screen width (base: iPhone 14 = 390px)
    const scale = (size: number): number => {
        const baseWidth = 390;
        const scaleFactor = width / baseWidth;
        const newSize = size * Math.min(scaleFactor, 1.5); // Cap at 1.5x to prevent too large
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    };

    // Moderate scale for fonts (less aggressive scaling)
    const fontScale = (size: number): number => {
        const baseWidth = 390;
        const scaleFactor = width / baseWidth;
        const newSize = size * Math.min(scaleFactor, 1.3); // Cap at 1.3x for fonts
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    };

    // Get responsive padding based on screen size
    const getPadding = (): number => {
        if (width < BREAKPOINTS.PHONE_SMALL) return 16;
        if (width < BREAKPOINTS.TABLET_MINI) return 24;
        if (width < BREAKPOINTS.TABLET) return 32;
        if (width < BREAKPOINTS.TABLET_PRO) return 40;
        return 48;
    };

    // Get number of grid columns based on screen size
    const getGridColumns = (phoneColumns: number = 2): number => {
        if (width < BREAKPOINTS.TABLET_MINI) return phoneColumns;
        if (width < BREAKPOINTS.TABLET) return phoneColumns + 1;
        if (width < BREAKPOINTS.TABLET_PRO) return phoneColumns + 2;
        return phoneColumns + 2;
    };

    // Get modal max width (prevents modals from being too wide on tablets)
    const getModalMaxWidth = (): number => {
        if (width < BREAKPOINTS.TABLET_MINI) return width - 48;
        return 500; // Fixed max width on tablets
    };

    // Get card width based on columns
    const getCardWidth = (columns: number, gap: number = 12): number => {
        const padding = getPadding() * 2;
        const totalGaps = gap * (columns - 1);
        return (width - padding - totalGaps) / columns;
    };

    return {
        width,
        height,
        screenSize,
        isTablet,
        isLandscape,
        scale,
        fontScale,
        padding: getPadding(),
        getGridColumns,
        getModalMaxWidth,
        getCardWidth,
    };
};

// Simple responsive value selector
export const responsive = <T,>(
    width: number,
    values: { phone?: T; tablet?: T; default: T }
): T => {
    if (isTabletSize(width) && values.tablet !== undefined) {
        return values.tablet;
    }
    if (values.phone !== undefined) {
        return values.phone;
    }
    return values.default;
};

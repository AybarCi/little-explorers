/// <reference types="vite/client" />

declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.PNG' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.svg' {
    const value: string;
    export default value;
}

declare module '*.webp' {
    const value: string;
    export default value;
}

// Meta Pixel (Facebook Pixel) global function
interface FbqFunction {
    (action: 'init', pixelId: string): void;
    (action: 'track', eventName: string, params?: Record<string, unknown>): void;
    (action: 'trackCustom', eventName: string, params?: Record<string, unknown>): void;
}

declare const fbq: FbqFunction | undefined;

interface Window {
    fbq?: FbqFunction;
}


import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

export const initAnalytics = () => {
    if (POSTHOG_KEY) {
        posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            autocapture: false, // We want explicit tracking for now to avoid noise
            capture_pageview: false // We are a SPA, so we handle this manually if needed
        });
    }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
        posthog.capture(eventName, properties);
    } else {
        console.log(`[Analytics - Dev] ${eventName}`, properties);
    }
};

export const identifyUser = (userId: string, email?: string) => {
    if (POSTHOG_KEY) {
        posthog.identify(userId, { email });
    }
};

export const resetAnalytics = () => {
    if (POSTHOG_KEY) {
        posthog.reset();
    }
};

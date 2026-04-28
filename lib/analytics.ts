import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || 'phc_Mt8o1IOEqDRawtJe4rbEKeRWxvAHSy7auQVo9hqzok9';
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

export const initAnalytics = () => {
    if (POSTHOG_KEY && POSTHOG_HOST) {
        try {
            posthog.init(POSTHOG_KEY, {
                api_host: POSTHOG_HOST,
                defaults: '2026-01-30',
                autocapture: true,
                capture_pageview: true,
                loaded: (ph) => {
                    console.log('✅ PostHog Loaded Successfully!', ph);
                }
            });
            console.log('🚀 PostHog Initialized with Host:', POSTHOG_HOST);
        } catch (e) {
            console.error('❌ PostHog Init Failed:', e);
        }
    } else {
        console.warn('⚠️ Analytics Skipped: Missing API Key or Host');
    }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    if (POSTHOG_KEY) {
        posthog.capture(eventName, properties);
        console.log(`📊 [Analytics] Tracked: ${eventName}`, properties);
    } else {
        console.log(`[Analytics - Dev] ${eventName}`, properties);
    }
};

export const identifyUser = (userId: string, email?: string) => {
    if (POSTHOG_KEY) {
        posthog.identify(userId, { email });
        console.log(`👤 [Analytics] Identified User: ${userId}`, { email });
    }
};

export const resetAnalytics = () => {
    if (POSTHOG_KEY) {
        posthog.reset();
    }
};

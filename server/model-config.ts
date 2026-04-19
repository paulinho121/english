/**
 * LINGUAFLOW AI — MODEL CONFIGURATION & AUTO-FALLBACK
 *
 * When Google deprecates a Gemini model, the system automatically
 * falls back to the next available model in the chain.
 *
 * HOW TO UPDATE:
 *   - To add a new model: prepend it to the top of the relevant array.
 *   - Older/deprecated models can be left in the list as fallbacks.
 *   - Do NOT remove models until you're sure they are fully shut down.
 */

// ─── AUDIO (Live / Realtime / BidiGenerateContent) ──────────────────────────
// Used by: server/index.ts (WebSocket proxy to Gemini Multimodal Live API)
export const AUDIO_MODELS: string[] = [
    'models/gemini-2.5-flash-preview-native-audio-dialog',  // Newest — try first
    'models/gemini-2.5-flash-native-audio-preview-12-2025', // Previous stable
    'models/gemini-2.0-flash-live-001',                     // Stable fallback
    'models/gemini-2.0-flash-exp',                          // Last resort
];

// ─── TEXT (REST / generateContent) ───────────────────────────────────────────
// Used by: services/geminiService.ts (text chat)
export const TEXT_MODELS: string[] = [
    'gemini-2.5-flash',         // Newest — try first
    'gemini-2.0-flash',         // Previous stable
    'gemini-2.0-flash-lite',    // Lighter fallback
    'gemini-1.5-flash',         // Last resort
];

// ─── Deprecation error patterns ───────────────────────────────────────────────
// These strings signal that a model is gone and we should retry with the next.
export const DEPRECATION_SIGNALS = [
    '404',
    'not found',
    'deprecated',
    'not supported',
    'model_not_found',
    'invalid model',
    'model is not available',
    'has been deprecated',
    'no longer available',
    'removed',
];

export const isDeprecationError = (errorMsg: string): boolean => {
    const lower = errorMsg.toLowerCase();
    return DEPRECATION_SIGNALS.some(signal => lower.includes(signal));
};

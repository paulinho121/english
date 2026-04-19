
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Teacher, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// ─── Model Fallback Chain ─────────────────────────────────────────────────────
// Ordered from newest to oldest. When a model is deprecated, the service
// automatically retries with the next one in the list.
const TEXT_MODELS: string[] = [
  'gemini-2.5-flash',       // Newest — try first
  'gemini-2.0-flash',       // Previous stable
  'gemini-2.0-flash-lite',  // Lighter fallback
  'gemini-1.5-flash',       // Last resort
];

const DEPRECATION_SIGNALS = [
  '404', 'not found', 'deprecated', 'not supported', 'model_not_found',
  'invalid model', 'model is not available', 'has been deprecated',
  'no longer available', 'removed',
];

const isDeprecationError = (err: unknown): boolean => {
  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();
  return DEPRECATION_SIGNALS.some(signal => msg.includes(signal));
};

// ─── Language Helper ──────────────────────────────────────────────────────────
const getLanguageName = (lang: Language): string => {
  switch (lang) {
    case Language.ENGLISH: return 'English';
    case Language.SPANISH: return 'Spanish';
    case Language.FRENCH:  return 'French';
    default:               return 'English';
  }
};

// ─── Core API Call (single model attempt) ────────────────────────────────────
const callGemini = async (
  model: string,
  systemInstruction: string,
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
) => {
  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          response:   { type: Type.STRING },
          correction: { type: Type.STRING, description: "A brief correction of the user's grammar or vocabulary mistakes" }
        },
        required: ["response"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

// ─── Main Export ──────────────────────────────────────────────────────────────
export const getAIResponse = async (
  message: string,
  teacher: Teacher,
  level: Level,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<GeminiResponse> => {
  const targetLanguage = getLanguageName(teacher.language);

  const systemInstruction = `
    =====================================================
    LANGUAGE LOCK — YOUR MOST CRITICAL RULE
    =====================================================
    YOUR TEACHING LANGUAGE IS: ${targetLanguage}.
    YOU MUST RESPOND AND TEACH EXCLUSIVELY IN ${targetLanguage}.
    DO NOT respond in Portuguese. DO NOT respond in any other language.
    If the student writes in Portuguese, UNDERSTAND it, but always reply in ${targetLanguage}.
    =====================================================

    You are ${teacher.name}, a professional and friendly ${targetLanguage} teacher.
    The student is at the ${level} level.

    Your goals:
    1. Chat naturally with the student IN ${targetLanguage}.
    2. Maintain the persona: ${teacher.bio}.
    3. If the student makes a grammatical, vocabulary, or stylistic mistake in ${targetLanguage}, provide a gentle correction in a separate field called "correction".
    4. Keep the "response" field for the natural flow of the conversation IN ${targetLanguage}.
    5. At the ${level} level:
       - Beginner: Use simple words, short sentences, and be very encouraging.
       - Intermediate: Use slightly more complex structures, common idioms, and ask open questions.
       - Advanced: Use academic or professional vocabulary, complex grammar, and engage in deeper discussions.

    Output format: You MUST respond in JSON with two keys:
    - "response": Your direct message to the student (ALWAYS in ${targetLanguage}).
    - "correction": (Optional) A brief, polite correction of any mistakes in the student's ${targetLanguage}.
  `;

  // ─── Fallback Loop ──────────────────────────────────────────────────────────
  for (let i = 0; i < TEXT_MODELS.length; i++) {
    const model = TEXT_MODELS[i];
    try {
      const data = await callGemini(model, systemInstruction, message, history);

      // Log if we used a fallback (not the first/preferred model)
      if (i > 0) {
        console.log(`✅ Text response served by fallback model: ${model}`);
      }

      return {
        response:   data.response  || "I'm sorry, I couldn't understand that. Could you repeat it?",
        correction: data.correction,
      };
    } catch (error) {
      if (isDeprecationError(error)) {
        const next = TEXT_MODELS[i + 1];
        console.warn(`⚠️  Model "${model}" is deprecated or unavailable.`);
        if (next) {
          console.log(`🔄 Auto-switching to: "${next}"`);
          continue; // retry with next model in chain
        } else {
          console.error('🚨 All text models exhausted.');
        }
      } else {
        // Non-deprecation error (rate limit, network, etc.) — don't exhaust the chain
        console.error(`Gemini API Error [${model}]:`, error);
      }
      break;
    }
  }

  return {
    response: "I'm having a little trouble connecting right now. Let's try again in a moment!"
  };
};

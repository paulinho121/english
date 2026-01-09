
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Level, Teacher, GeminiResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIResponse = async (
  message: string,
  teacher: Teacher,
  level: Level,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[]
): Promise<GeminiResponse> => {
  const systemInstruction = `
    You are ${teacher.name}, a professional and friendly native ${teacher.language === Language.ENGLISH ? 'English' : 'Spanish'} teacher.
    The student is at the ${level} level. 
    
    Your goals:
    1. Chat naturally with the student.
    2. Maintain the persona: ${teacher.bio}.
    3. If the student makes a grammatical, vocabulary, or stylistic mistake in ${teacher.language === Language.ENGLISH ? 'English' : 'Spanish'}, provide a gentle correction in a separate field called "correction". 
    4. Keep the "response" field for the natural flow of the conversation.
    5. At the ${level} level:
       - Beginner: Use simple words, short sentences, and be very encouraging.
       - Intermediate: Use slightly more complex structures, common idioms, and ask open questions.
       - Advanced: Use academic or professional vocabulary, complex grammar, and engage in deeper discussions.

    Output format: You MUST respond in JSON with two keys:
    - "response": Your direct message to the student.
    - "correction": (Optional) A brief, polite note about any mistakes found in the student's message.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
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
            response: { type: Type.STRING },
            correction: { type: Type.STRING, description: "A brief correction of the user's grammar or vocabulary mistakes" }
          },
          required: ["response"]
        }
      }
    });

    const data = JSON.parse(response.text || '{}');
    return {
      response: data.response || "I'm sorry, I couldn't understand that. Could you repeat it?",
      correction: data.correction
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      response: "I'm having a little trouble connecting right now. Let's try again in a moment!"
    };
  }
};

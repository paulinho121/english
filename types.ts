
export enum Language {
  ENGLISH = 'en-US',
  SPANISH = 'es-ES',
  FRENCH = 'fr-FR'
}

export enum Level {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export interface Teacher {
  id: string;
  name: string;
  language: Language;
  avatar: string;
  bio: string;
  accent: string;
  voice: string;
  gender: 'male' | 'female';
  isKidMode?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  correction?: string;
}

export interface GeminiResponse {
  response: string;
  correction?: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  isKidMode?: boolean;
}

export interface SessionReportData {
  score: number;
  mistakes: { mistake: string; correction: string }[];
  vocabulary: { word: string; translation: string }[];
  tip: string;
  continuationContext?: string;
}

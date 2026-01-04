import React from 'react';

export enum Language {
  ENGLISH = 'en-US',
  SPANISH = 'es-ES',
  FRENCH = 'fr-FR'
}

export enum Level {
  B1 = 'B1 (Intermediário)',
  B2 = 'B2 (Intermediário Superior)'
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
  icon: React.ReactNode;
  prompt: string;
  isKidMode?: boolean;
}

export interface SessionReportData {
  score: number;
  strengths: string[];
  mistakes: { mistake: string; correction: string; explanation: string }[];
  improvements: { original: string; adjusted: string; explanation: string }[];
  vocabulary: { word: string; translation: string }[];
  tip: string;
  continuationContext?: string;
  duration?: string;
}

export interface PronunciationPhrase {
  id: string;
  text: string;
  level: string;
  translation: string;
  image?: string; // Optional image for Kids Mode
}

export interface UserProgress {
  topic_id: string;
  score: number; // Used for bar percentage (0-100)
  status: 'locked' | 'unlocked' | 'completed';
  current_level: number; // e.g. 1.0, 1.1, 1.2
  total_minutes: number;
}

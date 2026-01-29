/**
 * LINGUAFLOW AI - PEDAGOGICAL CONSTANTS
 * Copyright (c) 2026 Paulinho Fernando. All rights reserved.
 * 
 * This file contains proprietary instructional prompts and pedagogical 
 * methodology developed specifically for the LinguaFlow AI platform.
 * Unauthorized reproduction or distribution is strictly prohibited.
 */

import { Teacher, Language, Topic, PronunciationPhrase } from './types';

export const TEACHERS: Teacher[] = [
  {
    id: 'malina-en',
    name: 'Professora Malina',
    language: Language.ENGLISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/malina-new.png',
    voice: 'Aoede', // Female, energetic
    gender: 'female',
    bio: 'Mentora brasileira especialista em pedagogia do Inglês. Malina entende profundamente as barreiras linguísticas e aplica técnicas de ensino personalizadas para cada nível, focando na construção da confiança do aluno.'
  },
  {
    id: 'geremy-en',
    name: 'Professor Geremy',
    language: Language.ENGLISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/geremy.png',
    voice: 'Puck', // Male, calm
    gender: 'male',
    bio: 'Estrategista de ensino brasileiro com vivência internacional acadêmica. Geremy utiliza métodos de imersão gradual para transformar o conhecimento passivo em fala ativa e fluente.'
  },
  {
    id: 'malina-es',
    name: 'Profesora Malina',
    language: Language.SPANISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/malina-new.png',
    voice: 'Aoede', // Using Aoede (Valid)
    gender: 'female',
    bio: 'Especialista em ensino de Espanhol para brasileiros. Malina utiliza técnicas de contraste linguístico para acelerar a gramática e a fluidez, atuando como uma guia pedagógica na sua jornada.'
  },
  {
    id: 'priscila-fr',
    name: 'Professora Priscila',
    language: Language.FRENCH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/priscila.png',
    voice: 'Kore', // Using Kore (Valid)
    gender: 'female',
    bio: 'Mentora de Francês focada em fonética e estruturação de pensamento no idioma. Priscila guia brasileiros pelos Labirintos do francês com uma metodologia clara e encorajadora.'
  },
  {
    id: 'geremy-es',
    name: 'Profesor Geremy',
    language: Language.SPANISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/geremy.png',
    voice: 'Puck', // Male, calm
    gender: 'male',
    bio: 'Estrategista de ensino brasileiro com vivência internacional acadêmica. Geremy utiliza métodos de imersão gradual no Espanhol para transformar o conhecimento passivo em fala ativa e fluente.'
  },
  {
    id: 'geremy-fr',
    name: 'Professeur Geremy',
    language: Language.FRENCH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/geremy.png',
    voice: 'Puck', // Male, calm
    gender: 'male',
    bio: 'Estrategista de ensino brasileiro com vivência internacional acadêmica. Geremy utiliza métodos de imersão gradual no Francês para transformar o conhecimento passivo em fala ativa e fluente.'
  },
  {
    id: 'leo-en',
    name: 'Leo',
    language: Language.ENGLISH,
    accent: 'Kids Mode 🎈',
    avatar: '/kids/leo.png',
    voice: 'Puck', // Energetic Boy
    gender: 'male',
    isKidMode: true,
    bio: 'Seu melhor amigo para aprender inglês brincando! O Leo adora aventuras e vai te ensinar palavras novas de um jeito super divertido.'
  },
  {
    id: 'lara-en',
    name: 'Lara',
    language: Language.ENGLISH,
    accent: 'Kids Mode 🎈',
    avatar: '/kids/lara.png',
    voice: 'Kore', // Youthful Girl
    gender: 'female',
    isKidMode: true,
    bio: 'A Lara é super criativa e ama contar histórias em inglês. Vamos aprender e nos divertir muito juntos!'
  },
  {
    id: 'leo-es',
    name: 'Leo',
    language: Language.SPANISH,
    accent: 'Modo Kids 🎈',
    avatar: '/kids/leo.png',
    voice: 'Puck',
    gender: 'male',
    isKidMode: true,
    bio: '¡Hola! Soy Leo. Vamos aprender espanhol com muitas brincadeiras e alegria!'
  },
  {
    id: 'lara-es',
    name: 'Lara',
    language: Language.SPANISH,
    accent: 'Modo Kids 🎈',
    avatar: '/kids/lara.png',
    voice: 'Kore',
    gender: 'female',
    isKidMode: true,
    bio: 'Oi! Eu sou a Lara. Vamos descobrir o mundo do espanhol cantando e rindo muito!'
  },
  {
    id: 'leo-fr',
    name: 'Leo',
    language: Language.FRENCH,
    accent: 'Mode Kids 🎈',
    avatar: '/kids/leo.png',
    voice: 'Puck',
    gender: 'male',
    isKidMode: true,
    bio: 'Salut! Je suis Leo. Aprender francês é como um jogo fantástico, vamos nessa?'
  },
  {
    id: 'lara-fr',
    name: 'Lara',
    language: Language.FRENCH,
    accent: 'Mode Kids 🎈',
    avatar: '/kids/lara.png',
    voice: 'Kore',
    gender: 'female',
    isKidMode: true,
    bio: 'Bonjour! Eu sou a Lara. O francês é uma língua mágica, e eu vou te mostrar como é fácil aprender!'
  }

];

import {
  MessageCircleHeart, BriefcaseBusiness, Plane, UtensilsCrossed,
  Coffee, GraduationCap, Building2, School, Mic,
  Wand, PawPrint, Zap, Rocket, TrendingUp
} from 'lucide-react';

const SECURE_PROMPT = "Instructional methodology managed by the LinguaFlow AI Secure Server.";

export const TOPICS: Topic[] = [
  {
    id: 'free-conversation',
    name: 'Conversa Livre',
    icon: <MessageCircleHeart className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'job-interview',
    name: 'Entrevista de Emprego',
    icon: <BriefcaseBusiness className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'travel',
    name: 'Viagem e Turismo',
    icon: <Plane className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: <UtensilsCrossed className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'daily-life',
    name: 'Vida Diária',
    icon: <Coffee className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'university',
    name: 'Faculdade / Estudos',
    icon: <GraduationCap className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'work',
    name: 'Ambiente de Trabalho',
    icon: <Building2 className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'school',
    name: 'Simulação de Vendas',
    icon: <TrendingUp className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'pronunciation',
    name: 'Treinamento de Pronúncia',
    icon: <Mic className="w-8 h-8" />,
    prompt: SECURE_PROMPT
  },
  {
    id: 'kids-magic',
    name: 'Escola de Magia 🧙‍♂️',
    icon: <Wand className="w-8 h-8" />,
    isKidMode: true,
    prompt: SECURE_PROMPT
  },
  {
    id: 'kids-animals',
    name: 'Mundo dos Animais 🦁',
    icon: <PawPrint className="w-8 h-8" />,
    isKidMode: true,
    prompt: SECURE_PROMPT
  },
  {
    id: 'kids-superhero',
    name: 'Clube dos Super-Heróis 🦸‍♂️',
    icon: <Zap className="w-8 h-8" />,
    isKidMode: true,
    prompt: SECURE_PROMPT
  },
  {
    id: 'kids-space',
    name: 'Viagem ao Espaço 🚀',
    icon: <Rocket className="w-8 h-8" />,
    isKidMode: true,
    prompt: SECURE_PROMPT
  }
];

export const PRONUNCIATION_PHRASES: Record<Language, PronunciationPhrase[]> = {
  [Language.ENGLISH]: [
    // Kids Mode Phrases (Images)
    { id: 'en-k1', text: "Apple", level: 'Kids', translation: "Maçã", image: '/kids/apple.png' },
    { id: 'en-k2', text: "Dog", level: 'Kids', translation: "Cachorro", image: '/kids/dog.png' },
    { id: 'en-k3', text: "Cat", level: 'Kids', translation: "Gato", image: '/kids/cat.png' },
    { id: 'en-k4', text: "Ball", level: 'Kids', translation: "Bola", image: '/kids/ball.png' },
    { id: 'en-k5', text: "Sun", level: 'Kids', translation: "Sol", image: '/kids/sun.png' },

    // Regular Phrases
    { id: '1', text: "The quick brown fox jumps over the lazy dog.", level: 'B1', translation: "A raposa marrom rápida pula sobre o cachorro preguiçoso." },
    { id: '2', text: "She sells seashells by the seashore.", level: 'B1', translation: "Ela vende conchas na beira do mar." },
    { id: '3', text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", level: 'B2', translation: "Quanta madeira uma marmota jogaria se uma marmota pudesse jogar madeira?" },
    { id: '4', text: "I would like to order a hamburger and fries, please.", level: 'B1', translation: "Gostaria de pedir um hambúrguer e fritas, por favor." },
    { id: '5', text: "Can you please tell me where the nearest subway station is?", level: 'B1', translation: "Pode me dizer onde fica a estação de metrô mais próxima?" },
    { id: '6', text: "Although it was raining, we decided to go for a walk in the park.", level: 'B1', translation: "Embora estivesse chovendo, decidimos caminhar no parque." },
    { id: '7', text: "The phenomenon of aurora borealis is best seen in high-latitude regions.", level: 'B2', translation: "O fenômeno da aurora boreal é melhor visto em regiões de alta latitude." },
    { id: '8', text: "Three thick thighs.", level: 'B2', translation: "Três coxas grossas." },
    { id: '9', text: "World Wide Web.", level: 'B2', translation: "Rede Mundial de Computadores." },
    { id: '10', text: "Edgar Allan Poe was an American writer, poet, editor, and literary critic.", level: 'B2', translation: "Edgar Allan Poe foi um escritor, poeta, editor e crítico literário americano." }
  ],
  [Language.SPANISH]: [
    // Kids Mode Phrases (Images)
    { id: 'es-k1', text: "Manzana", level: 'Kids', translation: "Maçã", image: '/kids/apple.png' },
    { id: 'es-k2', text: "Perro", level: 'Kids', translation: "Cachorro", image: '/kids/dog.png' },
    { id: 'es-k3', text: "Gato", level: 'Kids', translation: "Gato", image: '/kids/cat.png' },
    { id: 'es-k4', text: "Pelota", level: 'Kids', translation: "Bola", image: '/kids/ball.png' },
    { id: 'es-k5', text: "Sol", level: 'Kids', translation: "Sol", image: '/kids/sun.png' },

    { id: 'es-1', text: "Hola, ¿cómo estás?", level: 'B1', translation: "Olá, como você está?" },
    { id: 'es-2', text: "Me gustaría ordenar una paella, por favor.", level: 'B1', translation: "Gostaria de pedir uma paella, por favor." },
    { id: 'es-3', text: "El perro corre por el parque rápidamente.", level: 'B1', translation: "O cachorro corre pelo parque rapidamente." },
    { id: 'es-4', text: "Tres tristes tigres tragaban trigo en un trigal.", level: 'B2', translation: "Três tigres tristes comiam trigo num trigal." },
    { id: 'es-5', text: "¿Podría decirme dónde está la biblioteca?", level: 'B1', translation: "Poderia me dizer onde fica a biblioteca?" },
    { id: 'es-6', text: "Mañana por la mañana voy a viajar a Madrid.", level: 'B1', translation: "Amanhã de manhã vou viajar para Madrid." },
    { id: 'es-7', text: "El ingenioso hidalgo Don Quijote de la Mancha.", level: 'B2', translation: "O engenhoso fidalgo Dom Quixote de La Mancha." },
    { id: 'es-8', text: "Pablito clavó un clavito.", level: 'B2', translation: "Pablito pregou um preguinho." }
  ],
  [Language.FRENCH]: [
    // Kids Mode Phrases (Images)
    { id: 'fr-k1', text: "Pomme", level: 'Kids', translation: "Maçã", image: '/kids/apple.png' },
    { id: 'fr-k2', text: "Chien", level: 'Kids', translation: "Cachorro", image: '/kids/dog.png' },
    { id: 'fr-k3', text: "Chat", level: 'Kids', translation: "Gato", image: '/kids/cat.png' },
    { id: 'fr-k4', text: "Balle", level: 'Kids', translation: "Bola", image: '/kids/ball.png' },
    { id: 'fr-k5', text: "Soleil", level: 'Kids', translation: "Sol", image: '/kids/sun.png' },

    { id: 'fr-1', text: "Bonjour, comment ça va?", level: 'B1', translation: "Olá, como vai?" },
    { id: 'fr-2', text: "Je voudrais un croissant et un café, s'il vous plaît.", level: 'B1', translation: "Eu gostaria de um croissant e um café, por favor." },
    { id: 'fr-3', text: "Le chat noir dort sur le canapé.", level: 'B1', translation: "O gato preto dorme no sofá." },
    { id: 'fr-4', text: "Un chasseur sachant chasser doit savoir chasser sans son chien.", level: 'B2', translation: "Um caçador que sabe caçar deve saber caçar sem seu cachorro." },
    { id: 'fr-5', text: "Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches?", level: 'B2', translation: "As meias da arquiduquesa estão secas, arqui-secas?" },
    { id: 'fr-6', text: "Il fait très beau aujourd'hui à Paris.", level: 'B1', translation: "Está muito bonito hoje em Paris." },
    { id: 'fr-7', text: "Je ne parle pas très bien français.", level: 'B1', translation: "Eu não falo francês muito bem." },
    { id: 'fr-8', text: "L'essentiel est invisible pour les yeux.", level: 'B2', translation: "O essencial é invisível aos olhos." }
  ]
};

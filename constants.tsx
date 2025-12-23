
import { Teacher, Language, Topic } from './types';

export const TEACHERS: Teacher[] = [
  {
    id: 'malina-en',
    name: 'Professora Malina',
    language: Language.ENGLISH,
    accent: 'American Accent',
    avatar: '/malina.png',
    voice: 'Aoede', // Female, energetic
    gender: 'female',
    bio: 'Nativa dos Estados Unidos com vasta experiência em ensino internacional. Malina foca na imersão total e na confiança do aluno para falar como um nativo.'
  },
  {
    id: 'geremy-en',
    name: 'Professor Geremy',
    language: Language.ENGLISH,
    accent: 'British Accent',
    avatar: '/geremy.png',
    voice: 'Puck', // Male, calm
    gender: 'male',
    bio: 'Professor nativo de Londres com foco em elegância e precisão. Geremy acredita que a imersão em inglês britânico é a chave para a fluência.'
  },
  {
    id: 'malina-es',
    name: 'Profesora Malina',
    language: Language.SPANISH,
    accent: 'Acento Latino',
    avatar: '/malina.png',
    voice: 'Lyra', // Female, soft/natural for Spanish
    gender: 'female',
    bio: 'Nativa da Espanha, Priscila traz o calor e a cultura de Madrid para a aula. Ela prioriza a comunicação em espanhol desde o primeiro minuto.'
  },
  {
    id: 'priscila-fr',
    name: 'Professora Priscila',
    language: Language.FRENCH,
    accent: 'Accent Français',
    avatar: '/priscila.png',
    voice: 'Kore', // Female, sophisticated for French
    gender: 'female',
    bio: 'Expert em fonética francesa e nativa de Paris. Priscila conduz suas aulas integralmente em francês para garantir fluidez e naturalidade.'
  },
  {
    id: 'kevin-en',
    name: 'Professor Kevin',
    language: Language.ENGLISH,
    accent: 'Kid Mode 🎈',
    avatar: '/kevin.png',
    voice: 'Aoede', // Using Aoede as its confirmed to work, persona will handle the 'boy' tone.
    gender: 'male',
    isKidMode: true,
    bio: 'Nativo da Califórnia e acadêmico rigoroso. O Professor Kevin utiliza métodos pedagógicos avançados e fala integralmente no idioma alvo para máxima eficácia.'
  },
  {
    id: 'kevin-es',
    name: 'Professor Kevin',
    language: Language.SPANISH,
    accent: 'Modo Niños 🎈',
    avatar: '/kevin.png',
    voice: 'Aoede',
    gender: 'male',
    isKidMode: true,
    bio: 'Un académico riguroso y dedicado. El Profesor Kevin utiliza métodos pedagógicos avanzados y un lenguaje formal para garantizar el dominio técnico y gramatical del idioma.'
  },
  {
    id: 'kevin-fr',
    name: 'Professor Kevin',
    language: Language.FRENCH,
    accent: 'Mode Enfant 🎈',
    avatar: '/kevin.png',
    voice: 'Aoede',
    gender: 'male',
    isKidMode: true,
    bio: 'Un académique rigoureux et dévoué. Le Professeur Kevin utilise des méthodes pédagogiques avancées et un langage formel pour assurer la maîtrise technique et grammaticale de la langue.'
  }
];

export const TOPICS: Topic[] = [
  {
    id: 'job-interview',
    name: 'Entrevista de Emprego',
    icon: '💼',
    prompt: 'Conduza uma simulação de entrevista de emprego INTEGRALMENTE no idioma alvo. Faça perguntas sobre experiência e habilidades, oferecendo feedback linguístico ocasional em português se necessário.'
  },
  {
    id: 'travel',
    name: 'Viagem e Turismo',
    icon: '✈️',
    prompt: 'Imagine que estamos em um aeroporto ou hotel. Conduza a interação no IDIOMA ALVO. Ajude o aluno a fazer o check-in e pedir informações turísticas, mantendo a imersão.'
  },
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: '🍽️',
    prompt: 'Simule um jantar em um restaurante sofisticado, falando APENAS no idioma alvo. O aluno deve pedir a comida, fazer perguntas sobre o menu e pagar a conta.'
  },
  {
    id: 'daily-life',
    name: 'Vida Diária',
    icon: '🏠',
    prompt: 'Uma conversa casual sobre hobbies, família e rotina diária conduzida no IDIOMA ALVO para praticar a fluidez cotidiana.'
  },
  {
    id: 'pronunciation',
    name: 'Treinamento de Pronúncia',
    icon: '🗣️',
    prompt: `
      FOCO: Treinamento Intensivo de Pronúncia e Fonética.
      REGRAS:
      1. Proponha uma frase curta e desafiadora por vez no IDIOMA ALVO para o aluno ler.
      2. Você DEVE usar a ferramenta display_pronunciation_target(phrase: "frase aqui") para mostrar a frase na tela do aluno cada vez que propor um desafio.
      3. Quando o aluno ler, avalie a pronúncia, entonação e ritmo.
      4. Forneça feedback técnico sobre como posicionar a língua ou soprar o ar para sons específicos (ex: 'th' no inglês, 'rr' no espanhol, 'u' no francês).
      5. Se o aluno acertar, elogie e proponha um novo desafio chamando a ferramenta de novo.
      6. Se errar, peça para repetir focando no feedback dado.
    `
  }
];

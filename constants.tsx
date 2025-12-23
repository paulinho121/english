
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
      FOCO: Avaliador Implacável de Pronúncia.
      
      COMPORTAMENTO:
      1. O aluno vai ler uma frase que está aparecendo na tela dele.
      2. Eu (o sistema) vou te enviar via texto qual é a "FRASE ALVO" que ele está tentando ler.
      3. Sua tarefa é ouvir o áudio do aluno e comparar com a FRASE ALVO.
      4. Dê uma nota de 0 a 100 baseada na precisão fonética.
      5. Se a nota for menor que 100, explique EXATAMENTE qual som saiu errado (ex: "Você disse 'dii' mas o correto é 'th' com a língua nos dentes").
      6. Se a nota for 100, parabenize e peça para ele ir para a próxima.
      7. SEJA BREVE. Feedback curto e técnico.
      8. FERRAMENTA DE NAVEGAÇÃO: Se o aluno disser "Vamos para a próxima", "Próxima frase", ou "Next", CHAME a ferramenta 'next_phrase'. NÃO mude o assunto, apenas chame a ferramenta.
    `
  }
];

export const PRONUNCIATION_PHRASES = [
  { id: '1', text: "The quick brown fox jumps over the lazy dog.", level: 'Básico', translation: "A raposa marrom rápida pula sobre o cachorro preguiçoso." },
  { id: '2', text: "She sells seashells by the seashore.", level: 'Intermediário', translation: "Ela vende conchas na beira do mar." },
  { id: '3', text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?", level: 'Avançado', translation: "Quanta madeira uma marmota jogaria se uma marmota pudesse jogar madeira?" },
  { id: '4', text: "I would like to order a hamburger and fries, please.", level: 'Básico', translation: "Gostaria de pedir um hambúrguer e fritas, por favor." },
  { id: '5', text: "Can you please tell me where the nearest subway station is?", level: 'Básico', translation: "Pode me dizer onde fica a estação de metrô mais próxima?" },
  { id: '6', text: "Although it was raining, we decided to go for a walk in the park.", level: 'Intermediário', translation: "Embora estivesse chovendo, decidimos caminhar no parque." },
  { id: '7', text: "The phenomenon of aurora borealis is best seen in high-latitude regions.", level: 'Avançado', translation: "O fenômeno da aurora boreal é melhor visto em regiões de alta latitude." },
  { id: '8', text: "Three thick thighs.", level: 'Difícil', translation: "Três coxas grossas." },
  { id: '9', text: "World Wide Web.", level: 'Difícil', translation: "Rede Mundial de Computadores." },
  { id: '10', text: "Edgar Allan Poe was an American writer, poet, editor, and literary critic.", level: 'Avançado', translation: "Edgar Allan Poe foi um escritor, poeta, editor e crítico literário americano." }
];

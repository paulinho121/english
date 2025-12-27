
import { Teacher, Language, Topic } from './types';

export const TEACHERS: Teacher[] = [
  {
    id: 'malina-en',
    name: 'Professora Malina',
    language: Language.ENGLISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/malina-new.png',
    voice: 'Aoede', // Female, energetic
    gender: 'female',
    bio: 'Brasileira especialista em ensino de Inglês. Malina entende as dificuldades dos brasileiros e ajuda você a superar a barreira da fala com dicas práticas.'
  },
  {
    id: 'geremy-en',
    name: 'Professor Geremy',
    language: Language.ENGLISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/geremy.png',
    voice: 'Puck', // Male, calm
    gender: 'male',
    bio: 'Professor brasileiro com anos de experiência no exterior. Geremy foca na comunicação clara e eficaz, usando sua vivência para ensinar o inglês real.'
  },
  {
    id: 'malina-es',
    name: 'Profesora Malina',
    language: Language.SPANISH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/malina-new.png',
    voice: 'Aoede', // Using Aoede (Valid)
    gender: 'female',
    bio: 'Brasileira e apaixonada pela cultura hispânica. Malina ensina espanhol focando nas semelhanças e diferenças com o português para acelerar o aprendizado.'
  },
  {
    id: 'priscila-fr',
    name: 'Professora Priscila',
    language: Language.FRENCH,
    accent: 'Sotaque Brasileiro 🇧🇷',
    avatar: '/priscila.png',
    voice: 'Kore', // Using Kore (Valid)
    gender: 'female',
    bio: 'Brasileira especialista em Francês. Priscila desmistifica a pronúncia francesa e ajuda alunos brasileiros a falar com confiança e naturalidade.'
  },
  {
    id: 'kevin-en',
    name: 'Professor Kevin',
    language: Language.ENGLISH,
    accent: 'Modo Kids (BR) 🇧🇷',
    avatar: '/kevin.png',
    voice: 'Puck', // Changed to Puck (Male) for Kevin
    gender: 'male',
    isKidMode: true,
    bio: 'O amigo brasileiro divertido para aprender inglês! Kevin usa uma linguagem simples e brincadeiras para tornar o aprendizado leve e natural para crianças.'
  },
  {
    id: 'kevin-es',
    name: 'Professor Kevin',
    language: Language.SPANISH,
    accent: 'Modo Kids (BR) 🇧🇷',
    avatar: '/kevin.png',
    voice: 'Puck', // Puck for Spanish Kevin
    gender: 'male',
    isKidMode: true,
    bio: 'O amigo brasileiro divertido para aprender espanhol! Kevin usa uma linguagem simples e brincadeiras para tornar o aprendizado leve e natural para crianças.'
  },
  {
    id: 'kevin-fr',
    name: 'Professor Kevin',
    language: Language.FRENCH,
    accent: 'Modo Kids (BR) 🇧🇷',
    avatar: '/kevin.png',
    voice: 'Puck', // Puck for French Kevin
    gender: 'male',
    isKidMode: true,
    bio: 'O amigo brasileiro divertido para aprender francês! Kevin usa uma linguagem simples e brincadeiras para tornar o aprendizado leve e natural para crianças.'
  }
];

export const TOPICS: Topic[] = [
  {
    id: 'job-interview',
    name: 'Entrevista de Emprego',
    icon: '💼',
    prompt: 'Conduza uma simulação de entrevista de emprego. O foco é fazer perguntas sobre experiência e habilidades. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'travel',
    name: 'Viagem e Turismo',
    icon: '✈️',
    prompt: 'Imagine que estamos em um aeroporto ou hotel. Ajude o aluno a fazer o check-in e pedir informações turísticas. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: '🍽️',
    prompt: 'Simule um jantar em um restaurante sofisticado. O aluno deve pedir a comida, fazer perguntas sobre o menu e pagar a conta. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'daily-life',
    name: 'Vida Diária',
    icon: '🏠',
    prompt: 'Uma conversa casual sobre hobbies, família e rotina diária para praticar a fluidez cotidiana. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'university',
    name: 'Faculdade / Estudos',
    icon: '🎓',
    prompt: 'Simule uma interação no campus de uma universidade (biblioteca, café ou sala de aula). Discuta projetos, provas e vida acadêmica. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'work',
    name: 'Ambiente de Trabalho',
    icon: '🏢',
    prompt: 'Simule uma reunião de trabalho ou uma conversa no escritório. Foco em vocabulário profissional, prazos e colaboração. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
  },
  {
    id: 'school',
    name: 'Escola / Sala de Aula',
    icon: '🎒',
    prompt: 'Simule um dia de aula na escola. A conversa pode ser sobre matérias, dever de casa ou interação com colegas/professores. Siga o PROTOCOLO DE IDIOMA do nível selecionado.'
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

export const PRONUNCIATION_PHRASES = {
  [Language.ENGLISH]: [
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
  ],
  [Language.SPANISH]: [
    { id: 'es-1', text: "Hola, ¿cómo estás?", level: 'Básico', translation: "Olá, como você está?" },
    { id: 'es-2', text: "Me gustaría ordenar una paella, por favor.", level: 'Básico', translation: "Gostaria de pedir uma paella, por favor." },
    { id: 'es-3', text: "El perro corre por el parque rápidamente.", level: 'Intermediário', translation: "O cachorro corre pelo parque rapidamente." },
    { id: 'es-4', text: "Tres tristes tigres tragaban trigo en un trigal.", level: 'Difícil', translation: "Três tigres tristes comiam trigo num trigal." },
    { id: 'es-5', text: "¿Podría decirme dónde está la biblioteca?", level: 'Básico', translation: "Poderia me dizer onde fica a biblioteca?" },
    { id: 'es-6', text: "Mañana por la mañana voy a viajar a Madrid.", level: 'Intermediário', translation: "Amanhã de manhã vou viajar para Madrid." },
    { id: 'es-7', text: "El ingenioso hidalgo Don Quijote de la Mancha.", level: 'Avançado', translation: "O engenhoso fidalgo Dom Quixote de La Mancha." },
    { id: 'es-8', text: "Pablito clavó un clavito.", level: 'Difícil', translation: "Pablito pregou um preguinho." }
  ],
  [Language.FRENCH]: [
    { id: 'fr-1', text: "Bonjour, comment ça va?", level: 'Básico', translation: "Olá, como vai?" },
    { id: 'fr-2', text: "Je voudrais un croissant et un café, s'il vous plaît.", level: 'Básico', translation: "Eu gostaria de um croissant e um café, por favor." },
    { id: 'fr-3', text: "Le chat noir dort sur le canapé.", level: 'Básico', translation: "O gato preto dorme no sofá." },
    { id: 'fr-4', text: "Un chasseur sachant chasser doit savoir chasser sans son chien.", level: 'Difícil', translation: "Um caçador que sabe caçar deve saber caçar sem seu cachorro." },
    { id: 'fr-5', text: "Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches?", level: 'Difícil', translation: "As meias da arquiduquesa estão secas, arqui-secas?" },
    { id: 'fr-6', text: "Il fait très beau aujourd'hui à Paris.", level: 'Intermediário', translation: "Está muito bonito hoje em Paris." },
    { id: 'fr-7', text: "Je ne parle pas très bien français.", level: 'Básico', translation: "Eu não falo francês muito bem." },
    { id: 'fr-8', text: "L'essentiel est invisible pour les yeux.", level: 'Avançado', translation: "O essencial é invisível aos olhos." }
  ]
};

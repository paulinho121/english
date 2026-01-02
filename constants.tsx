
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

export const TOPICS: Topic[] = [
  {
    id: 'free-conversation',
    name: 'Conversa Livre',
    icon: '✨',
    prompt: 'Mantenha uma conversa pedagógica sobre qualquer assunto. Como mentor, induza o aluno a usar o vocabulário adequado para o seu nível e ofereça feedbacks construtivos contínuos conforme o Protocolo Pedagógico.'
  },
  {
    id: 'job-interview',
    name: 'Entrevista de Emprego',
    icon: '💼',
    prompt: 'Conduza uma mentoria de carreira em formato de entrevista. Avalie as respostas do aluno segundo o Protocolo Pedagógico, corrigindo não apenas o idioma, mas sugerindo formas mais profissionais de expressão.'
  },
  {
    id: 'travel',
    name: 'Viagem e Turismo',
    icon: '✈️',
    prompt: 'Atue como um guia instrucional em cenários de viagem. Coloque o aluno em situações práticas e use o Protocolo Pedagógico para garantir que ele aprenda os termos essenciais de sobrevivência e polidez.'
  },
  {
    id: 'restaurant',
    name: 'Restaurante',
    icon: '🍽️',
    prompt: 'Simule uma interação pedagógica em um restaurante. Ensine o aluno a lidar com menus e situações sociais complexas, aplicando rigorosamente o Protocolo Pedagógico de nível.'
  },
  {
    id: 'daily-life',
    name: 'Vida Diária',
    icon: '🏠',
    prompt: 'Conversa guiada sobre rotina. O objetivo é expandir o vocabulário base do aluno através do Protocolo Pedagógico, transformando situações comuns em oportunidades de ensino.'
  },
  {
    id: 'university',
    name: 'Faculdade / Estudos',
    icon: '🎓',
    prompt: 'Simulação acadêmica. Atue como um tutor universitário, incentivando o debate de ideias e o uso de termos formais de acordo com o Protocolo Pedagógico do nível selecionado.'
  },
  {
    id: 'work',
    name: 'Ambiente de Trabalho',
    icon: '🏢',
    prompt: 'Mentoria corporativa. Aborde situações de escritório e reuniões, focando no "Business Language" e aplicando o Protocolo Pedagógico para elevar o nível profissional do aluno.'
  },
  {
    id: 'school',
    name: 'Escola / Sala de Aula',
    icon: '🎒',
    prompt: 'Simule um ambiente de ensino formal. Atue como o professor da sala, aplicando o Protocolo Pedagógico para consolidar as bases gramaticais e a fluidez do aluno.'
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
      4. Dê uma nota de 0 a 100 baseada na precisão fonética de cada palavra.
      5. Se a nota não for 100, identifique as palavras específicas que soaram errado e explique EXATAMENTE qual som saiu errado (ex: "Em 'think', você disse 'fink' mas o correto é o som do 'th' soprado").
      6. Se a nota for 100, parabenize e peça para ele ir para a próxima.
      7. SEJA BREVE. Feedback curto, direto e técnico por palavra.
      8. FERRAMENTA DE NAVEGAÇÃO: Se o aluno disser "Vamos para a próxima", "Próxima frase", ou "Next", CHAME a ferramenta 'next_phrase'. NÃO mude o assunto, apenas chame a ferramenta.
      9. Se o aluno quiser parar o treinamento, use 'save_session_report' para avaliar o desempenho geral.
      10. FOCO DE VOZ: Ignore ruídos de fundo (TV, carros, conversas paralelas). Foque apenas na voz ativa que está lendo a frase alvo.
    `
  },
  {
    id: 'kids-magic',
    name: 'Escola de Magia 🧙‍♂️',
    icon: '✨',
    isKidMode: true,
    prompt: 'Atue como um mestre de magia divertido. Ensine palavras mágicas e feitiços em inglês, mantendo a conversa cheia de fantasia e encorajamento.'
  },
  {
    id: 'kids-animals',
    name: 'Mundo dos Animais 🦁',
    icon: '🐾',
    isKidMode: true,
    prompt: 'Simule uma aventura na floresta ou fazenda. Ensine nomes de animais, sons e cores de um jeito lúdico e animado.'
  },
  {
    id: 'kids-superhero',
    name: 'Clube dos Super-Heróis 🦸‍♂️',
    icon: '⚡',
    isKidMode: true,
    prompt: 'Atue como um super-herói treinando um novo parceiro. Use termos de ação, cores e heroismo para ensinar inglês de forma empolgante.'
  },
  {
    id: 'kids-space',
    name: 'Viagem ao Espaço 🚀',
    icon: '⭐',
    isKidMode: true,
    prompt: 'Conduza uma missão espacial! Ensine sobre planetas, estrelas e foguetes, usando um tom de curiosidade e descoberta.'
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

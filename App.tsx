
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { Language, Level, Teacher, Topic } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import {
  Mic, MicOff, PhoneOff, Settings, Volume2,
  Sparkles, Globe, ShieldCheck,
  ArrowRight, BrainCircuit, Bookmark
} from 'lucide-react';

// Auxiliares para áudio
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

const App: React.FC = () => {
  const [step, setStep] = useState<'welcome' | 'setup' | 'call'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.BEGINNER);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(TOPICS[3].id); // Default to Daily Life
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [hasSavedStage, setHasSavedStage] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    if (selectedTopicId === 'pronunciation' && isConnectedRef.current) {
      const phrase = PRONUNCIATION_PHRASES[currentPhraseIndex];
      console.log('Enviando contexto de pronúncia para IA:', phrase.text);
      sessionRef.current?.then((session: any) => {
        session.send({
          parts: [{ text: `CONTEXTO ATUALIZADO: O aluno vai ler a seguinte frase agora: "${phrase.text}". Avalie com rigor.` }]
        });
      });
    }
  }, [currentPhraseIndex, selectedTopicId]);



  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('linguistai_stage');
    if (saved) {
      setHasSavedStage(true);
    }
  }, []);

  const saveStage = () => {
    const data = {
      language: selectedLanguage,
      level: selectedLevel,
      teacherId: selectedTeacherId,
      topicId: selectedTopicId,
      timestamp: Date.now()
    };
    localStorage.setItem('linguistai_stage', JSON.stringify(data));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const loadSavedStage = () => {
    const saved = localStorage.getItem('linguistai_stage');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedLanguage(data.language);
      setSelectedLevel(data.level);
      setSelectedTeacherId(data.teacherId);
      setSelectedTopicId(data.topicId);
      setHasSavedStage(false);
    }
  };

  const startSession = async () => {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      setConnectionError('API Key não encontrada. Verifique o arquivo .env');
      return;
    }

    setConnectionError(null);
    setConnectionStatus('connecting');

    try {
      // Solicitar microfone ANTES de conectar
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch (micErr) {
      console.error('Microfone negado:', micErr);
      setConnectionError('Permissão de microfone negada. Ative para continuar.');
      setConnectionStatus('idle');
      return;
    }

    const ai = new GoogleGenAI({ apiKey });
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId)!;
    const topic = TOPICS.find(t => t.id === selectedTopicId)!;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    console.log('Gemini Live API: Iniciando conexão com config...', {
      model: 'gemini-2.0-flash-exp',
      modalities: [Modality.AUDIO, Modality.TEXT]
    });
    const sessionPromise = ai.live.connect({
      model: 'gemini-2.0-flash-exp',
      config: {
        responseModalities: [Modality.AUDIO],
        tools: [
          {
            functionDeclarations: [
              {
                name: 'next_phrase',
                description: 'Moves to the next pronunciation practice phrase.',
              }
            ]
          }
        ],

        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: teacher.voice } }
        },
        systemInstruction: {
          parts: [{
            text: teacher.isKidMode
              ? `
              PERSONA: Kevin
              - Professor NATIVO dos EUA (Inglês), Espanha (Espanhol) ou França (Francês).
              - Fala como uma criança de 9 anos (tom leve, agudo, entusiasmado), mas é um gênio da pedagogia.
              - Idioma Alvo: ${selectedLanguage === Language.ENGLISH ? 'Inglês' : selectedLanguage === Language.SPANISH ? 'Espanhol' : 'Francês'}.

              ESTRUTURA DA AULA (3 FASES OBRIGATÓRIAS):
              
              IMPORTANTE: NÍVEL ${selectedLevel}
              ${selectedLevel === Level.BEGINNER
                ? '⚠️ MODO BÁSICO: Explique TUDO em Português. Use o idioma alvo apenas para ensinar as frases e palavras, mas dê todas as instruções e correções em PORTUGUÊS para o aluno não se perder.'
                : 'MODO IMERSÃO: Fale 95% no idioma alvo. Use português apenas se o aluno travar muito.'}

              FASE 1: ACOLHIMENTO E RAPPORT
              - Inicie em Português (especialmente se for Básico).
              - Seja caloroso e amigável.
              - QUANDO MUDAR: Assim que o aluno sinalizar, vá para a Fase 2.

              FASE 2: AULA ESPECÍFICA (IDIOMA ALVO)
              - Tópico: ${topic.name}
              - Prompt Específico: "${topic.prompt}"
              ${selectedLevel === Level.BEGINNER ? '- Mantenha as explicações em Português, peça para o aluno repetir as frases no idioma alvo.' : '- Fale 100% no IDIOMA ALVO.'}

              FASE 3: CONVERSAÇÃO LIVRE
              - Após concluir o exercício, converse livremente.
              `
              : `
              PERSONA: ${teacher.name}
              - Professor(a) NATIVO(A) de: ${selectedLanguage === Language.ENGLISH ? 'EUA/UK' : selectedLanguage === Language.SPANISH ? 'Espanha' : 'França'}.
              - Idioma Alvo: ${selectedLanguage === Language.ENGLISH ? 'Inglês' : selectedLanguage === Language.SPANISH ? 'Espanhol' : 'Francês'}.

              ESTRUTURA DA AULA (3 FASES OBRIGATÓRIAS):

              IMPORTANTE: NÍVEL ${selectedLevel}
              ${selectedLevel === Level.BEGINNER
                ? '⚠️ MODO BÁSICO ATIVADO: O aluno é iniciante. Você DEVE dar explicações, feedback e instruções em PORTUGUÊS. Fale a frase no idioma alvo, mas explique o significado em português.'
                : 'MODO IMERSÃO: REGRA ABSOLUTA: 95% da aula deve ser conduzida em ' + (selectedLanguage === Language.ENGLISH ? 'INGLÊS' : selectedLanguage === Language.SPANISH ? 'ESPANHOL' : 'FRANCÊS') + '.'}

              FASE 1: ACOLHIMENTO (PORTUGUÊS)
              - Inicie ou responda em Português para criar conforto.
              - TRANSIÇÃO: Quando sentir que o aluno está pronto, inicie o tópico.

              FASE 2: AULA ESPECÍFICA
              - Tópico: ${topic.name}
              - Instrução da Atividade: ${topic.prompt}
              ${selectedLevel === Level.BEGINNER ? '- Explique o conceito em Português, dê o exemplo no Idioma Alvo, peça para repetir.' : '- A partir daqui, IMERSÃO TOTAL no idioma alvo.'}

              FASE 3: CONVERSAÇÃO LIVRE
              - Expanda para uma conversa natural.
              ${selectedLevel === Level.BEGINNER ? '- Mantenha o suporte em português quando necessário.' : '- Evite português a todo custo.'}

              NÍVEL DO ALUNO: ${selectedLevel}
              `
          }]
        },
      },
      callbacks: {
        onopen: async () => {
          console.log('Gemini Live API: Conexão aberta');
          isConnectedRef.current = true;
          setConnectionStatus('connected');
          setTimeout(() => {
            if (!isConnectedRef.current) return;
            try {
              // Usar o stream já obtido
              const stream = mediaStreamRef.current!;
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              processor.onaudioprocess = (e) => {
                if (!isConnectedRef.current) return;

                const inputData = e.inputBuffer.getChannelData(0);

                // Calcular nível do áudio para a barra visual com mais sensibilidade
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                // Multiplicador de 1500 (era 1000) para detectar sons mais baixos
                const level = Math.min(100, rms * 1500);

                // Atualiza o nível visual sempre que houver áudio
                setAudioLevel(level);

                if (level > 1) {
                  console.log(`Audio Activity: Level ${level.toFixed(1)}% (RMS: ${rms.toFixed(5)})`);
                }

                const int16 = new Int16Array(inputData.length);
                for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                sessionPromise.then(session => {
                  if (isConnectedRef.current) {
                    try {
                      session.sendRealtimeInput({
                        media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' }
                      });
                    } catch (e) {
                      console.error('Erro ao enviar áudio:', e);
                    }
                  }
                });
              };
              source.connect(processor);
              processor.connect(audioContextRef.current!.destination);
              console.log('Gemini Live API: Microfone iniciado após delay');
            } catch (err) {
              console.error('Erro ao iniciar processamento de áudio:', err);
            }
          }, 1000); // 1 segundo de delay para estabilizar a conexão
        },
        onmessage: async (msg: LiveServerMessage) => {
          console.log('Gemini Live API: Mensagem recebida', msg);
          const parts = msg.serverContent?.modelTurn?.parts;

          if (parts) {
            for (const part of parts) {
              if (part.text) {
                const newText = part.text;
                setCurrentCaption(prev => prev + newText);
              }

              if (part.inlineData?.data) {
                const audioData = part.inlineData.data;
                setIsTeacherSpeaking(true);
                const ctx = outputAudioContextRef.current!;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                    setIsTeacherSpeaking(false);
                    // Opcional: Limpar legenda após um tempo ou quando parar de falar
                    setTimeout(() => {
                      if (sourcesRef.current.size === 0) setCurrentCaption('');
                    }, 2000);
                  }
                };
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                sourcesRef.current.add(source);
              }
            }
          }


          if (msg.toolCall) {
            for (const call of msg.toolCall.functionCalls) {
              if (call.name === 'next_phrase') {
                console.log('Gemini Live API: Comando next_phrase detectado');
                setCurrentPhraseIndex(prev => Math.min(PRONUNCIATION_PHRASES.length - 1, prev + 1));

                // Responder à ferramenta
                sessionRef.current?.then((session: any) => {
                  session.sendToolResponse({
                    functionResponses: [{
                      name: 'next_phrase',
                      response: { result: 'Frase alterada com sucesso' },
                      id: call.id
                    }]
                  });
                });
              }
            }
          }



          if (msg.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            setIsTeacherSpeaking(false);
            setCurrentCaption('');
          }
        },
        onclose: (ev) => {
          console.log('Gemini Live API: Conexão fechada', ev);
          isConnectedRef.current = false;
          setConnectionStatus('idle');
          if (ev.code !== 1000) {
            console.error(`Gemini Live API: Conexão encerrada subitamente (Código: ${ev.code}, Razão: ${ev.reason})`);
            setConnectionError(`Conexão perdida (Erro ${ev.code}: ${ev.reason || 'Desconhecido'}). Verifique sua API Key ou região.`);
            // Removendo reload automático para permitir ler o erro
            // setTimeout(() => window.location.reload(), 3000);
          }
        },
        onerror: (e) => {
          console.error('Gemini Live API: Erro detalhado na conexão:', e);
          if (e instanceof Error) {
            console.error('Mensagem de erro:', e.message);
          } else if (typeof e === 'object') {
            console.error('JSON Erro:', JSON.stringify(e));
          }
          isConnectedRef.current = false;
          setConnectionStatus('idle');
          setConnectionError('Erro de conexão com a IA. Tente trocar de professor ou verifique sua conexão.');
        }
      }
    });

    sessionPromise.catch(e => {
      console.error('Gemini Live API: Falha na conexão:', e);
      setConnectionError('Falha ao iniciar sessão: ' + (e.message || 'Erro desconhecido'));
    });
    sessionRef.current = sessionPromise;
    setStep('call');
  };

  const endCall = () => {
    window.location.reload();
  };

  const currentTeacher = TEACHERS.find(t => t.id === selectedTeacherId) || TEACHERS[0];

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-8 animate-in fade-in duration-1000">
          <div className="relative group">
            <div className="w-32 h-32 bg-orange-600 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 relative z-10 transition-transform group-hover:scale-110">
              <BrainCircuit className="w-16 h-16 text-white" />
            </div>
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">{currentTeacher?.name?.split(' ')[1] || 'Malina'} <span className="text-orange-500">Live</span></h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-md mx-auto">
              Aprenda idiomas com a energia e o carisma de nossos professores. Uma experiência imersiva e real.
            </p>
          </div>
          <button
            onClick={() => {
              setStep('setup');
              setSelectedTeacherId(TEACHERS[0].id); // Default to Malina
            }}
            className="px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-full font-black text-xl flex items-center gap-3 transition-all hover:gap-5 shadow-2xl shadow-orange-600/30"
          >
            Começar Experiência <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {step === 'setup' && (
        <div className="flex-1 flex items-center justify-center p-4 md:p-6 animate-in slide-in-from-bottom-12 duration-500 overflow-y-auto">
          <div className="max-w-xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-8 space-y-6 md:space-y-8 shadow-2xl my-4">
            <div className="text-center space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-white">Configurar Aula</h2>
              <p className="text-slate-400 text-sm md:text-base">Escolha como quer interagir com {currentTeacher?.name.split(' ')[1] || 'IA'} hoje.</p>
            </div>

            {hasSavedStage && (
              <button
                onClick={loadSavedStage}
                className="w-full p-4 bg-orange-600/20 border border-orange-500/50 rounded-2xl text-orange-500 font-bold flex items-center justify-center gap-2 hover:bg-orange-600/30 transition-all"
              >
                <Bookmark className="w-5 h-5" /> Retomar Aula Anterior
              </button>
            )}

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Escolha o Idioma
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: Language.ENGLISH, label: 'English', flag: '🇺🇸' },
                    { id: Language.SPANISH, label: 'Español', flag: '🇪🇸' },
                    { id: Language.FRENCH, label: 'Français', flag: '🇫🇷' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        // Auto-select the first teacher of the new language
                        const firstTeacher = TEACHERS.find(t => t.language === lang.id);
                        if (firstTeacher) setSelectedTeacherId(firstTeacher.id);
                      }}
                      className={`p-3 md:p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedLanguage === lang.id
                        ? 'border-orange-500 bg-orange-500/20 text-white scale-105 shadow-xl'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                    >
                      <span className="text-2xl md:text-3xl">{lang.flag}</span>
                      <span className="font-black text-sm md:text-base">{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" /> Escolha seu Professor
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TEACHERS.filter(t => t.language === selectedLanguage).map(teacher => (
                    <button
                      key={teacher.id}
                      onClick={() => setSelectedTeacherId(teacher.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedTeacherId === teacher.id
                        ? 'border-orange-500 bg-orange-500/20 text-white scale-105 shadow-xl'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                    >
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/10">
                        <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-center">
                        <span className="font-black text-xs md:text-sm block">{teacher.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{teacher.accent}</span>
                      </div>
                    </button>
                  ))}
                  {TEACHERS.filter(t => t.language === selectedLanguage).length === 0 && (
                    <div className="col-span-2 text-center py-2 text-slate-500 text-xs italic">
                      Selecione um idioma primeiro
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Settings className="w-4 h-4" /> Seu Nível
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[Level.BEGINNER, Level.INTERMEDIATE, Level.ADVANCED].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`py-4 rounded-2xl border-2 text-xs font-black transition-all ${selectedLevel === lvl
                        ? 'border-white bg-white text-black'
                        : 'border-white/10 text-slate-400 hover:border-white/20'
                        }`}
                    >
                      {lvl === Level.BEGINNER ? 'BÁSICO' : lvl === Level.INTERMEDIATE ? 'MÉDIO' : 'PRO'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Bookmark className="w-4 h-4" /> Escolha o Tópico
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TOPICS.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedTopicId === topic.id
                        ? 'border-orange-500 bg-orange-500/20 text-white shadow-xl'
                        : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                    >
                      <span className="text-xl">{topic.icon}</span>
                      <span className="font-black text-xs text-left leading-tight">{topic.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              disabled={!selectedLanguage || !selectedTeacherId || connectionStatus === 'connecting'}
              onClick={startSession}
              className="w-full py-4 md:py-6 bg-white text-black hover:bg-orange-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed rounded-full font-black text-xl md:text-2xl transition-all flex items-center justify-center gap-4 shadow-xl"
            >
              {connectionStatus === 'connecting' ? 'Conectando...' : `Conectar com ${currentTeacher?.name?.split(' ')[1] || 'IA'}`} <Mic className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {connectionError && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-500 text-sm font-bold text-center animate-in fade-in zoom-in duration-300">
                {connectionError}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'call' && (
        <div className="flex-1 flex flex-col relative bg-slate-950 overflow-hidden">
          {/* Ambient Background */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/30 rounded-full blur-[150px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px]"></div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 w-full max-w-6xl mx-auto overflow-hidden">
            <div className={`relative transition-all duration-500 z-20 ${selectedTopicId === 'pronunciation' ? '-mb-12 scale-90' : 'mb-8 md:mb-16'}`}>
              {/* Dynamic Aura */}
              <div className={`absolute inset-[-80px] rounded-full blur-[120px] transition-all duration-1000 ${isTeacherSpeaking ? 'bg-orange-500/40 opacity-100 scale-125' : 'bg-slate-800/10 opacity-0 scale-95'
                }`}></div>

              {/* Avatar Frame */}
              <div className={`relative rounded-full overflow-hidden border-8 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] 
                ${selectedTopicId === 'pronunciation' ? 'w-32 h-32 md:w-40 md:h-40 border-4 bg-slate-950' : 'w-64 h-64 md:w-80 md:h-80'} 
                ${isTeacherSpeaking ? 'border-orange-500 scale-105 rotate-1' : 'border-white/10 scale-100 rotate-0'
                }`}>
                <img
                  src={currentTeacher.avatar}
                  alt={currentTeacher.name}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>

              {/* Talking Indicator */}
              <div className={`absolute left-1/2 -translate-x-1/2 bg-white text-black rounded-[2rem] flex items-center gap-5 shadow-2xl z-20 justify-center transition-all
                ${selectedTopicId === 'pronunciation'
                  ? 'bottom-2 px-3 py-1.5 min-w-[120px] scale-75'
                  : '-bottom-10 px-8 py-4 min-w-[240px]'}`}>
                <div className={`flex gap-1.5 items-end ${selectedTopicId === 'pronunciation' ? 'h-3 w-5' : 'h-6 w-10'}`}>
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`w-2 bg-black rounded-full transition-all duration-300 ${isTeacherSpeaking ? 'animate-bounce h-full' : 'h-2'}`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400 leading-none">Status</span>
                  <span className={`font-black uppercase tracking-tight ${selectedTopicId === 'pronunciation' ? 'text-[10px]' : 'text-sm'}`}>
                    {isTeacherSpeaking ? 'Falando' : 'Ouvindo...'}
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Feedback Meter - Hide in Pronunciation mode to reduce clutter */}
            <div className={`mb-4 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-top-6 w-full max-w-xs transition-opacity duration-300 ${audioLevel > 5 && selectedTopicId !== 'pronunciation' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] text-center">
                Iniciando Conversa
              </div>
              <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[3px] shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 rounded-full transition-all duration-75 ease-out"
                  style={{ width: `${Math.max(5, audioLevel)}%`, boxShadow: audioLevel > 15 ? '0 0 25px rgba(249, 115, 22, 0.6)' : 'none' }}
                ></div>
              </div>
            </div>

            <div className={`text-center space-y-2 transition-all duration-500 ${selectedTopicId === 'pronunciation' ? 'hidden' : 'mb-4 md:mb-12'}`}>
              <h3 className="text-2xl md:text-6xl font-black tracking-tight flex items-center justify-center gap-2 md:gap-5">
                {currentTeacher.name} <Sparkles className="w-5 h-5 md:w-10 md:h-10 text-orange-500 animate-pulse" />
              </h3>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.5em] text-[8px] md:text-sm">Sua Guia Linguística Imersiva</p>
            </div>

            {/* Pronunciation Target UI - UPDATED FOR IDEA B */}
            {/* Pronunciation Target UI - UPDATED FOR IDEA B */}
            {selectedTopicId === 'pronunciation' && (
              <div className="w-full max-w-xl bg-slate-900/95 border-2 border-orange-500 rounded-[2rem] p-8 mb-8 shadow-2xl relative z-50 mx-auto flex flex-col items-center gap-6">

                {/* Header Badge */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                    Modo Treinamento • {PRONUNCIATION_PHRASES[currentPhraseIndex]?.level || 'N/A'}
                  </span>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Leia em voz alta</p>
                </div>

                {/* Main Text */}
                <div className="w-full text-center">
                  <p className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight drop-shadow-lg">
                    "{PRONUNCIATION_PHRASES[currentPhraseIndex]?.text || 'Carregando...'}"
                  </p>
                </div>

                {/* Translation */}
                <div className="text-slate-400 text-sm italic font-medium">
                  "{PRONUNCIATION_PHRASES[currentPhraseIndex]?.translation || ''}"
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between w-full pt-4 border-t border-white/10 mt-2">
                  <button
                    onClick={() => setCurrentPhraseIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentPhraseIndex === 0}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <ArrowRight className="w-6 h-6 rotate-180 text-white" />
                  </button>

                  <span className="text-xs font-black text-slate-500 bg-black/30 px-3 py-1 rounded-lg">
                    {currentPhraseIndex + 1} / {PRONUNCIATION_PHRASES.length}
                  </span>

                  <button
                    onClick={() => setCurrentPhraseIndex(prev => Math.min(PRONUNCIATION_PHRASES.length - 1, prev + 1))}
                    disabled={currentPhraseIndex === PRONUNCIATION_PHRASES.length - 1}
                    className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <ArrowRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Subtitles Area */}
            <div className={`mt-auto mb-4 px-6 py-3 w-full max-w-4xl min-h-[80px] flex items-center justify-center bg-black/40 backdrop-blur-xl rounded-[2rem] border border-white/5 transition-all duration-500 ${currentCaption ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
              }`}>
              <p className="text-xl md:text-3xl font-bold text-center bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent leading-relaxed italic">
                {currentCaption ? `"${currentCaption}"` : 'Fale naturalmente...'}
              </p>
            </div>

            {showSaveSuccess && (
              <div className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full font-black text-xs animate-bounce shadow-lg flex items-center gap-2">
                <Bookmark className="w-4 h-4" /> Aula Salva com Sucesso!
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="pb-6 pt-2 flex items-center justify-center gap-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-30">
            <button className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group">
              <Volume2 className="w-8 h-8 text-slate-400 group-hover:text-white" />
            </button>

            <div className="relative group">
              <div className={`absolute inset-0 bg-orange-600 rounded-full blur-3xl transition-all ${audioLevel > 10 ? 'opacity-60 scale-125' : 'opacity-20 group-hover:opacity-40'}`}></div>
              <div
                className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${audioLevel > 10
                  ? 'bg-orange-500 scale-95 border-white shadow-[0_0_50px_rgba(249,115,22,0.6)]'
                  : 'bg-orange-600 border-white/10'
                  }`}
              >
                <Mic className={`w-12 h-12 text-white ${audioLevel > 10 ? 'animate-pulse' : ''}`} />
              </div>
            </div>

            <button
              onClick={endCall}
              className="p-6 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all shadow-xl group"
            >
              <PhoneOff className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Persistent Info Overlay */}
      {step === 'call' && (
        <div className="absolute top-10 left-10 z-40 flex items-center gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-4 rounded-[2rem] shadow-2xl transition-all h-[80px]">
          <div className="relative">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ring-2 ring-orange-500/20">M</div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-950 transition-colors duration-500 ${connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]'
              }`}></div>
          </div>
          <div className="flex flex-col justify-center">
            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2 mb-0.5">
              Sessão Ativa
              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black transition-all duration-500 ${connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                }`}>
                {connectionStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-sm font-bold text-white/90 leading-tight">
              {currentTeacher.name} • {
                selectedLanguage === Language.ENGLISH ? 'Inglês' :
                  selectedLanguage === Language.SPANISH ? 'Espanhol' :
                    'Francês'
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

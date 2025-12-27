
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { Language, Level, Teacher, Topic } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import {
  Mic, MicOff, PhoneOff, Settings, Volume2,
  Sparkles, Globe, ShieldCheck, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key
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
  const { user, loading, signOut } = useAuth();
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
      const phrase = PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex];
      // Safety check in case dictionary access fails (TS fix + runtime safety)
      if (phrase && sessionRef.current) {
        console.log('Enviando contexto de pronúncia para IA:', phrase.text);
        sessionRef.current.then((session: any) => {
          session.send({
            parts: [{ text: `CONTEXTO ATUALIZADO: O aluno vai ler a seguinte frase agora: "${phrase.text}". Avalie com rigor.` }]
          });
        });
      }
    }
  }, [currentPhraseIndex, selectedTopicId, selectedLanguage]);

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

  if (loading) {
    return (
      <div className="h-screen w-full bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const startSession = async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    console.log('DEBUG: API Key lida:', apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : 'NENHUMA');

    if (!apiKey) {
      setConnectionError('API Key não encontrada. Verifique o arquivo .env (VITE_GEMINI_API_KEY)');
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

    // Instanciando com a versão v1beta conforme solicitado
    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId)!;
    const topic = TOPICS.find(t => t.id === selectedTopicId)!;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    console.log('Gemini Live API: Iniciando conexão com config...', {
      model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
      modalities: [Modality.AUDIO, Modality.TEXT]
    });
    const sessionPromise = ai.live.connect({
      model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
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
              - CRITICAL: VOCÊ É UM PROFESSOR BRASILEIRO DIVERTIDO.
              - Sua língua nativa é Português do Brasil (PT-BR).

              NÍVEL SELECIONADO: ${selectedLevel}
              DIRETRIZES POR NÍVEL:
              ${selectedLevel === Level.BEGINNER ? `
              1. MODO INICIANTE (90% PT-BR / 10% IDIOMA ALVO):
                 - Explique TUDO em Português do Brasil primeiro.
                 - Apresente o idioma alvo DEVAGAR, palavra por palavra.
                 - Valide constantemente: "Entendeu?", "Quer que eu repita?".
                 - Foco: Construir confiança básica.
              ` : selectedLevel === Level.INTERMEDIATE ? `
              1. MODO INTERMEDIÁRIO (50% PT-BR / 50% IDIOMA ALVO):
                 - Explique conceitos novos em Português.
                 - Dê instruções e comandos já no idioma alvo.
                 - Foco: Frases completas, entonação e ritmo (sotaque).
                 - Corrija a pronúncia de forma natural, repetindo a frase corretamente.
              ` : `
              1. MODO PRO (100% IDIOMA ALVO):
                 - IMERSÃO TOTAL. Não fale Português, a menos que o aluno implore.
                 - Fale em velocidade natural/nativa.
                 - Use vocabulário avançado e expressões idiomáticas.
                 - Se o aluno errar, peça para reformular sem traduzir.
              `}
              
              IDIOMA ALVO: ${selectedLanguage === Language.ENGLISH ? 'Inglês' : selectedLanguage === Language.SPANISH ? 'Espanhol' : 'Francês'}
              Tópico: ${topic.name}
              Instrução: "${topic.prompt}"

              Seja o amigo legal! Use gírias leves do Brasil (tipo "né", "beleza") quando falar português.
              `
              : `
              PERSONA: ${teacher.name}
              - CRITICAL: VOCÊ É UM(A) PROFESSOR(A) BRASILEIRO(A).
              - Sua voz e identidade são brasileiras.

              NÍVEL SELECIONADO: ${selectedLevel}
              
              PROTOCOLO DE ENSINO (RIGOROSO):
              ${selectedLevel === Level.BEGINNER ? `
              --- MODO INICIANTE (FOCO: EXPLICAÇÃO CLARA) ---
              1. IDIOMA DE COMANDO: Português do Brasil (PT-BR).
              2. METODOLOGIA:
                 - Fale o termo no idioma alvo LENTAMENTE e CLARAMENTE.
                 - Traduza imediatamente para o Português.
                 - Verifique a compreensão a cada passo.
                 - Exemplo: "Agora vamos dizer 'Good Morning'. Repita comigo: Good... Morning."
              3. FEEDBACK: Sempre em PT-BR, muito encorajador.
              ` : selectedLevel === Level.INTERMEDIATE ? `
              --- MODO INTERMEDIÁRIO (50% PT-BR / 50% IDIOMA ALVO) ---
              1. IDIOMA DE COMANDO: Híbrido (50% Português / 50% Idioma Alvo).
              2. METODOLOGIA:
                 - Use o idioma alvo para interações sociais e frases comuns.
                 - Use Português do Brasil para explicar erros complexos ou gramática.
                 - Foco total na PRONÚNCIA e ENTONAÇÃO (Accent Reduction).
                 - Se o aluno errar, dê o modelo correto da frase inteira e peça para repetir.
              ` : `
              --- MODO PRO (FOCO: IMERSÃO TOTAL) ---
              1. IDIOMA DE COMANDO: 100% IDIOMA ALVO (${selectedLanguage}).
              2. METODOLOGIA:
                 - Aja como um nativo que não fala português (a menos que seja emergência).
                 - Discuta nuances, sarcasmo, cultura e expressões idiomáticas.
                 - Velocidade de fala: Natural/Rápida.
                 - Correções: Sutis e diretas, sem meta-explicação.
              `}

              IDIOMA ALVO: ${selectedLanguage === Language.ENGLISH ? 'Inglês' : selectedLanguage === Language.SPANISH ? 'Espanhol' : 'Francês'}
              Tópico: ${topic.name}
              Contexto: ${topic.prompt}
              `
          }]
        },
      },
      callbacks: {
        onopen: async () => {
          console.log('Gemini Live API: Conexão aberta');
          isConnectedRef.current = true;
          setConnectionStatus('connected');

          // START MODIFICATION: Send initial phrase context if in pronunciation mode
          if (selectedTopicId === 'pronunciation') {
            const firstPhrase = PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[0];
            if (firstPhrase) {
              console.log('Sending initial pronunciation phrase:', firstPhrase.text);
              sessionPromise.then(session => {
                session.send({
                  parts: [{ text: `CONTEXTO INICIAL: A primeira frase que o aluno vai ler é: "${firstPhrase.text}". Aguarde ele ler. NÃO invente outra frase.` }]
                });
              });
            }
          }
          // END MODIFICATION
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
                // Filtrar "pensamentos" que aparecem entre asteriscos ou parecem logs internos.
                if (!newText.startsWith('*') && !newText.includes('**')) {
                  setCurrentCaption(prev => prev + newText);
                }
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
                setCurrentPhraseIndex(prev => Math.min(PRONUNCIATION_PHRASES[selectedLanguage].length - 1, prev + 1));

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
    <div className="h-[100dvh] w-full flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">

          {/* Header / Logout */}
          <div className="absolute top-6 left-6 z-50">
            <button
              onClick={signOut}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-2xl text-xs font-bold border border-white/5 transition-all flex items-center gap-2.5 backdrop-blur-md active:scale-95"
            >
              <Key className="w-3.5 h-3.5" /> Sair da Conta
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center space-y-8 md:space-y-12 max-w-2xl w-full z-10 mt-[-40px]">

            {/* Logo */}
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[60px] md:blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <div className="w-32 h-32 md:w-56 md:h-56 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                <img src="/logo.png" alt="LinguistAI Logo" className="w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-500 drop-shadow-2xl">
                Lingua<span className="text-orange-500">Flow</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-2xl font-medium max-w-md md:max-w-xl mx-auto leading-relaxed">
                Aprenda idiomas com a energia de professores nativos. <span className="text-slate-200">Imersão real.</span>
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setStep('setup');
                setSelectedTeacherId(TEACHERS[0].id);
              }}
              className="group relative px-8 py-4 md:px-12 md:py-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-full font-black text-lg md:text-2xl flex items-center gap-3 md:gap-4 transition-all hover:scale-105 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(249,115,22,0.5)] active:scale-95"
            >
              <span className="relative z-10">Começar Experiência</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-1 transition-transform relative z-10" />
            </button>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-0 w-full text-center z-10">
            <p className="text-slate-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] hover:text-slate-500 transition-colors cursor-default">
              Criado por Paulinho Fernando
            </p>
          </div>
        </div>
      )}

      {
        step === 'setup' && (
          <div className="flex-1 flex justify-center p-4 md:p-6 pb-24 md:pb-6 animate-in slide-in-from-bottom-12 duration-500 overflow-y-auto w-full">
            <div className="max-w-7xl w-full bg-slate-950/90 backdrop-blur-2xl border border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 space-y-8 shadow-2xl my-auto relative overflow-hidden flex flex-col">

              {/* Background FX */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-[100px]"></div>

              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="w-full md:w-auto flex justify-center md:justify-start">
                  <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-500" /> Configurar Sessão
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  {hasSavedStage && (
                    <button
                      onClick={loadSavedStage}
                      className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-orange-500/20"
                    >
                      <Bookmark className="w-3.5 h-3.5" /> Retomar Aula
                    </button>
                  )}
                  <button
                    onClick={signOut}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl text-xs font-bold border border-white/5 transition-all flex items-center gap-2"
                  >
                    <Key className="w-3.5 h-3.5" /> Sair
                  </button>
                </div>
              </div>
              <p className="text-slate-400 text-sm md:text-lg max-w-2xl leading-relaxed z-10 text-center md:text-left">
                Personalize sua experiência de imersão. Escolha idioma, nível, tópico e seu professor ideal.
              </p>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 flex-1">

                {/* Left Column: Settings */}
                <div className="lg:col-span-5 space-y-8">

                  {/* Language */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-orange-500" /> Idioma
                    </label>
                    <div className="grid grid-cols-1 gap-2.5">
                      {[
                        { id: Language.ENGLISH, label: 'Inglês', native: 'English', flagUrl: 'https://flagcdn.com/w80/us.png' },
                        { id: Language.SPANISH, label: 'Espanhol', native: 'Español', flagUrl: 'https://flagcdn.com/w80/es.png' },
                        { id: Language.FRENCH, label: 'Francês', native: 'Français', flagUrl: 'https://flagcdn.com/w80/fr.png' }
                      ].map(lang => (
                        <button
                          key={lang.id}
                          onClick={() => {
                            setSelectedLanguage(lang.id);
                            setCurrentPhraseIndex(0);
                            const firstTeacher = TEACHERS.find(t => t.language === lang.id);
                            if (firstTeacher) setSelectedTeacherId(firstTeacher.id);
                          }}
                          className={`p-3.5 rounded-xl border transition-all flex items-center gap-4 group relative overflow-hidden ${selectedLanguage === lang.id
                            ? 'border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-transparent'
                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                            }`}
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${selectedLanguage === lang.id ? 'bg-orange-500' : 'bg-transparent'}`}></div>
                          <img src={lang.flagUrl} alt={lang.label} className="w-10 h-7 object-cover rounded shadow-sm" />
                          <div className="flex flex-col items-start">
                            <span className={`font-bold text-sm ${selectedLanguage === lang.id ? 'text-white' : 'text-slate-300'}`}>{lang.label}</span>
                            <span className="text-[10px] text-slate-500">{lang.native}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-orange-500" /> Nível
                    </label>
                    <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/5">
                      {[
                        { id: Level.BEGINNER, label: 'BÁSICO' },
                        { id: Level.INTERMEDIATE, label: 'MÉDIO' },
                        { id: Level.ADVANCED, label: 'PRO' }
                      ].map(lvl => (
                        <button
                          key={lvl.id}
                          onClick={() => setSelectedLevel(lvl.id)}
                          className={`flex-1 py-2.5 rounded-lg text-[10px] font-black transition-all ${selectedLevel === lvl.id
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500/80 italic pl-1">
                      {selectedLevel === Level.BEGINNER ? 'Explicações em Português' : selectedLevel === Level.INTERMEDIATE ? 'Imersão Híbrida (50/50)' : 'Imersão Total (Nativo)'}
                    </p>
                  </div>

                  {/* Topic */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-orange-500" /> Tópico
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {TOPICS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTopicId(t.id)}
                          className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${selectedTopicId === t.id
                            ? 'border-orange-500 bg-orange-500/10 text-white'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                          <span className="text-lg">{t.icon}</span>
                          <span className="font-bold text-[10px] uppercase leading-tight line-clamp-1">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Teacher & Action */}
                <div className="lg:col-span-7 flex flex-col h-full space-y-6">
                  <div className="flex-1 flex flex-col min-h-[400px] bg-slate-900/50 rounded-3xl border border-white/5 overflow-hidden">
                    <div className="p-4 border-b border-white/5 bg-white/5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <BrainCircuit className="w-3.5 h-3.5 text-orange-500" /> Professores Disponíveis
                      </label>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
                      {TEACHERS.filter(t => t.language === selectedLanguage).map(teacher => (
                        <button
                          key={teacher.id}
                          onClick={() => setSelectedTeacherId(teacher.id)}
                          className={`w-full relative group transition-all duration-300 text-left`}
                        >
                          <div className={`p-4 rounded-2xl border flex items-start gap-4 transition-all ${selectedTeacherId === teacher.id
                            ? 'bg-slate-800 border-orange-500/50 shadow-lg'
                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}>

                            <div className={`relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 shrink-0 ${selectedTeacherId === teacher.id ? 'border-orange-500' : 'border-white/10'}`}>
                              <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-bold text-sm md:text-base ${selectedTeacherId === teacher.id ? 'text-white' : 'text-slate-200'}`}>{teacher.name}</span>
                                {selectedTeacherId === teacher.id && <div className="px-2 py-0.5 bg-orange-500 text-white text-[9px] font-bold uppercase rounded-full">Selecionado</div>}
                              </div>
                              <span className="text-[10px] text-orange-400/80 font-bold uppercase tracking-wider block mb-1.5">{teacher.accent}</span>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{teacher.bio}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      {TEACHERS.filter(t => t.language === selectedLanguage).length === 0 && (
                        <div className="py-20 text-center text-slate-500 flex flex-col items-center justify-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Globe className="w-6 h-6 opacity-30" />
                          </div>
                          <p>Selecione um idioma para ver os professores</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Start Button */}
                  <div key={selectedLanguage + selectedTeacherId}>
                    <button
                      onClick={startSession}
                      disabled={connectionStatus === 'connecting' || !selectedLanguage || !selectedTeacherId}
                      className="w-full py-5 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-orange-600/20 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {connectionStatus === 'connecting' ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" /> Conectando...
                        </>
                      ) : (
                        <>
                          Iniciar Sessão <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {connectionError && (
                    <div className="w-full mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-xs font-medium">
                      {connectionError}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        step === 'call' && (
          <div className="flex-1 flex flex-col relative bg-slate-950 overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600/30 rounded-full blur-[150px]"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[150px]"></div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 w-full max-w-6xl mx-auto overflow-hidden">
              <div className={`relative transition-all duration-500 z-40 ${selectedTopicId === 'pronunciation' ? '-mb-12 scale-90' : 'mb-8 md:mb-16'}`}>
                {/* Dynamic Aura */}
                <div className={`absolute inset-[-80px] rounded-full blur-[120px] transition-all duration-1000 ${isTeacherSpeaking ? 'bg-orange-500/40 opacity-100 scale-125' : 'bg-slate-800/10 opacity-0 scale-95'
                  }`}></div>

                {/* Avatar Frame */}
                <div className={`relative rounded-full overflow-hidden border-8 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,0.9)] 
                ${selectedTopicId === 'pronunciation' ? 'w-32 h-32 md:w-40 md:h-40 border-4 bg-slate-950' : 'w-48 h-48 md:w-80 md:h-80'} 
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
                    : '-bottom-10 px-6 py-3 md:px-8 md:py-4 min-w-[200px] md:min-w-[240px]'}`}>
                  <div className={`flex gap-1.5 items-end ${selectedTopicId === 'pronunciation' ? 'h-3 w-5' : 'h-4 w-8 md:h-6 md:w-10'}`}>
                    {[1, 2, 3].map(i => (
                      <div key={i} className={`w-2 bg-black rounded-full transition-all duration-300 ${isTeacherSpeaking ? 'animate-bounce h-full' : 'h-2'}`} style={{ animationDelay: `${i * 0.2}s` }}></div>
                    ))}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 leading-none">Status</span>
                    <span className={`font-black uppercase tracking-tight ${selectedTopicId === 'pronunciation' ? 'text-[10px]' : 'text-xs md:text-sm'}`}>
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
                <div className="w-full max-w-xl bg-slate-900/95 border-2 border-orange-500 rounded-[2rem] p-8 mb-8 shadow-2xl relative z-30 mx-auto flex flex-col items-center gap-6">

                  {/* Header Badge */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] bg-orange-500/10 px-4 py-1.5 rounded-full border border-orange-500/20">
                      Modo Treinamento • {PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex]?.level || 'N/A'}
                    </span>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Leia em voz alta</p>
                  </div>

                  {/* Main Text */}
                  <div className="w-full text-center">
                    <p className="text-2xl md:text-4xl font-black text-white leading-snug tracking-tight drop-shadow-lg">
                      "{PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex]?.text || 'Carregando...'}"
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="text-slate-400 text-sm italic font-medium">
                    "{PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex]?.translation || ''}"
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
                      {currentPhraseIndex + 1} / {PRONUNCIATION_PHRASES[selectedLanguage as Language]?.length || 0}
                    </span>

                    <button
                      onClick={() => setCurrentPhraseIndex(prev => Math.min((PRONUNCIATION_PHRASES[selectedLanguage as Language]?.length || 1) - 1, prev + 1))}
                      disabled={currentPhraseIndex === (PRONUNCIATION_PHRASES[selectedLanguage as Language]?.length || 1) - 1}
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
                <p className="text-lg md:text-3xl font-bold text-center bg-gradient-to-r from-white via-white/80 to-white bg-clip-text text-transparent leading-relaxed italic">
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
            <div className="pb-6 pt-2 flex items-center justify-center gap-4 md:gap-8 bg-gradient-to-t from-slate-950 via-slate-950 to-transparent z-30">
              <button className="p-4 md:p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group">
                <Volume2 className="w-6 h-6 md:w-8 md:h-8 text-slate-400 group-hover:text-white" />
              </button>

              <div className="relative group">
                <div className={`absolute inset-0 bg-orange-600 rounded-full blur-3xl transition-all ${audioLevel > 10 ? 'opacity-60 scale-125' : 'opacity-20 group-hover:opacity-40'}`}></div>
                <div
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all border-4 ${audioLevel > 10
                    ? 'bg-orange-500 scale-95 border-white shadow-[0_0_50px_rgba(249,115,22,0.6)]'
                    : 'bg-orange-600 border-white/10'
                    }`}
                >
                  <Mic className={`w-8 h-8 md:w-12 md:h-12 text-white ${audioLevel > 10 ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <button
                onClick={endCall}
                className="p-4 md:p-6 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-[2rem] hover:bg-rose-500 hover:text-white transition-all shadow-xl group"
              >
                <PhoneOff className="w-6 h-6 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        )
      }

      {/* Persistent Info Overlay */}
      {
        step === 'call' && (
          <div className="absolute top-4 left-4 md:top-10 md:left-10 z-40 flex items-center gap-3 md:gap-4 bg-white/5 backdrop-blur-2xl border border-white/10 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl transition-all h-[60px] md:h-[80px]">
            <div className="relative">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-sm md:text-xl shadow-lg ring-2 ring-orange-500/20">M</div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-slate-950 transition-colors duration-500 ${connectionStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_15px_#10b981]' : 'bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]'
                }`}></div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-[8px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2 mb-0.5">
                Sessão Ativa
                <span className={`px-1.5 py-0.5 rounded-full text-[6px] md:text-[8px] font-black transition-all duration-500 ${connectionStatus === 'connected' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                  }`}>
                  {connectionStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}
                </span>
              </div>
              <div className="text-xs md:text-sm font-bold text-white/90 leading-tight">
                {currentTeacher.name} • {
                  selectedLanguage === Language.ENGLISH ? 'Inglês' :
                    selectedLanguage === Language.SPANISH ? 'Espanhol' :
                      'Francês'
                }
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default App;

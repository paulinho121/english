import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { Language, Level, Teacher, Topic } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import {
  Mic, MicOff, PhoneOff, Settings, Volume2,
  Sparkles, Globe, ShieldCheck, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key, Flag
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
    if (!apiKey) {
      setConnectionError('API Key não encontrada. Verifique o arquivo .env (VITE_GEMINI_API_KEY)');
      return;
    }

    setConnectionError(null);
    setConnectionStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
    } catch (micErr) {
      console.error('Microfone negado:', micErr);
      setConnectionError('Permissão de microfone negada. Ative para continuar.');
      setConnectionStatus('idle');
      return;
    }

    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId)!;
    const topic = TOPICS.find(t => t.id === selectedTopicId)!;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    console.log('Gemini Live API: Iniciando conexão...');
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

          if (selectedTopicId === 'pronunciation') {
            const firstPhrase = PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[0];
            if (firstPhrase) {
              sessionPromise.then(session => {
                session.send({
                  parts: [{ text: `CONTEXTO INICIAL: A primeira frase que o aluno vai ler é: "${firstPhrase.text}". Aguarde ele ler. NÃO invente outra frase.` }]
                });
              });
            }
          }
          setTimeout(() => {
            if (!isConnectedRef.current) return;
            try {
              const stream = mediaStreamRef.current!;
              const source = audioContextRef.current!.createMediaStreamSource(stream);
              const processor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
              processor.onaudioprocess = (e) => {
                if (!isConnectedRef.current) return;

                const inputData = e.inputBuffer.getChannelData(0);

                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                const rms = Math.sqrt(sum / inputData.length);
                const level = Math.min(100, rms * 1500);

                setAudioLevel(level);

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
              console.log('Gemini Live API: Microfone iniciado');
            } catch (err) {
              console.error('Erro ao iniciar processamento de áudio:', err);
            }
          }, 1000);
        },
        onmessage: async (msg: LiveServerMessage) => {
          const parts = msg.serverContent?.modelTurn?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.text) {
                const newText = part.text;
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
                setCurrentPhraseIndex(prev => Math.min(PRONUNCIATION_PHRASES[selectedLanguage].length - 1, prev + 1));
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
            setConnectionError(`Conexão perdida (Erro ${ev.code}). Verifique sua API Key ou região.`);
          }
        },
        onerror: (e) => {
          console.error('Gemini Live API: Erro:', e);
          isConnectedRef.current = false;
          setConnectionStatus('idle');
          setConnectionError('Erro de conexão com a IA.');
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
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden relative">
      <div className="bg-animated">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden animate-in fade-in duration-1000">

          {/* Header / Logout */}
          <div className="absolute top-6 left-6 z-50">
            <button
              onClick={signOut}
              className="px-5 py-2.5 glass-premium rounded-full text-slate-300 text-xs font-bold transition-all flex items-center gap-2.5 hover:text-white"
            >
              <Key className="w-3.5 h-3.5" /> Sair
            </button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col items-center justify-center space-y-10 md:space-y-14 max-w-2xl w-full z-10 mt-[-40px]">

            {/* Logo */}
            <div className="relative group cursor-default">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-[80px] group-hover:opacity-100 opacity-60 transition-opacity duration-1000"></div>
              <div className="w-32 h-32 md:w-56 md:h-56 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-2">
                <img src="/logo.png" alt="LinguistAI Logo" className="w-full h-full object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)]" />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-6xl md:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-2xl">
                Lingua<span className="text-gradient-primary">Flow</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-2xl font-light max-w-md md:max-w-xl mx-auto leading-relaxed">
                Imersão real com professores nativos de IA. <br />
                <span className="text-white font-medium">Fale como se estivesse lá.</span>
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setStep('setup');
                setSelectedTeacherId(TEACHERS[0].id);
              }}
              className="btn-primary px-10 py-5 rounded-full text-xl md:text-3xl flex items-center gap-4 hover:scale-105"
            >
              <span>Começar Experiência</span>
              <ArrowRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-0 w-full text-center z-10">
            <p className="text-slate-600 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] hover:text-slate-500 transition-colors cursor-default">
              Criado por Paulinho Fernando
            </p>
          </div>
        </div>
      )}

      {
        step === 'setup' && (
          <div className="flex-1 flex justify-center p-4 md:p-6 pb-24 md:pb-6 animate-in slide-in-from-bottom-12 duration-500 overflow-y-auto w-full">
            <div className="max-w-7xl w-full glass-premium rounded-[3rem] p-6 md:p-12 space-y-8 my-auto relative overflow-hidden flex flex-col">

              {/* Header */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
                <div className="w-full md:w-auto text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-display font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3">
                    <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-orange-500" /> Configurar Sessão
                  </h2>
                  <p className="text-slate-400 text-sm md:text-lg mt-2 font-light">
                    Personalize sua imersão. Escolha idioma, nível e mentor.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {hasSavedStage && (
                    <button
                      onClick={loadSavedStage}
                      className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-orange-500/20"
                    >
                      <Bookmark className="w-3.5 h-3.5" /> Retomar
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

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 flex-1">

                {/* Left Column: Settings */}
                <div className="lg:col-span-5 space-y-8">

                  {/* Language */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-orange-500" /> Idioma
                    </label>
                    <div className="grid grid-cols-1 gap-3">
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
                          className={`p-4 rounded-2xl border transition-all flex items-center gap-4 group relative overflow-hidden ${selectedLanguage === lang.id
                            ? 'border-orange-500/50 bg-white/5'
                            : 'border-transparent bg-white/5 hover:bg-white/10'
                            }`}
                        >
                          <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${selectedLanguage === lang.id ? 'bg-orange-500' : 'bg-transparent'}`}></div>
                          <img src={lang.flagUrl} alt={lang.label} className="w-12 h-8 object-cover rounded-md shadow-sm opacity-80 group-hover:opacity-100 transition-opacity" />
                          <div className="flex flex-col items-start z-10">
                            <span className={`font-display font-bold text-lg ${selectedLanguage === lang.id ? 'text-white' : 'text-slate-300'}`}>{lang.label}</span>
                            <span className="text-xs text-slate-500 font-medium">{lang.native}</span>
                          </div>
                          {selectedLanguage === lang.id && <Sparkles className="w-5 h-5 text-orange-500 ml-auto animate-pulse" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5 text-orange-500" /> Nível
                    </label>
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      {[
                        { id: Level.BEGINNER, label: 'BÁSICO' },
                        { id: Level.INTERMEDIATE, label: 'MÉDIO' },
                        { id: Level.ADVANCED, label: 'PRO' }
                      ].map(lvl => (
                        <button
                          key={lvl.id}
                          onClick={() => setSelectedLevel(lvl.id)}
                          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${selectedLevel === lvl.id
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {lvl.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500/80 italic pl-1 text-center font-medium">
                      {selectedLevel === Level.BEGINNER ? 'Explicações em Português' : selectedLevel === Level.INTERMEDIATE ? 'Imersão Híbrida (50/50)' : 'Imersão Total (Nativo)'}
                    </p>
                  </div>

                  {/* Topic */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                      <LayoutGrid className="w-3.5 h-3.5 text-orange-500" /> Tópico
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {TOPICS.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTopicId(t.id)}
                          className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-2 ${selectedTopicId === t.id
                            ? 'border-orange-500/50 bg-orange-500/10 text-white'
                            : 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                          <span className="text-2xl">{t.icon}</span>
                          <span className="font-bold text-xs uppercase leading-tight">{t.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Teacher & Action */}
                <div className="lg:col-span-7 flex flex-col h-full space-y-6">
                  <div className="flex-1 flex flex-col min-h-[400px] bg-white/5 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-sm">
                    <div className="p-6 border-b border-white/5 bg-white/5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <BrainCircuit className="w-3.5 h-3.5 text-orange-500" /> Professores Disponíveis
                      </label>
                    </div>

                    <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar flex-1 relative">
                      {TEACHERS.filter(t => t.language === selectedLanguage).map(teacher => (
                        <button
                          key={teacher.id}
                          onClick={() => setSelectedTeacherId(teacher.id)}
                          className={`w-full relative group transition-all duration-300 text-left rounded-2xl overflow-hidden`}
                        >
                          <div className={`p-4 flex items-start gap-5 transition-all ${selectedTeacherId === teacher.id
                            ? 'bg-white/10 border border-orange-500/30'
                            : 'bg-transparent border border-transparent hover:bg-white/5'
                            }`}>

                            <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 shrink-0 shadow-lg ${selectedTeacherId === teacher.id ? 'border-orange-500 shadow-orange-500/20' : 'border-white/10'}`}>
                              <img src={teacher.avatar} alt={teacher.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1 min-w-0 py-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className={`font-display font-bold text-lg ${selectedTeacherId === teacher.id ? 'text-white' : 'text-slate-200'}`}>{teacher.name}</span>
                                {selectedTeacherId === teacher.id && <div className="px-3 py-1 bg-orange-500 text-white text-[9px] font-black uppercase rounded-full">Selecionado</div>}
                              </div>
                              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block mb-2">{teacher.accent}</span>
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">{teacher.bio}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                      {TEACHERS.filter(t => t.language === selectedLanguage).length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 gap-4">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                            <Globe className="w-8 h-8 opacity-30" />
                          </div>
                          <p className="font-medium">Selecione um idioma</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Start Button */}
                  <div key={selectedLanguage + selectedTeacherId}>
                    <button
                      onClick={startSession}
                      disabled={connectionStatus === 'connecting' || !selectedLanguage || !selectedTeacherId}
                      className="btn-primary w-full py-6 rounded-2xl text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group shadow-2xl shadow-orange-900/40"
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
                    <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-2xl text-center text-sm font-medium backdrop-blur-md">
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
          <div className="flex-1 flex flex-col relative overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 w-full max-w-6xl mx-auto overflow-hidden">

              {/* Teacher Display */}
              <div className={`relative transition-all duration-500 z-40 ${selectedTopicId === 'pronunciation' ? '-mb-12 scale-90' : 'mb-8 md:mb-16'}`}>
                {/* Dynamic Aura - More subtle and premium */}
                <div className={`absolute inset-[-40px] rounded-full blur-[60px] transition-all duration-1000 ${isTeacherSpeaking ? 'bg-orange-500/20 opacity-100 scale-110' : 'bg-transparent opacity-0 scale-95'
                  }`}></div>

                {/* Avatar Frame */}
                <div className={`relative rounded-full overflow-hidden border-4 transition-all duration-700 shadow-[0_0_60px_rgba(0,0,0,0.5)] 
                ${selectedTopicId === 'pronunciation' ? 'w-32 h-32 md:w-40 md:h-40 bg-slate-950' : 'w-48 h-48 md:w-80 md:h-80'} 
                ${isTeacherSpeaking ? 'border-orange-500 scale-105' : 'border-white/10 scale-100'
                  }`}>
                  <img
                    src={currentTeacher.avatar}
                    alt={currentTeacher.name}
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                </div>

                {/* Status Indicator */}
                <div className={`absolute left-1/2 -translate-x-1/2 glass-premium border-white/10 rounded-full flex items-center gap-4 justify-center transition-all px-6 py-2
                ${selectedTopicId === 'pronunciation'
                    ? 'bottom-0 translate-y-1/2 scale-75'
                    : '-bottom-8 min-w-[160px]'}`}>

                  <div className={`flex gap-1 items-end h-4`}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className={`w-1 bg-orange-500 rounded-full transition-all duration-150 ${isTeacherSpeaking ? 'animate-[bounce_0.8s_infinite]' : 'h-1 opacity-30'}`} style={{ height: isTeacherSpeaking ? '100%' : '20%', animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {isTeacherSpeaking ? 'Falando' : 'Ouvindo'}
                  </span>
                </div>
              </div>

              {/* Teacher Info */}
              <div className={`text-center space-y-2 transition-all duration-500 ${selectedTopicId === 'pronunciation' ? 'hidden' : 'mb-4 md:mb-12'}`}>
                <h3 className="text-3xl md:text-6xl font-display font-black tracking-tight text-white flex items-center justify-center gap-3">
                  {currentTeacher.name} <Sparkles className="w-5 h-5 md:w-8 md:h-8 text-orange-500 animate-pulse" />
                </h3>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">Sua Guia Linguística Imersiva</p>
              </div>

              {/* Pronunciation Target UI */}
              {selectedTopicId === 'pronunciation' && (
                <div className="w-full max-w-xl glass-premium border border-orange-500/30 rounded-[2.5rem] p-8 mb-8 shadow-2xl relative z-30 mx-auto flex flex-col items-center gap-8 animate-in slide-in-from-bottom-24">

                  {/* Header Badge */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20">
                      Modo Treinamento
                    </span>
                  </div>

                  {/* Main Text */}
                  <div className="w-full text-center space-y-4">
                    <p className="text-3xl md:text-5xl font-display font-black text-white leading-tight tracking-tight drop-shadow-lg text-glow">
                      "{PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex]?.text || 'Carregando...'}"
                    </p>
                    <div className="text-slate-400 text-lg italic font-medium">
                      "{PRONUNCIATION_PHRASES[selectedLanguage as Language]?.[currentPhraseIndex]?.translation || ''}"
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between w-full pt-6 border-t border-white/5">
                    <button
                      onClick={() => setCurrentPhraseIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentPhraseIndex === 0}
                      className="p-4 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                    >
                      <ArrowRight className="w-6 h-6 rotate-180 text-white" />
                    </button>

                    <div className="flex flex-col items-center">
                      <span className="text-2xl font-black text-white">{currentPhraseIndex + 1}</span>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500">de {PRONUNCIATION_PHRASES[selectedLanguage as Language]?.length || 0}</span>
                    </div>

                    <button
                      onClick={() => setCurrentPhraseIndex(prev => Math.min(PRONUNCIATION_PHRASES[selectedLanguage]?.length - 1, prev + 1))}
                      disabled={currentPhraseIndex === (PRONUNCIATION_PHRASES[selectedLanguage]?.length || 0) - 1}
                      className="p-4 rounded-full bg-orange-500 hover:bg-orange-400 text-white disabled:opacity-30 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all active:scale-95 shadow-lg shadow-orange-500/20"
                    >
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Caption */}
            {currentCaption && (
              <div className="absolute bottom-10 left-0 w-full px-6 flex justify-center z-50">
                <div className="bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl max-w-4xl text-center border-l-4 border-orange-500 shadow-2xl animate-in slide-in-from-bottom-5">
                  <p className="text-lg md:text-2xl text-white font-medium leading-relaxed">
                    {currentCaption}
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      }
    </div>
  );
};

export default App;

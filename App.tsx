import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Type } from "@google/genai";
import { Language, Level, Teacher, Topic, SessionReportData } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { supabase } from './lib/supabase';
import { JourneyMap } from './components/JourneyMap';
import { hotmartService } from './lib/hotmart_integration';
import {
  Mic, MicOff, PhoneOff, Settings, Sparkles, Globe, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key, Flag, Flame, AlertTriangle
} from 'lucide-react';

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
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [hasSavedStage, setHasSavedStage] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // New Progress States
  const [streak, setStreak] = useState(0);
  const [topicProgress, setTopicProgress] = useState<Record<string, number>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isKidsMode, setIsKidsMode] = useState(false);
  const [sessionReport, setSessionReport] = useState<SessionReportData | null>(null);


  // Monetization States
  const [isPremium, setIsPremium] = useState(false);
  const [dailyMinutesUsed, setDailyMinutesUsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const teacherPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('linguistai_stage');
    if (saved) setHasSavedStage(true);

    const loadProgress = async () => {
      if (!user) return;

      const isAdmin = user.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com';

      const { data: profile } = await supabase.from('profiles').select('streak_count, last_language, last_level, last_teacher_id, last_topic_id, is_premium, daily_minutes_used').eq('id', user.id).single();

      if (isAdmin) {
        setIsPremium(true);
      } else if (profile) {
        setIsPremium(profile.is_premium || false);
      } else {
        setIsPremium(false);
      }

      if (profile) {
        setStreak(profile.streak_count || 0);
        setDailyMinutesUsed(profile.daily_minutes_used || 0);
        if (profile.last_language) setSelectedLanguage(profile.last_language as Language);
        if (profile.last_level) setSelectedLevel(profile.last_level as Level);
        if (profile.last_teacher_id) setSelectedTeacherId(profile.last_teacher_id);
        if (profile.last_topic_id) setSelectedTopicId(profile.last_topic_id);
      }

      const { data: progressData } = await supabase.from('user_progress').select('topic_id, score').eq('user_id', user.id);

      const newProgress: Record<string, number> = {};
      if (progressData) {
        progressData.forEach(p => {
          newProgress[p.topic_id] = p.score || 0;
        });
      }
      setTopicProgress(newProgress);
    };

    loadProgress();
  }, [user]);

  // Force premium for admin
  useEffect(() => {
    if (user?.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com') {
      console.log('Admin identified:', user.email);
      setIsPremium(true);
    }
  }, [user]);

  // Handle auto-scroll to teacher panel on mobile when topic selected
  useEffect(() => {
    if (selectedTopicId && window.innerWidth < 1024) {
      teacherPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTopicId]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user]);

  // Auto-save session state to profile
  useEffect(() => {
    const saveSessionState = async () => {
      if (!user) return;
      await supabase.from('profiles').update({
        last_language: selectedLanguage,
        last_level: selectedLevel,
        last_teacher_id: selectedTeacherId,
        last_topic_id: selectedTopicId,
        last_seen: new Date().toISOString()
      }).eq('id', user.id);
    };

    if (selectedLanguage || selectedLevel || selectedTeacherId || selectedTopicId) {
      const timeout = setTimeout(saveSessionState, 1000); // Debounce to avoid excessive updates
      return () => clearTimeout(timeout);
    }
  }, [user, selectedLanguage, selectedLevel, selectedTeacherId, selectedTopicId]);

  // Session Timer for Monetization
  useEffect(() => {
    if (step !== 'call' || isPremium) return;

    const FREE_LIMIT_MINUTES = 10;
    const interval = setInterval(() => {
      if (sessionStartTime) {
        const elapsedMinutes = (Date.now() - sessionStartTime) / 60000;
        const totalUsed = dailyMinutesUsed + elapsedMinutes;

        if (totalUsed >= FREE_LIMIT_MINUTES) {
          endCall();
          setShowUpgradeModal(true);
          setConnectionError("Limite diário de 10 minutos atingido (Grátis).");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [step, isPremium, sessionStartTime, dailyMinutesUsed]);

  const startSession = async () => {
    if (!isPremium && dailyMinutesUsed >= 10) {
      setShowUpgradeModal(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      setConnectionError('API Key não encontrada.');
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass(); // Use native sample rate (often 44.1k or 48k)
    outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

    try {
      if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
      if (outputAudioContextRef.current.state === 'suspended') await outputAudioContextRef.current.resume();
    } catch (e) { console.warn(e); }

    setConnectionError(null);
    setConnectionStatus('connecting');
    setSessionStartTime(Date.now());

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      mediaStreamRef.current = stream;
      stream.getAudioTracks().forEach(track => track.enabled = !isMuted);
    } catch (micErr) {
      setConnectionError('Permissão de microfone negada.');
      setConnectionStatus('idle');
      return;
    }

    const ai = new GoogleGenAI({ apiKey, apiVersion: 'v1beta' });
    const teacher = TEACHERS.find(t => t.id === selectedTeacherId)!;
    const topic = TOPICS.find(t => t.id === selectedTopicId)!;

    console.log('Gemini Live API: Iniciando conexão...');

    try {
      const sessionPromise = ai.live.connect({
        model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          tools: [
            { functionDeclarations: [{ name: 'next_phrase', description: 'Next phrase' }] },
            {
              functionDeclarations: [{
                name: 'save_session_report',
                description: 'Saves the student performance report at the end of the session.',
                parameters: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER, description: 'Overall score from 0 to 100' },
                    mistakes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          mistake: { type: Type.STRING },
                          correction: { type: Type.STRING }
                        }
                      }
                    },
                    vocabulary: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          word: { type: Type.STRING },
                          translation: { type: Type.STRING }
                        }
                      }
                    },
                    tip: { type: Type.STRING, description: 'A helpful tip from the teacher' }
                  },
                  required: ['score', 'mistakes', 'vocabulary', 'tip']
                }
              }]
            }
          ],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: teacher.voice } } },
          // @ts-ignore - The SDK types might not be fully updated yet
          voiceActivityDetection: {
            silenceDurationMs: 1500, // Reduced from 2000 to be more responsive/detect ends faster
            minimizeNoise: true
          },
          systemInstruction: {
            parts: [{
              text: `
              VOCÊ É UM PROFESSOR REAL DE IDIOMAS. Sua missão é ensinar, encorajar e guiar o aluno para a fluência.
              
              PERSONA: ${teacher.name} (${teacher.language}).
              NÍVEL DO ALUNO: ${selectedLevel}.
              PROTOCOLO PEDAGÓGICO OBRIGATÓRIO POR NÍVEL:

              ${selectedLevel === Level.BEGINNER ? `
              - NÍVEL BÁSICO (Protocolo "Safe Path"):
                1. Use 80% Português e 20% ${teacher.language}.
                2. Fale frases curtas e pausadas.
                3. Se o aluno errar, corrija IMEDIATAMENTE de forma gentil em português, explique a regra brevemente e peça para ele repetir.
                4. Encoraje o tempo todo ("Muito bem!", "Isso mesmo!").
                5. Use vocabulário do dia a dia.
              ` : ''}

              ${selectedLevel === Level.INTERMEDIATE ? `
              - NÍVEL MÉDIO (Protocolo "Bridge to Fluency"):
                1. Use 50% Português e 50% ${teacher.language}.
                2. Comece frases em ${teacher.language} e use português apenas para traduzir conceitos complexos ou palavras novas.
                3. Incentive o aluno a elaborar frases completas. Se ele responder com uma palavra, pergunte "Como você diria isso em uma frase completa?".
                4. Introduza expressões comuns (phrasal verbs/idioms).
              ` : ''}

              ${selectedLevel === Level.ADVANCED ? `
              - NÍVEL PRO (Protocolo "High Immersion"):
                1. Use 100% ${teacher.language}. NUNCA fale português.
                2. Fale em velocidade natural de um nativo.
                3. Foco em nuances: sugira sinônimos mais sofisticados ou formas mais naturais de dizer algo.
                4. Desafie o aluno com perguntas complexas e debates.
                5. O feedback deve ser técnico e refinado.
              ` : ''}

              DIRETRIZES GERAIS DE ENSINO:
              - TÓPICO DA AULA: ${topic.name}.
              - CONTEXTO: ${topic.prompt}.
              - SEJA PROATIVO: Inicie a conversa imediatamente. Não espere o aluno.
              - FOCO AUDITIVO: Ignore ruídos secundários (TV, trânsito). Foque apenas na voz ativa do aluno.

              ${isKidsMode ? `
              KIDS MODE ACTIVE:
              - Sua linguagem deve ser extremamente simples, lúdica e encorajadora.
              - Use metáforas de desenhos animados e jogos.
              - Se o aluno errar, diga "Ops! Quase lá! Vamos tentar de novo?" em vez de apenas corrigir.
              - Seja um amigo imaginário divertido, não apenas um professor.
              ` : ''}

              - ENCERRAMENTO: Quando o aluno quiser parar, você DEVE gerar o relatório técnico final via 'save_session_report'.

            `
            }]
          },
        },
        callbacks: {
          onopen: async () => {
            console.log('Gemini Live API: Conexão aberta');
            isConnectedRef.current = true;
            setConnectionStatus('connected');

            // Trigger Teacher Initiative via Text
            sessionPromise.then(session => {
              // Sends a text turn to force generation
              // @ts-ignore
              session.sendRealtimeInput({
                turns: [{
                  role: 'user',
                  parts: [{ text: `[[SISTEMA]] O aluno entrou. Comece a aula agora. Apresente-se como ${teacher.name} e inicie o tópico ${topic.name}.` }]
                }],
                turnComplete: true
              } as any);
            });

            setTimeout(() => {
              if (!isConnectedRef.current || !mediaStreamRef.current || !audioContextRef.current) return;
              const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
              const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

              const inputSampleRate = audioContextRef.current.sampleRate;
              const targetSampleRate = 16000;

              processor.onaudioprocess = (e) => {
                if (!isConnectedRef.current) return;
                const inputData = e.inputBuffer.getChannelData(0);

                // Audio Level Vis
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
                setAudioLevel(Math.min(100, Math.sqrt(sum / inputData.length) * 1500));

                // Downsampling Logic (Averaging)
                if (inputSampleRate !== targetSampleRate) {
                  const ratio = inputSampleRate / targetSampleRate;
                  const newLength = Math.floor(inputData.length / ratio);
                  const result = new Int16Array(newLength);

                  for (let i = 0; i < newLength; i++) {
                    const startOffset = Math.floor(i * ratio);
                    const endOffset = Math.floor((i + 1) * ratio);
                    let sampleSum = 0;
                    let sampleCount = 0;

                    for (let j = startOffset; j < endOffset && j < inputData.length; j++) {
                      sampleSum += inputData[j];
                      sampleCount++;
                    }

                    const avgSample = sampleCount > 0 ? sampleSum / sampleCount : 0;

                    const clamped = Math.max(-1, Math.min(1, avgSample));
                    result[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
                  }

                  sessionPromise.then(session => {
                    session.sendRealtimeInput({ media: { data: encode(new Uint8Array(result.buffer)), mimeType: 'audio/pcm;rate=16000' } });
                  });
                } else {
                  // Native 16k handling
                  const int16 = new Int16Array(inputData.length);
                  for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
                  sessionPromise.then(session => {
                    session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
                  });
                }
              };

              const muteGain = audioContextRef.current.createGain();
              muteGain.gain.value = 0;
              source.connect(processor);
              processor.connect(muteGain); // Prevent feedback loop
              muteGain.connect(audioContextRef.current.destination);
            }, 500);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const parts = msg.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.text && !part.text.startsWith('*')) setCurrentCaption(p => p + part.text);

                // Handle Function Calls
                const call = part.functionCall;
                if (call) {
                  if (call.name === 'save_session_report') {
                    const report = call.args as unknown as SessionReportData;
                    setSessionReport(report);

                    // Automatically save real score to Supabase
                    if (selectedTopicId && user) {
                      await supabase.from('user_progress').upsert({
                        user_id: user.id,
                        topic_id: selectedTopicId,
                        score: report.score,
                        status: report.score >= 80 ? 'completed' : 'unlocked'
                      }, { onConflict: 'user_id, topic_id' });

                      setTopicProgress(prev => ({ ...prev, [selectedTopicId]: report.score }));
                    }

                    // Respond to the tool call so the model knows it was successful
                    sessionPromise.then(session => {
                      session.sendRealtimeInput({
                        turns: [{
                          role: 'user',
                          parts: [{
                            functionResponse: {
                              name: 'save_session_report',
                              id: (call as any).id || '',
                              response: { result: 'success' }
                            }
                          }]
                        }],
                        turnComplete: true
                      } as any);
                    });
                  }
                }

                if (part.inlineData?.data) {
                  setIsTeacherSpeaking(true);
                  const ctx = outputAudioContextRef.current!;
                  const buffer = await decodeAudioData(decode(part.inlineData.data), ctx, 24000, 1);

                  const source = ctx.createBufferSource();
                  source.buffer = buffer;
                  source.connect(ctx.destination);

                  // Audio Queue Logic
                  // Ensure we don't schedule in the past
                  const currentTime = ctx.currentTime;
                  // Add a small buffer (50ms) if starting fresh to avoid glitch
                  const startTime = Math.max(currentTime, nextStartTimeRef.current);

                  source.start(startTime);
                  nextStartTimeRef.current = startTime + buffer.duration;

                  source.onended = () => {
                    sourcesRef.current.delete(source);
                    // Only set not speaking if queue is empty (approx check)
                    if (ctx.currentTime >= nextStartTimeRef.current - 0.1) {
                      setIsTeacherSpeaking(false);
                    }
                  };
                  sourcesRef.current.add(source);
                }
              }
            }
          },
          onclose: () => {
            isConnectedRef.current = false;
            setConnectionStatus('idle');
            nextStartTimeRef.current = 0; // Reset queue on close
          }
        }
      });
      sessionRef.current = sessionPromise;
      setStep('call');
    } catch (err: any) {
      console.error('Erro ao conectar Gemini:', err);
      setConnectionError('Falha ao conectar com a IA: ' + (err.message || 'Erro desconhecido'));
      setConnectionStatus('idle');
    }
  };

  const endCall = async () => {
    // Save usage if not premium
    if (sessionStartTime && !isPremium && user) {
      const elapsedMinutes = Math.ceil((Date.now() - sessionStartTime) / 60000);
      const newTotal = dailyMinutesUsed + elapsedMinutes;
      setDailyMinutesUsed(newTotal);
      await supabase.from('profiles').update({ daily_minutes_used: newTotal }).eq('id', user.id);
    }
    setSessionStartTime(null);

    // Update Progress
    if (selectedTopicId && user) {
      const currentProgress = topicProgress[selectedTopicId] || 0;
      const newProgress = Math.min(100, currentProgress + 20); // Increment by 20%

      setTopicProgress(prev => ({ ...prev, [selectedTopicId]: newProgress }));

      // Save to Supabase
      await supabase.from('user_progress').upsert({
        user_id: user.id,
        topic_id: selectedTopicId,
        score: newProgress,
        status: newProgress === 100 ? 'completed' : 'unlocked'
      }, { onConflict: 'user_id, topic_id' });
    }

    // Cleanup Resources
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    if (sessionRef.current) {
      try {
        const session = await sessionRef.current;
        // Attempt to close the session gracefully
        if (session.disconnect) session.disconnect();
        else if (session.close) session.close();
      } catch (e) {
        console.warn("Error closing session:", e);
      }
      sessionRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { await audioContextRef.current.close(); } catch (e) { console.warn(e); }
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      try { await outputAudioContextRef.current.close(); } catch (e) { console.warn(e); }
    }

    // Reset UI State
    setIsTeacherSpeaking(false);
    setCurrentCaption('');
    setConnectionStatus('idle');
    setSelectedTopicId(null); // Reset selection
    setStep('setup');
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsMuted(m => !m);
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-orange-500"><Loader2 className="animate-spin w-10 h-10" /></div>;


  if (!user) return <LoginScreen />;

  return (
    <main className={`h-[100dvh] w-full flex flex-col font-sans overflow-hidden relative bg-slate-950 text-white ${isKidsMode ? 'kids-mode' : ''}`}>

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {/* Offline/Reconnecting Overlay */}
      {(!isOnline || connectionStatus === 'connecting') && step === 'call' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4 p-8 glass-premium rounded-3xl border border-orange-500/20">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">
                {!isOnline ? 'Sem Conexão' : 'Conectando à IA...'}
              </h3>
              <p className="text-slate-400 text-sm">
                {!isOnline
                  ? 'Verifique sua internet para continuar a aula.'
                  : 'Establishando canal de áudio de alta fidelidade...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center relative p-6 text-center bg-mesh overflow-hidden">
          {/* Background Blobs - Enhanced */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="blob blob-1 mix-blend-screen" style={{ width: '60vw', height: '60vw', left: '-10%', top: '-20%' }}></div>
            <div className="blob blob-2 mix-blend-overlay" style={{ width: '50vw', height: '50vw', right: '0%', bottom: '-10%' }}></div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-4 z-30 animate-in fade-in slide-in-from-right-4 duration-1000">
            {/* Kids Mode Toggle */}
            <button
              onClick={() => setIsKidsMode(!isKidsMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-500 group pointer-events-auto ${isKidsMode ? 'bg-white text-[#ff6b6b] border-[#ff6b6b] shadow-[0_0_20px_rgba(255,107,107,0.3)]' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:border-orange-500/30'}`}
            >
              <div className={`p-1 rounded-full transition-transform duration-500 ${isKidsMode ? 'bg-[#ff6b6b] text-white rotate-[360deg]' : 'bg-slate-800 text-slate-500'}`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">{isKidsMode ? 'Modo Kids Ativo' : 'Ativar Modo Kids'}</span>
            </button>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md z-30 transition-colors ${isKidsMode ? 'bg-white/80 border-[#ff6b6b] text-[#ff6b6b]' : 'bg-slate-900/50 border-white/10 text-orange-100 group hover:border-orange-500/30'}`}>
              <Flame className={`w-5 h-5 animate-pulse ${isKidsMode ? 'text-[#ff6b6b] fill-[#ff6b6b]' : 'text-orange-500 fill-orange-500'}`} />
              <span className="font-bold">{streak} Dias</span>
            </div>
          </div>

          <div className="space-y-12 z-10 max-w-2xl relative">
            <div className="animate-float-slow transition-all duration-1000">
              <img
                src="/logo.png"
                className="w-44 h-44 md:w-52 md:h-52 mx-auto drop-shadow-[0_0_50px_rgba(249,115,22,0.5)] transform hover:scale-105 transition-transform duration-700"
              />
            </div>


            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight leading-[1.1]">
                {isKidsMode ? (
                  <span className="text-white drop-shadow-[0_5px_15px_rgba(255,107,107,0.4)]">
                    Mundo<span className="text-[#ff6b6b] text-glow animate-bounce-slow inline-block">Kids!</span>
                  </span>
                ) : (
                  <span className="text-white">
                    Lingua<span className="text-orange-500 text-glow">Flow</span>
                  </span>
                )}
              </h1>
              <p className={`text-sm md:text-xl font-medium max-w-sm md:max-w-md mx-auto leading-relaxed ${isKidsMode ? 'text-[#4b5563]' : 'text-slate-400'}`}>
                {isKidsMode
                  ? 'Aprenda inglês com aventuras mágicas, jogos e muitos amigos novos!'
                  : 'Sua jornada para a fluência começa aqui. Interaja, aprenda e domine.'}
              </p>
            </div>


            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
              <button
                onClick={() => { setStep('setup'); }}
                className="btn-shimmer px-8 py-4 md:px-14 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-2xl font-black flex items-center gap-4 mx-auto group shadow-2xl shadow-orange-500/10"
              >
                Continuar Jornada
                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>

          </div>
        </div>
      )}



      {step === 'setup' && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-4 md:p-8">
          <div className="max-w-5xl w-full mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-black flex items-center gap-3">
                  <Sparkles className="text-orange-500 shrink-0" /> {isKidsMode ? 'Mapa de Aventuras' : 'Mapa de Progresso'}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {isKidsMode
                    ? 'Explore mundos mágicos e aprenda brincando!'
                    : 'Domine novas línguas e expanda seus horizontes, uma missão de cada vez.'}
                </p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-sm text-orange-200">{streak} Dias</span>
                </div>
                <button
                  onClick={signOut}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-colors"
                  title="Sair"
                >
                  <Key className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[Language.ENGLISH, Language.SPANISH, Language.FRENCH].map(lang => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`p-4 rounded-2xl border font-bold uppercase transition-all flex flex-col items-center gap-2 ${selectedLanguage === lang ? 'bg-orange-500 text-white border-orange-500' : 'bg-white/5 border-white/10 text-slate-400'}`}
                >
                  <img
                    src={lang === Language.ENGLISH ? 'https://flagcdn.com/w80/us.png' : lang === Language.SPANISH ? 'https://flagcdn.com/w80/es.png' : 'https://flagcdn.com/w80/fr.png'}
                    alt={lang}
                    className="w-10 h-auto rounded shadow-sm object-cover"
                  />
                  <span>{lang}</span>
                </button>
              ))}
            </div>

            {selectedLanguage ? (
              <div className="flex flex-col lg:flex-row gap-8 overflow-x-hidden">
                {/* Journey Map */}
                <div className="flex-1">
                  <JourneyMap
                    topics={TOPICS.filter(t => isKidsMode ? t.isKidMode : !t.isKidMode)}
                    progress={topicProgress}
                    selectedTopicId={selectedTopicId}
                    onSelectTopic={(id) => setSelectedTopicId(id)}
                  />
                </div>

                {/* Right Panel: Teacher Selection */}
                <div ref={teacherPanelRef} className="lg:w-1/3 space-y-4 lg:sticky top-8 h-fit">
                  <div className="glass-premium p-5 rounded-3xl border border-white/10 flex flex-col max-h-[85vh]">
                    {/* Level Selector */}
                    <div className="mb-6">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-3 opacity-70">
                        <Settings className="w-3.5 h-3.5 text-orange-500" /> Nível de Dificuldade
                      </label>
                      <div className="flex bg-slate-900/40 p-1.5 rounded-2xl border border-white/5">
                        {[
                          { id: Level.BEGINNER, label: isKidsMode ? 'Nível 1' : 'Básico' },
                          { id: Level.INTERMEDIATE, label: isKidsMode ? 'Nível 2' : 'Médio' },
                          { id: Level.ADVANCED, label: isKidsMode ? 'Nível 3' : 'Pro' }
                        ].map(lvl => (
                          <button
                            key={lvl.id}
                            onClick={() => {
                              if (!isPremium && (lvl.id === Level.INTERMEDIATE || lvl.id === Level.ADVANCED)) {
                                setShowUpgradeModal(true);
                              } else {
                                setSelectedLevel(lvl.id);
                              }
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${selectedLevel === lvl.id
                              ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white shadow-lg shadow-black/20 border border-white/10'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                              }`}
                          >
                            {lvl.label}
                            {!isPremium && (lvl.id === Level.INTERMEDIATE || lvl.id === Level.ADVANCED) && (
                              <span className="bg-orange-500/10 p-0.5 rounded">
                                <Key className="w-3 h-3 text-orange-500" />
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Free Conversation Shortcut */}
                    <button
                      onClick={() => setSelectedTopicId('free-conversation')}
                      className={`w-full mb-6 p-4 rounded-[1.5rem] border transition-all flex items-center gap-4 group relative overflow-hidden ${selectedTopicId === 'free-conversation'
                        ? 'bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                        : 'bg-white/5 border-white/5 hover:border-indigo-500/30'
                        }`}
                    >
                      {selectedTopicId === 'free-conversation' && (
                        <div className="absolute top-0 right-0 p-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                        </div>
                      )}
                      <div className={`p-3 rounded-xl ${selectedTopicId === 'free-conversation' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'} transition-all duration-300`}>
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className={`font-black block text-sm tracking-tight ${selectedTopicId === 'free-conversation' ? 'text-white' : 'text-slate-300'}`}>
                          {isKidsMode ? 'Conversa Amiga' : 'Conversa Livre'}
                        </span>
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.1em] opacity-80">
                          {isKidsMode ? 'Fale o que quiser!' : 'Pratique sem roteiro'}
                        </span>
                      </div>
                    </button>

                    <div className="mb-5">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 opacity-70">
                        <BrainCircuit className="w-3.5 h-3.5 text-orange-500" /> {isKidsMode ? 'Escolha seu Amigo' : 'Escolha seu Mentor'}
                      </label>
                    </div>

                    {/* Teachers List */}
                    <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1 mb-4 min-h-[160px]">
                      {TEACHERS
                        .filter(t => t.language === selectedLanguage && (isKidsMode ? t.isKidMode : !t.isKidMode))
                        .map(teacher => {
                          const currentPool = TEACHERS.filter(t => t.language === selectedLanguage && (isKidsMode ? t.isKidMode : !t.isKidMode));
                          const isLocked = !isPremium && currentPool.indexOf(teacher) >= 2;
                          const isSelected = selectedTeacherId === teacher.id;


                          return (
                            <button
                              key={teacher.id}
                              onClick={() => {
                                if (isLocked) {
                                  setShowUpgradeModal(true);
                                } else {
                                  setSelectedTeacherId(teacher.id);
                                }
                              }}
                              className={`w-full group relative flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${isSelected
                                ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5'
                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                }`}
                            >
                              <div className="relative">
                                <img src={teacher.avatar} className={`w-11 h-11 rounded-xl object-cover border-2 transition-all duration-300 ${isSelected ? 'border-orange-500 shadow-lg shadow-orange-500/10' : 'border-slate-800'} ${isLocked ? 'grayscale opacity-50' : ''}`} />
                                {isSelected && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-slate-900 animate-pulse"></div>}
                              </div>
                              <div className="text-left flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`font-black text-sm tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>{teacher.name}</span>
                                  {isLocked && <span className="text-[8px] font-black bg-orange-500 text-white px-1 py-0.5 rounded border border-orange-400/50 uppercase tracking-tighter shadow-sm flex-shrink-0">PRO</span>}
                                </div>
                                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest block truncate opacity-70">{teacher.accent}</span>
                              </div>
                            </button>
                          );
                        })}
                    </div>

                    {/* Selected Mission Preview (Footer) */}
                    {selectedTopicId && (
                      <div className="pt-5 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-500">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-[0.25em] block mb-3 text-center">
                          {isKidsMode ? 'Tudo pronto para a aventura?' : 'Pronto para iniciar?'}
                        </label>
                        <div className="flex items-center gap-3 mb-4 bg-white/5 p-3 rounded-[1.25rem] border border-white/5">
                          <div className="p-3 bg-slate-900 rounded-xl text-2xl shadow-inner">{TOPICS.find(t => t.id === selectedTopicId)?.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="font-black text-white text-base tracking-tight truncate">{TOPICS.find(t => t.id === selectedTopicId)?.name}</div>
                            <div className="inline-flex items-center px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded-md mt-0.5">
                              <span className="text-[8px] text-orange-400 font-black uppercase tracking-widest">
                                {isKidsMode
                                  ? `Fase ${selectedLevel === Level.BEGINNER ? '1' : selectedLevel === Level.INTERMEDIATE ? '2' : '3'}`
                                  : `Nível ${selectedLevel === Level.BEGINNER ? 'Básico' : selectedLevel === Level.INTERMEDIATE ? 'Médio' : 'Pro'}`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {connectionError && (
                          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-bold animate-in fade-in slide-in-from-top-2 text-center flex items-center justify-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5" /> {connectionError}
                          </div>
                        )}

                        <button
                          onClick={startSession}
                          disabled={!selectedTopicId || connectionStatus === 'connecting'}
                          className="w-full relative group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                          <div className="relative flex items-center justify-center gap-3 bg-orange-500 py-4 rounded-[1rem] font-black text-white shadow-xl shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            {connectionStatus === 'connecting' ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="uppercase tracking-widest text-xs">Conectando...</span>
                              </>
                            ) : (
                              <>
                                <span className="uppercase tracking-widest text-base">
                                  {isKidsMode ? 'Começar Aventura!' : 'Iniciar Missão'}
                                </span>
                                <ArrowRight className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isKidsMode ? 'animate-bounce-hover' : ''}`} />
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">Selecione um idioma para ver o seu mapa.</div>
            )}
          </div>
        </div>
      )
      }

      {
        step === 'call' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

            {/* Pronunciation Card Overlay */}
            {selectedTopicId === 'pronunciation' && selectedLanguage && PRONUNCIATION_PHRASES[selectedLanguage] && (
              <div className="absolute top-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-20">
                <div className="glass-premium p-6 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-orange-500/20">
                        Frase {currentPhraseIndex + 1} de {PRONUNCIATION_PHRASES[selectedLanguage].length}
                      </span>
                      <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5">
                        {PRONUNCIATION_PHRASES[selectedLanguage][currentPhraseIndex]?.level || 'Geral'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPhraseIndex(p => Math.max(0, p - 1))}
                        disabled={currentPhraseIndex === 0}
                        className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => setCurrentPhraseIndex(p => Math.min(PRONUNCIATION_PHRASES[selectedLanguage!].length - 1, p + 1))}
                        disabled={currentPhraseIndex === PRONUNCIATION_PHRASES[selectedLanguage].length - 1}
                        className="p-2 hover:bg-white/10 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-3 leading-snug">
                    "{PRONUNCIATION_PHRASES[selectedLanguage][currentPhraseIndex]?.text}"
                  </h3>

                  <p className="text-slate-400 font-medium text-lg">
                    {PRONUNCIATION_PHRASES[selectedLanguage][currentPhraseIndex]?.translation}
                  </p>

                  <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                    <span>Diga a frase em voz alta</span>
                    <span className="flex items-center gap-1"><Sparkles className="w-3 h-3 text-orange-500" /> IA Ouvindo</span>
                  </div>
                </div>
              </div>
            )}

            <div className="relative mb-8">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-orange-500 shadow-[0_0_60px_rgba(249,115,22,0.4)] overflow-hidden transition-transform ${isTeacherSpeaking ? 'scale-105' : 'scale-100'}`}>
                <img src={TEACHERS.find(t => t.id === selectedTeacherId)?.avatar} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 glass-premium px-6 py-2 rounded-full border border-white/10 flex items-center gap-3">
                <div className="flex gap-1 h-8 items-end justify-center">
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      className={`w-1.5 bg-orange-500 rounded-full transition-all duration-75 ${isTeacherSpeaking ? 'animate-pulse h-2 opacity-50' : ''}`}
                      style={{
                        height: isTeacherSpeaking ? undefined : `${Math.max(6, audioLevel * (0.5 + (i % 2) * 0.4))}px`,
                        opacity: isTeacherSpeaking ? 0.5 : 1
                      }}
                    ></div>
                  ))}
                </div>
                <span className="text-[10px] uppercase font-black tracking-widest">{isTeacherSpeaking ? 'Ouvindo...' : 'Fale agora'}</span>
              </div>
            </div>

            {/* Dynamic Transcript */}
            {currentCaption && (
              <div className={`absolute bottom-32 max-w-2xl text-center px-4 animate-in slide-in-from-bottom-4 ${selectedTopicId === 'pronunciation' ? 'opacity-50 pointer-events-none' : ''}`}>
                <p className="text-xl md:text-2xl font-medium text-white drop-shadow-md bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">{currentCaption}</p>
              </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-8 flex items-center gap-6">
              <button onClick={toggleMute} className={`p-5 rounded-full ${isMuted ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-white'} hover:scale-105 transition-all`}>
                {isMuted ? <MicOff /> : <Mic />}
              </button>
              <button onClick={endCall} className="p-5 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg hover:scale-105 transition-all">
                <PhoneOff />
              </button>
            </div>
          </div>
        )
      }

      {step !== 'call' && (
        <div className="absolute bottom-6 left-0 right-0 py-4 text-center text-[10px] text-slate-700 font-medium z-10 flex flex-col gap-1 pointer-events-none">
          <p>&copy; 2026 Paulinho Fernando. Todos os direitos reservados.</p>
          {user && <p className="opacity-30">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
        </div>
      )}


      {/* Upgrade Modal */}
      {
        showUpgradeModal && (
          <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="w-full max-w-md mx-4 glass-premium p-8 rounded-[2.5rem] border border-orange-500/30 text-center relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl opacity-50"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/20 rotate-3">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>

                <h2 className="text-3xl font-display font-black text-white mb-3">Upgrade para o PRO</h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  {!isPremium && dailyMinutesUsed >= 10
                    ? "Você atingiu seu limite diário de 10 minutos gratuitos. Continue evoluindo sem limites!"
                    : "Desbloqueie todos os mentores, níveis avançados e tempo de conversação ilimitado."}
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      const url = hotmartService.getCheckoutUrl('YOUR_HOTMART_ID', user?.email);
                      window.open(url, '_blank');
                    }}
                    className="btn-primary w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform"
                  >
                    Assinar agora - R$ 49,90/mês
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Talvez mais tarde
                  </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 opacity-50 grayscale">
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[10px] font-black uppercase text-slate-500">Mentores</div>
                    <div className="text-sm font-bold text-white">Ilimitados</div>
                  </div>
                  <div className="w-1px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[10px] font-black uppercase text-slate-500">Feedback</div>
                    <div className="text-sm font-bold text-white">IA Avançada</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </main >
  );
};

export default App;

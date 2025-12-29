import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";
import { Language, Level, Teacher, Topic } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { supabase } from './lib/supabase';
import { JourneyMap } from './components/JourneyMap';
import {
  Mic, MicOff, PhoneOff, Settings, Sparkles, Globe, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key, Flag, Flame
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

  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const isConnectedRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('linguistai_stage');
    if (saved) setHasSavedStage(true);

    const loadProgress = async () => {
      if (!user) return;

      const { data: profile } = await supabase.from('profiles').select('streak_count').eq('id', user.id).single();
      if (profile) setStreak(profile.streak_count || 0);

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

  const startSession = async () => {
    // Check if topic is locked (unless it's the first one 'introduction' or 'free-conversation')
    // Logic: If previous topic < 100, current is locked? 
    // For now, valid logic: everything starts at 0. All visible. 
    // We enforce sequentiality by checking index if we want, but 'introduction' is first.
    // Let's assume JourneyMap handles 'locked' visual if 0 and previous is not 100?
    // Actually, requested behavior: "start at 0 and progress as they use".

    // ... rest of startSession logic remains ...
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

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
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

    const sessionPromise = ai.live.connect({
      model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        tools: [{ functionDeclarations: [{ name: 'next_phrase', description: 'Next phrase' }] }],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: teacher.voice } } },
        // @ts-ignore - The SDK types might not be fully updated yet
        voiceActivityDetection: {
          silenceDurationMs: 2000,
          minimizeNoise: true
        },
        systemInstruction: {
          parts: [{
            text: `
              PERSONA: ${teacher.name} (${teacher.language}).
              NÍVEL: ${selectedLevel}.
              TÓPICO: ${topic.name} (${topic.id === 'free-conversation' ? 'CONVERSA LIVRE E ESPONTÂNEA' : 'AULA ESTRUTURADA'}).
              CONTEXTO: ${topic.prompt}
              ${selectedLevel === Level.BEGINNER ? 'Fale 80% Português.' : 'Fale 100% Idioma Alvo.'}
              
              VOCÊ DEVE INICIAR A CONVERSA IMEDIATAMENTE.
              Assim que conectar, apresente-se brevemente.
              ${topic.id === 'free-conversation'
                ? 'Pergunte sobre o que o aluno quer conversar hoje (hobbies, dia, interesses).'
                : 'Faça a primeira pergunta do cenário/tópico.'}
              NÃO ESPERE O ALUNO FALAR.
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
  };

  const endCall = async () => {
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
    <div className="h-[100dvh] w-full flex flex-col font-sans overflow-hidden relative bg-slate-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center relative p-6 text-center animate-in fade-in duration-700">
          {/* Header Streak */}
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full border border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
            <span className="font-bold text-orange-100">{streak} Dias</span>
          </div>

          <div className="space-y-8 z-10 max-w-2xl">
            <img src="/logo.png" className="w-40 h-40 mx-auto drop-shadow-[0_0_30px_rgba(249,115,22,0.4)]" />
            <h1 className="hidden md:block text-5xl md:text-7xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
              Lingua<span className="text-orange-500">Flow</span>
            </h1>
            <button
              onClick={() => { setStep('setup'); setSelectedTeacherId(TEACHERS[0].id); }}
              className="btn-primary px-8 py-4 md:px-12 md:py-5 rounded-full text-xl md:text-2xl font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-transform shadow-lg shadow-orange-500/20"
            >
              Continuar Jornada <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {step === 'setup' && (
        <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-4 md:p-8">
          <div className="max-w-5xl w-full mx-auto space-y-8 pb-20">

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-black flex items-center gap-3">
                  <Sparkles className="text-orange-500" /> Mapa de Progresso
                </h2>
                <p className="text-slate-400">Domine novas línguas e expanda seus horizontes, uma missão de cada vez.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="font-bold text-sm text-orange-200">{streak} Dias Seguidos</span>
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
            <div className="grid grid-cols-3 gap-3">
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
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Journey Map */}
                <div className="flex-1">
                  <JourneyMap
                    topics={TOPICS}
                    progress={topicProgress}
                    onSelectTopic={(id) => setSelectedTopicId(id)}
                  />
                </div>

                {/* Right Panel: Teacher Selection */}
                <div className="lg:w-1/3 space-y-6 sticky top-8 h-fit">
                  <div className="glass-premium p-6 rounded-3xl border border-white/10 flex flex-col max-h-[80vh]">
                    {/* Level Selector */}
                    <div className="mb-6">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
                        <Settings className="w-4 h-4 text-orange-500" /> Nível de Dificuldade
                      </label>
                      <div className="flex bg-white/5 p-1 rounded-xl">
                        {[
                          { id: Level.BEGINNER, label: 'Básico' },
                          { id: Level.INTERMEDIATE, label: 'Médio' },
                          { id: Level.ADVANCED, label: 'Pro' }
                        ].map(lvl => (
                          <button
                            key={lvl.id}
                            onClick={() => setSelectedLevel(lvl.id)}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${selectedLevel === lvl.id
                              ? 'bg-slate-700 text-white shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Free Conversation Shortcut */}
                    <button
                      onClick={() => setSelectedTopicId('free-conversation')}
                      className={`w-full mb-8 p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group ${selectedTopicId === 'free-conversation'
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500'
                        : 'bg-white/5 border-transparent hover:border-indigo-500/50'
                        }`}
                    >
                      <div className={`p-3 rounded-xl ${selectedTopicId === 'free-conversation' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'} transition-colors`}>
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className={`font-bold block ${selectedTopicId === 'free-conversation' ? 'text-white' : 'text-slate-300'}`}>Conversa Livre</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Pratique sem roteiro</span>
                      </div>
                    </button>

                    <div className="mb-4">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-orange-500" /> Escolha seu Mentor
                      </label>
                    </div>

                    {/* Teachers List */}
                    <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2 mb-6">
                      {TEACHERS.filter(t => t.language === selectedLanguage).map(teacher => (
                        <button
                          key={teacher.id}
                          onClick={() => setSelectedTeacherId(teacher.id)}
                          className={`w-full group relative flex items-center gap-4 p-3 rounded-2xl border transition-all ${selectedTeacherId === teacher.id
                            ? 'bg-orange-500/10 border-orange-500/50'
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                            }`}
                        >
                          <img src={teacher.avatar} className={`w-12 h-12 rounded-full object-cover border-2 ${selectedTeacherId === teacher.id ? 'border-orange-500' : 'border-slate-700'}`} />
                          <div className="text-left flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`font-bold text-sm ${selectedTeacherId === teacher.id ? 'text-white' : 'text-slate-300'}`}>{teacher.name}</span>
                              {selectedTeacherId === teacher.id && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
                            </div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block truncate">{teacher.accent}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Selected Mission Preview (Footer) */}
                    {selectedTopicId && (
                      <div className="pt-6 border-t border-white/10 animate-in slide-in-from-bottom-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Pronto para iniciar?</label>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-white/5 rounded-xl text-2xl">{TOPICS.find(t => t.id === selectedTopicId)?.icon}</div>
                          <div>
                            <div className="font-bold text-white leading-tight">{TOPICS.find(t => t.id === selectedTopicId)?.name}</div>
                            <div className="text-xs text-orange-400 font-medium">Nível {selectedLevel === Level.BEGINNER ? 'Básico' : selectedLevel === Level.INTERMEDIATE ? 'Médio' : 'Pro'}</div>
                          </div>
                        </div>

                        <button
                          onClick={startSession}
                          disabled={!selectedTopicId || connectionStatus === 'connecting'}
                          className="btn-primary w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 text-white shadow-lg hover:shadow-orange-500/20"
                        >
                          {connectionStatus === 'connecting' ? <Loader2 className="animate-spin" /> : 'Iniciar Missão'} <ArrowRight className="w-5 h-5" />
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
      )}

      {step === 'call' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
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
            <div className="absolute bottom-32 max-w-2xl text-center px-4 animate-in slide-in-from-bottom-4">
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
      )}

    </div>
  );
};

export default App;

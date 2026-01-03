/**
 * LINGUAFLOW AI - Main Application
 * Copyright (c) 2026 Paulinho Fernando. All rights reserved.
 * Proprietary and Confidential.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type LiveServerMessage } from "@google/genai";
import { Language, Level, Teacher, Topic, SessionReportData } from './types';
import { TEACHERS, TOPICS, PRONUNCIATION_PHRASES } from './constants';
import { useAuth } from './contexts/AuthContext';
import { LoginScreen } from './components/auth/LoginScreen';
import { supabase } from './lib/supabase';
import { JourneyMap } from './components/JourneyMap';
import { hotmartService } from './lib/hotmart_integration';
import { AdminDashboard } from './components/AdminDashboard';
import { PaymentModal } from './components/PaymentModal';
import { UpdatePasswordModal } from './components/UpdatePasswordModal';
import { OnboardingTutorial } from './components/OnboardingTutorial';
import { PrivacyPolicy, TermsOfService } from './components/LegalModals';
import {
  Mic, MicOff, PhoneOff, Settings, Sparkles, Globe, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key, Flag, Flame, AlertTriangle, Shield, Rocket
} from 'lucide-react';
import { initAnalytics, trackEvent, identifyUser } from './lib/analytics';

// Initialize Analytics
initAnalytics();

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
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.B1);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [hasSavedStage, setHasSavedStage] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [sessionReport, setSessionReport] = useState<SessionReportData | null>(null);
  const [connectionTestStatus, setConnectionTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [upgradeModalReason, setUpgradeModalReason] = useState<'user_action' | 'time_limit'>('user_action');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // New Progress States
  const [streak, setStreak] = useState(0);
  const [topicProgress, setTopicProgress] = useState<Record<string, number>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isKidsMode, setIsKidsMode] = useState(false);


  // Monetization States
  const [isPremium, setIsPremium] = useState(false);
  const [dailyMinutesUsed, setDailyMinutesUsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);

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

      const { data: profile } = await supabase.from('profiles').select('streak_count, last_language, last_level, last_teacher_id, last_topic_id, is_premium, daily_minutes_used, is_kids_mode, has_completed_tutorial').eq('id', user.id).single();

      if (isAdmin) {
        setIsPremium(true);
      } else if (profile) {
        setIsPremium(profile.is_premium || false);
      } else {
        setIsPremium(false);
      }

      // Analytics Identification
      if (user) {
        identifyUser(user.id, user.email);
      }

      if (profile) {
        setStreak(profile.streak_count || 0);
        setDailyMinutesUsed(profile.daily_minutes_used || 0);
        setIsKidsMode(profile.is_kids_mode || false);
        if (profile.last_language) setSelectedLanguage(profile.last_language as Language);
        if (profile.last_level) setSelectedLevel(profile.last_level as Level);
        if (profile.last_teacher_id) setSelectedTeacherId(profile.last_teacher_id);
        if (profile.last_topic_id) setSelectedTopicId(profile.last_topic_id);
        if (profile.has_completed_tutorial === false) setShowTutorial(true);
      }

      const { data: progressData } = await supabase.from('user_progress').select('topic_id, score, mistakes, vocabulary, tip').eq('user_id', user.id);

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

  // Listen for Password Recovery Event - Independent of user state
  useEffect(() => {
    // Check specific hash for recovery (Fallback)
    const hash = window.location.hash;
    if (hash && hash.includes('type=recovery')) {
      setShowUpdatePasswordModal(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Auth monitoring
      if (event === 'PASSWORD_RECOVERY') {
        setShowUpdatePasswordModal(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Force premium for admin
  useEffect(() => {
    if (user?.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com') {
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
        is_kids_mode: isKidsMode,
        last_seen: new Date().toISOString()
      }).eq('id', user.id);
    };

    if (selectedLanguage || selectedLevel || selectedTeacherId || selectedTopicId || isKidsMode !== undefined) {
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
          setUpgradeModalReason('time_limit');
          setShowUpgradeModal(true);
          setConnectionError("Limite diário de 10 minutos atingido (Grátis).");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [step, isPremium, sessionStartTime, dailyMinutesUsed]);

  const startSession = async () => {
    if (!isPremium && dailyMinutesUsed >= 10) {
      setUpgradeModalReason('time_limit');
      setShowUpgradeModal(true);
      return;
    }

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
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

    const teacher = TEACHERS.find(t => t.id === selectedTeacherId)!;
    const topic = TOPICS.find(t => t.id === selectedTopicId)!;

    console.log('Proxy Connection: Iniciando conexão...');

    try {
      // Connect to Proxy (Production or Local)
      // const ws = new WebSocket('ws://localhost:8080'); // Localhost Fallback
      const ws = new WebSocket('wss://linguaflow-proxy-885367892979.us-central1.run.app');

      ws.onopen = () => {
        console.log('Proxy conectado');
        isConnectedRef.current = true;
        setConnectionStatus('connected');

        // 1. Send Setup Message
        const setupMessage = {
          setup: {
            model: 'models/gemini-2.5-flash-native-audio-preview-12-2025',
            generation_config: {
              response_modalities: ['AUDIO'],
              speech_config: { voice_config: { prebuilt_voice_config: { voice_name: teacher.voice } } },
            },
            system_instruction: {
              parts: [{
                text: `
              VOCÊ É UM PROFESSOR REAL DE IDIOMAS. Sua missão é ensinar, encorajar e guiar o aluno para a fluência.
              
              IMPORTANTE: SUA VOZ DEVE SOAR COM SOTAQUE NATIVO DO BRASIL QUANDO FALAR PORTUGUÊS. VOCÊ É BRASILEIRO.
              
              PERSONA: ${teacher.name} (${teacher.language}).
              NÍVEL DO ALUNO: ${selectedLevel}.
              PROTOCOLO PEDAGÓGICO OBRIGATÓRIO POR NÍVEL:

              ${selectedLevel === Level.B1 ? `
              - NÍVEL B1 (INTERMEDIÁRIO - Protocolo "Bridge to Fluency"):
                1. Use 60% Português e 40% ${teacher.language}.
                2. Explique conceitos mais complexos em português.
                3. Incentive frases completas, mas aceite erros menores.
                4. Foque em comunicação funcional: o aluno consegue se fazer entender?
                5. Introduza vocabulário mais rico.
              ` : ''}

              ${selectedLevel === Level.B2 ? `
              - NÍVEL B2 (INTERMEDIÁRIO SUPERIOR - Protocolo "High Immersion"):
                1. Use 90% ${teacher.language}. Português apenas se o aluno travar totalmente.
                2. Fale em velocidade natural.
                3. Exija precisão gramatical e correção de erros.
                4. Incentive o uso de conectivos e estruturas mais complexas.
                5. O feedback deve focar em soar "natural" e menos "traduzido".
              ` : ''}

              DIRETRIZES GERAIS DE ENSINO:
              - TÓPICO DA AULA: ${topic.name}.
              - CONTEXTO: ${topic.prompt}.
              - TOMAR INICIATIVA (OBRIGATÓRIO): Você é o guia e mentor. Nunca deixe o silêncio reinar. Se o aluno demorar a responder ou parecer perdido, tome a frente, faça uma pergunta direta, sugira um exemplo ou conte uma curiosidade sobre o tema.
              - FOCO AUDITIVO: Ignore ruídos secundários (TV, trânsito). Foque apenas na voz ativa do aluno.

              ${isKidsMode ? `
              KIDS_MODE_ACTIVE (SALA MÁGICA):
              - PERSONA: Você é um amigo imaginário e mentor de aventuras. Sua voz deve transbordar entusiasmo e carinho.
              - GUIA PROATIVO: Crianças precisam de direção clara. Sugira atividades constantemente: "Vamos ver o que tem atrás daquela árvore?", "Você consegue dizer o nome desse planeta mágico comigo?".
              - ADAPTAÇÃO DINÂMICA: Sinta o nível da criança. Se ela responder apenas "Yes/No", ajude-a a construir pequenas frases. Se ela já fala bem, desafie-a com perguntas sobre cores, tamanhos e emoções.
              - REFORÇO POSITIVO: Comemore cada pequena vitória com muita festa sonora (descrita ou via tom de voz).
              - CORREÇÃO LÚDICA: Se a criança errar, use: "Quase! Foi por pouco! O som é mais ou menos assim: [correção]. Tenta de novo pro seu amigo ${teacher.name} ouvir!".
              ` : ''}

              - ENCERRAMENTO: Quando o aluno quiser parar, você DEVE gerar o relatório técnico final via 'save_session_report'.
              `
              }]
            },
            tools: [
              { function_declarations: [{ name: 'next_phrase', description: 'Next phrase' }] },
              {
                function_declarations: [{
                  name: "save_session_report",
                  description: "Save a detailed report of the conversation session.",
                  parameters: {
                    type: "OBJECT",
                    properties: {
                      score: { type: "NUMBER", description: "Score from 0 to 100 based on performance" },
                      strengths: {
                        type: "ARRAY",
                        items: { type: "STRING" },
                        description: "List of specific things the student did well (pronunciation, vocabulary, grammar)"
                      },
                      mistakes: {
                        type: "ARRAY",
                        items: {
                          type: "OBJECT",
                          properties: {
                            mistake: { type: "STRING" },
                            correction: { type: "STRING" },
                            explanation: { type: "STRING" }
                          }
                        },
                        description: "List of major mistakes with corrections and brief explanations"
                      },
                      improvements: {
                        type: "ARRAY",
                        items: {
                          type: "OBJECT",
                          properties: {
                            original: { type: "STRING", description: "What the user said" },
                            adjusted: { type: "STRING", description: "A more natural/native way to say it (B1/B2 level)" },
                            explanation: { type: "STRING", description: "Why the adjustment is better" }
                          }
                        },
                        description: "Suggestions for sounding more natural or professional"
                      },
                      vocabulary: {
                        type: "ARRAY",
                        items: {
                          type: "OBJECT",
                          properties: {
                            word: { type: "STRING" },
                            translation: { type: "STRING" }
                          }
                        },
                        description: "List of new or relevant vocabulary used"
                      },
                      tip: { type: "STRING", description: "A motivational tip for the student" },
                      continuationContext: { type: "STRING", description: "Context for the next session" }
                    },
                    required: ["score", "strengths", "mistakes", "improvements", "vocabulary", "tip"]
                  }
                }]
              }
            ]
          }
        };
        ws.send(JSON.stringify(setupMessage));

        // 2. Send Initial Text to Trigger Turn
        const triggerMessage = {
          client_content: {
            turns: [{
              role: 'user',
              parts: [{
                text: isKidsMode
                  ? `[[SISTEMA]] A criança entrou na sala mágica! Comece a aventura agora com MUITA ENERGIA. Apresente-se como seu amigo ${teacher.name} e inicie a brincadeira no tema ${topic.name}. TOME A INICIATIVA E LIDERE A CONVERSA!`
                  : `[[SISTEMA]] O aluno entrou. Comece a aula agora de forma proativa. Apresente-se como ${teacher.name} e inicie o tópico ${topic.name}.`
              }]
            }],
            turn_complete: true
          }
        };
        ws.send(JSON.stringify(triggerMessage));

        // 3. Start Audio Stream
        setTimeout(() => {
          if (!isConnectedRef.current || !mediaStreamRef.current || !audioContextRef.current) return;
          const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
          const processor = audioContextRef.current.createScriptProcessor(4096, 1, 1);

          const inputSampleRate = audioContextRef.current.sampleRate;
          const targetSampleRate = 16000;

          processor.onaudioprocess = (e) => {
            if (!isConnectedRef.current || ws.readyState !== WebSocket.OPEN) return;
            const inputData = e.inputBuffer.getChannelData(0);

            // Audio Level Vis
            let sum = 0;
            for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
            setAudioLevel(Math.min(100, Math.sqrt(sum / inputData.length) * 1500));

            // Downsampling Logic
            let pcmData;
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
              pcmData = encode(new Uint8Array(result.buffer));
            } else {
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              pcmData = encode(new Uint8Array(int16.buffer));
            }

            // Send Realtime Input
            ws.send(JSON.stringify({
              realtime_input: {
                media_chunks: [{
                  mime_type: 'audio/pcm;rate=16000',
                  data: pcmData
                }]
              }
            }));
          };

          const muteGain = audioContextRef.current.createGain();
          muteGain.gain.value = 0;
          source.connect(processor);
          processor.connect(muteGain);
          muteGain.connect(audioContextRef.current.destination);
        }, 500);

      };

      ws.onmessage = async (event) => {
        try {
          let msg;
          if (event.data instanceof Blob) {
            msg = JSON.parse(await event.data.text());
          } else {
            msg = JSON.parse(event.data as string);
          }

          // Handle Server Content (Audio)
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

                const currentTime = ctx.currentTime;
                const startTime = Math.max(currentTime, nextStartTimeRef.current);

                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;

                source.onended = () => {
                  sourcesRef.current.delete(source);
                  if (ctx.currentTime >= nextStartTimeRef.current - 0.1) {
                    setIsTeacherSpeaking(false);
                  }
                };
                sourcesRef.current.add(source);
              }
            }
          }

          // Handle Tool Calls
          const toolCall = msg.toolCall;
          if (toolCall) {
            const functionCalls = toolCall.functionCalls;
            if (functionCalls) {
              for (const call of functionCalls) {
                if (call.name === 'save_session_report') {
                  const report = call.args as unknown as SessionReportData;

                  // Calculate Duration
                  if (sessionStartTime) {
                    const diffMs = Date.now() - sessionStartTime;
                    const mins = Math.floor(diffMs / 60000);
                    const secs = Math.floor((diffMs % 60000) / 1000);
                    report.duration = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                  }

                  setSessionReport(report);

                  if (selectedTopicId && user) {
                    await supabase.from('user_progress').upsert({
                      user_id: user.id,
                      topic_id: selectedTopicId,
                      score: report.score,
                      mistakes: report.mistakes,
                      vocabulary: report.vocabulary,
                      tip: report.tip,
                      status: report.score >= 80 ? 'completed' : 'unlocked'
                    }, { onConflict: 'user_id, topic_id' });
                    setTopicProgress(prev => ({ ...prev, [selectedTopicId]: report.score }));
                  }

                  // Send Tool Response
                  ws.send(JSON.stringify({
                    tool_response: {
                      function_responses: [{
                        name: 'save_session_report',
                        id: call.id,
                        response: { result: 'success' }
                      }]
                    }
                  }));
                }
              }
            }
          }
        } catch (e) {
          console.error("Error parsing websocket message", e);
        }
      };

      ws.onclose = () => {
        console.log("Proxy disconnected");
        isConnectedRef.current = false;
        setConnectionStatus('idle');
        nextStartTimeRef.current = 0;
      };

      sessionRef.current = {
        disconnect: () => ws.close(),
        close: () => ws.close()
      };
      setStep('call');

      // Analytics: Session Start
      if (selectedTopicId) {
        trackEvent('session_start', {
          topic_id: selectedTopicId,
          level: selectedLevel,
          teacher_id: selectedTeacherId,
          language: selectedLanguage,
          is_kids_mode: isKidsMode // Even if hidden, we track track it
        });
      }

    } catch (err: any) {
      console.error('Erro ao conectar Proxy:', err);
      setConnectionError('Falha na conexão: ' + (err.message || 'Erro desconhecido'));
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

    // Analytics: Session End
    if (sessionStartTime) {
      const durationSeconds = (Date.now() - sessionStartTime) / 1000;
      trackEvent('session_end', {
        duration_seconds: durationSeconds,
        topic_id: selectedTopicId,
        score: sessionReport?.score || 0
      });
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

  const completeTutorial = async () => {
    setShowTutorial(false);
    if (user) {
      await supabase.from('profiles').update({ has_completed_tutorial: true }).eq('id', user.id);
    }
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

        {/* Kids Mode Specific Background Elements */}
        {isKidsMode && step === 'welcome' && (
          <>
            <div className="absolute top-[10%] left-[15%] text-amber-300 animate-rocket opacity-60">
              <Rocket className="w-12 h-12 rotate-[45deg]" />
            </div>
            <div className="absolute top-[20%] right-[20%] text-blue-300 animate-star opacity-40">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="absolute bottom-[25%] left-[10%] text-pink-300 animate-star opacity-50 delay-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="absolute top-[60%] right-[10%] text-orange-300 animate-rocket opacity-40 delay-1000">
              <Rocket className="w-10 h-10 -rotate-[15deg]" />
            </div>
          </>
        )}
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
        <div className={`flex-1 flex flex-col items-center justify-center relative p-6 text-center bg-mesh overflow-hidden ${isKidsMode ? 'pt-24 md:pt-12' : ''}`}>
          {/* Background Blobs - Enhanced */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="blob blob-1 mix-blend-screen" style={{ width: '60vw', height: '60vw', left: '-10%', top: '-20%' }}></div>
            <div className="blob blob-2 mix-blend-overlay" style={{ width: '50vw', height: '50vw', right: '0%', bottom: '-10%' }}></div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-4 z-30 animate-in fade-in slide-in-from-right-4 duration-1000">
            {/* Kids Mode Toggle - HIDDEN FOR STARTUP PITCH
            <button
              onClick={() => setIsKidsMode(!isKidsMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-500 group pointer-events-auto ${isKidsMode ? 'bg-white text-[#ff6b6b] border-[#ff6b6b] shadow-[0_0_20px_rgba(255,107,107,0.3)]' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:border-orange-500/30'}`}
            >
              <div className={`p-1 rounded-full transition-transform duration-500 ${isKidsMode ? 'bg-[#ff6b6b] text-white rotate-[360deg]' : 'bg-slate-800 text-slate-500'}`}>
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest">{isKidsMode ? 'Modo Kids Ativo' : 'Ativar Modo Kids'}</span>
            </button>
            */}

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md z-30 transition-colors ${isKidsMode ? 'bg-white/80 border-[#ff6b6b] text-[#ff6b6b]' : 'bg-slate-900/50 border-white/10 text-orange-100 group hover:border-orange-500/30'}`}>
              <Flame className={`w-5 h-5 animate-pulse ${isKidsMode ? 'text-[#ff6b6b] fill-[#ff6b6b]' : 'text-orange-500 fill-orange-500'}`} />
              <span className="font-bold">{streak} Dias</span>
            </div>
          </div>

          <div className="space-y-8 md:space-y-12 z-10 max-w-2xl relative mb-16 md:mb-28">
            <div className={`transition-all duration-1000 ${isKidsMode ? 'animate-float opacity-100 scale-100 md:scale-110' : 'animate-float-slow'}`}>
              <img
                src="/logo.png"
                className={`w-36 h-36 md:w-44 md:h-44 mx-auto transform hover:scale-105 transition-transform duration-700 ${isKidsMode ? 'mb-4 md:mb-8 drop-shadow-[0_10px_30px_rgba(78,205,196,0.3)]' : 'drop-shadow-[0_0_50px_rgba(249,115,22,0.5)]'}`}
              />
            </div>


            <div className={`space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both ${isKidsMode ? 'mb-8' : ''}`}>
              <h1 className="text-4xl md:text-7xl font-display font-black tracking-tight leading-[1.1]">
                {isKidsMode ? (
                  <span className="text-slate-900 drop-shadow-[0_5px_15px_rgba(255,107,107,0.3)]">
                    Mundo<span className="text-[#ff6b6b] text-glow animate-bounce-slow inline-block ml-2">Kids!</span>
                  </span>
                ) : (
                  <span className="text-white">
                    Lingua<span className="text-orange-500 text-glow">Flow</span>
                  </span>
                )}
              </h1>
              <p className={`text-sm md:text-xl font-bold max-w-[280px] md:max-w-md mx-auto leading-relaxed ${isKidsMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {isKidsMode
                  ? 'Aprenda inglês com aventuras mágicas, jogos e muitos amigos novos!'
                  : 'Sua jornada para a fluência começa aqui. Interaja, aprenda e domine.'}
              </p>
            </div>


            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both">
              <button
                onClick={() => { setStep('setup'); }}
                className="btn-shimmer px-8 py-4 md:px-16 md:py-7 rounded-2xl md:rounded-[2.5rem] text-lg md:text-3xl font-black flex items-center justify-center gap-3 md:gap-4 mx-auto group shadow-2xl shadow-orange-500/10 active:scale-95 transition-all"
              >
                {isKidsMode ? 'VAMOS COMEÇAR!' : 'Continuar Jornada'}
                <ArrowRight className="w-6 h-6 md:w-9 md:h-9 group-hover:translate-x-2 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* Walking Characters - Optimized for Final Visibility */}
          {isKidsMode && (
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute top-[28%] -left-[2%] md:top-[38%] md:left-[10%] animate-character">
                <img src="/kids/leo.png" className="w-28 h-28 md:w-64 md:h-64 blend-multiply" alt="Leo" />
              </div>
              <div className="absolute bottom-[20%] -right-[2%] md:top-[58%] md:right-[10%] animate-character delay-500">
                <img src="/kids/lara.png" className="w-28 h-28 md:w-64 md:h-64 blend-multiply" alt="Lara" />
              </div>
            </div>
          )}
        </div>
      )
      }



      {
        step === 'setup' && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-4 md:p-8">
            <div className="max-w-5xl w-full mx-auto space-y-8 pb-20">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-display font-black flex items-center gap-3">
                    <Sparkles className="text-orange-500 shrink-0" /> {isKidsMode ? 'Mapa de Aventuras' : 'Mapa de Progresso'}
                  </h2>
                  <p className={`text-sm mt-1 font-bold ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-400'}`}>
                    {isKidsMode
                      ? 'Explore mundos mágicos e aprenda brincando!'
                      : 'Domine novas línguas e expanda seus horizontes, uma missão de cada vez.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {user.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com' && (
                    <button
                      onClick={() => setIsAdminDashboardOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                      <Shield className="w-4 h-4" /> Dashboard Admin
                    </button>
                  )}
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isKidsMode ? 'bg-white/80 border-[#ff6b6b]/20 shadow-sm' : 'bg-orange-500/10 border-orange-500/20'}`}>
                    <Flame className={`w-4 h-4 ${isKidsMode ? 'text-[#ff6b6b] fill-[#ff6b6b]' : 'text-orange-500 fill-orange-500'}`} />
                    <span className={`font-bold text-sm ${isKidsMode ? 'text-[#ff6b6b]' : 'text-orange-200'}`}>{streak} Dias</span>
                  </div>
                  <button
                    onClick={() => setShowTutorial(true)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-slate-400 hover:text-white transition-colors"
                    title="Como Usar"
                  >
                    <Globe className="w-4 h-4" />
                  </button>
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
                    className={`p-4 rounded-2xl border font-bold uppercase transition-all flex flex-col items-center gap-2 
                    ${selectedLanguage === lang
                        ? isKidsMode ? 'bg-[#ff6b6b] text-white border-[#ff6b6b] shadow-lg shadow-[#ff6b6b]/20' : 'bg-orange-500 text-white border-orange-500'
                        : isKidsMode ? 'bg-white/80 border-[#4ecdc4]/20 text-[#4ecdc4]' : 'bg-white/5 border-white/10 text-slate-400'}`}
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
                      isKidsMode={isKidsMode}
                    />
                  </div>

                  {/* Right Panel: Teacher Selection */}
                  <div ref={teacherPanelRef} className="lg:w-1/3 space-y-4 lg:sticky top-8 h-fit">
                    <div className="glass-premium p-5 rounded-3xl border border-white/10 flex flex-col max-h-[85vh]">
                      {/* Level Selector */}
                      <div className="mb-6">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-3 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500 opacity-70'}`}>
                          <Settings className={`w-3.5 h-3.5 ${isKidsMode ? 'text-[#ff6b6b]' : 'text-orange-500'}`} /> Nível de Dificuldade
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: Level.B1, label: 'B1 - Intermediário' },
                            { id: Level.B2, label: 'B2 - Avançado' }
                          ].map((lvl) => (
                            <button
                              key={lvl.id}
                              onClick={() => {
                                if (!isPremium && lvl.id === Level.B2) {
                                  setShowUpgradeModal(true);
                                } else {
                                  setSelectedLevel(lvl.id);
                                }
                              }}
                              className={`p-4 rounded-xl border-2 transition-all ${selectedLevel === lvl.id
                                ? 'border-orange-500 bg-orange-500/10 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]'
                                : 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20'
                                }`}
                            >
                              <div className="font-bold text-lg mb-1">{lvl.label.split(' - ')[0]}</div>
                              <div className="text-xs opacity-70 uppercase tracking-widest">{lvl.label.split(' - ')[1]}</div>
                              {!isPremium && lvl.id === Level.B2 && (
                                <span className={`p-0.5 rounded ${isKidsMode ? 'bg-white/20' : 'bg-orange-500/10'}`}>
                                  <Key className={`w-3 h-3 ${isKidsMode ? 'text-white' : 'text-orange-500'}`} />
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
                          ? isKidsMode ? 'bg-[#ff6b6b]/10 border-[#ff6b6b]/50 shadow-lg' : 'bg-gradient-to-br from-indigo-500/15 to-purple-500/15 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                          : isKidsMode ? 'bg-white/50 border-[#4ecdc4]/20 hover:border-[#ff6b6b]/30' : 'bg-white/5 border-white/5 hover:border-indigo-500/30'
                          }`}
                      >
                        {selectedTopicId === 'free-conversation' && (
                          <div className="absolute top-0 right-0 p-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                          </div>
                        )}
                        <div className={`p-3 rounded-xl transition-all duration-300 ${selectedTopicId === 'free-conversation'
                          ? isKidsMode ? 'bg-[#ff6b6b] text-white shadow-md' : 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                          : isKidsMode ? 'bg-[#4ecdc4]/20 text-[#4ecdc4]' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}`}>
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <span className={`font-black block text-sm tracking-tight ${selectedTopicId === 'free-conversation'
                            ? isKidsMode ? 'text-[#ff6b6b]' : 'text-white'
                            : isKidsMode ? 'text-[#2d3748]' : 'text-slate-300'}`}>
                            {isKidsMode ? 'Conversa Amiga' : 'Conversa Livre'}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-[0.1em] opacity-80 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500'}`}>
                            {isKidsMode ? 'Fale o que quiser!' : 'Pratique sem roteiro'}
                          </span>
                        </div>
                      </button>

                      <div className="mb-5">
                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500 opacity-70'}`}>
                          <BrainCircuit className={`w-3.5 h-3.5 ${isKidsMode ? 'text-[#ff6b6b]' : 'text-orange-500'}`} /> {isKidsMode ? 'Escolha seu Amigo' : 'Escolha seu Mentor'}
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
                                  ? isKidsMode ? 'bg-[#4ecdc4]/10 border-[#4ecdc4]/50 shadow-md' : 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5'
                                  : isKidsMode ? 'bg-white/50 border-[#4ecdc4]/10 hover:border-[#4ecdc4]/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                  }`}
                              >
                                <div className="relative">
                                  <img src={teacher.avatar} className={`w-11 h-11 rounded-xl object-cover border-2 transition-all duration-300 ${isSelected ? isKidsMode ? 'border-[#4ecdc4] shadow-md' : 'border-orange-500 shadow-lg shadow-orange-500/10' : isKidsMode ? 'border-[#4ecdc4]/20' : 'border-slate-800'} ${isLocked ? 'grayscale opacity-50' : ''}`} />
                                  {isSelected && <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 animate-pulse ${isKidsMode ? 'bg-[#ff6b6b] border-white' : 'bg-orange-500 border-slate-900'}`}></div>}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`font-black text-sm tracking-tight truncate ${isSelected ? isKidsMode ? 'text-[#ff6b6b]' : 'text-white' : isKidsMode ? 'text-[#2d3748]' : 'text-slate-300'}`}>{teacher.name}</span>
                                    {isLocked && <span className={`text-[8px] font-black px-1 py-0.5 rounded border uppercase tracking-tighter shadow-sm flex-shrink-0 ${isKidsMode ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]/50' : 'bg-orange-500 text-white border-orange-400/50'}`}>PRO</span>}
                                  </div>
                                  <span className={`text-[9px] font-bold uppercase tracking-widest block truncate opacity-70 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500'}`}>{teacher.accent}</span>
                                </div>
                              </button>
                            );
                          })}
                      </div>

                      {/* Selected Mission Preview (Footer) */}
                      {selectedTopicId && (
                        <div className="pt-5 border-t border-white/5 animate-in slide-in-from-bottom-4 duration-500">
                          <label className={`text-[10px] font-black uppercase tracking-[0.25em] block mb-3 text-center ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-600'}`}>
                            {isKidsMode ? 'Tudo pronto para a aventura?' : 'Pronto para iniciar?'}
                          </label>
                          <div className={`flex items-center gap-3 mb-4 p-3 rounded-[1.25rem] border ${isKidsMode ? 'bg-white border-[#4ecdc4]/20 shadow-sm' : 'bg-white/5 border-white/5'}`}>
                            <div className={`p-3 rounded-xl text-2xl shadow-inner ${isKidsMode ? 'bg-[#4ecdc4]/10 text-white' : 'bg-slate-900'}`}>
                              {TOPICS.find(t => t.id === selectedTopicId)?.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`font-black text-base tracking-tight truncate ${isKidsMode ? 'text-[#2d3748]' : 'text-white'}`}>
                                {TOPICS.find(t => t.id === selectedTopicId)?.name}
                              </div>
                              <div className={`inline-flex items-center px-1.5 py-0.5 border rounded-md mt-0.5 ${isKidsMode ? 'bg-[#ff6b6b]/10 border-[#ff6b6b]/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                                <span className={`text-[8px] font-black uppercase tracking-widest ${isKidsMode ? 'text-[#ff6b6b]' : 'text-orange-400'}`}>
                                  {isKidsMode
                                    ? `Fase ${selectedLevel === Level.B1 ? '1' : '2'}`
                                    : `Nível ${selectedLevel === Level.B1 ? 'B1' : 'B2'}`}
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
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity ${isKidsMode ? 'bg-white' : 'bg-gradient-to-r from-orange-400 to-amber-600'}`}></div>
                            <div className={`relative flex items-center justify-center gap-3 py-4 rounded-[1rem] font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] 
                            ${isKidsMode ? 'bg-gradient-to-r from-[#4ecdc4] to-[#45b7af] shadow-[#4ecdc4]/20' : 'bg-orange-500 shadow-orange-500/30'}`}>
                              {connectionStatus === 'connecting' ? (
                                <>
                                  <Loader2 className="w-5 h-5 animate-spin" />
                                  <span className="uppercase tracking-widest text-xs">Conectando...</span>
                                </>
                              ) : (
                                <>
                                  <span className="uppercase tracking-widest text-base">
                                    {isKidsMode ? 'COMEÇAR AVENTURA!' : 'Iniciar Missão'}
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
            {/* Pronunciation Card Overlay */}
            {selectedTopicId === 'pronunciation' && selectedLanguage && PRONUNCIATION_PHRASES[selectedLanguage] && (() => {
              const allPhrases = PRONUNCIATION_PHRASES[selectedLanguage];
              const filteredPhrases = allPhrases.filter(p => isKidsMode ? p.level === 'Kids' : p.level !== 'Kids');
              const currentPhrase = filteredPhrases[currentPhraseIndex];

              if (!currentPhrase) return null;

              return (
                <div className="absolute top-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-20">
                  <div className={`glass-premium p-6 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 ${isKidsMode ? 'bg-white/90 border-[#4ecdc4]/30' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${isKidsMode ? 'bg-[#ff6b6b]/20 text-[#ff6b6b] border-[#ff6b6b]/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                          Frase {currentPhraseIndex + 1} de {filteredPhrases.length}
                        </span>
                        <span className="px-3 py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5">
                          {currentPhrase.level || 'Geral'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPhraseIndex(p => Math.max(0, p - 1))}
                          disabled={currentPhraseIndex === 0}
                          className={`p-2 rounded-lg disabled:opacity-30 transition-colors ${isKidsMode ? 'hover:bg-[#4ecdc4]/10 text-[#2d3748]' : 'hover:bg-white/10 text-white'}`}
                        >
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => setCurrentPhraseIndex(p => Math.min(filteredPhrases.length - 1, p + 1))}
                          disabled={currentPhraseIndex === filteredPhrases.length - 1}
                          className={`p-2 rounded-lg disabled:opacity-30 transition-colors ${isKidsMode ? 'hover:bg-[#4ecdc4]/10 text-[#2d3748]' : 'hover:bg-white/10 text-white'}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isKidsMode && currentPhrase.image ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-40 h-40 relative animate-bounce-slow">
                          <img
                            src={currentPhrase.image}
                            alt={currentPhrase.text}
                            className="w-full h-full object-contain filter drop-shadow-xl"
                          />
                        </div>
                        <h3 className="text-3xl md:text-4xl font-display font-black text-[#2d3748] mb-1">
                          {currentPhrase.text}
                        </h3>
                        {/* <p className="text-slate-400 font-medium text-sm">{currentPhrase.translation}</p> */}
                      </div>
                    ) : (
                      <>
                        <h3 className="text-2xl md:text-3xl font-display font-medium text-white mb-3 leading-snug">
                          "{currentPhrase.text}"
                        </h3>
                        <p className="text-slate-400 font-medium text-lg">
                          {currentPhrase.translation}
                        </p>
                      </>
                    )}

                    <div className={`mt-6 flex items-center justify-between text-xs ${isKidsMode ? 'text-slate-600' : 'text-slate-500'}`}>
                      <span>{isKidsMode ? 'Diga o nome do desenho!' : 'Diga a frase em voz alta'}</span>
                      <span className="flex items-center gap-1">
                        <Sparkles className={`w-3 h-3 ${isKidsMode ? 'text-[#ff6b6b]' : 'text-orange-500'}`} /> IA Ouvindo
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

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

      {
        step !== 'call' && (
          <div className="absolute bottom-6 left-0 right-0 py-4 text-center text-[10px] text-slate-700 font-medium z-10 flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <button onClick={() => setActiveLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">Termos de Uso</button>
              <div className="w-[1px] h-2 bg-slate-800"></div>
              <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
            </div>
            <p>&copy; 2026 LinguaFlow AI - Paulinho Fernando. Todos os direitos reservados.</p>
            {user && <p className="opacity-30">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
          </div>
        )
      }


      {/* Upgrade Modal */}
      <PaymentModal
        isOpen={showUpgradeModal}
        onClose={() => {
          setShowUpgradeModal(false);
          setUpgradeModalReason('user_action'); // Reset reason
        }}
        isKidsMode={isKidsMode}
        userEmail={user?.email}
        triggerReason={upgradeModalReason}
      />
      {
        isAdminDashboardOpen && (
          <AdminDashboard onClose={() => setIsAdminDashboardOpen(false)} />
        )
      }

      {
        showTutorial && (
          <OnboardingTutorial onComplete={completeTutorial} isKidsMode={isKidsMode} />
        )
      }

      {activeLegalModal === 'privacy' && <PrivacyPolicy onClose={() => setActiveLegalModal(null)} />}
      {activeLegalModal === 'terms' && <TermsOfService onClose={() => setActiveLegalModal(null)} />}
    </main >
  );
};

export default App;

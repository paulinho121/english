/**
 * LINGUAFLOW AI - Main Application
 * Copyright (c) 2026 Paulinho Fernando. All rights reserved.
 * Proprietary and Confidential.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type LiveServerMessage } from "@google/genai";
import { Language, Level, Teacher, Topic, SessionReportData, UserProgress } from './types';
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
import { LandingPage } from './components/LandingPage';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, PhoneOff, Settings, Sparkles, Globe, LayoutGrid, Loader2,
  ArrowRight, BrainCircuit, Bookmark, Key, Flag, Flame, AlertTriangle, Shield, Rocket, Zap
} from 'lucide-react';
import { initAnalytics, trackEvent, identifyUser } from './lib/analytics';
import { SeanEllisSurvey } from './components/SeanEllisSurvey';

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

const MainApp: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();


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
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // New Progress States
  const [streak, setStreak] = useState(0);
  const [topicProgress, setTopicProgress] = useState<Record<string, UserProgress>>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isKidsMode, setIsKidsMode] = useState(false);


  // Monetization States
  const [isPremium, setIsPremium] = useState(false);
  const [dailyMinutesUsed, setDailyMinutesUsed] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Added for Session Timer
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
  const hasWarnedRef = useRef(false);
  const teacherPanelRef = useRef<HTMLDivElement>(null);

  const [showSurvey, setShowSurvey] = useState(false);



  // Moved loading/auth checks to bottom to prevent Hook Error #310
  initAnalytics();


  useEffect(() => {
    // Demo Trigger for PMF Survey:
    // Show if: 
    // 1. Not answered yet (localStorage)
    // 2. Used for at least 3 minutes (enough to form opinion)
    // 3. Not currently in a call (don't interrupt)

    // Check localStorage on mount
    const hasAnswered = localStorage.getItem('linguaflow_pmf_answered');
    if (!hasAnswered && dailyMinutesUsed >= 3 && step !== 'call' && !showTutorial) {
      // Add a small delay so it doesn't pop up INSTANTLY after call
      const timer = setTimeout(() => setShowSurvey(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [dailyMinutesUsed, step, showTutorial]);

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    localStorage.setItem('linguaflow_pmf_answered', 'true');
  };

  useEffect(() => {
    const saved = localStorage.getItem('linguistai_stage');
    if (saved) setHasSavedStage(true);

    const loadProgress = async () => {
      if (!user) return;

      // Auto-unlock survey for testing if needed
      // localStorage.removeItem('linguaflow_pmf_answered'); 


      const isAdmin = user.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com';

      let profile = null;
      let retries = 0;
      while (!profile && retries < 3) {
        const { data } = await supabase.from('profiles').select('streak_count, last_language, last_level, last_teacher_id, last_topic_id, is_premium, daily_minutes_used, is_kids_mode, has_completed_tutorial').eq('id', user.id).single();
        profile = data;
        if (!profile) await new Promise(r => setTimeout(r, 500)); // Wait 500ms
        retries++;
      }

      // TEMPORARY DEMO UNLOCK (Content Only)
      // Removes payment locks for display, but timer is strictly enforced.
      const isDemoPeriod = new Date() < new Date('2026-01-10');
      const realPremiumStatus = profile?.is_premium || false;

      // Logic:
      // 1. If Admin -> TRUE Premium (Unlimited Time, Unlocked Content)
      // 2. If Real Premium -> TRUE Premium (Unlimited Time, Unlocked Content)
      // 3. If Demo Period -> "Fake" Premium for UI (Unlocked Content), but FALSE for Time (Limited Time)

      if (isAdmin || realPremiumStatus) {
        setIsPremium(true);
      } else if (isDemoPeriod) {
        // UI Unlocked (so they see no padlocks)
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }

      // Analytics Identification
      if (user) {
        identifyUser(user.id, user.email);
      }

      const hasCompletedTutorialLocal = localStorage.getItem('linguistai_tutorial_complete') === 'true';

      if (profile) {
        setStreak(profile.streak_count || 0);
        setDailyMinutesUsed(profile.daily_minutes_used || 0);
        setIsKidsMode(false); // Force hidden for now as requested
        if (profile.last_language) setSelectedLanguage(profile.last_language as Language);
        if (profile.last_level) setSelectedLevel(profile.last_level as Level);
        if (profile.last_teacher_id) setSelectedTeacherId(profile.last_teacher_id);
        if (profile.last_topic_id) setSelectedTopicId(profile.last_topic_id);

        // Show tutorial only if both DB and LocalStorage say it's not complete
        if (profile.has_completed_tutorial === false && !hasCompletedTutorialLocal) {
          setShowTutorial(true);
        }
      } else {
        // Fallback: If absolutely no profile found after retries, assume new user -> Show Tutorial
        if (!hasCompletedTutorialLocal) {
          setShowTutorial(true);
        }
      }

      const { data: progressData } = await supabase.from('user_progress').select('topic_id, score, status, current_level, total_minutes').eq('user_id', user.id);

      const newProgress: Record<string, UserProgress> = {};
      if (progressData) {
        progressData.forEach(p => {
          newProgress[p.topic_id] = {
            topic_id: p.topic_id,
            score: p.score || 0,
            status: (p.status as any) || 'unlocked',
            current_level: p.current_level || 1.0,
            total_minutes: p.total_minutes || 0
          };
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

  useEffect(() => {
    if (selectedTopicId && window.innerWidth < 1024) {
      teacherPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedTopicId]);

  // Realtime Sync for Premium Status
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('profile-premium-sync')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.is_premium === 'boolean') {
            const isAdmin = user.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com';
            setIsPremium(isAdmin || payload.new.is_premium);
            console.log('Premium status synced:', payload.new.is_premium);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

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
    // Admin and Real Premium are exempt
    const isAdmin = user?.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com';
    // We need to fetch/know real premium status here. 
    // Since 'isPremium' is now potentially "fake true" for demo, we must rely on a stricter check.
    // However, to keep it simple: If it's a demo user (isPremium=true but NOT admin), we enforce the limit.

    // STRICT DEMO RULE: Even if unlocked, if you are not Admin, you have 10 mins.
    if (step !== 'call') return;

    if (isAdmin) return; // Admins are gods.

    // Everyone else (Demo or Free) gets 10 minutes. 
    // If they have a REAL subscription, they should be exempt. 
    // But currently, only Admin has a real subscription in this context.

    // Logic: Limit is enforced for EVERYONE except Admin during this "Demo Pitch" phase.

    const FREE_LIMIT_MINUTES = 10;
    const interval = setInterval(() => {
      if (sessionStartTime) {
        const elapsedMinutes = (Date.now() - sessionStartTime) / 60000;
        const totalUsed = dailyMinutesUsed + elapsedMinutes;

        // Warning at 9 minutes (1 minute remaining)
        if (!isPremium && totalUsed >= 9 && totalUsed < FREE_LIMIT_MINUTES && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          if (sessionRef.current && sessionRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending Time Warning to AI...');
            sessionRef.current.send(JSON.stringify({
              client_content: {
                turns: [{
                  role: 'user',
                  parts: [{
                    text: `[SISTEMA - ALERTA DE TEMPO]: O usuário tem apenas 1 minuto restante na conta gratuita. Por favor, avise-o educadamente que a aula vai acabar em breve e que ele precisa assinar o plano PRO para continuar conversando sem limites. Comece a se despedir.`
                  }]
                }],
                turn_complete: true
              }
            }));
          }
        }

        if (totalUsed >= FREE_LIMIT_MINUTES) {
          endCall();
          setUpgradeModalReason('time_limit');
          setShowUpgradeModal(true);
          setConnectionError("Tempo limite diário atingido. Assine o PRO para continuar!");
        }
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [step, isPremium, sessionStartTime, dailyMinutesUsed, user]);

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
          channelCount: 1,
          // @ts-ignore - Chrome specific constraints
          googEchoCancellation: true,
          googAutoGainControl: true,
          googNoiseSuppression: true,
          googHighpassFilter: true
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
      const ws = new WebSocket('wss://linguaflow-proxy-458232577422.us-central1.run.app');
      sessionRef.current = ws;

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
              - NÍVEL B1 (INTERMEDIÁRIO - Protocolo "Mixed Immersion"):
                1. AUMENTAR CARGA DE INGLÊS: Fale misturado (Português/Inglês) mas force o uso de termos em inglês.
                2. EXIGÊNCIA DE OUTPUT: Se o aluno falar em português, entenda, mas peça gentilmente: "Can you try to say that in English?".
                3. CORREÇÃO ATIVA: Corrija erros de pronúncia e gramática. O objetivo é destravar a fala, mesmo que errada, para poder corrigir.
                4. VOCABULÁRIO: Use palavras em inglês no meio de frases em português para acostumar o ouvido (Code-Switching).
                5. META: Fazer o aluno suar a camisa. Tire ele da zona de conforto do português.
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
              - FOCO AUDITIVO ABSOLUTO: O aluno pode estar em ambiente ruidoso (Carro, Rua, TV). IGNORE completamente sons de fundo, músicas ou vozes paralelas. Foque EXCLUSIVAMENTE na voz principal que fala diretamente com você. Se não entender, peça para repetir com gentileza.

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
          // Optimized Buffer Size: 2048 (approx 40ms latency at 48kHz) vs 4096 (85ms)
          const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);

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
                    setTopicProgress(prev => {
                      const current = prev[selectedTopicId] || {
                        topic_id: selectedTopicId,
                        score: 0,
                        status: 'unlocked',
                        current_level: 1.0,
                        total_minutes: 0
                      };
                      return {
                        ...prev,
                        [selectedTopicId]: {
                          ...current,
                          score: report.score,
                          status: report.score >= 80 ? 'completed' : 'unlocked'
                        }
                      };
                    });
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

      // Persistence: Create Session Record
      if (user && selectedTeacherId && selectedLanguage && selectedTopicId) {
        try {
          const { data: sessionData, error: sessionError } = await supabase.from('sessions').insert({
            user_id: user.id,
            teacher_id: selectedTeacherId,
            language: selectedLanguage,
            topic_id: selectedTopicId,
            start_time: new Date().toISOString(),
            status: 'started'
          }).select().single();

          if (sessionData) {
            setCurrentSessionId(sessionData.id);
            console.log('✅ Session started:', sessionData.id);
          } else if (sessionError) {
            console.error('❌ Error creating session:', sessionError);
          }
        } catch (err) {
          console.error('❌ Unexpected error creating session:', err);
        }
      }

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

    // Update Session in Database
    if (currentSessionId && user) {
      const endTime = new Date();
      const duration = sessionStartTime ? Math.floor((endTime.getTime() - sessionStartTime) / 1000) : 0;

      await supabase.from('sessions').update({
        end_time: endTime.toISOString(),
        duration_seconds: duration,
        status: 'completed'
      }).eq('id', currentSessionId);
    }

    setSessionStartTime(null);
    setCurrentSessionId(null);

    // Update Progress
    // Update Progress
    // Update Progress
    if (selectedTopicId && user) {
      // ... (rest of progress logic matches existing)
      const elapsedMinutesForProgress = sessionStartTime ? Math.ceil((Date.now() - sessionStartTime) / 60000) : 0;

      // MINIMUM DURATION CHECK:
      // Only update progress (level/score) if session lasted at least 10 minutes.
      if (elapsedMinutesForProgress >= 10) {
        // @ts-ignore - Validating runtime type or fallback
        const currentVal = topicProgress[selectedTopicId];
        const currentProgressObj: UserProgress = (currentVal && typeof currentVal === 'object') ? currentVal : {
          topic_id: selectedTopicId,
          score: 0,
          status: 'unlocked',
          current_level: 1.0,
          total_minutes: 0
        };

        const newTotalMinutes = (currentProgressObj.total_minutes || 0) + elapsedMinutesForProgress;

        // Leveling Logic: 70 min per sub-level, 5 sub-levels per major level
        const MINUTES_PER_SUBLEVEL = 70;
        const SUBLEVELS_PER_MAJOR = 5;

        const totalSteps = Math.floor(newTotalMinutes / MINUTES_PER_SUBLEVEL);

        const majorLevel = 1 + Math.floor(totalSteps / SUBLEVELS_PER_MAJOR);
        const minorLevel = totalSteps % SUBLEVELS_PER_MAJOR;

        const newLevel = parseFloat(`${majorLevel}.${minorLevel}`);

        // Percentage of current bar
        const newPercentage = Math.min(100, Math.round(((newTotalMinutes % MINUTES_PER_SUBLEVEL) / MINUTES_PER_SUBLEVEL) * 100));

        const updatedProgressNode: UserProgress = {
          ...currentProgressObj,
          score: newPercentage,
          current_level: newLevel,
          total_minutes: newTotalMinutes,
          status: 'unlocked'
        };

        setTopicProgress(prev => ({ ...prev, [selectedTopicId]: updatedProgressNode }));

        // Save to Supabase with Debugging
        try {
          console.log('📝 Saving progress:', { userId: user.id, level: newLevel, minutes: newTotalMinutes, percent: newPercentage });
          const { error: upsertError } = await supabase.from('user_progress').upsert({
            user_id: user.id,
            topic_id: selectedTopicId,
            score: newPercentage,
            current_level: newLevel,
            total_minutes: newTotalMinutes,
            status: 'unlocked'
          }, { onConflict: 'user_id, topic_id' });

          if (upsertError) console.error('❌ Error saving progress:', upsertError);
          else console.log('✅ Progress saved successfully');
        } catch (err) {
          console.error('❌ Unexpected error in progress save:', err);
        }
      } else {
        console.log(`⏳ Session too short for progress update (${elapsedMinutesForProgress}m). Minimum required: 10m.`);
      }
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
    localStorage.setItem('linguistai_tutorial_complete', 'true');
    if (user) {
      await supabase.from('profiles').update({ has_completed_tutorial: true }).eq('id', user.id);
    }
  };

  // Session Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  const toggleMute = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(t => t.enabled = !t.enabled);
      setIsMuted(m => !m);
    }
  }, [mediaStreamRef]);



  // --- END OF HOOKS ---

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950 text-orange-500"><Loader2 className="animate-spin w-10 h-10" /></div>;

  if (!user) {
    return <LoginScreen />;
  }

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
        <div className={`flex-1 flex flex-col items-center justify-between relative p-6 text-center bg-mesh overflow-hidden ${isKidsMode ? 'pt-24 md:pt-12' : ''}`}>
          {/* Background Blobs - Enhanced */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="blob blob-1 mix-blend-screen" style={{ width: '60vw', height: '60vw', left: '-10%', top: '-20%' }}></div>
            <div className="blob blob-2 mix-blend-overlay" style={{ width: '50vw', height: '50vw', right: '0%', bottom: '-10%' }}></div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-4 z-30 animate-in fade-in slide-in-from-right-4 duration-1000">
            {/* Premium/Free Badge */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md z-30 transition-colors ${isPremium
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'bg-slate-800/50 border-white/10 text-slate-400'
              }`}>
              {isPremium ? <Sparkles className="w-4 h-4 text-amber-400" /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
              <span className="font-bold text-xs tracking-wider">{isPremium ? 'PREMIUM' : 'FREE PLAN'}</span>
            </div>

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md z-30 transition-colors ${isKidsMode ? 'bg-white/80 border-[#ff6b6b] text-[#ff6b6b]' : 'bg-slate-900/50 border-white/10 text-orange-100 group hover:border-orange-500/30'}`}>
              <Flame className={`w-5 h-5 animate-pulse ${isKidsMode ? 'text-[#ff6b6b] fill-[#ff6b6b]' : 'text-orange-500 fill-orange-500'}`} />
              <span className="font-bold">{streak} Dias</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center w-full z-10 max-w-2xl relative">
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


            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-700 fill-mode-both mt-8 md:mt-12">
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

          {/* Footer for Welcome Screen */}
          <div className="w-full py-4 text-center text-[10px] text-slate-700 font-medium z-10 flex flex-col gap-2 pointer-events-auto flex-shrink-0">
            <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
              <button onClick={() => setActiveLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">Termos de Uso</button>
              <div className="w-[1px] h-2 bg-slate-800"></div>
              <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
            </div>
            <p>&copy; 2026 LinguaFlow AI - Paulinho Fernando. Todos os direitos reservados.</p>
            {user && <p className="opacity-30">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
          </div>
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
                  <h2 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
                    {isKidsMode ? 'Mapa de Aventuras' : 'Sua Jornada de Fluência'}
                  </h2>
                  <p className={`text-sm mt-2 font-medium leading-relaxed max-w-2xl ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-400'}`}>
                    {isKidsMode
                      ? 'Explore mundos mágicos e aprenda brincando!'
                      : 'Domine novas línguas e expanda seus horizontes, uma missão de cada vez.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto justify-end">
                  {/* Status & Upgrade Badge/Button */}
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${isPremium
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-800/50 border-white/10 text-slate-400'
                      }`}>
                      {isPremium ? <Sparkles className="w-3.5 h-3.5 text-amber-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                      <span className="font-bold text-[10px] tracking-wider uppercase">{isPremium ? 'PREMIUM' : 'FREE PLAN'}</span>
                    </div>

                    {!isPremium && (
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className={`btn-shimmer px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all ${isKidsMode ? 'bg-[#ff6b6b] text-white shadow-[#ff6b6b]/20' : 'bg-orange-500 text-white shadow-orange-500/20'}`}
                      >
                        <Zap className="w-3 h-3 fill-current" /> SEJA PRO
                      </button>
                    )}
                  </div>

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

                      {/* Teachers List */}
                      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-1 mb-4 min-h-[220px]">
                        {TEACHERS
                          .filter(t => t.language === selectedLanguage && ((isKidsMode ? t.isKidMode : !t.isKidMode) || t.id === 'pronunciation'))
                          .map(teacher => {
                            const currentPool = TEACHERS.filter(t => t.language === selectedLanguage && ((isKidsMode ? t.isKidMode : !t.isKidMode) || t.id === 'pronunciation'));
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
                                className={`w-full group relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${isSelected
                                  ? isKidsMode ? 'bg-[#4ecdc4]/10 border-[#4ecdc4]/50 shadow-md' : 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/5'
                                  : isKidsMode ? 'bg-white/50 border-[#4ecdc4]/10 hover:border-[#4ecdc4]/30' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                                  }`}
                              >
                                <div className="relative">
                                  <img src={teacher.avatar} className={`w-14 h-14 rounded-2xl object-cover border-2 transition-all duration-300 ${isSelected ? isKidsMode ? 'border-[#4ecdc4] shadow-md' : 'border-orange-500 shadow-lg shadow-orange-500/10' : isKidsMode ? 'border-[#4ecdc4]/20' : 'border-slate-800'} ${isLocked ? 'grayscale opacity-50' : ''}`} />
                                  {isSelected && <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 animate-pulse ${isKidsMode ? 'bg-[#ff6b6b] border-white' : 'bg-orange-500 border-slate-900'}`}></div>}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={`font-black text-lg tracking-tight truncate ${isSelected ? isKidsMode ? 'text-[#ff6b6b]' : 'text-white' : isKidsMode ? 'text-[#2d3748]' : 'text-slate-300'}`}>{teacher.name}</span>
                                    {isLocked && <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase tracking-tighter shadow-sm flex-shrink-0 ${isKidsMode ? 'bg-[#ff6b6b] text-white border-[#ff6b6b]/50' : 'bg-orange-500 text-white border-orange-400/50'}`}>PRO</span>}
                                  </div>
                                  <span className={`text-[10px] font-bold uppercase tracking-widest block truncate opacity-70 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500'}`}>{teacher.accent}</span>
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

              {/* Footer Static in Setup */}
              <div className="pt-8 pb-4 text-center text-[10px] text-slate-700 font-medium flex flex-col gap-2">
                <div className="flex items-center justify-center gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">Termos de Uso</button>
                  <div className="w-[1px] h-2 bg-slate-800"></div>
                  <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
                </div>
                <p>&copy; 2026 LinguaFlow AI - Paulinho Fernando. Todos os direitos reservados.</p>
                {user && <p className="opacity-30">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
              </div>
            </div>
          </div>
        )
      }

      {
        step === 'call' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
            {/* Live Timer Overlay */}
            <div className="absolute top-6 right-6 z-50 animate-in fade-in duration-700">
              <div className={`px-4 py-2 rounded-full border backdrop-blur-md flex items-center gap-2 ${isKidsMode ? 'bg-white/80 border-[#ff6b6b] text-[#ff6b6b] shadow-[0_0_15px_rgba(255,107,107,0.3)] animate-pulse' : 'bg-red-500/10 border-red-500/20 text-red-500 animate-pulse'}`}>
                <div className={`w-2 h-2 rounded-full ${isKidsMode ? 'bg-[#ff6b6b]' : 'bg-red-500'} animate-ping`} />
                <span className="text-xs font-black tracking-widest uppercase tabular-nums">
                  {/* Timer Display */}
                  {new Date(elapsedTime * 1000).toISOString().substr(14, 5)}
                </span>
              </div>
            </div>

            {/* Pronunciation Card Overlay */}
            {/* Pronunciation Card Overlay */}
            {selectedTopicId === 'pronunciation' && selectedLanguage && PRONUNCIATION_PHRASES[selectedLanguage] && (() => {
              const allPhrases = PRONUNCIATION_PHRASES[selectedLanguage];
              const filteredPhrases = allPhrases.filter(p => isKidsMode ? p.level === 'Kids' : p.level !== 'Kids');
              const currentPhrase = filteredPhrases[currentPhraseIndex];

              if (!currentPhrase) return null;

              return (
                <div className="absolute top-16 left-4 right-4 md:top-8 md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-20">
                  <div className={`glass-premium p-4 md:p-6 rounded-3xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] animate-in slide-in-from-top-4 ${isKidsMode ? 'bg-white/90 border-[#4ecdc4]/30' : ''}`}>
                    <div className="flex justify-between items-start mb-3 md:mb-4">
                      <div className="flex gap-2">
                        <span className={`px-2 py-0.5 md:px-3 md:py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${isKidsMode ? 'bg-[#ff6b6b]/20 text-[#ff6b6b] border-[#ff6b6b]/20' : 'bg-orange-500/20 text-orange-400 border-orange-500/20'}`}>
                          Frase {currentPhraseIndex + 1}/{filteredPhrases.length}
                        </span>
                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-slate-700/50 text-slate-300 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-white/5">
                          {currentPhrase.level || 'Geral'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setCurrentPhraseIndex(p => Math.max(0, p - 1))}
                          disabled={currentPhraseIndex === 0}
                          className={`p-1.5 md:p-2 rounded-lg disabled:opacity-30 transition-colors ${isKidsMode ? 'hover:bg-[#4ecdc4]/10 text-[#2d3748]' : 'hover:bg-white/10 text-white'}`}
                        >
                          <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                        <button
                          onClick={() => setCurrentPhraseIndex(p => Math.min(filteredPhrases.length - 1, p + 1))}
                          disabled={currentPhraseIndex === filteredPhrases.length - 1}
                          className={`p-1.5 md:p-2 rounded-lg disabled:opacity-30 transition-colors ${isKidsMode ? 'hover:bg-[#4ecdc4]/10 text-[#2d3748]' : 'hover:bg-white/10 text-white'}`}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isKidsMode && currentPhrase.image ? (
                      <div className="flex flex-col items-center gap-2 md:gap-4">
                        <div className="w-24 h-24 md:w-40 md:h-40 relative animate-bounce-slow">
                          <img
                            src={currentPhrase.image}
                            alt={currentPhrase.text}
                            className="w-full h-full object-contain filter drop-shadow-xl"
                          />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-display font-black text-[#2d3748] mb-1 text-center">
                          {currentPhrase.text}
                        </h3>
                        {/* <p className="text-slate-400 font-medium text-sm">{currentPhrase.translation}</p> */}
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl md:text-3xl font-display font-medium text-white mb-2 md:mb-3 leading-snug text-center">
                          "{currentPhrase.text}"
                        </h3>
                        <p className="text-slate-400 font-medium text-sm md:text-lg text-center">
                          {currentPhrase.translation}
                        </p>
                      </>
                    )}

                    <div className={`mt-4 md:mt-6 flex items-center justify-between text-xs ${isKidsMode ? 'text-slate-600' : 'text-slate-500'}`}>
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

      {/* PMF Survey Modal */}
      {showSurvey && user && (
        <SeanEllisSurvey
          onClose={() => setShowSurvey(false)}
          onComplete={handleSurveyComplete}
          userId={user.id}
        />
      )}
    </main >
  );
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/landingpage" element={<LandingPage onStart={() => window.location.href = '/'} />} />
      <Route path="/*" element={<MainApp />} />
    </Routes>
  );
};

export default App;

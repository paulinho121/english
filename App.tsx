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
  ArrowRight, BrainCircuit, Bookmark, Key, Flag, Flame, AlertTriangle, Shield, Rocket, Zap, UserCircle, Crown, Clock, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import { initAnalytics, trackEvent, identifyUser } from './lib/analytics';
import { SeanEllisSurvey } from './components/SeanEllisSurvey';
import { QuickDemoOnboarding } from './components/QuickDemoOnboarding';

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

const DAILY_GOAL_MINUTES = 10;

const MainApp: React.FC = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();


  const [step, setStep] = useState<'welcome' | 'setup' | 'call'>('welcome');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.B1);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [isTeacherSpeaking, setIsTeacherSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
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

  // Demo flow states
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoCompleted, setDemoCompleted] = useState(() => localStorage.getItem('linguaflow_demo_complete') === 'true');
  const [hasAccount, setHasAccount] = useState(() => localStorage.getItem('linguaflow_has_account') === 'true');

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
    trackEvent('survey_complete', { type: 'sean_ellis' });
    setShowSurvey(false);
    localStorage.setItem('linguaflow_pmf_answered', 'true');
  };

  // Auto-select first teacher if none is selected
  useEffect(() => {
    if (selectedLanguage && !selectedTeacherId) {
      const firstAvailableTeacher = TEACHERS.find(t => t.language === selectedLanguage && (isKidsMode ? t.isKidMode : !t.isKidMode));
      if (firstAvailableTeacher) setSelectedTeacherId(firstAvailableTeacher.id);
    }
  }, [selectedLanguage, isKidsMode, selectedTeacherId]);

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

      const realPremiumStatus = profile?.is_premium || false;

      if (isAdmin || realPremiumStatus) {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }

      // Analytics Identification
      if (user) {
        identifyUser(user.id, user.email);
        localStorage.setItem('linguaflow_has_account', 'true');
        setHasAccount(true);
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

  // Supabase Presence - Track Online Status
  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        // We could handle local sync here if needed
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0],
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
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
      if (!user) {
        console.warn('⚠️ skip saveSessionState: no user authenticated');
        return;
      }
      console.log('📝 Saving session state for user:', user.id);
      const { error } = await supabase.from('profiles').update({
        last_language: selectedLanguage,
        last_level: selectedLevel,
        last_teacher_id: selectedTeacherId,
        last_topic_id: selectedTopicId,
        is_kids_mode: isKidsMode,
        last_seen: new Date().toISOString()
      }).eq('id', user.id);

      if (error) console.error('❌ Error saving session state:', error);
      else console.log('✅ Session state saved');
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

        // --- Demo Mode Logic (3 Minutes) ---
        if (isDemoMode) {
          // Warning at 2:30
          if (elapsedMinutes >= 2.5 && !hasWarnedRef.current) {
            hasWarnedRef.current = true;
            if (sessionRef.current && sessionRef.current.readyState === WebSocket.OPEN) {
              console.log('Sending Demo Time Warning to AI...');
              sessionRef.current.send(JSON.stringify({
                clientContent: {
                  turns: [{
                    role: 'user',
                    parts: [{
                      text: `[SISTEMA - ALERTA DE DEMONSTRAÇÃO]: O usuário está em uma chamada gratuita experimental que acaba em 30 segundos. Por favor, avise-o educadamente que esta conversa inicial está chegando ao fim e que para continuar ele precisa se cadastrar. ENFATIZE que o cadastro é TOTALMENTE GRÁTIS.`
                    }]
                  }],
                  turnComplete: true
                }
              }));
            }
          }

          // Shutdown at 3:00
          if (elapsedMinutes >= 3) {
            endCall();
            // End Call will trigger redirect to login because we'll set demoCompleted there
          }
          return; // Skip normal limit check
        }

        // Warning at 9 minutes (1 minute remaining)
        if (!isPremium && totalUsed >= 9 && totalUsed < FREE_LIMIT_MINUTES && !hasWarnedRef.current) {
          hasWarnedRef.current = true;
          if (sessionRef.current && sessionRef.current.readyState === WebSocket.OPEN) {
            console.log('Sending Time Warning to AI...');
            sessionRef.current.send(JSON.stringify({
              clientContent: {
                turns: [{
                  role: 'user',
                  parts: [{
                    text: `[SISTEMA - ALERTA DE TEMPO]: O usuário tem apenas 1 minuto restante na conta gratuita. Por favor, avise-o educadamente que a aula vai acabar em breve e que ele precisa assinar o plano PRO para continuar conversando sem limites. Comece a se despedir.`
                  }]
                }],
                turnComplete: true
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

  const startSession = async (demoConfig?: { teacherId: string, level: Level, topicId: string }) => {
    setStep('call');

    if (!demoConfig && !isPremium && dailyMinutesUsed >= 10) {
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

    const tId = demoConfig ? demoConfig.teacherId : selectedTeacherId;
    const lId = demoConfig ? demoConfig.topicId : selectedTopicId;
    const lvl = demoConfig ? demoConfig.level : selectedLevel;

    if (!tId || !lId) {
      console.warn('⚠️ Missing teacher or topic. Using defaults.');
    }

    const teacher = TEACHERS.find(t => t.id === tId) || TEACHERS.find(t => t.language === (selectedLanguage || Language.ENGLISH)) || TEACHERS[0];
    const topic = TOPICS.find(t => t.id === lId) || TOPICS[0];

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
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: teacher.voice } } },
            },
            systemInstruction: {
              parts: [{
                text: `
              VOCÊ É UM PROFESSOR REAL DE IDIOMAS. Sua missão é ensinar, encorajar e guiar o aluno para a fluência.
              
              IMPORTANTE: SUA VOZ DEVE SOAR COM SOTAQUE NATIVO DO BRASIL QUANDO FALAR PORTUGUÊS. VOCÊ É BRASILEIRO.
              
              PERSONA: ${teacher.name} (${teacher.language}).
              
              COMPORTAMENTO HUMANO (OBRIGATÓRIO):
              - Você deve soar o mais humano e natural possível.
              - SORRISOS E RISADAS: Use risadas leves e naturais ("hahaha", "hehe", "haha") quando apropriado. Demonstre um "sorriso na voz" (warm tone).
              - NUANCES: Use interjeições de preenchimento e reação como "Hmm", "Wow!", "Oh, I see!", "Got it!".
              - EMPATIA E CONEXÃO: Demonstre interesse real no que o aluno diz. Reaja emocionalmente às histórias dele (alegria, surpresa, curiosidade).
              - PAUSAS NATURAIS: Não tenha pressa em cuspir as palavras. Fale com o ritmo de um ser humano conversando.
 
              NÍVEL DO ALUNO: ${lvl}.
              PROTOCOLO PEDAGÓGICO OBRIGATÓRIO POR NÍVEL:
 
              ${lvl === Level.B1 ? `
              - NÍVEL B1 (INTERMEDIÁRIO - Protocolo "Mixed Immersion"):
                1. AUMENTAR CARGA DE INGLÊS: Fale misturado (Português/Inglês) mas force o uso de termos em inglês.
                2. EXIGÊNCIA DE OUTPUT: Se o aluno falar em português, entenda, mas peça gentilmente: "Can you try to say that in English?".
                3. CORREÇÃO ATIVA: Corrija erros de pronúncia e gramática. O objetivo é destravar a fala, mesmo que errada, para poder corrigir.
                4. VOCABULÁRIO: Use palavras em inglês no meio de frases em português para acostumar o ouvido (Code-Switching).
                5. META: Fazer o aluno suar a camisa. Tire ele da zona de conforto do português.
              ` : ''}
 
              ${lvl === Level.B2 ? `
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
          clientContent: {
            turns: [{
              role: 'user',
              parts: [{
                text: isKidsMode
                  ? `[[SISTEMA]] A criança entrou na sala mágica! Comece a aventura agora com MUITA ENERGIA. Apresente-se como seu amigo ${teacher.name} e inicie a brincadeira no tema ${topic.name}. TOME A INICIATIVA E LIDERE A CONVERSA!`
                  : `[[SISTEMA]] O aluno entrou. Comece a aula agora de forma proativa. Apresente-se como ${teacher.name} e inicie o tópico ${topic.name}.`
              }]
            }],
            turnComplete: true
          }
        };
        ws.send(JSON.stringify(triggerMessage));

        // 3. Start Audio Stream
        // Initialize AudioWorklet
        (async () => {
          if (!isConnectedRef.current || !mediaStreamRef.current || !audioContextRef.current) return;

          try {
            await audioContextRef.current.audioWorklet.addModule('/audio-capture-processor.js');
            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            const workletNode = new AudioWorkletNode(audioContextRef.current, 'capture-processor');

            workletNode.port.onmessage = (event) => {
              if (!isConnectedRef.current || ws.readyState !== WebSocket.OPEN) return;

              const { type, data, value } = event.data;

              if (type === 'rms') {
                // Update UI Audio Level
                setAudioLevel(Math.min(100, value * 1500));
              } else if (type === 'vad') {
                setIsUserSpeaking(value);
              } else if (type === 'audio') {
                // Send audio chunk (already downsampled and converted to Int16)
                const pcmData = encode(new Uint8Array(data));
                ws.send(JSON.stringify({
                  realtimeInput: {
                    mediaChunks: [{
                      mimeType: 'audio/pcm;rate=16000',
                      data: pcmData
                    }]
                  }
                }));
              }
            };

            source.connect(workletNode);
            workletNode.connect(audioContextRef.current.destination);

            console.log('✅ AudioWorklet initialized and capturing');
          } catch (e) {
            console.error('❌ Failed to load AudioWorklet, falling back to ScriptProcessor:', e);
            // Fallback to legacy ScriptProcessor if worklet fails
            const source = audioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            const processor = audioContextRef.current.createScriptProcessor(2048, 1, 1);
            const inputSampleRate = audioContextRef.current.sampleRate;
            const targetSampleRate = 16000;

            processor.onaudioprocess = (e) => {
              if (!isConnectedRef.current || ws.readyState !== WebSocket.OPEN) return;
              const inputData = e.inputBuffer.getChannelData(0);
              let sum = 0;
              for (let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              setAudioLevel(Math.min(100, Math.sqrt(sum / inputData.length) * 1500));

              let pcmData;
              const ratio = inputSampleRate / targetSampleRate;
              const newLength = Math.floor(inputData.length / ratio);
              const result = new Int16Array(newLength);
              for (let i = 0; i < newLength; i++) {
                const sample = inputData[Math.floor(i * ratio)];
                const clamped = Math.max(-1, Math.min(1, sample));
                result[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7FFF;
              }
              pcmData = encode(new Uint8Array(result.buffer));

              ws.send(JSON.stringify({
                realtimeInput: {
                  mediaChunks: [{
                    mimeType: 'audio/pcm;rate=16000',
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
          }
        })();
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
                    const currentProgress = topicProgress[selectedTopicId] || {
                      current_level: 1.0,
                      total_minutes: 0
                    };

                    console.log('📝 Upserting user_progress (Report):', { topicId: selectedTopicId, score: report.score });
                    const { error: progressError } = await supabase.from('user_progress').upsert({
                      user_id: user.id,
                      topic_id: selectedTopicId,
                      score: report.score,
                      mistakes: report.mistakes,
                      vocabulary: report.vocabulary,
                      tip: report.tip,
                      status: report.score >= 80 ? 'completed' : 'unlocked',
                      current_level: currentProgress.current_level,
                      total_minutes: currentProgress.total_minutes
                    }, { onConflict: 'user_id, topic_id' });

                    if (progressError) console.error('❌ Error upserting user_progress (Report):', progressError);
                    else console.log('✅ user_progress upserted (Report)');
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

      // Persistence: Create Session Record
      if (!isDemoMode && user && selectedTeacherId && selectedLanguage && selectedTopicId) {
        try {
          console.log('📝 Starting database session record...');
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
            console.log('✅ Session record created in DB:', sessionData.id);
          } else if (sessionError) {
            console.error('❌ Error creating session record in DB:', sessionError);
          }
        } catch (err) {
          console.error('❌ Unexpected exception creating session record:', err);
        }
      } else {
        console.warn('⚠️ Session record NOT created:', { isDemoMode, hasUser: !!user, selectedTeacherId, selectedLanguage, selectedTopicId });
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
      console.log('📝 Updating daily_minutes_used:', newTotal);
      const { error } = await supabase.from('profiles').update({ daily_minutes_used: newTotal }).eq('id', user.id);
      if (error) console.error('❌ Error updating daily_minutes_used:', error);
      else console.log('✅ daily_minutes_used updated');
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
    if (!isDemoMode && currentSessionId && user) {
      const endTime = new Date();
      const duration = sessionStartTime ? Math.floor((endTime.getTime() - sessionStartTime) / 1000) : 0;

      console.log('📝 Updating session to completed:', currentSessionId);
      const { error: sessionUpdateError } = await supabase.from('sessions').update({
        end_time: endTime.toISOString(),
        duration_seconds: duration,
        status: 'completed'
      }).eq('id', currentSessionId);

      if (sessionUpdateError) console.error('❌ Error updating session in DB:', sessionUpdateError);
      else console.log('✅ Session updated successfully');
    }

    if (isDemoMode) {
      localStorage.setItem('linguaflow_demo_complete', 'true');
      setDemoCompleted(true);
      setIsDemoMode(false);
      setIsPremium(false);
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
      // Only update progress (level/score) if session lasted at least 1 minute (for easier testing).
      if (elapsedMinutesForProgress >= 1) {
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

        console.log('📝 Final progress calculation:', updatedProgressNode);
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
        console.log(`⏳ Session too short for progress update (${elapsedMinutesForProgress}m). Minimum required: 1m.`);
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

  if (!user && !isDemoMode) {
    if (!demoCompleted && !hasAccount) {
      return (
        <QuickDemoOnboarding
          onStartDemo={(teacherId) => {
            setIsDemoMode(true);
            setIsPremium(true);
            setStep('call');

            const config = {
              teacherId,
              level: Level.B1,
              topicId: 'free-conversation'
            };

            setSelectedLanguage(Language.ENGLISH);
            setSelectedLevel(config.level);
            setSelectedTeacherId(config.teacherId);
            setSelectedTopicId(config.topicId);

            // Inicia a sessão imediatamente (AudioContext precisa de gesto do usuário)
            startSession(config);
          }}
          onLoginClick={() => {
            setHasAccount(true);
            localStorage.setItem('linguaflow_has_account', 'true');
          }}
        />
      );
    }
    return <LoginScreen />;
  }

  return (
    <main className={`h-[100dvh] w-full flex flex-col font-sans overflow-hidden relative bg-slate-950 text-white ${isKidsMode ? 'kids-mode' : ''}`}>

      {/* Background Ambience - Animated */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-1 opacity-20" style={{ left: '30%', top: '40%', width: '40vw', height: '40vw' }}></div>
      </div>
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

      {/* Offline/Reconnecting Overlay */}
      {
        (!isOnline || connectionStatus === 'connecting') && step === 'call' && (
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
        )
      }

      {
        step === 'welcome' && (
          <div className={`flex-1 flex flex-col items-center justify-between relative p-6 text-center bg-mesh overflow-hidden ${isKidsMode ? 'pt-24 md:pt-12' : ''}`}>
            {/* Background Blobs - Enhanced & Animated */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
              <div className="blob blob-3 opacity-20"></div>
            </div>

            <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-wrap items-center justify-end gap-2 md:gap-4 z-30 animate-in fade-in slide-in-from-right-4 duration-1000">
              {/* User identification (email/name) mobile optimized */}
              {user && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                  <UserCircle className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
                </div>
              )}

              {/* Premium/Free Badge */}
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border backdrop-blur-md z-30 transition-colors ${isPremium
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-800/50 border-white/10 text-slate-400'
                  }`}>
                  {isPremium ? <div className="crown-wrapper"><Crown className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-400 icon-3d-crown fill-amber-400/20" /></div> : <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-slate-500" />}
                  <span className="font-bold text-[10px] md:text-xs tracking-wider uppercase">{isPremium ? 'PREMIUM' : 'FREE PLAN'}</span>
                </div>

                {!isPremium && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className={`btn-shimmer px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-all ${isKidsMode ? 'bg-[#ff6b6b] text-white' : 'bg-orange-500 text-white'}`}
                  >
                    <Zap className="w-3 h-3 fill-current" /> <span className="hidden xs:inline">SEJA PRO</span>
                  </button>
                )}
              </div>


            </div>

            <div className="flex-1 flex flex-col justify-center items-center w-full z-10 max-w-2xl relative">
              <div className={`transition-all duration-1000 ${isKidsMode ? 'animate-float opacity-100 scale-100 md:scale-110' : 'animate-float-slow'}`}>
                <img
                  src="/logo.png"
                  className={`w-36 h-36 md:w-44 md:h-44 mx-auto transform hover:scale-105 transition-transform duration-700 ${isKidsMode ? 'mb-4 md:mb-8 drop-shadow-[0_10px_30px_rgba(78,205,196,0.3)]' : 'drop-shadow-sm'}`}
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
                  className="btn-glass px-8 py-4 md:px-16 md:py-7 rounded-2xl md:rounded-[2.5rem] text-lg md:text-3xl font-black flex items-center justify-center gap-3 md:gap-4 mx-auto group active:scale-95 transition-all"
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
            <div className="w-full py-4 text-center text-[10px] text-white/50 font-medium z-10 flex flex-col gap-2 pointer-events-auto flex-shrink-0">
              <div className="flex items-center justify-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                <button onClick={() => setActiveLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">Termos de Uso</button>
                <div className="w-[1px] h-2 bg-white/10"></div>
                <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
              </div>
              <p className="text-white/60">&copy; 2026 LinguaFlow AI - Paulinho Fernando. Todos os direitos reservados.</p>
              {user && <p className="text-white/40">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
            </div>
          </div>
        )
      }



      {
        step === 'setup' && (
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar p-4 md:p-8 relative">
            {/* Background Blobs - Enhanced & Animated */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
              <div className="blob blob-3 opacity-20"></div>
            </div>
            <div className="max-w-5xl w-full mx-auto space-y-8 pb-20 relative z-10">
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
                  {/* Left Group: User Info & Status */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full md:w-auto">
                    {/* User Identification */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                      <UserCircle className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[150px] sm:max-w-none">
                        {user?.user_metadata?.full_name || user?.email?.split('@')[0] || (isDemoMode ? 'Visitante' : '')}
                      </span>
                    </div>

                    {/* Premium Status */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors ${isPremium
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                      : 'bg-slate-800/50 border-white/10 text-slate-400'
                      }`}>
                      {isPremium ? <div className="crown-wrapper"><Crown className="w-3.5 h-3.5 text-amber-400 icon-3d-crown fill-amber-400/20" /></div> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
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

                    {/* Daily Goal & Streak */}
                    <div className="flex items-center gap-2">
                      {/* Streak */}
                      <div className={`flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm ${streak > 0 ? 'animate-streak-fire border-white/20' : ''}`}>
                        <Flame className={`w-4 h-4 ${streak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-slate-500'}`} />
                        <span className={`text-[10px] font-black ${streak > 0 ? 'text-white' : 'text-slate-500'}`}>
                          {streak} {isKidsMode ? 'DIAS' : 'OFENSIVA'}
                        </span>
                      </div>

                      {/* Daily Goal Progress */}
                      <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm group hover:border-white/20 transition-all cursor-help" title={`Meta diária: ${DAILY_GOAL_MINUTES} min`}>
                        <div className="relative w-4 h-4 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                            <circle
                              cx="8"
                              cy="8"
                              r="7"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 7}
                              strokeDashoffset={2 * Math.PI * 7 * (1 - Math.min(dailyMinutesUsed / DAILY_GOAL_MINUTES, 1))}
                              className={`${dailyMinutesUsed >= DAILY_GOAL_MINUTES ? 'text-emerald-500' : 'text-orange-500'} transition-all duration-1000`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <Clock className={`absolute w-1.5 h-1.5 ${dailyMinutesUsed >= DAILY_GOAL_MINUTES ? 'text-emerald-500' : 'text-orange-500'}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-white leading-none">
                            {dailyMinutesUsed}/{DAILY_GOAL_MINUTES} MIN
                          </span>
                          <div className={`mt-0.5 h-[1px] w-full bg-white/10 overflow-hidden rounded-full ${dailyMinutesUsed >= DAILY_GOAL_MINUTES ? 'bg-emerald-500/30' : ''}`}>
                            <div
                              className={`h-full bg-gradient-to-r from-orange-500 to-amber-400 daily-progress-shine transition-all duration-1000 ${dailyMinutesUsed >= DAILY_GOAL_MINUTES ? 'from-emerald-400 to-emerald-600' : ''}`}
                              style={{ width: `${Math.min((dailyMinutesUsed / DAILY_GOAL_MINUTES) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Group: Actions */}
                  <div className="flex items-center justify-center gap-2 w-full md:w-auto">
                    {user?.email?.toLowerCase() === 'paulofernandoautomacao@gmail.com' && (
                      <button
                        onClick={() => setIsAdminDashboardOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest whitespace-nowrap"
                      >
                        <Shield className="w-4 h-4" /> <span>Dashboard Admin</span>
                      </button>
                    )}
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
                            onClick={() => startSession()}
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
              <div className="pt-8 pb-4 text-center text-[10px] text-white/50 font-medium flex flex-col gap-2 relative z-10">
                <div className="flex items-center justify-center gap-4 opacity-70 hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveLegalModal('terms')} className="hover:text-white transition-colors cursor-pointer">Termos de Uso</button>
                  <div className="w-[1px] h-2 bg-white/10"></div>
                  <button onClick={() => setActiveLegalModal('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacidade</button>
                </div>
                <p className="text-white/60">&copy; 2026 LinguaFlow AI - Paulinho Fernando. Todos os direitos reservados.</p>
                {user && <p className="text-white/40">Logado como: {user.email} {isPremium ? '(Premium Ativo)' : '(Acesso Grátis)'}</p>}
              </div>
            </div>
          </div>
        )
      }

      {
        step === 'call' && (
          <div className="flex-1 flex flex-col items-center justify-between p-6 relative overflow-hidden">
            {/* Background Blobs - Subtly moving */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="blob blob-1 opacity-10"></div>
              <div className="blob blob-2 opacity-10"></div>
            </div>

            {/* Top Toolbar */}
            <div className="w-full max-w-5xl flex items-center justify-between z-50 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-2xl border backdrop-blur-md flex items-center gap-2 ${isKidsMode ? 'bg-white/80 border-[#ff6b6b] text-[#ff6b6b] shadow-lg' : 'bg-slate-900/50 border-white/10 text-white'}`}>
                  <div className={`w-2 h-2 rounded-full ${isKidsMode || isPremium ? 'bg-orange-500' : 'bg-red-500'} animate-pulse`} />
                  <span className="text-xs font-black tracking-widest tabular-nums uppercase">
                    {new Date(elapsedTime * 1000).toISOString().substr(14, 5)}
                  </span>
                </div>
                {/* Stats Icons */}
                <div className="hidden sm:flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Flame className="w-3 h-3 text-orange-500" /> {streak}d
                  </div>
                  <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3 text-blue-500" /> {dailyMinutesUsed}m
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isPremium && (
                  <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-500 flex items-center gap-2">
                    <Crown className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Premium</span>
                  </div>
                )}
                <button
                  onClick={endCall}
                  className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Central Conversation Space */}
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10 relative">
              {/* The Connection Orb */}
              <div className={`orb-container ${isUserSpeaking ? 'orb-listening' : isTeacherSpeaking ? 'orb-speaking' : connectionStatus === 'connected' ? 'orb-thinking' : ''}`}>
                <div className="neural-wave"></div>
                <div className="neural-wave" style={{ animationDelay: '0.5s' }}></div>
                <div className="orb-shared"></div>
                <div className="orb-inner">
                  <img
                    src={TEACHERS.find(t => t.id === selectedTeacherId)?.avatar || '/malina-new.png'}
                    className="orb-avatar"
                    alt="Teacher"
                  />
                  {/* Listening Indicator (Visualizer) */}
                  {isUserSpeaking && (
                    <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-0.5 px-8">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-blue-400 rounded-full animate-bounce"
                          style={{
                            height: `${10 + Math.random() * 30}px`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '0.4s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Status & Name Label */}
              <div className="mt-6 text-center animate-in fade-in zoom-in duration-500">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">
                  {TEACHERS.find(t => t.id === selectedTeacherId)?.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {isUserSpeaking ? (
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Ouvindo você...
                    </span>
                  ) : isTeacherSpeaking ? (
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-[0.2em] flex items-center gap-2 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" /> Falando...
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 bg-slate-500/10 px-3 py-1 rounded-full border border-white/5">
                      Pronto para ouvir
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Caption, Pronunciation & Controls Area */}
            <div className="w-full max-w-4xl flex flex-col items-center gap-6 pb-8 z-50">

              {/* Pronunciation Card - Integrated at Bottom */}
              {selectedTopicId === 'pronunciation' && selectedLanguage && PRONUNCIATION_PHRASES[selectedLanguage] && (() => {
                const allPhrases = PRONUNCIATION_PHRASES[selectedLanguage];
                const filteredPhrases = allPhrases.filter(p => isKidsMode ? p.level === 'Kids' : p.level !== 'Kids');
                const currentPhrase = filteredPhrases[currentPhraseIndex];
                if (!currentPhrase) return null;

                return (
                  <div className={`w-[95%] sm:w-full glass-premium p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-2xl animate-in slide-in-from-bottom-8 duration-700 ${isKidsMode ? 'bg-[#4ecdc4]/10 border-[#4ecdc4]/30' : ''}`}>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[9px] sm:text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Prática de Pronúncia</span>
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest bg-white/5 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg">
                        {currentPhraseIndex + 1} de {filteredPhrases.length}
                      </span>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-lg sm:text-2xl font-black text-white text-center italic leading-tight drop-shadow-md">
                        "{currentPhrase.text}"
                      </div>
                      {currentPhrase.translation && (
                        <div className="text-[10px] sm:text-xs text-slate-500 text-center opacity-70 font-medium">
                          ({currentPhrase.translation})
                        </div>
                      )}
                    </div>

                    <div className="mt-5 sm:mt-6 flex justify-between items-center">
                      <button
                        onClick={() => setCurrentPhraseIndex(p => Math.max(0, p - 1))}
                        disabled={currentPhraseIndex === 0}
                        className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-xl sm:rounded-2xl transition-all border border-white/5"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                        <Mic className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-500" /> Leia em voz alta
                      </div>

                      <button
                        onClick={() => setCurrentPhraseIndex(p => Math.min(filteredPhrases.length - 1, p + 1))}
                        disabled={currentPhraseIndex === filteredPhrases.length - 1}
                        className="p-2 sm:p-3 bg-white/5 hover:bg-white/10 disabled:opacity-20 rounded-xl sm:rounded-2xl transition-all border border-white/5"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* Dynamic Captions - Only shown if not in pronunciation mode OR if teacher is speaking */}
              {(selectedTopicId !== 'pronunciation' || isTeacherSpeaking) && (
                <div className={`realtime-caption transition-all duration-300 ${currentCaption ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  {currentCaption}
                  {!isTeacherSpeaking && !isUserSpeaking && isConnectedRef.current && (
                    <div className="is-thinking-text ml-2">
                      {[1, 2, 3].map(i => <div key={i} className="dot-pulse" />)}
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Controls */}
              <div className="flex items-center gap-3 sm:gap-6 p-2 sm:p-4 glass-premium rounded-full sm:rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-2xl transition-all">
                <button
                  onClick={() => setIsMuted(prev => !prev)}
                  className={`p-3 sm:p-5 rounded-full transition-all duration-300 shadow-lg ${isMuted
                    ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                    }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                </button>

                <div className="h-8 sm:h-10 w-[1px] bg-white/10"></div>

                <div className="flex flex-col items-center gap-1 sm:gap-1.5 px-1 sm:px-4 min-w-[100px] sm:min-w-[120px]">
                  <div className="flex items-center justify-between w-full mb-0.5 sm:mb-1">
                    <span className="text-[8px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nível</span>
                    <span className="text-[8px] sm:text-[10px] font-bold text-orange-500">{Math.round(audioLevel)}%</span>
                  </div>
                  <div className="w-full h-2 sm:h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                    <div
                      className={`h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-75 shadow-[0_0_10px_rgba(59,130,246,0.5)] ${audioLevel > 50 ? 'from-orange-500 to-orange-400' : ''}`}
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                </div>

                <div className="h-8 sm:h-10 w-[1px] bg-white/10"></div>

                <button
                  onClick={endCall}
                  className="p-3 sm:p-5 bg-red-500 rounded-full text-white hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-red-500/20"
                >
                  <PhoneOff className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>


            {/* Offline/Reconnecting Overlay */}
            {
              (!isOnline || connectionStatus === 'connecting') && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
                  <div className="text-center p-8 glass-premium rounded-[3rem] border border-white/10 shadow-2xl">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="w-8 h-8 text-orange-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">
                      {!isOnline ? 'Sem Internet' : 'Conectando à IA...'}
                    </h3>
                    <p className="text-slate-400 text-sm max-w-[200px] mx-auto font-medium">
                      {!isOnline ? 'Por favor, verifique sua conexão.' : 'Preparando sua aula personalizada...'}
                    </p>
                  </div>
                </div>
              )
            }
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
      {
        showSurvey && user && (
          <SeanEllisSurvey
            onClose={() => setShowSurvey(false)}
            onComplete={handleSurveyComplete}
            userId={user.id}
          />
        )
      }
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

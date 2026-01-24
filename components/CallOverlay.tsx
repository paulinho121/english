import React from 'react';
import {
    X, Mic, MicOff, PhoneOff, Flame, Clock, Crown, ChevronLeft, ChevronRight, AlertTriangle, Globe, Loader2
} from 'lucide-react';
import { Teacher, Language, Level } from '../types';
import { TEACHERS, PRONUNCIATION_PHRASES } from '../constants';

interface CallOverlayProps {
    teacher: Teacher | undefined;
    isUserSpeaking: boolean;
    isTeacherSpeaking: boolean;
    connectionStatus: 'idle' | 'connecting' | 'connected';
    elapsedTime: number;
    streak: number;
    dailyMinutesUsed: number;
    isPremium: boolean;
    isKidsMode: boolean;
    isMuted: boolean;
    setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
    endCall: () => void;
    selectedTopicId: string | null;
    selectedLanguage: Language | null;
    currentCaption: string;
    audioLevel: number;
    currentPhraseIndex: number;
    setCurrentPhraseIndex: React.Dispatch<React.SetStateAction<number>>;
    isConnectedRef: React.MutableRefObject<boolean>;
    isOnline: boolean;
}

export const CallOverlay: React.FC<CallOverlayProps> = ({
    teacher,
    isUserSpeaking,
    isTeacherSpeaking,
    connectionStatus,
    elapsedTime,
    streak,
    dailyMinutesUsed,
    isPremium,
    isKidsMode,
    isMuted,
    setIsMuted,
    endCall,
    selectedTopicId,
    selectedLanguage,
    currentCaption,
    audioLevel,
    currentPhraseIndex,
    setCurrentPhraseIndex,
    isConnectedRef,
    isOnline
}) => {
    return (
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
                            <Flame className="w-4 h-4 text-orange-500 shrink-0" /> {streak}d
                        </div>
                        <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500 shrink-0" /> {dailyMinutesUsed}m
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isPremium && (
                        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-500 flex items-center gap-2">
                            <Crown className="w-4 h-4 fill-current shrink-0" />
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
                            src={teacher?.avatar || '/malina-new.png'}
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
                        {teacher?.name}
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
                                    <Mic className="w-3.5 h-3.5 text-orange-500 shrink-0" /> Leia em voz alta
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
    );
};

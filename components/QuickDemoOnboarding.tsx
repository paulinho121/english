import React, { useState } from 'react';
import { Sparkles, ArrowRight, Globe, LogIn } from 'lucide-react';

interface QuickDemoOnboardingProps {
    onStartDemo: (teacherId: string) => void;
    onLoginClick: () => void;
}

export const QuickDemoOnboarding: React.FC<QuickDemoOnboardingProps> = ({ onStartDemo, onLoginClick }) => {
    const [selectedTeacher, setSelectedTeacher] = useState<'malina-en' | 'geremy-en'>('malina-en');

    return (
        <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center p-4 md:p-6 relative overflow-hidden">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="w-full max-w-2xl mt-auto mb-auto relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Language Indicator */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 flex items-center gap-3 animate-float-slow">
                        <span className="text-2xl">🇺🇸</span>
                        <span className="text-white font-display font-bold tracking-wide text-sm">ENGLISH ACTIVATED</span>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    </div>
                </div>

                <div className="glass-premium rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-tight">
                        Fale Inglês <br />
                        <span className="text-glow text-orange-500">Agora Mesmo.</span>
                    </h1>

                    <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed">
                        Experimente uma conversa real com nossos mentores brasileiros. Sem cadastros, sem barreiras.
                    </p>

                    {/* Teachers Preview */}
                    <div className="flex justify-center items-center gap-6 md:gap-12 mb-12">
                        <button
                            onClick={() => setSelectedTeacher('malina-en')}
                            className={`flex flex-col items-center gap-3 group transition-all duration-300 ${selectedTeacher === 'malina-en' ? 'scale-110' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 p-1 transition-all duration-500 ${selectedTeacher === 'malina-en' ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-white/10 group-hover:border-white/30'}`}>
                                <img
                                    src="/malina-new.png"
                                    alt="Professora Malina"
                                    className="w-full h-full object-cover rounded-full bg-slate-800"
                                />
                            </div>
                            <span className={`font-display font-bold text-sm tracking-wide ${selectedTeacher === 'malina-en' ? 'text-orange-500' : 'text-white'}`}>MALINA</span>
                        </button>

                        <div className="h-12 w-px bg-white/10"></div>

                        <button
                            onClick={() => setSelectedTeacher('geremy-en')}
                            className={`flex flex-col items-center gap-3 group transition-all duration-300 ${selectedTeacher === 'geremy-en' ? 'scale-110' : 'opacity-50 hover:opacity-80'}`}
                        >
                            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 p-1 transition-all duration-500 ${selectedTeacher === 'geremy-en' ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'border-white/10 group-hover:border-white/30'}`}>
                                <img
                                    src="/geremy.png"
                                    alt="Professor Geremy"
                                    className="w-full h-full object-cover rounded-full bg-slate-800"
                                />
                            </div>
                            <span className={`font-display font-bold text-sm tracking-wide ${selectedTeacher === 'geremy-en' ? 'text-orange-500' : 'text-white'}`}>GEREMY</span>
                        </button>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                        <button
                            onClick={() => onStartDemo(selectedTeacher)}
                            className="btn-primary w-full max-w-md py-5 rounded-2xl flex items-center justify-center gap-3 text-xl shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            FALE AGORA
                            <ArrowRight className="w-6 h-6" />
                        </button>

                        <button
                            onClick={onLoginClick}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest group"
                        >
                            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            Já sou aluno • Fazer Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-auto pb-8 flex items-center gap-8 text-slate-500/40 relative z-10 translate-y-4 animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Global Learning</span>
                </div>
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">AI Mentorship</span>
                </div>
            </div>
        </div>
    );
};

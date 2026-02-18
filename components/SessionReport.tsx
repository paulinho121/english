import React, { useEffect } from 'react';
import { SessionReportData } from '../types';
import { Star, AlertTriangle, BookOpen, Lightbulb, Share2, RefreshCw, ArrowRight, Sparkles, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SessionReportProps {
    data: SessionReportData;
    onRestart: () => void;
}

export const SessionReport: React.FC<SessionReportProps> = ({ data, onRestart }) => {
    const [displayScore, setDisplayScore] = React.useState(0);

    useEffect(() => {
        if (data.score >= 80) {
            // Celebração para scores altos
            const duration = 3 * 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval: any = setInterval(function () {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 50 * (timeLeft / duration);
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
                confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
            return () => clearInterval(interval);
        }
    }, [data.score]);

    // Score Count-up Animation - UX: Dopamine loop for achievement
    useEffect(() => {
        let start = 0;
        const end = data.score;
        const duration = 1000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayScore(end);
                clearInterval(timer);
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [data.score]);

    const handleShare = async () => {
        const text = `Ganhei ${data.score} pontos praticando meu novo idioma no LinguaFlow AI! 🚀\n\nMinha dica de hoje: "${data.tip}"\n\nVenha destravar sua fluência também! #LinguaFlow #FluenciaIA`;
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Meu Progresso no LinguaFlow AI', text: text, url: window.location.origin });
            } catch (err) { console.log('Error sharing:', err); }
        } else {
            await navigator.clipboard.writeText(text + '\n' + window.location.origin);
            alert('Progresso copiado para a área de transferência! Compartilhe com seus amigos.');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 md:pb-6 overflow-y-auto w-full animate-in fade-in zoom-in-95 duration-700 relative">
            {/* Background Blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3 opacity-20"></div>
            </div>
            <div className="max-w-4xl w-full bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden z-10">

                {/* Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12">

                    {/* Left Column: Score - Progressive Step 1 */}
                    <div className="flex flex-col items-center justify-center space-y-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8 reveal-step" style={{ animationDelay: '0.1s' }}>
                        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Desempenho</h2>
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                                <circle
                                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - displayScore / 100)}
                                    className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className={`absolute flex flex-col items-center justify-center text-center ${displayScore === data.score ? 'score-pulse' : ''}`}>
                                <span className="text-6xl font-black text-white tracking-tighter">{displayScore}</span>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Pontos</span>
                            </div>
                        </div>
                        <div className="flex gap-1 text-emerald-400">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < Math.round(data.score / 20) ? 'fill-emerald-400 text-emerald-400' : 'text-slate-700'}`} />
                            ))}
                        </div>

                        {data.duration && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mt-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span className="text-sm font-mono text-slate-300">{data.duration}</span>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details - Progressive Step 2+ */}
                    <div className="flex-1 space-y-8 h-full overflow-y-auto custom-scrollbar pr-2">

                        {/* Strengths - Progressive Step 2 */}
                        {data.strengths && data.strengths.length > 0 && (
                            <div className="space-y-4 reveal-step" style={{ animationDelay: '0.3s' }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Pontos Fortes</h3>
                                </div>
                                <ul className="space-y-2">
                                    {data.strengths.map((str, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                            {str}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Improvements - Progressive Step 3 */}
                        {data.improvements && data.improvements.length > 0 && (
                            <div className="space-y-4 reveal-step" style={{ animationDelay: '0.5s' }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <RefreshCw className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Frases Ajustadas</h3>
                                </div>
                                <div className="grid gap-4">
                                    {data.improvements.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 opacity-60">
                                                    <span className="bg-red-500/10 text-red-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Você disse</span>
                                                    <span className="text-slate-300 text-sm italic">"{item.original}"</span>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <span className="bg-emerald-500/10 text-emerald-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Melhor seria</span>
                                                    <span className="text-emerald-400 font-medium text-sm">"{item.adjusted}"</span>
                                                </div>
                                                {item.explanation && (
                                                    <div className="flex items-start gap-2 text-xs text-slate-500 pl-2 border-l border-white/10 mt-2 italic leading-relaxed">
                                                        <span>💡</span>
                                                        <span>{item.explanation}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tip - Progressive Step 4 */}
                        <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 reveal-step" style={{ animationDelay: '0.7s' }}>
                            <div className="relative z-10">
                                <h4 className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">
                                    <Lightbulb className="w-4 h-4" /> Dica do Professor
                                </h4>
                                <p className="text-slate-200 text-sm leading-relaxed italic">"{data.tip}"</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions - Progressive Step 5 */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 reveal-step" style={{ animationDelay: '1s' }}>
                    <button onClick={handleShare} className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                        <Share2 className="w-4 h-4" /> Compartilhar Resultado
                    </button>
                    <button
                        onClick={onRestart}
                        className="w-full md:w-auto px-8 py-4 bg-white text-slate-950 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-lg active-haptic"
                    >
                        <RefreshCw className="w-5 h-5" /> Nova Sessão
                    </button>
                </div>
            </div>
        </div>
    );
};

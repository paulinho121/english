
import React from 'react';
import { SessionReportData } from '../types';
import { Star, AlertTriangle, BookOpen, Lightbulb, Share2, RefreshCw, ArrowRight, Sparkles, Clock } from 'lucide-react';

interface SessionReportProps {
    data: SessionReportData;
    onRestart: () => void;
}

export const SessionReport: React.FC<SessionReportProps> = ({ data, onRestart }) => {
    const handleShare = async () => {
        const text = `Ganhei ${data.score} pontos praticando meu novo idioma no LinguaFlow AI! 🚀\n\nMinha dica de hoje: "${data.tip}"\n\nVenha destravar sua fluência também! #LinguaFlow #FluenciaIA`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Meu Progresso no LinguaFlow AI',
                    text: text,
                    url: window.location.origin,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            await navigator.clipboard.writeText(text + '\n' + window.location.origin);
            alert('Progresso copiado para a área de transferência! Compartilhe com seus amigos.');
        }
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 md:pb-6 overflow-y-auto w-full animate-in fade-in zoom-in-95 duration-700 relative">
            {/* Background Blobs - Enhanced & Animated */}
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

                    {/* Left Column: Score */}
                    <div className="flex flex-col items-center justify-center space-y-6 md:w-1/3 border-b md:border-b-0 md:border-r border-white/5 pb-8 md:pb-0 md:pr-8">
                        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest">Desempenho</h2>
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-800"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - data.score / 100)}
                                    className={`text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className="text-6xl font-black text-white tracking-tighter">{data.score}</span>
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

                    {/* Right Column: Details */}
                    <div className="flex-1 space-y-8 h-full overflow-y-auto custom-scrollbar pr-2">

                        {/* Strengths */}
                        {data.strengths && data.strengths.length > 0 && (
                            <div className="space-y-4">
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

                        {/* Improvements (Adjusted Phrases) */}
                        {data.improvements && data.improvements.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <RefreshCw className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <h3 className="font-bold text-lg text-white">Frases Ajustadas (Soe mais natural)</h3>
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
                                                    <p className="text-xs text-slate-500 pl-2 border-l-2 border-white/10 mt-1">
                                                        💡 {item.explanation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Mistakes */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-lg text-white">Atenção (Erros)</h3>
                            </div>
                            <div className="grid gap-3">
                                {data.mistakes.map((item, idx) => (
                                    <div key={idx} className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-4">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-start gap-2">
                                                <span className="text-red-400 line-through text-sm opacity-70 decoration-2 decoration-red-500/50">"{item.mistake}"</span>
                                                <ArrowRight className="w-4 h-4 text-slate-600 mt-0.5 shrink-0" />
                                                <span className="text-emerald-400 font-medium text-sm">"{item.correction}"</span>
                                            </div>
                                            {item.explanation && (
                                                <p className="text-xs text-orange-300/70 mt-1">
                                                    ⚠️ {item.explanation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {data.mistakes.length === 0 && <p className="text-slate-500 text-sm italic">Nenhum erro grave detectado. Parabéns!</p>}
                            </div>
                        </div>

                        {/* Vocabulary */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-purple-500" />
                                </div>
                                <h3 className="font-bold text-lg text-white">Vocabulário Novo</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.vocabulary.map((item, idx) => (
                                    <div key={idx} className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-purple-500/20 transition-colors cursor-help" title={item.translation}>
                                        {item.word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lightbulb className="w-24 h-24 rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="flex items-center gap-2 text-indigo-400 font-bold uppercase text-xs tracking-widest mb-2">
                                    <Lightbulb className="w-4 h-4" /> Dica do Professor
                                </h4>
                                <p className="text-slate-200 text-sm leading-relaxed italic">"{data.tip}"</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <button
                        onClick={handleShare}
                        className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors"
                    >
                        <Share2 className="w-4 h-4" /> Compartilhar Resultado
                    </button>
                    <button
                        onClick={onRestart}
                        className="w-full md:w-auto px-8 py-4 bg-white text-slate-950 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-lg shadow-white/10"
                    >
                        <RefreshCw className="w-5 h-5" /> Nova Sessão
                    </button>
                </div>

            </div>
        </div>
    );
};


import React from 'react';
import { SessionReportData } from '../types';
import { Star, AlertTriangle, BookOpen, Lightbulb, Share2, RefreshCw, ArrowRight } from 'lucide-react';

interface SessionReportProps {
    data: SessionReportData;
    onRestart: () => void;
}

export const SessionReport: React.FC<SessionReportProps> = ({ data, onRestart }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 pb-24 md:pb-6 overflow-y-auto w-full animate-in fade-in zoom-in-95 duration-700">
            <div className="max-w-4xl w-full bg-slate-950/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

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
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex-1 space-y-8">

                        {/* Corrections */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="font-bold text-lg text-white">Correções Principais</h3>
                            </div>
                            <div className="grid gap-3">
                                {data.mistakes.map((item, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <span className="text-red-400 line-through text-sm opacity-70">"{item.mistake}"</span>
                                            <ArrowRight className="w-4 h-4 text-slate-600 mt-1 shrink-0" />
                                            <span className="text-emerald-400 font-medium text-sm">"{item.correction}"</span>
                                        </div>
                                    </div>
                                ))}
                                {data.mistakes.length === 0 && <p className="text-slate-500 text-sm italic">Nenhum erro grave detectado. Parabéns!</p>}
                            </div>
                        </div>

                        {/* Vocabulary */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-blue-500" />
                                </div>
                                <h3 className="font-bold text-lg text-white">Vocabulário</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.vocabulary.map((item, idx) => (
                                    <div key={idx} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium">
                                        {item.word} <span className="text-blue-500/50 mx-1">•</span> {item.translation}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tip */}
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Lightbulb className="w-24 h-24 rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <h4 className="flex items-center gap-2 text-purple-400 font-bold uppercase text-xs tracking-widest mb-2">
                                    <Lightbulb className="w-4 h-4" /> Dica do Professor
                                </h4>
                                <p className="text-slate-200 text-sm leading-relaxed italic">"{data.tip}"</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <button className="text-slate-400 hover:text-white flex items-center gap-2 text-sm font-bold transition-colors">
                        <Share2 className="w-4 h-4" /> Compartilhar Relatório
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

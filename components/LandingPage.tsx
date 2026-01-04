import React from 'react';
import { Rocket, Sparkles, Shield, Globe, Zap, MessageCircleHeart, CheckCircle2, ArrowRight, Star } from 'lucide-react';

interface LandingPageProps {
    onStart: () => void;
}

const USFlag = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
        <path d="M5 7h.01" />
        <path d="M8 6h.01" />
        <path d="M11 7h.01" />
        <path d="M14 6h.01" />
        <path d="M17 7h.01" />
        <path d="M5 10h.01" />
        <path d="M8 9h.01" />
        <path d="M11 10h.01" />
        <path d="M14 9h.01" />
        <path d="M17 10h.01" />
    </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-[100dvh] bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-orange-500/30">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob blob-1 opacity-40"></div>
                <div className="blob blob-2 opacity-30"></div>
            </div>

            {/* Header */}
            <header className="absolute top-0 w-full z-50 p-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 relative">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight hidden md:block">
                        Lingua<span className="text-orange-500">Flow</span>
                    </span>
                </div>
                <button
                    onClick={onStart}
                    className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 font-bold text-sm transition-all hover:scale-105 active:scale-95"
                >
                    Entrar
                </button>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex flex-col items-center justify-center text-center z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Acelerador de Fluência B1 • B2
                </div>

                <h1 className="text-5xl md:text-8xl font-display font-black tracking-tight leading-[1.1] mb-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">Chega de Travar</span>
                    <br />
                    <span className="text-glow text-orange-500">na Hora de Falar.</span>
                </h1>

                <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                    Você já entende bem, mas sente que não evolui? Transforme seu inglês <strong className="text-white">Intermediário</strong> em <strong className="text-white">Fluência Profissional</strong> com imersão ativa.
                </p>

                <button
                    onClick={onStart}
                    className="group relative px-8 py-5 md:px-12 md:py-6 bg-orange-500 rounded-[2rem] font-black text-xl md:text-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        DESTRAVAR MEU INGLÊS / START
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-[2rem] bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                <div className="mt-16 flex items-center gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest animate-in fade-in duration-1000 delay-1000">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Foco em Carreira</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fluência Rápida</span>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-16">O Salto do B1 para o C1</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="md:col-span-2 glass-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <USFlag className="w-48 h-48 text-orange-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6 text-orange-500">
                                <USFlag className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Inglês do Mundo Real</h3>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                Chega de diálogos robóticos. Simule reuniões de liderança, entrevistas de emprego tech e negociações internacionais.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="glass-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-30 transition-opacity text-blue-400">
                            <Zap className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Refine seu Sotaque</h3>
                            <p className="text-slate-400">
                                Pare de traduzir mentalmente. Ganhe a naturalidade e a velocidade de resposta que o mercado exige.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="glass-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-30 transition-opacity text-pink-400">
                            <Rocket className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
                                <Rocket className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Modo Família</h3>
                            <p className="text-slate-400">
                                Enquanto você domina o Business English, seus filhos aprendem brincando no modo dedicado para crianças.
                            </p>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="md:col-span-2 glass-premium p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity text-emerald-500">
                            <Shield className="w-48 h-48" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-6 text-emerald-500">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Sem Medo de Errar</h3>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                                O bloqueio mental acontece pelo medo do julgamento. Aqui, você treina com uma IA empática até se sentir 100% pronto para o mundo real.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
                <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-16">Resultados Reais</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            name: "Ricardo Souza",
                            role: "Tech Lead Senior",
                            text: "Eu lia documentação técnica fácil, mas travava nas Dailies com o time dos EUA. Em 3 semanas de imersão, minha confiança mudou da água para o vinho.",
                            stars: 5,
                            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces"
                        },
                        {
                            name: "Fernanda Lima",
                            role: "Gerente de Marketing",
                            text: "Precisava do B2 para uma promoção. O foco em 'Business English' do LinguaFlow foi cirúrgico. Consegui a vaga!",
                            stars: 5,
                            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces"
                        },
                        {
                            name: "Lucas Mendes",
                            role: "Empreendedor",
                            text: "Meu inglês era 'enferrujado'. A plataforma me ajudou a limpar o sotaque e ganhar vocabulário para vender meu produto lá fora.",
                            stars: 5,
                            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces"
                        }
                    ].map((t, i) => (
                        <div key={i} className="glass-premium p-8 rounded-3xl border border-white/5 flex flex-col gap-4">
                            <div className="flex items-center gap-1 text-orange-500 mb-2">
                                {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-slate-300 italic">"{t.text}"</p>
                            <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/5">
                                <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <div className="font-bold text-sm">{t.name}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 px-6 text-center z-10 relative">
                <h2 className="text-4xl md:text-6xl font-display font-black mb-8">Pronto para falar?</h2>
                <button
                    onClick={onStart}
                    className="group relative px-12 py-6 bg-white text-slate-950 rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        Começar Gratuitamente
                    </span>
                </button>
                <p className="mt-8 text-slate-500 text-sm font-bold uppercase tracking-widest">
                    &copy; 2026 LinguaFlow AI. Feito com amor por Paulinho Fernando.
                </p>
            </section>
        </div>
    );
}

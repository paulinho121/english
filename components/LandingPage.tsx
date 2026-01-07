import React, { useState, useEffect } from 'react';
import { Rocket, Sparkles, Shield, Globe, Zap, MessageCircleHeart, CheckCircle2, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [currentIndex, setCurrentIndex] = useState(0);

    const testimonials = [
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
        },
        {
            name: "Juliana Costa",
            role: "Product Manager",
            text: "A IA me corrigiu em vícios de linguagem que eu nem sabia que tinha. Melhorei minhas apresentações técnicas em tempo recorde.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces"
        },
        {
            name: "André Silva",
            role: "Software Engineer",
            text: "Impressionante como a IA entende termos técnicos e o contexto de desenvolvimento. É como ter um mentor de inglês 24/7.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces"
        },
        {
            name: "Beatriz Oliveira",
            role: "Sales Executive",
            text: "Perdi o medo de fazer cold calls internacionais. A prática constante aqui me deu a segurança necessária para negociar em dólar.",
            stars: 5,
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-sm" />
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

                <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
                    Transforme seu inglês <strong className="text-white">intermediário (B1–B2)</strong> em <strong className="text-white">fluência profissional</strong> treinando conversas reais com IA em tempo real.
                </p>

                <button
                    onClick={onStart}
                    className="group relative px-8 py-5 md:px-12 md:py-6 btn-glass rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        DESTRAVAR MEU INGLÊS / START
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>

                <div className="mt-16 flex items-center gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest animate-in fade-in duration-1000 delay-1000">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Foco em Carreira</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fluência Rápida</span>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-display font-black mb-6">Como Funciona</h2>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        A metodologia mais próxima de morar fora, sem sair de casa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            step: "01",
                            title: "Escolha seu Cenário",
                            description: "Selecione situações reais do dia a dia: reuniões de trabalho, entrevistas ou conversas sociais.",
                            icon: <Globe className="w-8 h-8" />,
                            color: "text-orange-500"
                        },
                        {
                            step: "02",
                            title: "Fale em Tempo Real",
                            description: "Pratique conversas naturais com nossa IA que entende contexto, gírias e nuances profissionais.",
                            icon: <Zap className="w-8 h-8" />,
                            color: "text-blue-500"
                        },
                        {
                            step: "03",
                            title: "Evolua com Feedback",
                            description: "Receba correções instantâneas e sugestões de como soar mais natural e profissional.",
                            icon: <Rocket className="w-8 h-8" />,
                            color: "text-emerald-500"
                        }
                    ].map((item, i) => (
                        <div key={i} className="glass-premium p-8 rounded-[2.5rem] border border-white/5 relative group hover:border-white/10 transition-all duration-300">
                            <div className="text-5xl font-black text-white/5 absolute top-6 right-8 group-hover:text-white/10 transition-colors">
                                {item.step}
                            </div>
                            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
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
                            <Zap className="w-40 h-40" />
                        </div>
                        <div className="relative z-10">
                            <div className="w-14 h-14 rounded-2xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Evolução Data-Driven</h3>
                            <p className="text-slate-400">
                                Acompanhe seu progresso com métricas detalhadas. Veja onde você está melhorando e quais áreas precisam de mais prática.
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

            {/* Testimonials Carousel */}
            <section className="py-24 px-6 max-w-4xl mx-auto z-10 relative overflow-hidden">
                <h2 className="text-4xl md:text-6xl font-display font-black text-center mb-16">Resultados Reais</h2>

                <div className="relative">
                    <div className="overflow-hidden p-4">
                        <div
                            className="flex transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((t, i) => (
                                <div key={i} className="w-full flex-shrink-0 px-4">
                                    <div className="glass-premium p-10 rounded-[3rem] border border-white/10 flex flex-col gap-6 shadow-2xl relative">
                                        <div className="flex items-center gap-1 text-orange-500">
                                            {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
                                        </div>
                                        <p className="text-xl md:text-2xl text-slate-100 italic leading-relaxed font-medium">
                                            "{t.text}"
                                        </p>
                                        <div className="flex items-center gap-5 mt-4 pt-6 border-t border-white/5">
                                            <img src={t.image} alt={t.name} className="w-16 h-16 rounded-full object-cover border-2 border-orange-500/20" />
                                            <div>
                                                <div className="font-bold text-lg text-white">{t.name}</div>
                                                <div className="text-sm text-slate-500 uppercase tracking-widest font-bold">{t.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <button
                        onClick={prev}
                        className="absolute left-[-2rem] top-1/2 -translate-y-1/2 p-4 rounded-full glass-premium border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition-all hidden md:flex z-20"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-[-2rem] top-1/2 -translate-y-1/2 p-4 rounded-full glass-premium border border-white/10 hover:border-orange-500/50 hover:text-orange-500 transition-all hidden md:flex z-20"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots */}
                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === i ? 'bg-orange-500 w-8' : 'bg-slate-700'}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-32 px-6 text-center z-10 relative">
                <h2 className="text-4xl md:text-6xl font-display font-black mb-8">Pronto para falar?</h2>
                <button
                    onClick={onStart}
                    className="group relative px-12 py-6 btn-glass rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl"
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

import React, { useState, useEffect } from 'react';
import {
    DollarSign,
    Server,
    Users,
    Building2,
    AlertTriangle,
    Lightbulb,
    ArrowRight,
    X,
    TrendingUp,
    ShieldAlert,
    Swords
} from 'lucide-react';

interface WalkthroughStep {
    title: string;
    description: string;
    details?: string[];
    icon: React.ReactNode;
    color: string;
}

interface FinancialWalkthroughProps {
    onClose: () => void;
}

export const FinancialWalkthrough: React.FC<FinancialWalkthroughProps> = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const steps: WalkthroughStep[] = [
        {
            title: "Relatório Financeiro de Startup",
            description: "Análise de custos operacionais e unit economics para o LinguistAI (Cenários B2C & B2B).",
            icon: <DollarSign className="w-12 h-12 text-green-500" />,
            color: "green",
            details: [
                "Arquitetura: Híbrida (Vercel + Supabase + Cloud Run)",
                "Modelo de IA: Gemini 1.5 Flash (WebSocket)",
                "Fator Crítico: Custo de Áudio em Tempo Real"
            ]
        },
        {
            title: "1. Custos Fixos (Infraestrutura)",
            description: "O custo mensal para manter a operação no ar, antes mesmo do primeiro cliente.",
            icon: <Server className="w-12 h-12 text-slate-400" />,
            color: "slate",
            details: [
                "Vercel (Frontend): $20/mês (Plano Pro)",
                "Supabase (Banco): $25/mês (Plano Pro)",
                "Cloud Run (Proxy AI): ~$50/mês (Instância Always On)",
                "TOTAL BASE: ~$95 - $105 USD / mês"
            ]
        },
        {
            title: "2. Unit Economics: B2C (Aluno)",
            description: "Custo por usuário individual (Aluno Frequente). Margem saudável.",
            icon: <Users className="w-12 h-12 text-blue-500" />,
            color: "blue",
            details: [
                "Perfil: 2 aulas/semana (30 min)",
                "Uso de Voz: ~60 min/mês",
                "Custo IA (Gemini Audio): ~$1.80/mês",
                "Preço Sugerido: R$ 29,90 (~$5.00)",
                "Lucro Bruto: ~60% (Margem Saudável)"
            ]
        },
        {
            title: "3. Unit Economics: B2B (Empresas)",
            description: "Custo para escolas/empresas. ATENÇÃO: Alto volume = Risco de Prejuízo.",
            icon: <Building2 className="w-12 h-12 text-orange-500" />,
            color: "orange",
            details: [
                "Perfil: Uso intensivo diário (Treinamento)",
                "Uso de Voz: ~480 min/mês (8 horas)",
                "Custo IA (Gemini Audio): ~$14.40/mês por usuário",
                "ALERTA: Se cobrar barato (ex: R$ 50), a margem some.",
                "Recomendação: Cobrar por 'Horas de Voz' ou Planos Enterprise > R$ 100."
            ]
        },
        {
            title: "4. Riscos Técnicos & Financeiros",
            description: "Onde o dinheiro pode vazar sem você perceber.",
            icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
            color: "red",
            details: [
                "Cloud Run Concurrency: Muitos alunos simultâneos exigem mais instâncias ($$$).",
                "Custo do Silêncio: Se o microfone ficar aberto ouvindo silêncio, você paga por processamento de IA inútil.",
                "Solução: VAD agressivo no Frontend (já implementado) e timeouts rigorosos."
            ]
        },
        {
            title: "5. Análise Competitiva",
            description: "Benchmark contra os 'Nativos de IA' (Speak, Praktika, Loora).",
            icon: <Swords className="w-12 h-12 text-purple-500" />,
            color: "purple",
            details: [
                "Preço Médio Deles: $15-$20 USD/mês (~R$ 100). Nosso Alvo: R$ 29,90.",
                "Diferencial B2B: Eles vendem o método deles. Nós vendemos a FERRAMENTA para escolas (White-label).",
                "Tecnologia: Praktika usa 3D (Pesado). Nós focamos em Latência Zero e Áudio Puro.",
                "Gap de Mercado: América Latina não paga $20/mês em massa. Temos preço local."
            ]
        },
        {
            title: "Conclusão & Estratégia",
            description: "O LinguistAI é viável, mas exige precisão na precificação do B2B.",
            icon: <Lightbulb className="w-12 h-12 text-yellow-500" />,
            color: "yellow",
            details: [
                "B2C: Mantenha o preço acessível, volume compensa.",
                "B2B: Venda pacotes de horas ou cobre caro.",
                "Feature Vital: Dashboard de consumo (este aqui!) para monitorar heavy users.",
                "Próximo Passo: Implementar limite rígido de horas para contas Free."
            ]
        }
    ];

    const currentData = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsVisible(false);
            setTimeout(onClose, 500);
        }
    };

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-xl transition-all duration-500 ${isVisible ? 'bg-slate-950/90 opacity-100' : 'bg-slate-950/0 opacity-0 pointer-events-none'}`}>
            <div className={`w-full max-w-2xl bg-slate-900/50 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-md transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 flex gap-0.5 p-1">
                    {steps.map((step, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-full rounded-full transition-all duration-500 ${i <= currentStep ? `bg-${step.color === 'slate' ? 'white' : steps[i].color + '-500'}` : 'bg-white/5'}`}
                        />
                    ))}
                </div>

                <div className="relative p-8 md:p-12">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className={`mb-8 p-6 rounded-[2rem] border border-white/5 bg-${currentData.color === 'white' ? 'slate-800' : currentData.color + '-500'}/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] shadow-${currentData.color}-500/20`}>
                            {currentData.icon}
                        </div>

                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {currentData.title}
                        </h2>

                        <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
                            {currentData.description}
                        </p>

                        {currentData.details && (
                            <div className="w-full bg-white/5 rounded-2xl p-6 mb-8 text-left border border-white/5 animate-in fade-in slide-in-from-bottom-6 duration-500 delay-200">
                                <ul className="space-y-3">
                                    {currentData.details.map((detail, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                                            <div className={`mt-1.5 w-1.5 h-1.5 rounded-full bg-${currentData.color}-500 shrink-0`} />
                                            <span>{detail}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleNext}
                            className={`w-full md:w-auto px-12 py-4 bg-white text-slate-900 hover:bg-slate-200 font-black rounded-2xl shadow-xl shadow-white/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95`}
                        >
                            {currentStep === steps.length - 1 ? 'Fechar Relatório' : 'Próximo Slide'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * LINGUAFLOW AI - Onboarding Tutorial Component
 * Copyright (c) 2026 Paulinho Fernando. All rights reserved.
 */

import React, { useState, useEffect } from 'react';
import {
    Sparkles,
    ArrowRight,
    CheckCircle2,
    LayoutGrid,
    UserCircle,
    Mic,
    Globe,
    X
} from 'lucide-react';

interface TutorialStep {
    title: string;
    description: string;
    icon: React.ReactNode;
    animation: string;
}

interface OnboardingTutorialProps {
    onComplete: () => void;
    isKidsMode?: boolean;
}

export const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete, isKidsMode }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const steps: TutorialStep[] = [
        {
            title: "Boas-vindas ao LinguaFlow!",
            description: "Sua jornada para a fluência começa agora. Vamos te mostrar rapidamente como aproveitar o app ao máximo.",
            icon: <Globe className="w-12 h-12 text-orange-500" />,
            animation: "animate-float"
        },
        {
            title: "Diferentes Tópicos",
            description: "Escolha o que deseja praticar no Mapa: desde Entrevistas de Emprego até Viagens e Cotidiano.",
            icon: <LayoutGrid className="w-12 h-12 text-blue-500" />,
            animation: "animate-pulse"
        },
        {
            title: "Mentores Especialistas",
            description: "Selecione seu professor favorito e defina o nível de dificuldade ideal para o seu momento.",
            icon: <UserCircle className="w-12 h-12 text-purple-500" />,
            animation: "animate-float-slow"
        },
        {
            title: "Pronto para Falar?",
            description: "É só clicar no botão 'Entrar na Aula' para iniciar uma conversa em tempo real com nossa IA via áudio.",
            icon: <Mic className="w-12 h-12 text-green-500" />,
            animation: "animate-pulse"
        }
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsVisible(false);
            setTimeout(onComplete, 500);
        }
    };

    const handleSkip = () => {
        setIsVisible(false);
        setTimeout(onComplete, 500);
    };

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center backdrop-blur-md transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${isKidsMode ? 'bg-white/60' : 'bg-slate-950/80'}`}>
            <div className={`w-full max-w-lg mx-4 border rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'} ${isKidsMode ? 'bg-white border-[#4ecdc4] shadow-[0_20px_50px_rgba(78,205,196,0.3)]' : 'bg-slate-900 border-white/10'}`}>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex gap-1 p-1">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 h-full rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-orange-500' : 'bg-white/10'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={handleSkip}
                    className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-10 pt-16 flex flex-col items-center text-center">
                    <div className={`mb-8 p-6 bg-white/5 rounded-[2rem] border border-white/5 ${steps[currentStep].animation}`}>
                        {steps[currentStep].icon}
                    </div>

                    <div className="min-h-[160px] flex flex-col items-center">
                        <h2 className={`text-3xl font-display font-black mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 ${isKidsMode ? 'text-slate-900' : 'text-white'}`}>
                            {steps[currentStep].title}
                        </h2>
                        <p className={`text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 ${isKidsMode ? 'text-slate-600' : 'text-slate-400'}`}>
                            {steps[currentStep].description}
                        </p>
                    </div>

                    <div className="mt-12 w-full flex flex-col gap-4">
                        <button
                            onClick={handleNext}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 group transition-all hover:scale-[1.02] active:scale-95"
                        >
                            {currentStep === steps.length - 1 ? 'Começar Agora!' : 'Próximo'}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={handleSkip}
                            className="text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest text-xs py-2 transition-colors"
                        >
                            Pular Tutorial
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

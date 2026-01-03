import React, { useState } from 'react';
import { trackEvent } from '../lib/analytics';
import { X, MessageSquareHeart } from 'lucide-react';

interface SeanEllisSurveyProps {
    onClose: () => void;
    onComplete: () => void;
}

export const SeanEllisSurvey: React.FC<SeanEllisSurveyProps> = ({ onClose, onComplete }) => {
    const [step, setStep] = useState<'question' | 'feedback' | 'thanks'>('question');
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');

    const options = [
        { value: 'very_disappointed', label: 'Muito desapontado' },
        { value: 'somewhat_disappointed', label: 'Um pouco desapontado' },
        { value: 'not_disappointed', label: 'Nada desapontado' },
    ];

    const handleOptionSelect = (value: string) => {
        setSelectedOption(value);
        setStep('feedback');

        // Track the main PMF metric immediately
        trackEvent('pmf_survey_response', { response: value });
    };

    const handleSubmitFeedback = () => {
        if (feedback.trim()) {
            trackEvent('pmf_survey_feedback', {
                response: selectedOption,
                feedback: feedback
            });
        }
        setStep('thanks');
        setTimeout(onComplete, 2500);
    };

    if (step === 'thanks') {
        return (
            <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="bg-slate-900 border border-orange-500/20 p-6 rounded-2xl shadow-2xl max-w-sm text-center">
                    <MessageSquareHeart className="w-10 h-10 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-lg">Obrigado!</h3>
                    <p className="text-slate-400 text-sm">Sua opinião ajuda a construir o futuro do LinguaFlow.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    {step === 'question' ? (
                        <>
                            <div className="mb-6">
                                <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">
                                    Pesquisa Rápida
                                </span>
                                <h2 className="text-2xl font-bold text-white leading-tight">
                                    Como você se sentiria se não pudesse mais usar o LinguaFlow?
                                </h2>
                            </div>

                            <div className="space-y-3">
                                {options.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleOptionSelect(option.value)}
                                        className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-orange-500/30 transition-all group flex items-center justify-between"
                                    >
                                        <span className="text-slate-300 group-hover:text-white font-medium">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-white mb-2">
                                O que podemos melhorar?
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">
                                (Opcional) Conte-nos o principal motivo da sua resposta.
                            </p>

                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full h-32 bg-slate-950 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 resize-none mb-4"
                                placeholder="Eu gostaria de..."
                            />

                            <button
                                onClick={handleSubmitFeedback}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors"
                            >
                                Enviar Feedback
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

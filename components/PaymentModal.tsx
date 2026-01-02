import React from 'react';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { stripeService } from '../lib/stripe';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    isKidsMode: boolean;
    userEmail?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, isKidsMode, userEmail }) => {
    if (!isOpen) return null;

    const handleSubscribe = () => {
        stripeService.redirectToCheckout(userEmail);
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full max-w-md mx-4 p-8 rounded-[2.5rem] border text-center relative overflow-hidden shadow-2xl ${isKidsMode
                    ? 'bg-white border-[#ff6b6b]/30 shadow-[#ff6b6b]/20'
                    : 'glass-premium border-orange-500/30'
                }`}>
                {/* Background Effects */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-50 ${isKidsMode ? 'bg-[#ff6b6b]/30' : 'bg-orange-500/20'}`}></div>
                <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-50 ${isKidsMode ? 'bg-[#4ecdc4]/30' : 'bg-purple-500/20'}`}></div>

                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${isKidsMode
                            ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                            : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-xl rotate-3 ${isKidsMode
                            ? 'bg-gradient-to-br from-[#ff6b6b] to-[#ff8e8e] shadow-[#ff6b6b]/30'
                            : 'bg-gradient-to-br from-orange-400 to-amber-600 shadow-orange-500/20'
                        }`}>
                        <Sparkles className="w-10 h-10 text-white animate-pulse" />
                    </div>

                    <h2 className={`text-3xl font-display font-black mb-3 ${isKidsMode ? 'text-slate-900' : 'text-white'}`}>
                        {isKidsMode ? 'Seja um Super Estudante!' : 'Upgrade para o PRO'}
                    </h2>

                    <p className={`${isKidsMode ? 'text-slate-600' : 'text-slate-400'} mb-8 leading-relaxed max-w-[80%]`}>
                        {isKidsMode
                            ? "Desbloqueie todos os poderes mágicos, aventuras ilimitadas e novos amigos!"
                            : "Desbloqueie acesso ilimitado a todos os mentores, níveis avançados e relatórios de IA."}
                    </p>

                    <div className="w-full space-y-3 mb-8 text-left">
                        {[
                            isKidsMode ? 'Aventuras Ilimitadas' : 'Tempo de conversação ilimitado',
                            isKidsMode ? 'Todos os Amigos Mágicos' : 'Acesso a todos os mentores',
                            isKidsMode ? 'Relatório de Super Poderes' : 'Feedback detalhado e avançado',
                            isKidsMode ? 'Sem interrupções' : 'Prioridade na fila de processamento'
                        ].map((feature, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isKidsMode ? 'bg-slate-50' : 'bg-white/5'}`}>
                                <CheckCircle2 className={`w-5 h-5 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-orange-500'}`} />
                                <span className={`font-medium ${isKidsMode ? 'text-slate-700' : 'text-slate-200'}`}>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full space-y-4">
                        <button
                            onClick={handleSubscribe}
                            className={`w-full py-4 rounded-xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isKidsMode
                                    ? 'btn-shimmer bg-[#ff6b6b] text-white shadow-[#ff6b6b]/30'
                                    : 'btn-primary shadow-orange-500/20'
                                }`}
                        >
                            <span>{isKidsMode ? 'Começar Agora' : 'Assinar Agora'}</span>
                            <span className={`text-sm opacity-80 font-normal ml-1`}>R$ 49,90/mês</span>
                        </button>

                        <p className={`text-xs ${isKidsMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Cancele quando quiser. Pagamento seguro via Stripe.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

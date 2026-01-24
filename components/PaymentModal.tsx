import React from 'react';
import { Crown, CheckCircle2, X, ShieldCheck } from 'lucide-react';
import { stripeService } from '../lib/stripe';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    isKidsMode: boolean;
    userEmail?: string;
    triggerReason?: 'user_action' | 'time_limit';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, isKidsMode, userEmail, triggerReason = 'user_action' }) => {
    if (!isOpen) return null;

    const handleStripe = () => {
        const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/test_placeholder';

        if (STRIPE_PAYMENT_LINK) {
            const url = new URL(STRIPE_PAYMENT_LINK);
            if (userEmail) {
                // Stripe uses 'prefilled_email' for Payment Links
                url.searchParams.set('prefilled_email', userEmail);
            }
            window.location.href = url.toString();
            return;
        }
        // Fallback to stripeService if VITE_STRIPE_PAYMENT_LINK is not set
        stripeService.redirectToCheckout(userEmail);
    };

    const handleHotmart = () => {
        const hotmartLink = import.meta.env.VITE_HOTMART_PAYMENT_LINK || 'https://pay.hotmart.com/I103658736V';
        const url = new URL(hotmartLink);
        if (userEmail) {
            url.searchParams.set('off_email', userEmail);
        }
        window.location.href = url.toString();
    };

    return (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className={`w-full max-w-md mx-4 p-8 rounded-[2.5rem] border text-center relative overflow-hidden shadow-2xl ${isKidsMode
                ? 'bg-white border-[#ff6b6b]/30 shadow-[#ff6b6b]/20'
                : 'glass-premium border-orange-500/30 ring-1 ring-orange-500/10'
                }`}>
                {/* Background Effects */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-50 ${isKidsMode ? 'bg-[#ff6b6b]/30' : 'bg-orange-500/20'}`}></div>
                <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-50 ${isKidsMode ? 'bg-[#4ecdc4]/30' : 'bg-purple-500/20'}`}></div>

                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                <button
                    onClick={onClose}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-20 ${isKidsMode
                        ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                        }`}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 flex flex-col items-center">
                    <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl rotate-3 ring-4 ${isKidsMode
                        ? 'bg-white shadow-[#ff6b6b]/30 ring-white'
                        : 'bg-slate-900 shadow-orange-500/30 ring-slate-800'
                        }`}>
                        <img
                            src="/logo.png"
                            alt="LinguaFlow AI Logo"
                            className="w-20 h-20 object-contain drop-shadow-md"
                        />
                    </div>

                    <h2 className={`text-3xl font-display font-black mb-3 leading-tight ${isKidsMode ? 'text-slate-900' : 'text-white'}`}>
                        {triggerReason === 'time_limit'
                            ? (isKidsMode ? 'Ops! O tempo acabou!' : 'Tempo Diário Esgotado')
                            : (isKidsMode ? 'Seja um Super Estudante!' : 'Acesso Premium')
                        }
                    </h2>

                    <p className={`${isKidsMode ? 'text-slate-600' : 'text-slate-300'} mb-8 leading-relaxed max-w-[90%] font-medium`}>
                        {triggerReason === 'time_limit'
                            ? (isKidsMode
                                ? "Oh não! O tempo de brincar acabou por hoje. Peça para seus pais para continuar a aventura!"
                                : "Seu tempo gratuito diário acabou. Assine o Premium para continuar sua jornada sem limites!")
                            : (isKidsMode
                                ? "Desbloqueie todos os poderes mágicos, aventuras ilimitadas e novos amigos!"
                                : "Desbloqueie todo o potencial da sua fluência com recursos exclusivos e ilimitados.")
                        }
                    </p>

                    <div className="w-full space-y-3 mb-8 text-left">
                        {[
                            isKidsMode ? 'Aventuras Ilimitadas' : 'Conversação Ilimitada em Tempo Real',
                            isKidsMode ? 'Todos os Amigos Mágicos' : 'Acesso a Todos os Mentores Nativos',
                            isKidsMode ? 'Relatório de Super Poderes' : 'Relatórios Detalhados de Progresso',
                            isKidsMode ? 'Sem interrupções' : 'Sem Filas de Espera'
                        ].map((feature, i) => (
                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${isKidsMode ? 'bg-slate-50 border-slate-100' : 'bg-white/5 border-white/5'
                                }`}>
                                <CheckCircle2 className={`w-5 h-5 shrink-0 ${isKidsMode ? 'text-[#4ecdc4]' : 'text-orange-500'}`} />
                                <span className={`font-medium ${isKidsMode ? 'text-slate-700' : 'text-slate-200'}`}>{feature}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full space-y-4">
                        <div className="w-full grid grid-cols-1 gap-4">
                            <button
                                onClick={handleHotmart}
                                className={`w-full py-4 rounded-xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${isKidsMode
                                    ? 'btn-shimmer bg-[#ff6b6b] text-white shadow-[#ff6b6b]/30'
                                    : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-orange-500/40 ring-1 ring-white/20'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                <span className="flex items-center gap-2">Pagar via Hotmart <div className="crown-wrapper"><Crown className="w-4 h-4 icon-3d-crown fill-amber-400/20" /></div></span>
                                <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Cartão, Pix ou Boleto</span>
                            </button>

                            <button
                                onClick={handleStripe}
                                className={`w-full py-4 rounded-xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden bg-slate-100 text-slate-900 shadow-slate-200/20 ring-1 ring-slate-200 border border-slate-300`}
                            >
                                <span className="flex items-center gap-2">Pagar via Stripe <ShieldCheck className="w-4 h-4" /></span>
                                <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Cartão de Crédito Global</span>
                            </button>

                            <div className={`flex items-center justify-center gap-2 text-xs opacity-70 mt-2 ${isKidsMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                <ShieldCheck className="w-3 h-3" />
                                <span>Pagamento 100% seguro • R$ 29,90/mês</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

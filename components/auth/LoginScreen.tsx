
import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Key, Phone, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
    const { sessionError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup' | 'phone'>('signin');
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Phone Auth States
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { error } = mode === 'signin'
                ? await supabase.auth.signInWithPassword({ email, password })
                : await supabase.auth.signUp({ email, password });

            if (error) throw error;
            if (mode === 'signup') {
                setMessage({ type: 'success', text: 'Verifique seu email para confirmar a conta!' });
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (!showOtpInput) {
                // Send OTP
                const { error } = await supabase.auth.signInWithOtp({ phone: phoneNumber });
                if (error) throw error;
                setShowOtpInput(true);
                setMessage({ type: 'success', text: 'Código enviado por SMS!' });
            } else {
                // Verify OTP
                const { error } = await supabase.auth.verifyOtp({ phone: phoneNumber, token: otp, type: 'sms' });
                if (error) throw error;
                // Success - AuthContext will pick up the user
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-orange-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="text-center mb-6 md:mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 flex items-center justify-center">
                        <img src="/logo.png" alt="LinguistAI Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Bem-vindo</h1>
                    <p className="text-slate-400 text-sm">Acesse sua conta para continuar sua jornada.</p>
                </div>

                {sessionError && (
                    <div className="mb-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-200">{sessionError}</p>
                    </div>
                )}

                {message && (
                    <div className={`mb-4 p-4 rounded-xl flex items-start gap-3 ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm">{message.text}</p>
                    </div>
                )}

                {mode === 'phone' ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                        {!showOtpInput ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Celular (com DDD)</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                    <input
                                        type="tel"
                                        placeholder="+55 11 99999-9999"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Código SMS</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 px-4 text-center text-2xl tracking-[0.5em] font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-orange-500 transition-colors"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (showOtpInput ? 'Confirmar Código' : 'Enviar SMS')}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Senha</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/20"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'signin' ? 'Entrar' : 'Criar Conta')}
                        </button>
                    </form>
                )}

                <div className="mt-6 flex flex-col gap-4">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-widest">Opções</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => { setMode(mode === 'phone' ? 'signin' : 'phone'); setMessage(null); }}
                            className="py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {mode === 'phone' ? <><LogIn className="w-4 h-4" /> Email</> : <><Phone className="w-4 h-4" /> Celular</>}
                        </button>
                        <button
                            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(null); }}
                            className="py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {mode === 'signup' ? 'Tenho Conta' : 'Criar Conta'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 text-slate-500/50 text-xs font-bold tracking-widest uppercase">
                Criado por Paulinho Fernando
            </div>
        </div>
    );
};

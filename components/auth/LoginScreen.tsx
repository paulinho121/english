import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { trackEvent } from '../../lib/analytics';
import { LogIn, Key, Phone, ArrowRight, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export const LoginScreen: React.FC = () => {
    const { sessionError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [mode, setMode] = useState<'signin' | 'signup' | 'phone' | 'reset_password'>('signin');
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Signup specific states
    const [fullName, setFullName] = useState('');
    const [signupPhone, setSignupPhone] = useState('');

    // Phone Auth States
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (mode === 'signup') {
                // 1. Sign Up
                const { data: { user }, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone_number: signupPhone
                        }
                    }
                });

                if (signUpError) throw signUpError;

                if (user) {
                    // 2. Create Profile Record explicitly to ensure consistency
                    const { error: profileError } = await supabase.from('profiles').insert({
                        id: user.id,
                        full_name: fullName,
                        phone_number: signupPhone,
                        current_session_id: Math.random().toString(36).substring(7),
                        last_seen: new Date().toISOString()
                    });

                    if (profileError) {
                        console.error('Profile creation warning:', profileError);
                    }

                    trackEvent('signup', { method: 'email' });
                    setMessage({ type: 'success', text: 'Conta criada! Verifique seu email.' });
                }
            } else {
                // Sign In
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                trackEvent('login', { method: 'email' });
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
                const { error } = await supabase.auth.signInWithOtp({
                    phone: phoneNumber,
                    // We can also upsert profile here if needed, but usually phone auth creates user first 
                });
                if (error) throw error;
                setShowOtpInput(true);
                setMessage({ type: 'success', text: 'Código enviado por SMS!' });
            } else {
                // Verify OTP
                const { data: { session }, error } = await supabase.auth.verifyOtp({ phone: phoneNumber, token: otp, type: 'sms' });
                if (error) throw error;

                // Ensure profile exists for phone user too
                if (session?.user) {
                    const { error: profileError } = await supabase.from('profiles').upsert({
                        id: session.user.id,
                        phone_number: phoneNumber,
                        current_session_id: Math.random().toString(36).substring(7),
                        last_seen: new Date().toISOString()
                    });
                    if (profileError) console.error(profileError);
                    trackEvent('login', { method: 'phone' });
                }
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin,
            });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Email de redefinição enviado! Verifique sua caixa de entrada.' });
            setTimeout(() => setMode('signin'), 5000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center p-4 md:p-6 relative overflow-y-auto custom-scrollbar">
            {/* Ambient Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            <div className="w-full max-w-md glass-premium p-6 md:p-10 rounded-[2.5rem] relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700 my-auto">
                <div className="text-center mb-8 md:mb-10">
                    <div className="w-24 h-24 md:w-36 md:h-36 mx-auto mb-4 md:mb-6 flex items-center justify-center group relative">
                        <img src="/logo.png" alt="LinguaFlow AI Logo" className="w-full h-full object-contain relative z-10 transform group-hover:scale-110 transition-transform duration-500 drop-shadow-sm" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-tight mb-2 text-glow">Bem-vindo</h1>
                    <p className="text-slate-300 font-medium">Acesse sua conta para continuar.</p>
                </div>

                {sessionError && (
                    <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-start gap-3 backdrop-blur-sm">
                        <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-orange-200 font-medium">{sessionError}</p>
                    </div>
                )}

                {message && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 backdrop-blur-sm ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                {mode === 'phone' ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-5">
                        {!showOtpInput ? (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Celular (com DDD)</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                                    <input
                                        type="tel"
                                        placeholder="+55 11 99999-9999"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Código SMS</label>
                                <input
                                    type="text"
                                    placeholder="000000"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 px-4 text-center text-3xl tracking-[0.5em] font-mono font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    maxLength={6}
                                    required
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-orange-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (showOtpInput ? 'Confirmar Código' : 'Enviar SMS')}
                        </button>
                    </form>
                ) : mode === 'reset_password' ? (
                    <form onSubmit={handlePasswordReset} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email para recuperação</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-orange-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Enviar Email'}
                        </button>

                        <button
                            type="button"
                            onClick={() => { setMode('signin'); setMessage(null); }}
                            className="w-full py-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Voltar para Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-5">
                        {mode === 'signup' && (
                            <>
                                <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Seu nome"
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Celular</label>
                                    <input
                                        type="tel"
                                        placeholder="(11) 99999-9999"
                                        value={signupPhone}
                                        onChange={e => setSignupPhone(e.target.value)}
                                        className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                        required
                                    />
                                </div>
                            </>
                        )}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 px-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                            <div className="relative group">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {mode === 'signin' && (
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => { setMode('reset_password'); setMessage(null); }}
                                    className="text-xs text-slate-400 hover:text-orange-400 transition-colors font-medium"
                                >
                                    Esqueceu sua senha?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 md:py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-orange-500/20"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (mode === 'signin' ? 'Entrar' : 'Criar Conta')}
                        </button>
                    </form>
                )}

                <div className="mt-8 flex flex-col gap-4">
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ou entre com</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => { setMode(mode === 'phone' ? 'signin' : 'phone'); setMessage(null); }}
                            className="py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-orange-500/30 active:scale-95"
                        >
                            {mode === 'phone' ? <><LogIn className="w-4 h-4" /> Email</> : <><Phone className="w-4 h-4" /> Celular</>}
                        </button>
                        <button
                            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(null); }}
                            className="py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-orange-500/30 active:scale-95"
                        >
                            {mode === 'signup' ? 'Tenho Conta' : 'Criar Conta'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-white/20 text-[10px] font-black tracking-[0.2em] uppercase text-center relative z-10 pb-4 mix-blend-plus-lighter">
                &copy; 2026 Paulinho Fernando. Todos os direitos reservados.
            </div>
        </div>
    );
};

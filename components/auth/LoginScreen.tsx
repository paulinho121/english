import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { trackEvent } from '../../lib/analytics';
import { LogIn, Key, Phone, ArrowRight, Loader2, AlertCircle, Sparkles, Building2, UserCircle } from 'lucide-react';

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

    // B2B States
    const [isB2B, setIsB2B] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [cnpj, setCnpj] = useState('');

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
                    let orgId = null;
                    if (isB2B) {
                        // Create Organization
                        const { data: orgData, error: orgError } = await supabase.from('organizations').insert({
                            name: orgName,
                            cnpj: cnpj,
                            plan_type: 'team',
                            max_seats: 5
                        }).select().single();

                        if (orgError) throw orgError;
                        orgId = orgData.id;
                    }

                    // 2. Create Profile Record explicitly to ensure consistency
                    const { error: profileError } = await supabase.from('profiles').insert({
                        id: user.id,
                        full_name: fullName,
                        phone_number: signupPhone,
                        organization_id: orgId,
                        org_role: isB2B ? 'admin' : 'member',
                        current_session_id: Math.random().toString(36).substring(7),
                        last_seen: new Date().toISOString()
                    });

                    if (profileError) {
                        console.error('Profile creation warning:', profileError);
                    }

                    trackEvent('signup', { method: 'email', type: isB2B ? 'b2b' : 'b2c' });
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

                {/* Account Type Switcher */}
                <div className="flex p-1 bg-slate-900/50 rounded-xl mb-6 border border-white/5">
                    <button
                        type="button"
                        onClick={() => { setIsB2B(false); setMode('signin'); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isB2B ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <UserCircle className="w-4 h-4" /> Para Você
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsB2B(true); setMode('signup'); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${isB2B ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Building2 className="w-4 h-4" /> Para Empresas
                    </button>
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
                                {isB2B && (
                                    <>
                                        <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome da Empresa</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="Sua Empresa Ltda"
                                                    value={orgName}
                                                    onChange={e => setOrgName(e.target.value)}
                                                    className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    required={isB2B}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2 animate-in slide-in-from-top-4 duration-300">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">CNPJ</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                                <input
                                                    type="text"
                                                    placeholder="00.000.000/0001-00"
                                                    value={cnpj}
                                                    onChange={e => setCnpj(e.target.value)}
                                                    className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    required={isB2B}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
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
                        <span className="flex-shrink-0 mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">Ou continue com</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <button
                        onClick={async () => {
                            setLoading(true);
                            try {
                                const { error } = await supabase.auth.signInWithOAuth({
                                    provider: 'google',
                                    options: {
                                        queryParams: {
                                            access_type: 'offline',
                                            prompt: 'consent',
                                        },
                                        redirectTo: window.location.origin
                                    }
                                });
                                if (error) throw error;
                            } catch (err: any) {
                                setMessage({ type: 'error', text: err.message });
                                setLoading(false);
                            }
                        }}
                        className="w-full py-4 rounded-2xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all flex items-center justify-center gap-3 hover:border-white/20 active:scale-95 bg-slate-900/50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Google
                    </button>

                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setMessage(null); }}
                            className="text-slate-400 text-sm font-medium hover:text-white transition-colors"
                        >
                            {mode === 'signup'
                                ? <>Já tem uma conta? <span className="text-blue-400 font-bold">Faça Login</span></>
                                : <>Não tem uma conta? <span className="text-blue-400 font-bold">Cadastre-se</span></>
                            }
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

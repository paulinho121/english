import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Loader2, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: 'Novo Professor' }
                    }
                });
                if (error) throw error;
                toast.success('Verifique seu e-mail para confirmar o cadastro!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success('Bem-vindo de volta!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro na autenticação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-fade-in">
                    <div className="flex flex-col items-center mb-10">
                        <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/20 mb-6 group hover:scale-110 transition-transform cursor-pointer">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight text-center">
                            Linguaflow<span className="text-indigo-600">Edu</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-center text-sm">O futuro do ensino começa aqui.</p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Endereço de E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-300"
                                    placeholder="seu@email.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Sua Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    {isSignUp ? 'Criar minha conta' : 'Entrar no Painel'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-indigo-600 font-bold text-sm hover:underline underline-offset-4"
                        >
                            {isSignUp ? 'Já tem conta? Entre aqui' : "Não tem conta? Crie uma agora"}
                        </button>
                    </div>
                </div>
                <p className="mt-8 text-center text-slate-300 text-xs font-medium">
                    Acesso Acadêmico Seguro • Linguaflow AI
                </p>
            </div>
        </div>
    );
};

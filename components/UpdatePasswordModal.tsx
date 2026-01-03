import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Key, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface UpdatePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpdatePasswordModal: React.FC<UpdatePasswordModalProps> = ({ isOpen, onClose }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    if (!isOpen) return null;

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;

            setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
            setTimeout(() => {
                onClose();
                // Optional: Force reload or just let user continue
            }, 2000);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-md glass-premium p-8 rounded-3xl border border-orange-500/20 shadow-2xl relative">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                        <Key className="w-8 h-8 text-orange-500" />
                    </div>
                    <h2 className="text-2xl font-display font-black text-white">Nova Senha</h2>
                    <p className="text-slate-400 text-sm mt-1">Defina sua nova senha de acesso.</p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'}`}>
                        {message.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> : <CheckCircle className="w-5 h-5 shrink-0" />}
                        <p className="text-sm font-medium">{message.text}</p>
                    </div>
                )}

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nova Senha</label>
                        <div className="relative group">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-900/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all font-medium"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-orange-500/20 font-bold"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Atualizar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
};

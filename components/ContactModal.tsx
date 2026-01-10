import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, Building2, UserCircle2, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ContactModalProps {
    onClose: () => void;
    initialType?: 'support' | 'business';
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, initialType = 'support' }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [type, setType] = useState<'support' | 'business'>(initialType);
    const [formData, setFormData] = useState({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        company_name: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from('contact_messages').insert([{
                user_id: user?.id,
                name: formData.name,
                email: formData.email,
                company_name: type === 'business' ? formData.company_name : null,
                message_type: type,
                subject: formData.subject,
                message: formData.message
            }]);

            if (error) throw error;
            setSent(true);
            setTimeout(onClose, 3000);
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Mensagem Enviada!</h2>
                    <p className="text-slate-400">Recebemos seu contato e retornaremos em breve no seu e-mail.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 my-auto">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">Fale Conosco</h2>
                        <p className="text-slate-400 text-sm">Como podemos ajudar você hoje?</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-8 h-8 text-slate-500 hover:text-white" />
                    </button>
                </div>

                {/* Type Selector */}
                <div className="grid grid-cols-2 gap-4 p-8 pb-0">
                    <button
                        onClick={() => setType('support')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${type === 'support' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                    >
                        <UserCircle2 className="w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-widest">Suporte</span>
                    </button>
                    <button
                        onClick={() => setType('business')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${type === 'business' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/10'}`}
                    >
                        <Building2 className="w-6 h-6" />
                        <span className="text-xs font-black uppercase tracking-widest">Empresas</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Seu Nome</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="Como se chama?"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">E-mail para Retorno</label>
                            <input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                                placeholder="seu@email.com"
                            />
                        </div>
                    </div>

                    {type === 'business' && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome da Empresa</label>
                            <input
                                required
                                type="text"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                                placeholder="Empresa LTDA"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assunto</label>
                        <input
                            required
                            type="text"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                            placeholder="Sobre o que quer falar?"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mensagem</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                            placeholder="Conte os detalhes..."
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${type === 'support' ? 'bg-orange-500 text-white shadow-orange-500/20 hover:bg-orange-600' : 'bg-blue-500 text-white shadow-blue-500/20 hover:bg-blue-600'}`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-5 h-5" />
                                Enviar Mensagem
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Shield, Zap, Search, X, Loader2, TrendingUp, Clock, Flame } from 'lucide-react';

interface UserProfile {
    id: string;
    email: string;
    full_name: string;
    is_premium: boolean;
    daily_minutes_used: number;
    streak_count: number;
    last_seen: string;
}

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        // Note: This requires the admin migration to be run in Supabase
        const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*')
            .order('last_seen', { ascending: false });

        if (!error && profiles) {
            // Profiles might not have email in the table, we'll need to join or handle separately 
            // but for this implementation we assume profile has email or we display ID/Name
            setUsers(profiles as UserProfile[]);
        }
        setLoading(false);
    };

    const togglePremium = async (userId: string, currentStatus: boolean) => {
        setUpdatingId(userId);
        const { error } = await supabase
            .from('profiles')
            .update({ is_premium: !currentStatus })
            .eq('id', userId);

        if (!error) {
            setUsers(users.map(u => u.id === userId ? { ...u, is_premium: !currentStatus } : u));
        }
        setUpdatingId(null);
    };

    const filteredUsers = users.filter(u =>
        u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalMinutes = users.reduce((acc, u) => acc + (u.daily_minutes_used || 0), 0);
    const premiumCount = users.filter(u => u.is_premium).length;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">Dashboard de Consumo</h2>
                        <p className="text-slate-400 text-sm">Monitoramento em tempo real dos usuários</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <X className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-slate-900/40">
                <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total de Alunos</p>
                        <p className="text-2xl font-black text-white">{users.length}</p>
                    </div>
                </div>

                <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Minutos Usados (Hoje)</p>
                        <p className="text-2xl font-black text-white">{totalMinutes} min</p>
                    </div>
                </div>

                <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
                        <Zap className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contas Premium</p>
                        <p className="text-2xl font-black text-white">{premiumCount}</p>
                    </div>
                </div>
            </div>

            {/* User Table Section */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar'}
                    </button>
                </div>

                <div className="flex-1 overflow-auto rounded-3xl border border-white/10 bg-slate-900/20 no-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                            <p className="text-slate-400 font-medium">Carregando usuários...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-slate-900 border-b border-white/10 z-10">
                                <tr>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuário</th>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano</th>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Consumo</th>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</th>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Último Acesso</th>
                                    <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black">
                                                    {u.full_name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{u.full_name || 'Sem Nome'}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono tracking-tighter truncate max-w-[120px]">{u.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            {u.is_premium ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
                                                    <Zap className="w-3 h-3 fill-orange-500" /> Premium
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-wider border border-white/5">
                                                    Grátis
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${u.daily_minutes_used >= 10 ? 'bg-red-500' : 'bg-orange-500'}`}
                                                        style={{ width: `${Math.min(100, (u.daily_minutes_used / 10) * 100)}%` }}
                                                    />
                                                </div>
                                                <span className={`text-xs font-bold ${u.daily_minutes_used >= 10 ? 'text-red-400' : 'text-slate-300'}`}>
                                                    {u.daily_minutes_used || 0} min
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2">
                                                <Flame className={`w-4 h-4 ${u.streak_count > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-700'}`} />
                                                <span className="text-xs font-bold text-slate-300">{u.streak_count || 0} dias</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-xs text-slate-500">
                                                {u.last_seen ? new Date(u.last_seen).toLocaleDateString('pt-BR') : 'Nunca'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => togglePremium(u.id, u.is_premium)}
                                                disabled={updatingId === u.id}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${u.is_premium
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'
                                                        : 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:scale-105 active:scale-95'
                                                    } disabled:opacity-50`}
                                            >
                                                {updatingId === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : (u.is_premium ? 'Remover Premium' : 'Tornar Premium')}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

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
    is_online?: boolean; // Added for real-time tracking
}

interface Coupon {
    id: string;
    code: string;
    description: string;
    discount_percentage: number;
    influencer_name: string;
    uses_count: number;
    max_uses: number;
    is_active: boolean;
    expires_at: string;
    created_at: string;
}

interface AdminDashboardProps {
    onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'users' | 'coupons'>('users');

    // Coupons state
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isCreatingCoupon, setIsCreatingCoupon] = useState(false);
    const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
        code: '',
        description: '',
        discount_percentage: 10,
        influencer_name: '',
        max_uses: 100,
        is_active: true
    });

    // Real-time Presence state
    const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchUsers();
        fetchCoupons();

        // Subscribe to Presence
        const channel = supabase.channel('online-users');
        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                const ids = new Set<string>();
                Object.values(state).forEach((presences: any) => {
                    presences.forEach((p: any) => ids.add(p.id));
                });
                setOnlineUserIds(ids);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, []);

    const fetchCoupons = async () => {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCoupons(data as Coupon[]);
        }
    };

    const createCoupon = async () => {
        if (!newCoupon.code) return;

        const { data, error } = await supabase
            .from('coupons')
            .insert([newCoupon])
            .select()
            .single();

        if (!error && data) {
            setCoupons([data as Coupon, ...coupons]);
            setIsCreatingCoupon(false);
            setNewCoupon({
                code: '',
                description: '',
                discount_percentage: 10,
                influencer_name: '',
                max_uses: 100,
                is_active: true
            });
        }
    };

    const toggleCouponStatus = async (couponId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('coupons')
            .update({ is_active: !currentStatus })
            .eq('id', couponId);

        if (!error) {
            setCoupons(coupons.map(c => c.id === couponId ? { ...c, is_active: !currentStatus } : c));
        }
    };

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
    const onlineCount = onlineUserIds.size;

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

            <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Alunos Online</p>
                    <p className="text-2xl font-black text-white">{onlineCount}</p>
                </div>
            </div>
        </div>

            {/* Tabs */ }
    <div className="px-6 flex gap-4 border-b border-white/5 bg-slate-900/20">
        <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-2 font-black text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'users' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            Alunos
        </button>
        <button
            onClick={() => setActiveTab('coupons')}
            className={`py-4 px-2 font-black text-xs uppercase tracking-widest transition-all border-b-2 ${activeTab === 'coupons' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
            Cupons (Influenciadores)
        </button>
    </div>

    {/* Content Section */ }
    <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {activeTab === 'users' ? (
            <>
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
                                                <div className="relative">
                                                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 font-black">
                                                        {u.full_name?.charAt(0) || '?'}
                                                    </div>
                                                    {onlineUserIds.has(u.id) && (
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950 animate-pulse" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                                                        {u.full_name || 'Sem Nome'}
                                                        {onlineUserIds.has(u.id) && <span className="ml-2 text-[8px] text-green-500 uppercase font-black tracking-widest">Online</span>}
                                                    </p>
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
            </>
        ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white">Gestão de Cupons</h3>
                        <p className="text-slate-500 text-sm">Crie códigos de desconto para seus influenciadores</p>
                    </div>
                    <button
                        onClick={() => setIsCreatingCoupon(true)}
                        className="px-6 py-3 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
                    >
                        Novo Cupom
                    </button>
                </div>

                <div className="flex-1 overflow-auto rounded-3xl border border-white/10 bg-slate-900/20 no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900 border-b border-white/10 z-10">
                            <tr>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Código</th>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Influenciador</th>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Desconto</th>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Uso</th>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="p-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {coupons.map((c) => (
                                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5">
                                        <span className="text-sm font-mono font-black text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                                            {c.code}
                                        </span>
                                    </td>
                                    <td className="p-5 text-sm font-bold text-slate-300">{c.influencer_name}</td>
                                    <td className="p-5 text-sm font-bold text-white">{c.discount_percentage}%</td>
                                    <td className="p-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                                <span>{c.uses_count} / {c.max_uses}</span>
                                            </div>
                                            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${(c.uses_count / c.max_uses) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        {c.is_active ? (
                                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20 uppercase tracking-tighter">Ativo</span>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-500 bg-slate-800 px-2 py-1 rounded-full border border-white/5 uppercase tracking-tighter">Inativo</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right">
                                        <button
                                            onClick={() => toggleCouponStatus(c.id, c.is_active)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${c.is_active ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'}`}
                                        >
                                            {c.is_active ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">Nenhum cupom criado ainda.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>

    {/* Create Coupon Modal */ }
    {
        isCreatingCoupon && (
            <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-white">Novo Cupom</h3>
                        <button onClick={() => setIsCreatingCoupon(false)} className="p-2 hover:bg-white/5 rounded-full">
                            <X className="w-6 h-6 text-slate-500" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Código do Cupom</label>
                            <input
                                type="text"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors uppercase font-mono"
                                placeholder="EX: LINGUA20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Desconto (%)</label>
                                <input
                                    type="number"
                                    value={newCoupon.discount_percentage}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, discount_percentage: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Max de Usos</label>
                                <input
                                    type="number"
                                    value={newCoupon.max_uses}
                                    onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: parseInt(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Nome do Influenciador</label>
                            <input
                                type="text"
                                value={newCoupon.influencer_name}
                                onChange={(e) => setNewCoupon({ ...newCoupon, influencer_name: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                placeholder="Nome do parceiro"
                            />
                        </div>

                        <button
                            onClick={createCoupon}
                            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
                        >
                            Criar Cupom Premiado
                        </button>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    );
};
        </div >
    );
};

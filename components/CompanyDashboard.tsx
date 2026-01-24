import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Shield, Loader2, X, PlusCircle, Mail, Clock, Flame, Building2 } from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    plan_type: string;
    max_seats: number;
}

interface OrgMember {
    id: string;
    full_name: string;
    email: string;
    daily_minutes_used: number;
    streak_count: number;
    org_role: 'admin' | 'member';
    last_seen: string;
}

interface CompanyDashboardProps {
    onClose: () => void;
    currentUserId: string;
}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ onClose, currentUserId }) => {
    const [loading, setLoading] = useState(true);
    const [organization, setOrganization] = useState<Organization | null>(null);
    const [members, setMembers] = useState<OrgMember[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');

    useEffect(() => {
        fetchCompanyData();
    }, [currentUserId]);

    const fetchCompanyData = async () => {
        setLoading(true);
        try {
            // 1. Get User's Organization ID
            const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', currentUserId).single();

            if (profile?.organization_id) {
                // 2. Fetcg Org Details
                const { data: org } = await supabase.from('organizations').select('*').eq('id', profile.organization_id).single();
                setOrganization(org);

                // 3. Fetch Members
                const { data: companyMembers } = await supabase
                    .from('profiles')
                    .select('id, full_name, email, daily_minutes_used, streak_count, org_role, last_seen')
                    .eq('organization_id', profile.organization_id)
                    .order('daily_minutes_used', { ascending: false });

                setMembers(companyMembers as OrgMember[] || []);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyInvite = () => {
        // Implementation for inviting via link (Future feature)
        alert('Funcionalidade de link de convite em breve! Por enquanto, adicione manualmente via Suporte.');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white">{organization?.name || 'Minha Empresa'}</h2>
                        <p className="text-slate-400 text-sm">Painel de Gestão de Equipe</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <X className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                    <p className="text-slate-400 font-medium">Carregando dados da equipe...</p>
                </div>
            ) : !organization ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
                    <Building2 className="w-16 h-16 text-slate-700 mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">Você não está em uma organização</h3>
                    <p className="text-slate-400 mb-6">Entre em contato com o suporte para criar uma conta corporativa para sua empresa.</p>
                    <button onClick={onClose} className="px-6 py-3 bg-white/5 rounded-xl text-white font-bold hover:bg-white/10">Voltar</button>
                </div>
            ) : (
                <div className="flex-1 flex flex-col p-6 overflow-hidden max-w-7xl mx-auto w-full">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Membros</p>
                                <p className="text-2xl font-black text-white">{members.length} <span className="text-sm text-slate-500 font-medium">/ {organization.max_seats}</span></p>
                            </div>
                        </div>
                        <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Minutos Totais (Hoje)</p>
                                <p className="text-2xl font-black text-white">
                                    {members.reduce((acc, m) => acc + (m.daily_minutes_used || 0), 0)} min
                                </p>
                            </div>
                        </div>
                        <div className="glass-premium p-6 rounded-3xl border border-white/5 flex items-center gap-4">
                            <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                                <Shield className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Plano Ativo</p>
                                <p className="text-xl font-black text-white uppercase">{organization.plan_type}</p>
                            </div>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="flex flex-col flex-1 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/20">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-slate-400" /> Colaboradores
                            </h3>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <PlusCircle className="w-4 h-4" /> Adicionar
                            </button>
                        </div>

                        <div className="flex-1 overflow-auto no-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-900 border-b border-white/10 z-10">
                                    <tr>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Nome / Email</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Função</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Engajamento (Hoje)</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ofensiva</th>
                                        <th className="p-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {members.map((member) => (
                                        <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white text-sm">{member.full_name || 'Usuário Sem Nome'}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                    <Mail className="w-3.5 h-3.5 shrink-0" /> {member.email}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {member.org_role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-wider border border-purple-500/20">
                                                        Admin
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Membro</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${member.daily_minutes_used >= 10 ? 'bg-green-500' : 'bg-orange-500'}`}
                                                            style={{ width: `${Math.min(100, (member.daily_minutes_used / 10) * 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-300">{member.daily_minutes_used} min</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Flame className={`w-3.5 h-3.5 ${member.streak_count > 0 ? 'text-orange-500 fill-orange-500' : 'text-slate-700'}`} />
                                                    <span className="text-xs font-bold">{member.streak_count} dias</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">Ativo</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Invite Modal (Mockup) */}
            {showInviteModal && (
                <div className="fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white">Adicionar Membro</h3>
                            <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-white/5 rounded-full">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>
                        <p className="text-slate-400 text-sm mb-6">
                            Para adicionar novos membros ao plano <strong>{organization?.name}</strong>, entre em contato com nosso time de suporte ou envie a lista de e-mails.
                        </p>
                        <div className="space-y-3">
                            <input
                                type="text"
                                disabled
                                value="Link de convite em breve..."
                                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-slate-500 text-sm"
                            />
                            <button onClick={() => setShowInviteModal(false)} className="w-full py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all">
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

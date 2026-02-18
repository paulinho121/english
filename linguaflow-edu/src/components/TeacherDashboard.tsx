import React, { useEffect, useState } from 'react';
import {
    Users,
    TrendingUp,
    Star,
    Plus,
    ArrowRight,
    BrainCircuit,
    Calendar as CalendarIcon,
    Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CreateClassModal } from './CreateClassModal';

interface ClassSession {
    id: string;
    title: string;
    start_date: string;
    enrollments_count: number;
}

export const TeacherDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teacherName, setTeacherName] = useState('Professor');
    const [stats, setStats] = useState({
        students: 0,
        progress: 78,
        classes: 0,
        rating: 5.0
    });
    const [upcomingClasses, setUpcomingClasses] = useState<ClassSession[]>([]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;
            if (user) {
                setTeacherName(user.email?.split('@')[0] || 'Professor');
            }

            const { count: studentCount } = await supabase
                .from('edu_enrollments')
                .select('*', { count: 'exact', head: true });

            const { count: classCount } = await supabase
                .from('edu_classes')
                .select('*', { count: 'exact', head: true });

            const { data: classes } = await supabase
                .from('edu_classes')
                .select('id, title, start_date')
                .eq('status', 'active')
                .gte('start_date', new Date().toISOString())
                .order('start_date', { ascending: true })
                .limit(3);

            setStats(prev => ({
                ...prev,
                students: studentCount || 0,
                classes: classCount || 0
            }));

            if (classes) {
                setUpcomingClasses(classes.map((c: any) => ({
                    ...c,
                    enrollments_count: 0
                })));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const statsItems = [
        { label: 'Alunos Ativos', value: stats.students.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Progresso Médio', value: `${stats.progress}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Aulas na Semana', value: stats.classes.toString(), icon: CalendarIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Avaliação', value: stats.rating.toFixed(1), icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    if (loading && !isModalOpen) {
        return (
            <div className="flex-1 min-h-screen bg-slate-50 flex items-center justify-center ml-72">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight">Bem-vindo de volta, <span className="text-indigo-600 capitalize">{teacherName}</span>! 👋</h2>
                    <p className="text-slate-500 font-medium">Continue inspirando seus alunos hoje.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="premium-button flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Criar Nova Aula
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                {statsItems.map((stat, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={stat.label}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
                    >
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-900">Próximas Sessões</h3>
                            <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                                Agenda Completa <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {upcomingClasses.length > 0 ? upcomingClasses.map((c) => (
                                <div key={c.id} className="flex items-center gap-5 p-5 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-lg hover:shadow-indigo-50/50 transition-all group">
                                    <div className="w-20 h-20 bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                                        <span className="text-[10px] uppercase font-black text-slate-400">
                                            {new Date(c.start_date).toLocaleString('pt-BR', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-black text-indigo-600">{new Date(c.start_date).getDate()}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg mb-1">{c.title}</h4>
                                        <p className="text-sm text-slate-500 font-medium">
                                            {new Date(c.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {c.enrollments_count} Alunos
                                        </p>
                                    </div>
                                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm">
                                        Abrir Lab
                                    </button>
                                </div>
                            )) : (
                                <div className="py-16 text-center border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                                    <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CalendarIcon className="w-6 h-6 text-slate-400" />
                                    </div>
                                    <p className="text-slate-400 font-bold">Nenhuma aula agendada ainda.</p>
                                    <p className="text-slate-300 text-sm mt-1">Comece criando sua primeira sessão.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-900/40 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:scale-110 transition-transform duration-700" />
                        <div className="relative z-10">
                            <div className="bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border border-white/10 backdrop-blur-sm shadow-inner group-hover:rotate-12 transition-transform">
                                <BrainCircuit className="w-7 h-7 text-indigo-300" />
                            </div>
                            <h3 className="text-2xl font-black mb-4 leading-tight">Inteligência Pedagógica IA</h3>
                            <p className="text-indigo-200 font-medium text-sm mb-10 leading-relaxed opacity-80">
                                Linguaflow AI está analisando suas {stats.classes} aulas para gerar dicas de performance para seus alunos.
                            </p>
                            <button className="w-full py-5 bg-white text-indigo-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-50 active:scale-[0.98] transition-all">
                                Gerar Insights
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-8 px-2">Atividade Recente</h3>
                        <div className="space-y-8 px-2">
                            <div className="flex gap-5 relative">
                                <div className="w-0.5 h-full bg-slate-50 absolute left-[9px] top-4 rounded-full" />
                                <div className="w-[18px] h-[18px] rounded-full bg-indigo-500 ring-4 ring-indigo-50 mt-1 shrink-0 z-10" />
                                <div>
                                    <p className="text-sm text-slate-600 font-medium leading-tight">
                                        Sistema inicializado. Bem-vindo ao portal.
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Agora mesmo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <CreateClassModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchDashboardData}
                />
            )}
        </div>
    );
};

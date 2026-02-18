import React, { useState, useEffect } from 'react';
import { BookOpen, Send, CheckCircle, Brain, Sparkles, Loader2, Clock, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const LessonLogView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [fetchingSessions, setFetchingSessions] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [recentSessions, setRecentSessions] = useState<any[]>([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [logData, setLogData] = useState({
        summary: '',
        homework_topic: '',
        homework_focus: ''
    });

    useEffect(() => {
        fetchClasses();
        fetchRecentSessions();
    }, []);

    const fetchClasses = async () => {
        const { data } = await supabase.from('edu_classes').select('*').eq('status', 'active');
        if (data) setClasses(data);
    };

    const fetchRecentSessions = async () => {
        setFetchingSessions(true);
        try {
            const { data, error } = await supabase
                .from('edu_sessions')
                .select(`
                    *,
                    edu_classes (title)
                `)
                .order('created_at', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentSessions(data || []);
        } catch (error) {
            console.error('Erro ao buscar sessões:', error);
        } finally {
            setFetchingSessions(false);
        }
    };

    const handleLevelUpHome = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClass) {
            toast.error('Selecione uma turma primeiro');
            return;
        }

        if (!logData.summary || !logData.homework_topic) {
            toast.error('Preencha o conteúdo da aula e o tema da missão');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.from('edu_sessions').insert([{
                class_id: selectedClass,
                content_summary: logData.summary,
                homework_topic: logData.homework_topic,
                homework_focus: logData.homework_focus
            }]);

            if (error) throw error;

            toast.success('Aula registrada! Missão enviada para os apps dos alunos. 🚀');
            setLogData({ summary: '', homework_topic: '', homework_focus: '' });
            fetchRecentSessions();
        } catch (error: any) {
            toast.error('Erro ao registrar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="max-w-5xl">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight tracking-tight">
                        Auxiliar do <span className="text-indigo-600">Professor</span>
                    </h2>
                    <p className="text-slate-500 font-medium">Transforme sua aula presencial em prática ativa de conversação.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Formulário de Registro (8 colunas) */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8 h-full">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-indigo-600" />
                                    Registro de Aula
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Turma</label>
                                        <select
                                            value={selectedClass}
                                            onChange={(e) => setSelectedClass(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                                        >
                                            <option value="">Escolha a turma...</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Resumo do Conteúdo</label>
                                        <textarea
                                            value={logData.summary}
                                            onChange={e => setLogData({ ...logData, summary: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500 min-h-[100px] resize-none font-medium"
                                            placeholder="Ex: Present Perfect, vocabulário de aeroporto..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                    Configurar Missão IA
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Cenário de Conversação (Roleplay)</label>
                                        <input
                                            value={logData.homework_topic}
                                            onChange={e => setLogData({ ...logData, homework_topic: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                                            placeholder="Ex: Check-in num hotel em Londres"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Obrigatoriedades (Gramática/Vocab)</label>
                                        <input
                                            value={logData.homework_focus}
                                            onChange={e => setLogData({ ...logData, homework_focus: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                                            placeholder="Ex: Usar 'would like', 'may I' e 'booking'"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLevelUpHome}
                                disabled={loading}
                                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        Ativar Missão de Prática
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Insights e Histórico (4 colunas) */}
                    <div className="lg:col-span-5 space-y-8">
                        {/* Status da Prática */}
                        <div className="bg-indigo-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full -mr-20 -mt-20 blur-[60px]" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                                        <Brain className="w-6 h-6 text-indigo-200" />
                                    </div>
                                    <h3 className="text-xl font-black">Feedback da IA</h3>
                                </div>
                                <p className="text-indigo-200 font-medium text-sm mb-8 leading-relaxed">
                                    A IA analisará a conversação dos alunos e trará os pontos de dificuldade aqui.
                                </p>
                                <div className="space-y-4">
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Matrículas Ativas</span>
                                        <span className="text-xl font-black">---</span>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                                        <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Engajamento (Prática)</span>
                                        <span className="text-xl font-black">--%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-6">
                                <History className="w-5 h-5 text-slate-400" />
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Missões Recentes</h4>
                            </div>

                            <div className="space-y-4">
                                {fetchingSessions ? (
                                    <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500" /></div>
                                ) : recentSessions.length > 0 ? (
                                    recentSessions.map((session) => (
                                        <div key={session.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-md">
                                                    {session.edu_classes?.title || 'Turma'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {format(new Date(session.created_at), 'dd MMM', { locale: ptBR })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-bold text-slate-900 line-clamp-1">{session.homework_topic}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">Foco: {session.homework_focus || 'Geral'}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center">
                                        <p className="text-slate-400 text-sm font-medium">Nenhuma missão lançada ainda.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

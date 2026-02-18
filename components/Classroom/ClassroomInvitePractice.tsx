import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { BookOpen, Sparkles, User, ArrowRight, Loader2, MessageSquare, BrainCircuit, Flag } from 'lucide-react';
import { toast } from 'sonner';

export const ClassroomInvitePractice: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [clase, setClase] = useState<any>(null);
    const [latestSession, setLatestSession] = useState<any>(null);
    const [studentName, setStudentName] = useState('');
    const [step, setStep] = useState<'welcome' | 'checking' | 'ready'>('checking');

    useEffect(() => {
        if (token) {
            fetchClassData();
        }
    }, [token]);

    const fetchClassData = async () => {
        try {
            setLoading(true);
            // 1. Fetch the class by its access_token
            const { data: classData, error: classError } = await supabase
                .from('edu_classes')
                .select(`
                    *,
                    edu_teachers ( full_name, avatar_url )
                `)
                .eq('access_token', token)
                .single();

            if (classError || !classData) {
                console.error('Erro ao buscar turma:', classError);
                toast.error('Turma não encontrada ou link expirado.');
                setLoading(false);
                return;
            }

            setClase(classData);

            // 2. Fetch the latest session (mission) for this class
            const { data: sessionData, error: sessionError } = await supabase
                .from('edu_sessions')
                .select('*')
                .eq('class_id', classData.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (sessionData) {
                setLatestSession(sessionData);
            }

            setStep('welcome');
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = () => {
        if (!studentName.trim()) {
            toast.error('Por favor, digite seu nome primeiro.');
            return;
        }

        // Armazenar contexto para o MainApp ler
        const sessionConfig = {
            isClassroom: true,
            classId: clase.id,
            className: clase.title,
            teacherId: clase.teacher_id,
            topicName: latestSession?.topic || 'General Practice',
            missionDescription: latestSession?.content_summary || 'Practice English based on today\'s lesson.',
            level: clase.level || 'intermediate',
            studentName: studentName.trim()
        };

        localStorage.setItem('linguaflow_classroom_session', JSON.stringify(sessionConfig));

        // Redirecionar para a home onde o MainApp vai detectar esse cache e iniciar a IA
        window.location.href = '/';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!clase) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6">
                    <Flag className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-black text-white mb-2">Ops! Link Inválido</h1>
                <p className="text-slate-400 max-w-sm mb-8">Não conseguimos encontrar a sua sala de aula. Verifique com seu professor se o link está correto.</p>
                <button onClick={() => navigate('/')} className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all">
                    Voltar para Início
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

            <div className="w-full max-w-xl relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
                        <Sparkles className="w-3 h-3" />
                        Prática Exclusiva via Professor
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
                        Bem-vindo à turma <span className="text-indigo-400">{clase.title}</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Seu professor te convidou para uma missão especial de IA.</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Missão de hoje</div>
                            <div className="text-white font-bold">{latestSession?.topic || 'Revisão Geral'}</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Como podemos te chamar?</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => setStudentName(e.target.value)}
                                    placeholder="Digite seu nome completo"
                                    className="w-full bg-slate-950 border border-white/10 rounded-2xl p-5 pl-14 text-white font-bold focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.98]"
                        >
                            Começar Prática IA
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                            {clase.edu_teachers?.avatar_url ? (
                                <img src={clase.edu_teachers.avatar_url} alt="Professor" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">P</div>
                            )}
                        </div>
                        <div className="text-sm">
                            <div className="text-slate-500 font-medium italic">Preparado pelo seu professor</div>
                            <div className="text-white font-bold">{clase.edu_teachers?.full_name || 'Professor Parceiro'}</div>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                        Powered by <BrainCircuit className="w-4 h-4" /> Linguaflow AI
                    </p>
                </div>
            </div>
        </div>
    );
};

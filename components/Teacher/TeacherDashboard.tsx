import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
    Users, Plus, BrainCircuit, Wand2, Calendar, Target,
    MessageSquare, Check, X, Loader2, Sparkles, BookOpen,
    BarChart3, Mic, ClipboardList, Send, Edit3, Trash2
} from 'lucide-react';

import { toast } from 'sonner';

interface TeacherDashboardProps {
    userId: string;
    onClose: () => void;
}

interface Classroom {
    id: string;
    name: string;
    description: string;
    student_count: number;
    room?: string;
    shift?: string;
    school_name?: string;
}

export const TeacherCommandCenter: React.FC<TeacherDashboardProps> = ({ userId, onClose }) => {
    const [view, setView] = useState<'classes' | 'assignments' | 'analytics'>('classes');
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Create Classroom State
    const [isCreatingClassroom, setIsCreatingClassroom] = useState(false);
    const [classroomDraft, setClassroomDraft] = useState({
        name: '',
        room: '',
        shift: 'morning',
        schoolName: '',
        difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
    });

    // Create Assignment State
    const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
    const [assignmentDraft, setAssignmentDraft] = useState({
        title: '',
        classroomId: '',
        dueDate: '',
        instructionPrompt: '', // O texto livre do professor
        difficultyLevel: 'beginner', // Novo campo definido
        aiSuggestions: null as any // Onde guardaremos o output da IA
    });

    // AI Processing State
    const [isProcessingAI, setIsProcessingAI] = useState(false);

    useEffect(() => {
        fetchClassrooms();
        fetchAssignments();
    }, [userId]);

    const fetchAssignments = async () => {
        const { data } = await supabase
            .from('assignments')
            .select('*, classrooms(name)')
            .eq('created_by', userId)
            .order('created_at', { ascending: false });

        if (data) setAssignments(data);
    };

    const fetchClassrooms = async () => {
        const { data, error } = await supabase
            .from('classrooms')
            .select('*, classroom_members(count)')
            .eq('teacher_id', userId);

        if (data) {
            const formatted = data.map((c: any) => ({
                ...c,
                student_count: c.classroom_members?.[0]?.count || 0
            }));
            setClassrooms(formatted);
        }
    };

    const handleGenerateAIPlan = async () => {
        if (!assignmentDraft.instructionPrompt) return;

        setIsProcessingAI(true);
        // Simulação de chamada para IA (Gemini)
        // Na prática, isso chamaria uma Edge Function que usa o Gemini 1.5 Pro
        // para estruturar o plano de aula em JSON.

        setTimeout(() => {
            setAssignmentDraft(prev => ({
                ...prev,
                aiSuggestions: {
                    summary: "Plano focado em 'Present Perfect' para viagens.",
                    exercises: [
                        { type: "roleplay", scenario: "Checking in at a hotel", focus: ["have you booked", "I have reserved"] },
                        { type: "drills", words: ["Luggage", "Passport", "Reservation"] }
                    ],
                    tips: "A IA corrigirá a entonação em perguntas."
                }
            }));
            setIsProcessingAI(false);
        }, 2000);
    };

    const handleCreateClassroom = async () => {
        if (!classroomDraft.name) return;

        setLoading(true);

        try {
            // Tenta pegar id da organização
            const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', userId).single();

            const payload = {
                name: classroomDraft.name,
                room: classroomDraft.room,
                shift: classroomDraft.shift,
                school_name: classroomDraft.schoolName || null,
                teacher_id: userId,
                organization_id: profile?.organization_id,
                difficulty_level: classroomDraft.difficultyLevel
            };

            const { data, error } = await supabase.from('classrooms').insert(payload).select();

            if (!error) {
                fetchClassrooms();
                toast.success("Turma criada com sucesso!");
                setIsCreatingClassroom(false);
                setClassroomDraft({ name: '', room: '', shift: 'morning', schoolName: '', difficultyLevel: 'beginner' });
            } else {
                console.error("Erro Supabase:", error);
                toast.error(`Erro ao criar turma: ${error.message}`);
            }
        } catch (e: any) {
            console.error("Erro inesperado:", e);
            toast.error(`Erro crítico: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handlePublishAssignment = async () => {
        if (!assignmentDraft.title || !assignmentDraft.classroomId) return;

        setLoading(true);
        // Tenta pegar o org_id do usuário se não tivermos
        const { data: profile } = await supabase.from('profiles').select('organization_id').eq('id', userId).single();
        const orgId = profile?.organization_id;

        // Se a turma escolhida nao tiver ID, erro
        if (!assignmentDraft.classroomId) {
            toast.error("Selecione uma turma para a atividade.");
            setLoading(false);
            return;
        }

        // Insere na tabela assignments
        // Nota: pronunciation_phrases é JSONB, então podemos salvar o objeto todo da IA
        const { error } = await supabase.from('assignments').insert({
            title: assignmentDraft.title,
            classroom_id: assignmentDraft.classroomId,
            description: assignmentDraft.aiSuggestions?.summary || "Atividade gerada por IA",
            due_date: assignmentDraft.dueDate ? new Date(assignmentDraft.dueDate).toISOString() : null,
            created_by: userId,
            difficulty_level: assignmentDraft.difficultyLevel,
            pronunciation_phrases: assignmentDraft.aiSuggestions || {} // Salva o payload da IA
        });

        if (error) {
            console.error('Erro ao salvar activity:', error);
            toast.error("Erro ao publicar atividade. Verifique permissões.");
        } else {
            const className = classrooms.find(c => c.id === assignmentDraft.classroomId)?.name;
            toast.success(`Atividade publicada para a turma ${className || ''}!`, {
                description: "Seus alunos receberão a notificação."
            });

            // Reset
            setAssignmentDraft({
                title: '',
                classroomId: '',
                dueDate: '',
                instructionPrompt: '',
                difficultyLevel: 'beginner',
                aiSuggestions: null
            });
            setIsCreatingAssignment(false);
            setView('assignments');
            fetchAssignments();
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300 overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-display font-bold text-lg text-white">Teacher Command Center</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest">Painel de Controle Pedagógico</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Navigation */}
                <aside className="w-64 border-r border-white/5 bg-slate-900/30 p-4 space-y-2 hidden md:block">
                    <button
                        onClick={() => setView('classes')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'classes' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="font-bold text-sm">Minhas Turmas</span>
                    </button>
                    <button
                        onClick={() => setView('assignments')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'assignments' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <ClipboardList className="w-5 h-5" />
                        <span className="font-bold text-sm">Atividades</span>
                    </button>
                    <button
                        onClick={() => setView('analytics')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${view === 'analytics' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'}`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        <span className="font-bold text-sm">Desempenho</span>
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">

                    {/* View: Classes */}
                    {view === 'classes' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white">Gestão de Turmas</h2>
                                <button
                                    onClick={() => setIsCreatingClassroom(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-500/20"
                                >
                                    <Plus className="w-4 h-4" /> Nova Turma
                                </button>
                            </div>

                            {/* Modal de Criação de Turma Overlay */}
                            {isCreatingClassroom && (
                                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                                    <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 duration-300 relative">
                                        <button
                                            onClick={() => setIsCreatingClassroom(false)}
                                            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>

                                        <div className="mb-6">
                                            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                                                <Target className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-white">Cadastrar Nova Turma</h3>
                                            <p className="text-sm text-slate-400">Preencha os dados da turma para começar.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome da Escola</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                                                    placeholder="Ex: Colégio Futuro"
                                                    value={classroomDraft.schoolName}
                                                    onChange={e => setClassroomDraft(prev => ({ ...prev, schoolName: e.target.value }))}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome/Série <span className="text-red-500">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                                                        placeholder="Ex: 3º Ano B"
                                                        value={classroomDraft.name}
                                                        onChange={e => setClassroomDraft(prev => ({ ...prev, name: e.target.value }))}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sala</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                                                        placeholder="Ex: Sala 12"
                                                        value={classroomDraft.room}
                                                        onChange={e => setClassroomDraft(prev => ({ ...prev, room: e.target.value }))}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Turno</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { id: 'morning', label: 'Manhã', icon: '☀️' },
                                                            { id: 'afternoon', label: 'Tarde', icon: '🌤️' },
                                                            { id: 'night', label: 'Noite', icon: '🌙' }
                                                        ].map((s) => (
                                                            <button
                                                                key={s.id}
                                                                onClick={() => setClassroomDraft(prev => ({ ...prev, shift: s.id }))}
                                                                className={`p-2 rounded-xl border text-[10px] font-medium transition-all flex flex-col items-center gap-1 ${classroomDraft.shift === s.id
                                                                    ? 'bg-indigo-500 text-white border-indigo-500'
                                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                                            >
                                                                <span>{s.icon}</span>
                                                                {s.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Nível da Turma</label>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {[
                                                            { id: 'beginner', label: 'Inic.', color: 'bg-green-500', border: 'border-green-500' },
                                                            { id: 'intermediate', label: 'Médio', color: 'bg-yellow-500', border: 'border-yellow-500' },
                                                            { id: 'advanced', label: 'Avanç.', color: 'bg-red-500', border: 'border-red-500' }
                                                        ].map((lvl) => (
                                                            <button
                                                                key={lvl.id}
                                                                onClick={() => setClassroomDraft(prev => ({ ...prev, difficultyLevel: lvl.id as any }))}
                                                                className={`p-2 rounded-xl border text-[10px] font-bold transition-all ${classroomDraft.difficultyLevel === lvl.id
                                                                    ? `${lvl.color}/10 ${lvl.border} text-white`
                                                                    : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}
                                                            >
                                                                {lvl.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCreateClassroom}
                                                disabled={!classroomDraft.name || loading}
                                                className="w-full py-4 mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                                Confirmar Cadastro
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {classrooms.map(cls => (
                                    <div key={cls.id} className="group p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all hover:bg-slate-800/60 cursor-pointer">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <div className="px-2 py-1 rounded bg-black/20 text-xs font-mono text-slate-400">
                                                {cls.student_count} Alunos
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                                        <div className="flex flex-wrap gap-2 mb-2 text-xs font-mono text-slate-400">
                                            {cls.school_name && <span className="bg-white/5 px-2 py-0.5 rounded flex items-center gap-1"><Target className="w-3 h-3" /> {cls.school_name}</span>}
                                            {cls.room && <span className="bg-white/5 px-2 py-0.5 rounded">Sala: {cls.room}</span>}
                                            {cls.shift && <span className="bg-white/5 px-2 py-0.5 rounded capitalize">{cls.shift === 'morning' ? 'Manhã' : cls.shift === 'afternoon' ? 'Tarde' : 'Noite'}</span>}
                                        </div>
                                        <p className="text-sm text-slate-500 line-clamp-2 italic">{cls.description || "Sem descrição."}</p>

                                        <div className="mt-6 flex gap-2">
                                            <button className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors">
                                                Ver Alunos
                                            </button>
                                            <button className="flex-1 py-2 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-bold text-indigo-300 transition-colors">
                                                Relatórios
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty State if no classes */}
                                {classrooms.length === 0 && (
                                    <button
                                        onClick={() => setIsCreatingClassroom(true)}
                                        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 hover:bg-white/5 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                                        </div>
                                        <span className="text-slate-400 font-bold group-hover:text-white">Criar Primeira Turma</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* View: Assignments (The Creation Flow) */}
                    {view === 'assignments' && (
                        <div className="max-w-4xl mx-auto space-y-8">
                            {!isCreatingAssignment ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-white">Minhas Atividades</h2>
                                        <button
                                            onClick={() => setIsCreatingAssignment(true)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> Nova Atividade
                                        </button>
                                    </div>

                                    {assignments.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {assignments.map(item => (
                                                <div key={item.id} className="p-6 rounded-2xl bg-slate-800/40 border border-white/5 hover:border-indigo-500/30 transition-all group flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                                                            <ClipboardList className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-white">{item.title}</h3>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <Users className="w-3 h-3" /> {item.classrooms?.name || 'Sem turma'}
                                                                </span>
                                                                {item.due_date && (
                                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" /> {new Date(item.due_date).toLocaleDateString()}
                                                                    </span>
                                                                )}
                                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.difficulty_level === 'beginner' ? 'bg-green-500/10 text-green-500' :
                                                                        item.difficulty_level === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500' :
                                                                            'bg-red-500/10 text-red-500'
                                                                    }`}>
                                                                    {item.difficulty_level}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
                                                            <BarChart3 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-slate-900/40 rounded-3xl border border-dashed border-white/5">
                                            <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-3xl flex items-center justify-center mb-6 animate-pulse-slow">
                                                <Wand2 className="w-10 h-10 text-indigo-400" />
                                            </div>
                                            <h2 className="text-xl font-bold text-white mb-2">Ainda não há atividades</h2>
                                            <p className="text-slate-400 max-w-sm mx-auto mb-6">
                                                Crie sua primeira atividade guiada por IA para seus alunos começarem a praticar.
                                            </p>
                                            <button
                                                onClick={() => setIsCreatingAssignment(true)}
                                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all"
                                            >
                                                Criar Agora
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
                                    <div className="flex items-center gap-4 mb-8">
                                        <button
                                            onClick={() => setIsCreatingAssignment(false)}
                                            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <h2 className="text-xl font-bold text-white">Nova Missão de Casa</h2>
                                    </div>

                                    {/* 1. Briefing Input */}
                                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                                        <label className="block text-sm font-bold text-indigo-300 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" /> Instruções para o Assistente (IA)
                                        </label>
                                        <textarea
                                            value={assignmentDraft.instructionPrompt}
                                            onChange={(e) => setAssignmentDraft(prev => ({ ...prev, instructionPrompt: e.target.value }))}
                                            placeholder="Ex: Hoje ensinei o Past Simple usando verbos irregulares. Foquei em contar histórias de ontem. Quero que eles pratiquem a pronúncia de 'bought', 'thought' e 'caught'."
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 min-h-[120px] resize-none"
                                        />
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={handleGenerateAIPlan}
                                                disabled={!assignmentDraft.instructionPrompt || isProcessingAI}
                                                className={`px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isProcessingAI ? 'bg-slate-800 text-slate-500 cursor-wait' : 'bg-white text-slate-900 hover:bg-indigo-50 hover:text-indigo-900 shadow-lg'}`}
                                            >
                                                {isProcessingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                                {isProcessingAI ? 'Gerando Plano...' : 'Gerar Estrutura da Atividade'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* 2. AI Suggestions Result */}
                                    {assignmentDraft.aiSuggestions && (
                                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                                            <div className="p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                                                <div className="bg-slate-900 rounded-[14px] p-6">
                                                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                                        <Sparkles className="w-5 h-5 text-yellow-400" /> Sugestão da IA
                                                    </h3>
                                                    <div className="space-y-4 text-slate-300 text-sm">
                                                        <p className="italic">"{assignmentDraft.aiSuggestions.summary}"</p>

                                                        <div className="grid gap-3">
                                                            {assignmentDraft.aiSuggestions.exercises.map((ex: any, idx: number) => (
                                                                <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/5 flex items-start gap-3">
                                                                    <div className="mt-1 w-2 h-2 rounded-full bg-indigo-500"></div>
                                                                    <div>
                                                                        <span className="block font-bold text-white uppercase text-xs mb-1">{ex.type}</span>
                                                                        <span className="block text-slate-400">
                                                                            {ex.scenario || `Words: ${ex.words.join(', ')}`}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. Final Details & Submit */}
                                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                                        <h3 className="font-bold text-white mb-6">Confirmar Detalhes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Título da Atividade</label>
                                                <input
                                                    type="text"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                                                    placeholder="Ex: Prática de Verbos Irregulares"
                                                    value={assignmentDraft.title}
                                                    onChange={e => setAssignmentDraft(prev => ({ ...prev, title: e.target.value }))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Data de Entrega</label>
                                                <input
                                                    type="date"
                                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-indigo-500 transition-colors"
                                                    value={assignmentDraft.dueDate}
                                                    onChange={e => setAssignmentDraft(prev => ({ ...prev, dueDate: e.target.value }))}
                                                />
                                            </div>
                                        </div>

                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Nível de Dificuldade</label>
                                        <div className="grid grid-cols-3 gap-3 mb-6">
                                            {[
                                                { id: 'beginner', label: 'Iniciante (80% PT)', desc: 'Fala devagar, repete', color: 'bg-green-500' },
                                                { id: 'intermediate', label: 'Médio (50% EN)', desc: 'Ritmo natural', color: 'bg-yellow-500' },
                                                { id: 'advanced', label: 'Fluente (100% EN)', desc: 'Imersão Total', color: 'bg-red-500' }
                                            ].map((lvl) => (
                                                <button
                                                    key={lvl.id}
                                                    onClick={() => setAssignmentDraft(prev => ({ ...prev, difficultyLevel: lvl.id as any }))}
                                                    className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${assignmentDraft.difficultyLevel === lvl.id
                                                        ? `${lvl.color}/10 border-${lvl.color.split('-')[1]}-500 text-white shadow-lg`
                                                        : 'bg-black/20 border-white/10 text-slate-400 hover:bg-white/5'}`}
                                                >
                                                    {assignmentDraft.difficultyLevel === lvl.id && (
                                                        <div className={`absolute top-0 right-0 p-1 rounded-bl-lg ${lvl.color} text-black`}>
                                                            <Check className="w-3 h-3" />
                                                        </div>
                                                    )}
                                                    <div className="font-bold text-sm mb-1">{lvl.label}</div>
                                                    <div className="text-[10px] opacity-70">{lvl.desc}</div>
                                                </button>
                                            ))}
                                        </div>

                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-4">Atribuir para Turma</label>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {classrooms.map(cls => (
                                                <button
                                                    key={cls.id}
                                                    onClick={() => {
                                                        setAssignmentDraft(prev => ({
                                                            ...prev,
                                                            classroomId: cls.id,
                                                            difficultyLevel: (cls as any).difficulty_level || prev.difficultyLevel
                                                        }));
                                                    }}
                                                    className={`flex-shrink-0 px-4 py-2 rounded-lg border text-sm font-bold transition-all ${assignmentDraft.classroomId === cls.id ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30'}`}
                                                >
                                                    {cls.name}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="mt-8 flex justify-end gap-3">
                                            <button
                                                onClick={() => setIsCreatingAssignment(false)}
                                                className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handlePublishAssignment}
                                                disabled={!assignmentDraft.title || !assignmentDraft.classroomId || loading}
                                                className="px-8 py-3 bg-green-500 hover:bg-green-400 text-slate-900 rounded-xl font-bold shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                            >
                                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                                {loading ? 'Publicando...' : 'Publicar Atividade'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div >
        </div >
    );
};

// Helper Icon
function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    );
}

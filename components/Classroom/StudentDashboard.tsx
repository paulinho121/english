import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, BookOpen, Clock, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Classroom {
    id: string;
    name: string;
    description: string;
    teacher_id: string;
    student_count?: number; // Fetched via count
}

interface Assignment {
    id: string;
    title: string;
    due_date: string;
    status?: 'pending' | 'submitted' | 'late';
    classroom_name?: string;
}

export const StudentDashboard: React.FC<{ userId: string; onClose: () => void; onStartAssignment: (assignment: Assignment) => void }> = ({ userId, onClose, onStartAssignment }) => {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [availableClassrooms, setAvailableClassrooms] = useState<Classroom[]>([]);
    const [isJoining, setIsJoining] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchClassrooms();
        fetchAssignments();
        fetchAvailableClassrooms();
    }, [userId]);

    const fetchAvailableClassrooms = async () => {
        const { data } = await supabase
            .from('classrooms')
            .select('*');

        if (data) setAvailableClassrooms(data);
    };

    const fetchClassrooms = async () => {
        const { data } = await supabase
            .from('classrooms')
            .select('*, classroom_members!inner(student_id)')
            .eq('classroom_members.student_id', userId);

        if (data) setClassrooms(data as any);
    };

    const fetchAssignments = async () => {
        // Busca tarefas das turmas onde o aluno eh membro
        // Simplificacao: Busca todas as tarefas associadas a turmas do aluno
        // Na pratica, precisaria de um join complexo ou view
        const { data: memberClassrooms } = await supabase
            .from('classroom_members')
            .select('classroom_id')
            .eq('student_id', userId);

        if (memberClassrooms && memberClassrooms.length > 0) {
            const classIds = memberClassrooms.map(c => c.classroom_id);
            const { data: tasks } = await supabase
                .from('assignments')
                .select('*')
                .in('classroom_id', classIds)
                .order('due_date', { ascending: true });

            if (tasks) setAssignments(tasks as any);
        }
    };

    const handleJoinClassroom = async (classroomId: string) => {
        setLoading(true);
        const { error } = await supabase
            .from('classroom_members')
            .insert({ classroom_id: classroomId, student_id: userId });

        if (!error) {
            fetchClassrooms();
            fetchAssignments();
            setIsJoining(false);
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300 overflow-y-auto">
            <div className="p-6 space-y-8 max-w-7xl mx-auto w-full">

                {/* Header com Resumo */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white">Minha Escola 🎓</h2>
                        <p className="text-slate-400">Suas turmas e atividades pendentes</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsJoining(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all"
                        >
                            Entrar em Turma
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors group"
                        >
                            <X className="w-8 h-8 text-slate-500 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </div>

                {isJoining && (
                    <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 animate-in slide-in-from-top-4">
                        <h3 className="text-lg font-bold text-white mb-4">Escolha uma Turma para Entrar</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {availableClassrooms
                                .filter(ac => !classrooms.some(c => c.id === ac.id))
                                .map(ac => (
                                    <button
                                        key={ac.id}
                                        onClick={() => handleJoinClassroom(ac.id)}
                                        disabled={loading}
                                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500 text-left transition-all group"
                                    >
                                        <h4 className="font-bold text-white group-hover:text-blue-400">{ac.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{ac.description || 'Sem descrição'}</p>
                                    </button>
                                ))}
                            {availableClassrooms.filter(ac => !classrooms.some(c => c.id === ac.id)).length === 0 && (
                                <p className="text-slate-500 text-sm col-span-full">Nenhuma turma nova disponível no momento.</p>
                            )}
                        </div>
                        <button
                            onClick={() => setIsJoining(false)}
                            className="mt-6 text-sm text-slate-400 hover:text-white font-bold"
                        >
                            Fechar
                        </button>
                    </div>
                )}

                {/* Proximas Atividades (Destaque) */}
                <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Para Fazer
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.length > 0 ? (
                            assignments.map(task => (
                                <button
                                    key={task.id}
                                    onClick={() => onStartAssignment(task)}
                                    className="group text-left p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-400/10 px-2 py-1 rounded-md">
                                            Lição de Casa
                                        </span>
                                        <span className="text-xs text-slate-500 font-mono">
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
                                        {task.title}
                                    </h4>
                                    <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                                        Toque para começar a praticar.
                                    </p>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full p-8 rounded-2xl border border-dashed border-white/10 text-center">
                                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2 opacity-50" />
                                <p className="text-slate-500">Nenhuma tarefa pendente! Bom trabalho.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Turmas */}
                <section>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Minhas Turmas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {classrooms.map(cls => (
                            <div key={cls.id} className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{cls.name}</h4>
                                        <p className="text-xs text-slate-500">Prof. Responsável</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

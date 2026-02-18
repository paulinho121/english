import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Users, GraduationCap, Copy, ExternalLink, Loader2, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { CreateClassModal } from './CreateClassModal';

export const ClassesView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('edu_classes')
                .select(`
                    *,
                    edu_schools ( name )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClasses(data || []);
        } catch (error) {
            console.error('Erro ao buscar turmas:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyClassLink = (token: string) => {
        const baseUrl = window.location.origin.replace('5174', '5173');
        const link = `${baseUrl}/turma/${token}`;
        navigator.clipboard.writeText(link);
        toast.success('Link da turma copiado! Compartilhe com seus alunos.');
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight">Gestão de <span className="text-indigo-600">Turmas</span></h2>
                    <p className="text-slate-500 font-medium">Crie salas e compartilhe o link de prática com seus alunos.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="premium-button flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nova Turma
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading && classes.length === 0 ? (
                    <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500" /></div>
                ) : classes.map((clase) => (
                    <div key={clase.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    <BookOpen className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-md mb-2">
                                        {clase.level}
                                    </span>
                                    <div className="flex items-center gap-1 text-slate-400 text-[10px] font-bold">
                                        <Building2 className="w-3 h-3" />
                                        {clase.edu_schools?.name || 'Sem Escola'}
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2 truncate">{clase.title}</h3>
                            <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 min-h-[40px] leading-relaxed">
                                {clase.description || 'Sem descrição cadastrada para esta turma.'}
                            </p>

                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alunos</span>
                                    <span className="text-lg font-black text-slate-900 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-indigo-500" />
                                        -- / {clase.max_students}
                                    </span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Avaliação IA</span>
                                    <span className="text-lg font-black text-indigo-600">5.0</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 mt-auto flex items-center gap-3">
                            <button
                                onClick={() => copyClassLink(clase.access_token)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                            >
                                <Copy className="w-3 h-3" />
                                Link da Sala
                            </button>
                            <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm">
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {classes.length === 0 && !loading && (
                    <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Nenhuma turma ativa</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto mb-10">
                            Crie sua primeira turma para começar a enviar missões de prática IA para seus alunos.
                        </p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="premium-button mx-auto"
                        >
                            Criar Turma Agora
                        </button>
                    </div>
                )}
            </div>

            {isAdding && (
                <CreateClassModal
                    onClose={() => setIsAdding(false)}
                    onSuccess={() => {
                        setIsAdding(false);
                        fetchClasses();
                    }}
                />
            )}
        </div>
    );
};

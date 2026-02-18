import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface CreateClassModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export const CreateClassModal: React.FC<CreateClassModalProps> = ({ onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        level: 'beginner',
        max_students: 10,
        start_date: '',
        school_id: ''
    });
    const [schools, setSchools] = useState<any[]>([]);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        const { data } = await supabase.from('edu_schools').select('id, name');
        if (data) setSchools(data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: userData } = await supabase.auth.getUser();
            const user = userData.user;

            if (!user) {
                toast.error('Você precisa estar logado para criar uma aula');
                return;
            }

            const { error } = await supabase
                .from('edu_classes')
                .insert([{
                    teacher_id: user.id,
                    school_id: formData.school_id || null,
                    title: formData.title,
                    description: formData.description,
                    level: formData.level,
                    max_students: formData.max_students,
                    start_date: new Date(formData.start_date).toISOString(),
                    status: 'active'
                }]);

            if (error) throw error;

            toast.success('Aula criada com sucesso! 🎓');
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao criar aula');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-8 sm:p-12 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="flex justify-between items-center mb-10 shrink-0">
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Configurar Nova Aula</h3>
                        <p className="text-slate-500 font-medium">Desenhe uma sessão de aprendizado impactante.</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full transition-colors group">
                        <X className="w-6 h-6 text-slate-400 group-hover:text-slate-900 transition-colors" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-8 no-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Escola / Instituição (Opcional)</label>
                            <select
                                value={formData.school_id}
                                onChange={(e) => setFormData({ ...formData, school_id: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                            >
                                <option value="">Nenhuma (Professor Particular)</option>
                                {schools.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Título da Sessão</label>
                            <div className="relative">
                                <BookOpen className="absolute left-4 top-4 w-5 h-5 text-indigo-400" />
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="ex: Inglês Avançado para Executivos"
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors min-h-[120px] resize-none"
                                placeholder="O que os alunos aprenderão nesta sessão?"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Nível de Dificuldade</label>
                            <select
                                value={formData.level}
                                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 appearance-none transition-colors"
                            >
                                <option value="beginner">Iniciante</option>
                                <option value="intermediate">Intermediário</option>
                                <option value="advanced">Avançado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Máx. de Alunos</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                <input
                                    type="number"
                                    value={formData.max_students}
                                    onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                    min="1"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Data e Hora de Início</label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                                <input
                                    type="datetime-local"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-12 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-50 sm:sticky sm:bottom-0 sm:bg-white sm:pb-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lançar esta Aula'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

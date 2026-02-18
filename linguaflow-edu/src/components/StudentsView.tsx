import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, GraduationCap, Mail, Calendar, Loader2, X, Plus, Filter, Copy, Check, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const StudentsView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [newStudent, setNewStudent] = useState({
        email: '',
        name: '',
        class_id: ''
    });
    const [classes, setClasses] = useState<any[]>([]);
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const { data } = await supabase.from('edu_classes').select('id, title');
        if (data) setClasses(data);
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('edu_invitations')
                .select(`
                    *,
                    edu_classes ( title )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setStudents(data || []);
        } catch (error) {
            console.error('Erro ao buscar alunos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Criar convite no banco
            const { data, error } = await supabase
                .from('edu_invitations')
                .insert([{
                    student_name: newStudent.name,
                    student_email: newStudent.email,
                    class_id: newStudent.class_id
                }])
                .select()
                .single();

            if (error) throw error;

            // Gerar link formatado (exemplo)
            const baseUrl = window.location.origin.replace('5174', '5173'); // Supondo que o app do aluno esteja na 5173
            const link = `${baseUrl}/practice/${data.token}`;
            setGeneratedLink(link);

            toast.success('Aluno adicionado! Link de prática gerado.');
            fetchStudents();
        } catch (error: any) {
            toast.error('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (generatedLink) {
            navigator.clipboard.writeText(generatedLink);
            setCopied(true);
            toast.success('Link copiado!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight">Gestão de <span className="text-indigo-600">Alunos</span></h2>
                    <p className="text-slate-500 font-medium">Crie convites e gere links personalizados de prática.</p>
                </div>
                <button
                    onClick={() => {
                        setIsAdding(true);
                        setGeneratedLink(null);
                    }}
                    className="premium-button flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" />
                    Novo Aluno
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[600px]">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                    <div className="flex-1 flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 w-full">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none focus:outline-none text-slate-900 font-medium w-full"
                        />
                    </div>
                </div>

                {loading && students.length === 0 ? (
                    <div className="py-20 text-center">
                        <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500" />
                    </div>
                ) : students.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {students.map((student) => (
                            <div key={student.id} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-black text-indigo-600">
                                        {student.student_name.charAt(0)}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h4 className="font-black text-slate-900 truncate">{student.student_name}</h4>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{student.edu_classes?.title || 'Sem Turma'}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-3 text-slate-500 text-xs">
                                        <Mail className="w-4 h-4 text-slate-300" />
                                        <span className="truncate">{student.student_email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-500 text-xs text-green-600 font-bold">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Link Ativo
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const baseUrl = window.location.origin.replace('5174', '5173');
                                        navigator.clipboard.writeText(`${baseUrl}/practice/${student.token}`);
                                        toast.success('Link de prática copiado!');
                                    }}
                                    className="w-full py-3 rounded-xl border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    <Copy className="w-3 h-3" />
                                    Copiar Link de Prática
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                        <div className="bg-indigo-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8 text-indigo-500" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">Sem convites ativos</h3>
                        <p className="text-slate-400 font-medium max-w-sm mx-auto">
                            Ao adicionar um aluno, você gerará um link único para ele praticar no Linguaflow.
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de Adição / Resultado do Link */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900">{generatedLink ? 'Link Gerado!' : 'Novo Aluno'}</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-full">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {!generatedLink ? (
                            <form onSubmit={handleAddStudent} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome Completo</label>
                                    <input
                                        required
                                        value={newStudent.name}
                                        onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                        placeholder="Nome do aluno"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">E-mail</label>
                                    <input
                                        required
                                        type="email"
                                        value={newStudent.email}
                                        onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                        placeholder="email@aluno.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Turma Destino</label>
                                    <select
                                        required
                                        value={newStudent.class_id}
                                        onChange={e => setNewStudent({ ...newStudent, class_id: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 appearance-none"
                                    >
                                        <option value="">Selecione a turma...</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>
                                <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gerar Link de Prática'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-indigo-600">
                                        <Check className="w-8 h-8" />
                                    </div>
                                    <p className="text-indigo-900 font-bold mb-2">Sucesso!</p>
                                    <p className="text-indigo-700 text-sm mb-6 leading-relaxed">
                                        Este aluno agora tem um acesso exclusivo para praticar conversação.
                                    </p>

                                    <div className="w-full bg-white p-4 rounded-xl border border-indigo-100 text-[10px] font-mono text-slate-400 break-all mb-6">
                                        {generatedLink}
                                    </div>

                                    <button
                                        onClick={copyToClipboard}
                                        className="w-full py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? 'Copiado!' : 'Copiar Link'}
                                    </button>
                                </div>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all"
                                >
                                    Fechar Janela
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

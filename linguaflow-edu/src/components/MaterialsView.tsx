import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Link as LinkIcon, File, Video, Loader2, X, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const MaterialsView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [classes, setClasses] = useState<any[]>([]);
    const [newMaterial, setNewMaterial] = useState({
        title: '',
        class_id: '',
        type: 'pdf',
        content_url: ''
    });

    useEffect(() => {
        fetchMaterials();
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        const { data } = await supabase.from('edu_classes').select('id, title');
        if (data) setClasses(data);
    };

    const fetchMaterials = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('edu_materials')
                .select(`
                    *,
                    edu_classes ( title )
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMaterials(data || []);
        } catch (error) {
            console.error('Erro ao buscar materiais:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMaterial = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error } = await supabase.from('edu_materials').insert([newMaterial]);
            if (error) throw error;

            toast.success('Material adicionado com sucesso!');
            setIsAdding(false);
            setNewMaterial({ title: '', class_id: '', type: 'pdf', content_url: '' });
            fetchMaterials();
        } catch (error: any) {
            toast.error('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText className="w-6 h-6 text-red-500" />;
            case 'video': return <Video className="w-6 h-6 text-blue-500" />;
            case 'exercise': return <File className="w-6 h-6 text-green-500" />;
            default: return <LinkIcon className="w-6 h-6 text-slate-400" />;
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight">Biblioteca de <span className="text-indigo-600">Materiais</span></h2>
                    <p className="text-slate-500 font-medium">Armazene PDFs, vídeos e exercícios para suas turmas.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="premium-button flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Novo Material
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center"><Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-500" /></div>
                ) : materials.length > 0 ? (
                    materials.map((item) => (
                        <div key={item.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    {getIcon(item.type)}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded-md">
                                    {item.edu_classes?.title || 'Geral'}
                                </span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 flex-1">{item.title}</h3>
                            <div className="pt-4 border-t border-slate-50 mt-4 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                                <a
                                    href={item.content_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-600 transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-white">
                        <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-lg">Biblioteca Vazia</p>
                        <p className="text-slate-300 text-sm mt-1">Clique em "Novo Material" para começar a subir arquivos.</p>
                    </div>
                )}
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Adicionar Material</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-full">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddMaterial} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Título do Material</label>
                                <input
                                    required
                                    value={newMaterial.title}
                                    onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                    placeholder="ex: Vocabulário de Negócios PDF"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Turma Destino</label>
                                <select
                                    required
                                    value={newMaterial.class_id}
                                    onChange={e => setNewMaterial({ ...newMaterial, class_id: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    <option value="">Selecione a turma...</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Tipo</label>
                                    <select
                                        value={newMaterial.type}
                                        onChange={e => setNewMaterial({ ...newMaterial, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 font-bold focus:outline-none focus:border-indigo-500"
                                    >
                                        <option value="pdf">PDF</option>
                                        <option value="video">Vídeo</option>
                                        <option value="exercise">Exercício</option>
                                        <option value="link">Link</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">URL / Link</label>
                                    <input
                                        required
                                        value={newMaterial.content_url}
                                        onChange={e => setNewMaterial({ ...newMaterial, content_url: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <button className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                                Salvar na Biblioteca
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

import React, { useState, useEffect } from 'react';
import { Building2, Plus, MapPin, Mail, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export const SchoolsView: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [schools, setSchools] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newSchool, setNewSchool] = useState({ name: '', address: '', email: '' });

    const fetchSchools = async () => {
        try {
            setLoading(true);
            // 1. Tentar busca simples primeiro para garantir visibilidade
            const { data, error } = await supabase
                .from('edu_schools')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Database Error:', error);
                toast.error('Erro no Banco: ' + error.message);
                return;
            }

            setSchools(data || []);
        } catch (error: any) {
            toast.error('Erro de conexão: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleAddSchool = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('edu_schools')
                .insert([{
                    name: newSchool.name,
                    address: newSchool.address,
                    contact_email: newSchool.email
                }]);

            if (error) throw error;

            toast.success('Escola cadastrada com sucesso!');
            setIsAdding(false);
            setNewSchool({ name: '', address: '', email: '' });
            fetchSchools();
        } catch (error: any) {
            toast.error(error.message || 'Erro ao cadastrar escola');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 min-h-screen bg-slate-50 p-8 ml-72">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight tracking-tight">Rede de <span className="text-indigo-600">Escolas</span></h2>
                    <p className="text-slate-500 font-medium">Gerencie as instituições parceiras.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="premium-button flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Cadastrar Escola
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {schools.map((school) => (
                    <div key={school.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Building2 className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-4">{school.name}</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <MapPin className="w-4 h-4 text-slate-300" />
                                <span className="truncate">{school.address || 'Endereço não informado'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500 text-sm">
                                <Mail className="w-4 h-4 text-slate-300" />
                                <span className="truncate">{school.contact_email || 'E-mail não informado'}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instituição</span>
                                <span className="text-[10px] font-bold text-slate-900 uppercase">Ativa</span>
                            </div>
                        </div>
                    </div>
                ))}

                {schools.length === 0 && !loading && (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-white">
                        <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold text-lg">Nenhuma escola encontrada</p>
                        <p className="text-slate-300 text-sm mt-1">Abra parcerias e cadastre novas instituições.</p>
                    </div>
                )}
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsAdding(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-slate-900">Nova Escola</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-50 rounded-full">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddSchool} className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome da Instituição</label>
                                <input
                                    required
                                    value={newSchool.name}
                                    onChange={e => setNewSchool({ ...newSchool, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                    placeholder="ex: Escola de Idiomas Master"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Endereço Completo</label>
                                <input
                                    required
                                    value={newSchool.address}
                                    onChange={e => setNewSchool({ ...newSchool, address: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                    placeholder="Rua, Número, Bairro, Cidade"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">E-mail de Contato</label>
                                <input
                                    required
                                    type="email"
                                    value={newSchool.email}
                                    onChange={e => setNewSchool({ ...newSchool, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-slate-900 focus:outline-none focus:border-indigo-500"
                                    placeholder="contato@escola.com"
                                />
                            </div>
                            <button className="md:col-span-2 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirmar Cadastro'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

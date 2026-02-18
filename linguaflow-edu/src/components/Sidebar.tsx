import React, { useEffect, useState } from 'react';
import {
    Users,
    BookOpen,
    FileText,
    PieChart,
    Settings,
    LogOut,
    GraduationCap,
    Building2,
    Sparkles
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export type ViewType = 'overview' | 'students' | 'classes' | 'schools' | 'schedule' | 'assistant' | 'materials' | 'settings';

interface SidebarProps {
    activeView: ViewType;
    onNavigate: (view: ViewType) => void;
}

const navItems: { icon: any, label: string, view: ViewType }[] = [
    { icon: PieChart, label: 'Visão Geral', view: 'overview' },
    { icon: Building2, label: 'Minhas Escolas', view: 'schools' },
    { icon: BookOpen, label: 'Salas e Links', view: 'classes' },
    { icon: Sparkles, label: 'Lançar Missão IA', view: 'assistant' },
    { icon: Users, label: 'Gestão de Alunos', view: 'students' },
    { icon: FileText, label: 'Biblioteca', view: 'materials' },
    { icon: Settings, label: 'Configurações', view: 'settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) setUserEmail(user.email || '');
        });
    }, []);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Erro ao sair');
        } else {
            toast.success('Sessão encerrada');
        }
    };

    return (
        <div className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col p-6 fixed left-0 top-0">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                    <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-slate-900 leading-tight">Linguaflow<span className="text-indigo-600">Edu</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Painel do Professor</p>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <button
                        key={item.view}
                        onClick={() => onNavigate(item.view)}
                        className={activeView === item.view ? 'nav-item-active w-full transition-all' : 'nav-item w-full transition-all'}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="mt-auto border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3 px-4 mb-6">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold uppercase">
                        {userEmail.charAt(0) || '?'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-slate-900 truncate">{userEmail.split('@')[0]}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Conta Acadêmica</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="nav-item w-full group hover:text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
};

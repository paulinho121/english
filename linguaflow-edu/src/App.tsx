import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Sidebar, type ViewType } from './components/Sidebar';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentsView } from './components/StudentsView';
import { SchoolsView } from './components/SchoolsView';
import { ClassesView } from './components/ClassesView';
import { LessonLogView } from './components/LessonLogView';
import { MaterialsView } from './components/MaterialsView';
import { Auth } from './components/Auth';
import { Toaster } from 'sonner';
import type { User } from '@supabase/supabase-js';

function App() {
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ViewType>('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      supabase.auth.getSession().then(({ data: { session: currentSession }, error: authError }) => {
        if (authError) {
          console.error("Auth session error:", authError);
          setError("Erro ao carregar sessão");
        }
        setSession(currentSession?.user ?? null);
        setLoading(false);
      }).catch(err => {
        console.error("Critical auth error:", err);
        setError("Erro crítico de autenticação");
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
        setSession(currentSession?.user ?? null);
      });

      return () => {
        if (subscription) subscription.unsubscribe();
      };
    } catch (err) {
      console.error("App useEffect error:", err);
      setError("Falha na inicialização");
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
        <h1 className="text-2xl font-black text-red-600 mb-4">Ops! Algo deu errado.</h1>
        <p className="text-slate-500 mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold"
        >
          Recarregar Página
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <TeacherDashboard />;
      case 'students': return <StudentsView />;
      case 'schools': return <SchoolsView />;
      case 'assistant': return <LessonLogView />;
      case 'materials': return <MaterialsView />;
      case 'classes': return <ClassesView />;
      default: return <div className="flex-1 p-20 ml-72 text-slate-300">Em breve...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" richColors />
      {!session ? (
        <Auth />
      ) : (
        <div className="flex">
          <Sidebar activeView={activeView} onNavigate={setActiveView} />
          {renderView()}
        </div>
      )}
    </div>
  );
}

export default App;

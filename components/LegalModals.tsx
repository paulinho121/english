import React from 'react';
import { X, ShieldCheck, ScrollText } from 'lucide-react';

interface LegalModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const LegalModal: React.FC<LegalModalProps> = ({ onClose, title, children }) => (
    <div className="fixed inset-0 z-[300] bg-slate-950/95 backdrop-blur-xl flex flex-col p-6 animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                    </div>
                    <h2 className="text-xl font-black text-white">{title}</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-6 h-6 text-slate-500 hover:text-white" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-invert max-w-none no-scrollbar">
                {children}
            </div>
        </div>
    </div>
);

export const PrivacyPolicy: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal onClose={onClose} title="Política de Privacidade">
        <div className="space-y-6 text-slate-400">
            <section>
                <h3 className="text-white font-bold text-lg mb-2">1. Coleta de Dados</h3>
                <p>Coletamos informações necessárias para o funcionamento do LinguaFlow, incluindo email, nome e progresso pedagógico (erros, acertos e vocabulário). Estes dados são usados exclusivamente para personalizar sua experiência de aprendizado.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">2. Processamento de Áudio</h3>
                <p>O áudio capturado durante as sessões é processado em tempo real via API do Google Gemini. Não armazenamos os arquivos de áudio brutos em nossos servidores após o processamento da transcrição e análise pedagógica.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">3. Segurança dos Dados</h3>
                <p>Utilizamos tecnologias de ponta (Supabase/PostgreSQL) para garantir que seus dados estejam protegidos contra acesso não autorizado.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">4. Seus Direitos</h3>
                <p>Em conformidade com a LGPD, você tem o direito de solicitar a exclusão total de seus dados de nossa plataforma a qualquer momento através das configurações de perfil ou suporte por email.</p>
            </section>
        </div>
    </LegalModal>
);

export const TermsOfService: React.FC<{ onClose: () => void }> = ({ onClose }) => (
    <LegalModal onClose={onClose} title="Termos de Uso">
        <div className="space-y-6 text-slate-400">
            <section>
                <h3 className="text-white font-bold text-lg mb-2">1. Propriedade Intelectual</h3>
                <p>Todo o conteúdo, incluindo metodologia pedagógica, prompts de IA, design e código fonte, é propriedade exclusiva de Paulinho Fernando. Qualquer reprodução total ou parcial é proibida.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">2. Uso Permitido</h3>
                <p>O acesso ao LinguaFlow é pessoal e intransferível. O compartilhamento de contas Premium pode resultar no cancelamento imediato da assinatura sem reembolso.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">3. Limitação de Responsabilidade</h3>
                <p>O LinguaFlow é uma ferramenta de auxílio ao aprendizado. Não garantimos fluência ou resultados em exames oficiais, sendo o progresso dependente do esforço individual do usuário.</p>
            </section>
            <section>
                <h3 className="text-white font-bold text-lg mb-2">4. Pagamentos e Reembolsos</h3>
                <p>Assinaturas são processadas via Hotmart/Stripe. O cancelamento pode ser feito a qualquer momento, mantendo o acesso até o fim do período já pago.</p>
            </section>
        </div>
    </LegalModal>
);

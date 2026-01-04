import React from 'react';
import { Topic, UserProgress } from '../types';
import { CheckCircle, Star, Play, Award, Zap } from 'lucide-react';

interface JourneyMapProps {
    topics: Topic[];
    progress: Record<string, UserProgress>;
    selectedTopicId: string | null;
    onSelectTopic: (topicId: string) => void;
    isKidsMode?: boolean;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ topics, progress, selectedTopicId, onSelectTopic, isKidsMode }) => {

    // Cycle colors based on the decimal part (1.0 -> Blue, 1.1 -> Green, etc.)
    const getLevelColor = (level: number) => {
        const minor = Math.round((level % 1) * 10);
        const major = Math.floor(level);

        // Level 1.x (Basic Cycle)
        if (major === 1) {
            switch (minor) {
                case 0: return 'bg-blue-500';   // 1.0
                case 1: return 'bg-emerald-500'; // 1.1
                case 2: return 'bg-yellow-500';  // 1.2
                case 3: return 'bg-orange-500';  // 1.3
                case 4: return 'bg-red-500';     // 1.4
            }
        }

        // Level 2.x (Advanced Cycle - Purple/Neon Theme)
        if (major === 2) {
            switch (minor) {
                case 0: return 'bg-purple-600';     // 2.0 (The start of "Roxa")
                case 1: return 'bg-fuchsia-500';    // 2.1 (Pink)
                case 2: return 'bg-pink-500';       // 2.2 (Hot Pink)
                case 3: return 'bg-indigo-500';     // 2.3 (Indigo)
                case 4: return 'bg-violet-600';     // 2.4 (Violet)
            }
        }

        // Level 3.x+ (Master Cycle - Gold/Elite)
        return 'bg-amber-400';
    };

    const getLevelGradient = (level: number) => {
        const minor = Math.round((level % 1) * 10);
        const major = Math.floor(level);

        // Level 1.x Gradients
        if (major === 1) {
            switch (minor) {
                case 0: return 'from-blue-400 to-blue-600';
                case 1: return 'from-emerald-400 to-emerald-600';
                case 2: return 'from-yellow-400 to-yellow-600';
                case 3: return 'from-orange-400 to-orange-600';
                case 4: return 'from-red-400 to-red-600';
            }
        }

        // Level 2.x Gradients (Neon/Cyberpunk)
        if (major === 2) {
            switch (minor) {
                case 0: return 'from-purple-500 to-indigo-600';
                case 1: return 'from-fuchsia-500 to-pink-600';
                case 2: return 'from-pink-500 to-rose-600';
                case 3: return 'from-indigo-500 to-violet-600';
                case 4: return 'from-violet-500 to-purple-800';
            }
        }

        // Level 3.x+ Gradients (Gold)
        return 'from-amber-300 to-yellow-600';
    };

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 py-10 px-4 overflow-x-hidden relative">

            {/* Central Line */}
            <div className={`absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full z-0 h-full ${isKidsMode ? 'bg-[#4ecdc4]/20' : 'bg-white/5'}`}></div>

            {topics.map((topic, index) => {
                const userProg = progress[topic.id];
                const score = userProg?.score || 0;
                const currentLevel = userProg?.current_level || 1.0;
                const isCompleted = userProg?.status === 'completed' || currentLevel >= 2.0; // Completed if passed 1.4? Or status flag.
                const isStarted = score > 0 || currentLevel > 1.0;
                const isSelected = selectedTopicId === topic.id;
                const isLeft = index % 2 === 0;

                const barGradient = getLevelGradient(currentLevel);

                return (
                    <div key={topic.id} className={`relative flex items-center justify-${isLeft ? 'end' : 'start'} w-full z-10`}>

                        {/* Connector Line */}
                        <div className={`hidden sm:block absolute top-1/2 left-1/2 w-1/2 h-1 border-t-2 border-dashed pointer-events-none 
                            ${isCompleted ? 'border-purple-500/50' : isKidsMode ? 'border-[#4ecdc4]/30' : 'border-slate-800'} 
                            ${isLeft ? 'translate-x-0' : '-translate-x-full'}`}></div>

                        <button
                            onClick={() => onSelectTopic(topic.id)}
                            className={`
                group relative w-full md:w-5/6 p-4 md:p-5 rounded-2xl border-2 transition-all duration-300
                flex items-center gap-4 md:gap-5 shadow-xl hover:scale-[1.02] active:scale-95
                ${isSelected
                                    ? 'bg-white/10 border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                    : isCompleted
                                        ? 'bg-purple-900/20 border-purple-500/50 hover:bg-purple-900/10'
                                        : isStarted
                                            ? 'glass-premium border-white/20 bg-white/5'
                                            : 'glass-premium border-white/10 hover:border-white/20'
                                }
              `}
                        >
                            {/* Icon Bubble */}
                            <div className={`
                w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg shrink-0 transition-all duration-500 relative overflow-hidden
                ${isCompleted ? 'bg-purple-500 text-white' : isStarted ? `bg-gradient-to-br ${barGradient} text-white` : isKidsMode ? 'bg-[#4ecdc4]/20 text-[#4ecdc4]/60' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}
              `}>
                                {isCompleted ? <Award className="w-8 h-8" /> : topic.icon}
                                {currentLevel > 1.0 && !isCompleted && (
                                    <div className="absolute top-1 right-1 text-[8px] font-black bg-black/30 px-1 rounded text-white">
                                        {currentLevel.toFixed(1)}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left min-w-0 py-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-display font-bold text-lg md:text-xl truncate transition-colors ${isKidsMode ? 'text-[#2d3748]' : 'text-white group-hover:text-orange-400'}`}>
                                        {topic.name}
                                    </h3>
                                    {isStarted && (
                                        <div className={`text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${isCompleted ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-white'}`}>
                                            <Zap className="w-3 h-3 fill-current" /> Nível {currentLevel.toFixed(1)}
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar Container */}
                                <div className={`w-full h-3 rounded-full overflow-hidden relative ${isKidsMode ? 'bg-[#4ecdc4]/10' : 'bg-slate-800'}`}>
                                    {/* Progress Fill */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${barGradient}`}
                                        style={{ width: `${score}%` }}
                                    ></div>
                                </div>

                                {/* Progress Text */}
                                <div className="flex justify-between items-center mt-2 h-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-purple-400' : isKidsMode ? 'text-[#4ecdc4]' : 'text-slate-500'}`}>
                                        {isCompleted ? 'Nível Máximo Alcançado!' : `${score}% para Próximo Nível`}
                                    </span>

                                    {!isCompleted && (
                                        <span className="text-[10px] font-bold text-white/50 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-3 h-3 fill-current" /> {isStarted ? 'Continuar Tempo' : 'Iniciar'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })
            }
        </div >
    );
};

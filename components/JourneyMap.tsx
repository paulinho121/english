import React from 'react';
import { Topic } from '../types';
import { CheckCircle, Star, Play, Award } from 'lucide-react';

interface JourneyMapProps {
    topics: Topic[];
    progress: Record<string, number>; // 0 to 100
    onSelectTopic: (topicId: string) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ topics, progress, onSelectTopic }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-8 py-10">

            {/* Central Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 rounded-full z-0 h-full"></div>

            {topics.map((topic, index) => {
                const topicProgress = progress[topic.id] || 0;
                const isCompleted = topicProgress === 100;
                const isStarted = topicProgress > 0;
                const isLeft = index % 2 === 0;

                return (
                    <div key={topic.id} className={`relative flex items-center justify-${isLeft ? 'end' : 'start'} w-full z-10`}>

                        {/* Connector Line (Horizontal) */}
                        <div className={`absolute top-1/2 left-1/2 w-1/2 h-1 border-t-2 border-dashed ${isCompleted ? 'border-orange-500/50' : 'border-slate-800'} 
             ${isLeft ? '-translate-x-full' : 'translate-x-0'}`}></div>

                        <button
                            onClick={() => onSelectTopic(topic.id)}
                            className={`
                group relative w-full md:w-5/6 p-5 rounded-[2rem] border-2 transition-all duration-300
                flex items-center gap-5 shadow-xl hover:scale-[1.02] active:scale-95
                ${isCompleted
                                    ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30'
                                    : isStarted
                                        ? 'glass-premium border-orange-500/50 bg-orange-500/5'
                                        : 'glass-premium border-white/10 hover:border-orange-500/30'
                                }
              `}
                        >
                            {/* Icon Bubble */}
                            <div className={`
                w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0 transition-all duration-500
                ${isCompleted ? 'bg-emerald-500 text-white' : isStarted ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'}
              `}>
                                {isCompleted ? <CheckCircle className="w-8 h-8" /> : topic.icon}
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-left min-w-0 py-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className={`font-display font-bold text-lg md:text-xl truncate text-white group-hover:text-orange-400 transition-colors`}>
                                        {topic.name}
                                    </h3>
                                    {isCompleted && <Award className="w-6 h-6 text-emerald-400 fill-emerald-400/20 animate-pulse" />}
                                </div>

                                {/* Progress Bar Container */}
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden relative">
                                    {/* Progress Fill */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}
                                        style={{ width: `${topicProgress}%` }}
                                    ></div>
                                </div>

                                {/* Progress Text */}
                                <div className="flex justify-between items-center mt-2 h-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isCompleted ? 'text-emerald-500' : 'text-slate-500'}`}>
                                        {isCompleted ? 'Completo' : `${topicProgress}% Concluído`}
                                    </span>

                                    {!isCompleted && (
                                        <span className="text-[10px] font-bold text-orange-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-3 h-3 fill-current" /> {isStarted ? 'Continuar' : 'Iniciar'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

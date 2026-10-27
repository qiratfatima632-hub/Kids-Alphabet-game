import React from 'react';
import { Star, Lock, CheckCircle2, Play, Trophy, Sparkles } from 'lucide-react';
import { LEVELS_CONFIG, INITIAL_BADGES } from '../data/levelsData';
import { PlayerProgress } from '../types';
import { playClick, playPop, speakWord } from '../utils/audio';

interface AdventureLevelsViewProps {
  progress: PlayerProgress;
  soundEnabled: boolean;
  onSelectLevelTask: (levelNum: number, taskType: 'learn_abc' | 'learn_shapes' | 'match_abc' | 'match_shapes' | 'quiz', initialParam?: string) => void;
}

export const AdventureLevelsView: React.FC<AdventureLevelsViewProps> = ({
  progress,
  soundEnabled,
  onSelectLevelTask
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-6 select-none" data-testid="adventure-levels-screen">
      {/* Top Banner */}
      <div className="bg-white/95 rounded-3xl border-4 border-amber-300 p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🗺️</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
              Adventure Learning Path
            </h1>
          </div>
          <p className="text-sm font-bold text-slate-600 mt-1">
            Complete levels, gather stars, unlock badges, and master alphabets and shapes!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-5 py-3 rounded-2xl border-2 border-amber-200">
          <div className="flex items-center gap-1.5">
            <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
            <span className="text-2xl font-black text-amber-950">{progress.stars} Stars</span>
          </div>
        </div>
      </div>

      {/* Levels Track (1 to 5) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Levels (1 to 5)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEVELS_CONFIG.map((lvl) => {
            const isUnlocked = progress.stars >= lvl.requiredStars;
            const isCompleted = progress.completedLevels.includes(lvl.level);

            return (
              <div
                key={lvl.level}
                className={`rounded-3xl border-4 p-5 flex flex-col justify-between transition-all relative ${
                  isUnlocked
                    ? 'bg-white border-amber-400 shadow-md hover:border-amber-500'
                    : 'bg-slate-100 border-slate-300 opacity-75'
                }`}
              >
                {/* Level Tag & Completion Icon */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-3 py-1 rounded-full text-white font-black text-xs shadow-xs"
                    style={{ backgroundColor: lvl.color }}
                  >
                    Level {lvl.level}
                  </span>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-extrabold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  ) : !isUnlocked ? (
                    <span className="flex items-center gap-1 text-slate-500 font-bold text-xs bg-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{lvl.requiredStars} Stars</span>
                    </span>
                  ) : (
                    <span className="text-amber-500 font-bold text-xs flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>Unlocked</span>
                    </span>
                  )}
                </div>

                {/* Level Title & Details */}
                <div className="flex flex-col gap-1 mb-4">
                  <h3 className="text-lg font-black text-slate-900">{lvl.title}</h3>
                  <p className="text-xs font-semibold text-slate-600">{lvl.subtitle}</p>

                  <div className="mt-2 text-xs font-bold text-slate-500 flex flex-wrap gap-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      Letters: {lvl.alphabetRange[0]}–{lvl.alphabetRange[1]}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                      Shapes: {lvl.shapesIncluded.length}
                    </span>
                  </div>
                </div>

                {/* Action buttons inside level */}
                {isUnlocked ? (
                  <div className="grid grid-cols-2 gap-2 mt-auto pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        playClick(soundEnabled);
                        onSelectLevelTask(lvl.level, 'learn_abc', lvl.alphabetRange[0]);
                      }}
                      className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-amber-900" />
                      <span>Learn {lvl.alphabetRange[0]}-{lvl.alphabetRange[1]}</span>
                    </button>

                    <button
                      onClick={() => {
                        playClick(soundEnabled);
                        onSelectLevelTask(lvl.level, 'match_abc');
                      }}
                      className="py-2 px-2.5 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 font-black text-xs flex items-center justify-center gap-1 cursor-pointer transition-transform active:scale-95"
                    >
                      <Star className="w-3.5 h-3.5 fill-sky-900" />
                      <span>Play Match</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-2.5 text-center text-xs font-bold text-slate-500 bg-slate-200/60 rounded-xl mt-auto">
                    Collect {lvl.requiredStars - progress.stars} more stars to unlock!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges Collection */}
      <div className="bg-white/95 rounded-3xl border-4 border-amber-300 p-5 sm:p-6 shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h2 className="text-xl font-black text-slate-800">Badges &amp; Trophies</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {progress.badges.length} of {INITIAL_BADGES.length} Collected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {INITIAL_BADGES.map((badge) => {
            const isUnlocked = progress.badges.includes(badge.id);

            return (
              <div
                key={badge.id}
                onClick={() => {
                  playPop(soundEnabled);
                  speakWord(`${badge.title}. ${badge.description}`);
                }}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center gap-2 cursor-pointer transition-transform active:scale-95 ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
                title={badge.description}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs ${
                    isUnlocked ? 'bg-amber-200 border-2 border-amber-400' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>
                <span className="text-xs font-black text-slate-800">{badge.title}</span>
                <span className="text-[11px] font-medium text-slate-500 line-clamp-2">
                  {badge.description}
                </span>
                {isUnlocked ? (
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Unlocked!
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

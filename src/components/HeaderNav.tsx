import React from 'react';
import { Home, Volume2, VolumeX, Music, Settings, Star, Coins, ArrowLeft } from 'lucide-react';
import { PlayerProgress } from '../types';
import { playClick } from '../utils/audio';

interface HeaderNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  progress: PlayerProgress;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenSettings: () => void;
  title?: string;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onNavigate,
  progress,
  onToggleSound,
  onToggleMusic,
  onOpenSettings,
  title
}) => {
  const isHome = currentView === 'menu';

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-4 border-amber-200 shadow-md sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between">
      {/* Left: Home / Back button */}
      <div className="flex items-center gap-2">
        {!isHome ? (
          <button
            onClick={() => {
              playClick(progress.soundEnabled);
              onNavigate('menu');
            }}
            className="px-3 py-1.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-sm sm:text-base flex items-center gap-1.5 shadow-sm transition-transform cursor-pointer border-2 border-amber-500"
            aria-label="Back to Main Menu"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Menu</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl animate-bounce">🎈</span>
            <span className="font-black text-lg sm:text-xl text-sky-600 tracking-tight">
              AlphaShapes <span className="text-amber-500">3D</span>
            </span>
          </div>
        )}

        {!isHome && title && (
          <span className="font-extrabold text-base sm:text-lg text-slate-800 ml-1 truncate max-w-[150px] sm:max-w-xs">
            {title}
          </span>
        )}
      </div>

      {/* Center/Right: Badges & Rewards */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Stars Counter */}
        <div
          className="flex items-center gap-1.5 bg-amber-50 border-2 border-amber-300 px-2.5 sm:px-3.5 py-1 rounded-2xl shadow-xs"
          title="Total Stars Earned"
        >
          <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
          <span className="font-black text-amber-900 text-sm sm:text-base">{progress.stars}</span>
        </div>

        {/* Coins Counter */}
        <div
          className="flex items-center gap-1.5 bg-yellow-50 border-2 border-yellow-300 px-2.5 sm:px-3.5 py-1 rounded-2xl shadow-xs"
          title="Total Coins"
        >
          <Coins className="w-5 h-5 text-yellow-600 fill-yellow-400" />
          <span className="font-black text-yellow-900 text-sm sm:text-base">{progress.coins}</span>
        </div>

        {/* Audio Controls */}
        <button
          onClick={() => {
            playClick(progress.soundEnabled);
            onToggleMusic();
          }}
          className={`p-2 rounded-2xl border-2 transition-transform active:scale-90 cursor-pointer ${
            progress.musicEnabled
              ? 'bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200'
              : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
          }`}
          title={progress.musicEnabled ? 'Mute Background Music' : 'Play Background Music'}
          aria-label={progress.musicEnabled ? 'Mute Background Music' : 'Play Background Music'}
        >
          <Music className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => {
            onToggleSound();
          }}
          className={`p-2 rounded-2xl border-2 transition-transform active:scale-90 cursor-pointer ${
            progress.soundEnabled
              ? 'bg-sky-100 border-sky-300 text-sky-700 hover:bg-sky-200'
              : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
          }`}
          title={progress.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          aria-label={progress.soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
        >
          {progress.soundEnabled ? (
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          ) : (
            <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
          )}
        </button>

        {/* Settings button */}
        <button
          onClick={() => {
            playClick(progress.soundEnabled);
            onOpenSettings();
          }}
          className="p-2 rounded-2xl border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-90 transition-transform cursor-pointer"
          title="Game Settings"
          aria-label="Game Settings"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
        </button>
      </div>
    </header>
  );
};

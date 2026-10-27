import React from 'react';
import { X, Volume2, Music, Palette, RotateCcw } from 'lucide-react';
import { PlayerProgress } from '../types';
import { playClick, speakWord } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PlayerProgress;
  onUpdateProgress: (updated: Partial<PlayerProgress>) => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  progress,
  onUpdateProgress,
  onResetProgress
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs select-none">
      <div className="bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-7 shadow-2xl max-w-md w-full flex flex-col gap-5 relative animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <h2 className="text-2xl font-black text-slate-800">Game Settings</h2>
          </div>
          <button
            onClick={() => {
              playClick(progress.soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            aria-label="Close Settings"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Audio Toggles */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Audio &amp; Sounds</span>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-sky-600" />
              <div>
                <p className="text-sm font-black text-slate-800">Sound Effects (SFX)</p>
                <p className="text-xs text-slate-500">Chimes, bounces, cheering sounds</p>
              </div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ soundEnabled: !progress.soundEnabled });
              }}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                progress.soundEnabled ? 'bg-sky-500' : 'bg-slate-300'
              }`}
              aria-label="Toggle Sound Effects"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform absolute top-1 ${
                  progress.soundEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-200">
            <div className="flex items-center gap-2.5">
              <Music className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-black text-slate-800">Background Lullaby</p>
                <p className="text-xs text-slate-500">Gentle relaxing melody for kids</p>
              </div>
            </div>
            <button
              onClick={() => {
                onUpdateProgress({ musicEnabled: !progress.musicEnabled });
              }}
              className={`w-14 h-8 rounded-full transition-colors relative cursor-pointer ${
                progress.musicEnabled ? 'bg-purple-600' : 'bg-slate-300'
              }`}
              aria-label="Toggle Background Music"
            >
              <div
                className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform absolute top-1 ${
                  progress.musicEnabled ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Speech Speed */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Pronunciation Speed</span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Slow', rate: 0.75 },
              { label: 'Normal', rate: 0.9 },
              { label: 'Brisk', rate: 1.05 }
            ].map(item => (
              <button
                key={item.label}
                onClick={() => {
                  onUpdateProgress({ speechRate: item.rate });
                  speakWord(`Speed set to ${item.label}`, item.rate);
                }}
                className={`py-2 rounded-xl text-xs font-black border-2 cursor-pointer transition-all ${
                  progress.speechRate === item.rate
                    ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-xs'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Themes */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
            <Palette className="w-3.5 h-3.5" />
            <span>World Themes</span>
          </span>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'sunny', name: 'Sunny Meadow', bg: 'bg-emerald-500' },
              { id: 'candy', name: 'Candy Castle', bg: 'bg-pink-500' },
              { id: 'cosmic', name: 'Cosmic Sky', bg: 'bg-indigo-600' },
              { id: 'ocean', name: 'Ocean Splash', bg: 'bg-sky-500' }
            ].map(theme => (
              <button
                key={theme.id}
                onClick={() => onUpdateProgress({ activeTheme: theme.id as 'sunny' | 'candy' | 'cosmic' | 'ocean' })}
                className={`p-2.5 rounded-2xl border-2 flex items-center gap-2 cursor-pointer transition-transform active:scale-95 ${
                  progress.activeTheme === theme.id
                    ? 'border-amber-500 bg-amber-50 shadow-sm'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${theme.bg}`} />
                <span className="text-xs font-black text-slate-800">{theme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Progress */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              if (window.confirm('Reset all progress, stars, and badges?')) {
                onResetProgress();
                onClose();
              }
            }}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Saved Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};

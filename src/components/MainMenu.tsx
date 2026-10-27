import React from 'react';
import { Play, Sparkles, Trophy, Star, Settings } from 'lucide-react';
import { PlayerProgress } from '../types';
import { playClick, speakWord } from '../utils/audio';

interface MainMenuProps {
  onSelectMode: (mode: string) => void;
  onOpenSettings: () => void;
  progress: PlayerProgress;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onSelectMode,
  onOpenSettings,
  progress
}) => {
  const handleLaunchMode = (mode: string, voiceGreeting: string) => {
    playClick(progress.soundEnabled);
    speakWord(voiceGreeting);
    onSelectMode(mode);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-8 flex flex-col items-center gap-6 sm:gap-8 select-none" data-testid="main-menu-screen">
      {/* Hero Welcome Banner */}
      <div className="w-full text-center flex flex-col items-center relative py-4">
        {/* Floating background decorative badges */}
        <div className="absolute -top-2 left-6 text-4xl animate-bounce hidden sm:block">🌟</div>
        <div className="absolute top-8 right-8 text-4xl animate-bounce delay-150 hidden sm:block">🎈</div>
        <div className="absolute bottom-2 left-12 text-3xl animate-pulse hidden sm:block">🔺</div>
        <div className="absolute -bottom-2 right-14 text-3xl animate-pulse delay-200 hidden sm:block">🎲</div>

        {/* Floating Letters & Shapes Mini Marquee */}
        <div className="flex items-center gap-2 mb-2 py-1 px-4 bg-white/80 rounded-full border border-amber-300 shadow-xs text-xs sm:text-sm font-black text-amber-900">
          <span className="text-base">✨</span>
          <span>A B C • 1 2 3 • Spheres, Cubes &amp; Stars!</span>
          <span className="text-base">✨</span>
        </div>

        {/* Big Game Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center justify-center gap-x-3">
          <span className="text-sky-500 drop-shadow-xs">Alpha</span>
          <span className="text-amber-500 drop-shadow-xs">Shapes</span>
          <span className="text-pink-500 bg-pink-100 px-3 py-0.5 rounded-3xl border-3 border-pink-300 text-3xl sm:text-5xl">
            3D
          </span>
        </h1>

        <p className="text-base sm:text-lg font-bold text-slate-600 mt-2 max-w-lg">
          The fun, colorful 3D educational game to learn English alphabets and geometric shapes!
        </p>
      </div>

      {/* Main Mode Launch Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. Play Adventure Game (Hero Card) */}
        <button
          onClick={() => handleLaunchMode('levels', 'Welcome to the Adventure Path! Let us learn and win stars!')}
          className="col-span-1 sm:col-span-2 lg:col-span-3 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 border-4 border-amber-500 shadow-lg hover:shadow-xl active:scale-98 transition-all flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer text-left group"
          aria-label="Play Game: Adventure Mode"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform">
              🚀
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-200 text-xs font-black uppercase">
                  Featured Mode
                </span>
                <span className="text-xs font-black text-amber-900">Level {progress.unlockedLevel} Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mt-0.5">
                Play Game — Adventure Journey
              </h2>
              <p className="text-xs sm:text-sm font-bold text-amber-900/80">
                Unlock 5 progressive learning levels from A-F to 3D shape masteries!
              </p>
            </div>
          </div>

          <div className="px-6 py-3 rounded-2xl bg-white text-amber-950 font-black text-base flex items-center gap-2 shadow-sm shrink-0 border-2 border-amber-300">
            <Play className="w-5 h-5 fill-amber-950" />
            <span>Start Adventure</span>
          </div>
        </button>

        {/* 2. Learn English Alphabets */}
        <button
          onClick={() => handleLaunchMode('learn_abc', 'Let us learn English Alphabets from A to Z!')}
          className="p-6 rounded-3xl bg-white border-4 border-sky-300 hover:border-sky-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Learn English Alphabets Mode"
        >
          <div className="w-14 h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🔤
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Learn English Alphabets
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Explore 26 letters with rotating 3D letters, word pictures, and phonics sounds!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-sky-600 flex items-center gap-1">
            <span>Explore A to Z</span>
            <span>→</span>
          </span>
        </button>

        {/* 3. Learn Shapes */}
        <button
          onClick={() => handleLaunchMode('learn_shapes', 'Let us explore 2D and 3D shapes!')}
          className="p-6 rounded-3xl bg-white border-4 border-purple-300 hover:border-purple-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Learn Different Shapes Mode"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🔷
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Learn Different Shapes
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Spheres, cubes, pyramids, triangles, circles &amp; real-world objects in 3D!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-purple-600 flex items-center gap-1">
            <span>Inspect 16 Shapes</span>
            <span>→</span>
          </span>
        </button>

        {/* 4. Alphabet Matching */}
        <button
          onClick={() => handleLaunchMode('match_abc', 'Time for Alphabet Matching! Find the matching picture!')}
          className="p-6 rounded-3xl bg-white border-4 border-pink-300 hover:border-pink-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Alphabet Matching Game"
        >
          <div className="w-14 h-14 rounded-2xl bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🎯
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Alphabet Matching
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Match the prompt letter to the right word picture and collect stars!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-pink-600 flex items-center gap-1">
            <span>Play Matching</span>
            <span>→</span>
          </span>
        </button>

        {/* 5. Shape Matching */}
        <button
          onClick={() => handleLaunchMode('match_shapes', 'Shape Matching! Drag and drop shapes into their outlines!')}
          className="p-6 rounded-3xl bg-white border-4 border-emerald-300 hover:border-emerald-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Shape Matching Game"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            🧩
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Shape Matching
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Drag-and-drop shapes into target outlines or tap to snap them in!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-emerald-600 flex items-center gap-1">
            <span>Play Puzzle</span>
            <span>→</span>
          </span>
        </button>

        {/* 6. Quiz Challenge */}
        <button
          onClick={() => handleLaunchMode('quiz', 'Quiz Challenge! Show your smart alphabet and shape skills!')}
          className="p-6 rounded-3xl bg-white border-4 border-amber-300 hover:border-amber-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Quiz Challenge Mode"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            ❓
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Quiz Challenge
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Fun 3-choice questions testing letter order, sounds, and shape sides!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-amber-600 flex items-center gap-1">
            <span>Start Quiz</span>
            <span>→</span>
          </span>
        </button>

        {/* 7. Settings Quick Tile */}
        <button
          onClick={() => {
            playClick(progress.soundEnabled);
            onOpenSettings();
          }}
          className="p-6 rounded-3xl bg-white border-4 border-slate-300 hover:border-slate-400 shadow-md hover:shadow-lg active:scale-98 transition-all flex flex-col items-start gap-3 cursor-pointer text-left group"
          aria-label="Settings"
        >
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            ⚙️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-800">
              Settings &amp; Audio
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Lullaby music, pronunciation speed, sound effects &amp; themes!
            </p>
          </div>
          <span className="mt-auto text-xs font-black text-slate-600 flex items-center gap-1">
            <span>Customize</span>
            <span>→</span>
          </span>
        </button>
      </div>

      {/* Child Player Summary Banner */}
      <div className="w-full bg-white/90 p-4 sm:p-5 rounded-3xl border-3 border-amber-200 shadow-sm flex flex-wrap items-center justify-around gap-4 text-center">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-400" />
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold text-slate-500">Stars Earned</span>
            <p className="text-lg font-black text-slate-800">{progress.stars} Stars</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-purple-500" />
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold text-slate-500">Badges</span>
            <p className="text-lg font-black text-slate-800">{progress.badges.length} Trophies</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sky-500" />
          <div className="text-left">
            <span className="text-xs uppercase font-extrabold text-slate-500">Letters &amp; Shapes</span>
            <p className="text-lg font-black text-slate-800">
              {progress.lettersLearned.length}/26 Letters • {progress.shapesExplored.length}/16 Shapes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

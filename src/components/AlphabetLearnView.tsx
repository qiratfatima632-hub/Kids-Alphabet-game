import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles, SpellCheck } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { ThreeLetterViewer } from './ThreeLetterViewer';
import { speakWord, playPop, playClick } from '../utils/audio';

interface AlphabetLearnViewProps {
  soundEnabled: boolean;
  onRecordLearnedLetter: (letter: string) => void;
  initialLetter?: string;
}

export const AlphabetLearnView: React.FC<AlphabetLearnViewProps> = ({
  soundEnabled,
  onRecordLearnedLetter,
  initialLetter = 'A'
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = ALPHABET_DATA.findIndex(a => a.letter.toUpperCase() === initialLetter.toUpperCase());
    return idx >= 0 ? idx : 0;
  });

  const [isLowercase, setIsLowercase] = useState(false);
  const currentItem = ALPHABET_DATA[currentIndex];

  // Pronounce and record when letter changes
  useEffect(() => {
    if (currentItem) {
      onRecordLearnedLetter(currentItem.letter);
      speakWord(`${currentItem.letter}. ${currentItem.word}.`);
    }
  }, [currentIndex, onRecordLearnedLetter]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        speakWord(`${currentItem.letter}. ${currentItem.word}.`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentItem]);

  const goToPrevious = () => {
    playClick(soundEnabled);
    setCurrentIndex(prev => (prev === 0 ? ALPHABET_DATA.length - 1 : prev - 1));
  };

  const goToNext = () => {
    playClick(soundEnabled);
    setCurrentIndex(prev => (prev === ALPHABET_DATA.length - 1 ? 0 : prev + 1));
  };

  const selectLetter = (index: number) => {
    playPop(soundEnabled);
    setCurrentIndex(index);
  };

  // Spell the word out letter-by-letter
  const handleSpellWord = () => {
    playClick(soundEnabled);
    const lettersSpelled = currentItem.word.toUpperCase().split('').join(', ');
    speakWord(`${currentItem.word}. Spelled: ${lettersSpelled}. ${currentItem.word}!`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 select-none" data-testid="alphabet-learn-screen">
      {/* Top Banner & Case Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 p-4 rounded-3xl border-3 border-amber-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🔤</span> Learn English Alphabets
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            Explore letters A to Z with 3D models, words, and clear pronunciations!
          </p>
        </div>

        {/* Uppercase / Lowercase Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300">
          <button
            onClick={() => {
              playClick(soundEnabled);
              setIsLowercase(false);
              speakWord('Capital letters');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              !isLowercase ? 'bg-amber-400 text-amber-950 shadow-xs scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Show Uppercase Letters"
          >
            A B C (Upper)
          </button>
          <button
            onClick={() => {
              playClick(soundEnabled);
              setIsLowercase(true);
              speakWord('Small letters');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              isLowercase ? 'bg-amber-400 text-amber-950 shadow-xs scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Show Lowercase Letters"
          >
            a b c (Lower)
          </button>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 3D Letter Viewer */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl border-4 border-amber-300 shadow-md p-4 sm:p-6 flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
          {/* Subtle background letter watermark */}
          <span className="absolute -top-10 -left-6 text-9xl font-black text-slate-100 pointer-events-none select-none">
            {isLowercase ? currentItem.lowercase : currentItem.letter}
          </span>

          {/* Letter Index Badge */}
          <div className="w-full flex items-center justify-between z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-black text-sm">
              Letter {currentIndex + 1} of 26
            </span>

            {/* Pronounce letter button */}
            <button
              onClick={() => {
                playClick(soundEnabled);
                speakWord(`${isLowercase ? currentItem.lowercase : currentItem.letter}. ${currentItem.phonetic}`);
              }}
              className="px-3 py-1.5 rounded-2xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-800 font-black text-sm flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
              aria-label={`Pronounce letter ${currentItem.letter}`}
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Say Letter</span>
            </button>
          </div>

          {/* 3D Canvas Letter */}
          <div className="w-full my-2 flex items-center justify-center">
            <ThreeLetterViewer
              letter={currentItem.letter}
              lowercase={currentItem.lowercase}
              word={currentItem.word}
              color={currentItem.color}
              isLowercase={isLowercase}
              soundEnabled={soundEnabled}
            />
          </div>

          {/* Bottom Navigation Buttons */}
          <div className="w-full flex items-center justify-between gap-3 pt-2 border-t-2 border-slate-100 z-10">
            <button
              onClick={goToPrevious}
              className="flex-1 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-base flex items-center justify-center gap-2 border-2 border-amber-500 shadow-xs cursor-pointer transition-transform"
              aria-label="Previous Letter"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
              <span>Previous</span>
            </button>

            <button
              onClick={goToNext}
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-400 hover:bg-sky-500 active:scale-95 text-sky-950 font-black text-base flex items-center justify-center gap-2 border-2 border-sky-500 shadow-xs cursor-pointer transition-transform"
              aria-label="Next Letter"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right: Word Card, Spelling & Phonetics */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Main Word Card */}
          <div className="bg-white/95 rounded-3xl border-4 border-sky-300 shadow-md p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Word Example
              </span>
              <span className="text-3xl animate-bounce">{currentItem.emoji}</span>
            </div>

            {/* Word Display with Highlighted First Letter */}
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight flex items-baseline">
                <span className="text-sky-600 font-extrabold underline decoration-amber-400 decoration-4">
                  {currentItem.letter}
                </span>
                <span>{currentItem.word.slice(1)}</span>
              </h2>
              <span className="text-sm font-bold text-slate-500">
                {isLowercase ? currentItem.lowercase : currentItem.letter} is for {currentItem.word}
              </span>
            </div>

            {/* Phonics & Sound */}
            <div className="bg-sky-50/80 rounded-2xl p-3 border-2 border-sky-200 flex items-center justify-between">
              <div>
                <p className="text-xs text-sky-700 font-bold uppercase">Phonics Sound</p>
                <p className="text-base font-black text-sky-950">{currentItem.phonetic}</p>
              </div>
              <button
                onClick={() => {
                  playClick(soundEnabled);
                  speakWord(currentItem.phonetic);
                }}
                className="p-2.5 rounded-xl bg-white hover:bg-sky-100 border border-sky-300 text-sky-700 active:scale-95 cursor-pointer shadow-xs"
                title="Hear Phonics Sound"
                aria-label="Hear Phonics Sound"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Spelling Breakdown */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 uppercase">Spelling</span>
                <button
                  onClick={handleSpellWord}
                  className="text-xs font-black text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300"
                  aria-label={`Spell the word ${currentItem.word}`}
                >
                  <SpellCheck className="w-3.5 h-3.5" />
                  <span>Spell Aloud</span>
                </button>
              </div>

              {/* Letter Tiles */}
              <div className="flex flex-wrap gap-1.5">
                {currentItem.word.split('').map((char, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playPop(soundEnabled);
                      speakWord(char);
                    }}
                    className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-950 font-black text-lg flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                    title={`Tap to hear ${char}`}
                    aria-label={`Letter ${char}`}
                  >
                    {isLowercase ? char.toLowerCase() : char.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Description & Fun Fact */}
            <div className="bg-amber-50/70 rounded-2xl p-3.5 border-2 border-amber-200 flex flex-col gap-1 text-slate-700 text-xs sm:text-sm">
              <p className="font-bold flex items-center gap-1 text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{currentItem.hint}</span>
              </p>
              <p className="text-slate-600 mt-1 italic">
                💡 <span className="font-semibold">Did you know?</span> {currentItem.funFact}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alphabet Tray (A to Z grid) */}
      <div className="bg-white/95 rounded-3xl border-4 border-amber-300 shadow-md p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">
            Tap Any Letter to Learn (26 Letters)
          </span>
          <span className="text-xs font-bold text-slate-500">
            Selected: <span className="text-sky-600 font-black">{currentItem.letter}</span>
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-13 gap-2">
          {ALPHABET_DATA.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.letter}
                onClick={() => selectLetter(idx)}
                className={`h-12 rounded-2xl font-black text-lg sm:text-xl flex flex-col items-center justify-center transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-amber-950 border-amber-600 scale-110 shadow-md ring-3 ring-amber-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
                aria-label={`Learn Letter ${item.letter}`}
                aria-pressed={isSelected}
              >
                <span>{isLowercase ? item.lowercase : item.letter}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

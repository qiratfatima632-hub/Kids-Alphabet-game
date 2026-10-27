import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem } from '../types';
import { validateLetterMatch, calculateMatchScore, generateMatchingOptions } from '../game/rules';
import { playSuccessChime, playErrorBoing, speakWord, playPop } from '../utils/audio';

interface AlphabetMatchGameProps {
  soundEnabled: boolean;
  onAwardStars: (stars: number, coins: number) => void;
  onUpdateStreak: (streak: number) => void;
}

export const AlphabetMatchGame: React.FC<AlphabetMatchGameProps> = ({
  soundEnabled,
  onAwardStars,
  onUpdateStreak
}) => {
  const [roundNumber, setRoundNumber] = useState(1);
  const totalRounds = 8;
  const [targetIndex, setTargetIndex] = useState(0);
  const [options, setOptions] = useState<AlphabetItem[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [status, setStatus] = useState<'playing' | 'correct' | 'wrong'>('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const currentTarget = ALPHABET_DATA[targetIndex] || ALPHABET_DATA[0];

  // Set up round
  const setupRound = (idx: number) => {
    const target = ALPHABET_DATA[idx];
    const generated = generateMatchingOptions(target.letter, ALPHABET_DATA);
    setOptions(generated);
    setSelectedWord(null);
    setStatus('playing');
    setFeedbackMessage(`Which one starts with letter ${target.letter}?`);
    speakWord(`Which one starts with letter ${target.letter}?`);
  };

  useEffect(() => {
    setupRound(targetIndex);
  }, [targetIndex]);

  const handleSelectOption = (option: AlphabetItem) => {
    if (status === 'correct') return;

    setSelectedWord(option.word);
    const isCorrect = validateLetterMatch(currentTarget.letter, option.word, ALPHABET_DATA);

    if (isCorrect) {
      setStatus('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      onUpdateStreak(newStreak);

      const { newScore, starsEarned, bonusCoins } = calculateMatchScore(score, newStreak);
      setScore(newScore);
      onAwardStars(starsEarned, bonusCoins);

      setFeedbackMessage(`Hurray! ${currentTarget.letter} is for ${option.word}!`);
      playSuccessChime(soundEnabled);
      speakWord(`Super! ${currentTarget.letter} is for ${option.word}!`);

      // Confetti celebration
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }
    } else {
      setStatus('wrong');
      setStreak(0);
      playErrorBoing(soundEnabled);
      setFeedbackMessage(`Nice try! ${option.word} starts with ${option.letter}. Try finding the one starting with ${currentTarget.letter}!`);
      speakWord(`Try again! What starts with ${currentTarget.letter}?`);
    }
  };

  const handleNextRound = () => {
    playPop(soundEnabled);
    if (roundNumber >= totalRounds) {
      setIsGameOver(true);
      speakWord(`Congratulations! You scored ${score} points!`);
    } else {
      setRoundNumber(prev => prev + 1);
      // Pick next target letter
      const nextTargetIdx = Math.floor(Math.random() * ALPHABET_DATA.length);
      setTargetIndex(nextTargetIdx);
    }
  };

  const handleRestart = () => {
    playPop(soundEnabled);
    setRoundNumber(1);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
    const newIdx = Math.floor(Math.random() * ALPHABET_DATA.length);
    setTargetIndex(newIdx);
  };

  if (isGameOver) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center select-none" data-testid="alphabet-match-gameover">
        <div className="w-full bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 text-center shadow-lg flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-4xl animate-bounce">
            🏆
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            Superstar Matcher!
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg">
            You completed all matching rounds with great skill!
          </p>

          <div className="flex items-center justify-center gap-6 bg-amber-50 px-6 py-4 rounded-2xl border-2 border-amber-200">
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-amber-800">Total Score</span>
              <p className="text-3xl font-black text-amber-900">{score}</p>
            </div>
            <div className="w-px h-10 bg-amber-200" />
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-amber-800">Best Streak</span>
              <p className="text-3xl font-black text-amber-900">🔥 {streak}</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-lg flex items-center justify-center gap-2 border-2 border-amber-500 shadow-md cursor-pointer transition-transform"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 select-none" data-testid="alphabet-match-screen">
      {/* Game HUD */}
      <div className="flex items-center justify-between bg-white/90 p-4 rounded-3xl border-3 border-sky-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
            Round {roundNumber} of {totalRounds}
          </span>
          {streak > 1 && (
            <span className="text-xs sm:text-sm font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full border border-orange-300 animate-pulse">
              🔥 {streak} Streak!
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-black text-slate-800 text-sm sm:text-base">Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Target Letter Prompt Card */}
      <div className="bg-white/95 rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md flex flex-col items-center text-center gap-4 relative">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500">
          Match the Letter
        </span>

        {/* Big Letter Card */}
        <div
          className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl shadow-md border-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer relative"
          style={{
            backgroundColor: `${currentTarget.color}15`,
            borderColor: currentTarget.color
          }}
          onClick={() => {
            playPop(soundEnabled);
            speakWord(`Letter ${currentTarget.letter}. Find what starts with ${currentTarget.letter}!`);
          }}
          title="Click to hear letter prompt"
        >
          <span
            className="text-7xl sm:text-8xl font-black tracking-tight"
            style={{ color: currentTarget.color }}
          >
            {currentTarget.letter}
          </span>
          <span className="text-2xl font-bold text-slate-600 -mt-2">
            {currentTarget.lowercase}
          </span>

          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 shadow-xs">
            <Volume2 className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Spoken Instruction / Feedback */}
        <div
          className={`px-4 py-2.5 rounded-2xl border-2 text-sm sm:text-base font-bold flex items-center gap-2 max-w-lg transition-all ${
            status === 'correct'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : status === 'wrong'
              ? 'bg-rose-50 text-rose-900 border-rose-300'
              : 'bg-amber-50 text-amber-950 border-amber-200'
          }`}
        >
          {status === 'correct' ? (
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <Volume2 className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <span>{feedbackMessage}</span>
        </div>
      </div>

      {/* 3 Answer Choice Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map((opt) => {
          const isSelected = selectedWord === opt.word;
          const isTarget = opt.letter.toUpperCase() === currentTarget.letter.toUpperCase();
          const showSuccessState = isSelected && status === 'correct';
          const showErrorState = isSelected && status === 'wrong';

          return (
            <button
              key={opt.letter}
              onClick={() => handleSelectOption(opt)}
              disabled={status === 'correct'}
              className={`p-5 rounded-3xl border-4 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer shadow-sm active:scale-95 disabled:cursor-default ${
                showSuccessState
                  ? 'bg-emerald-100 border-emerald-500 scale-105 ring-4 ring-emerald-300'
                  : showErrorState
                  ? 'bg-rose-100 border-rose-400 shake'
                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-amber-300'
              }`}
              aria-label={`Option ${opt.word}`}
            >
              {/* Picture / Emoji */}
              <span className="text-6xl sm:text-7xl p-2 bg-slate-50 rounded-2xl shadow-inner">
                {opt.emoji}
              </span>

              {/* Word & Initial letter hint */}
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-black text-slate-800">
                  {opt.word}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Starts with letter <span className="font-black text-amber-600">{opt.letter}</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Round Button on Success */}
      {status === 'correct' && (
        <div className="flex justify-center pt-2">
          <button
            onClick={handleNextRound}
            className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-lg flex items-center gap-2 border-2 border-emerald-600 shadow-md cursor-pointer transition-transform animate-bounce"
            aria-label="Next Round"
          >
            <span>Next Round</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};

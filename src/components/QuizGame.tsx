import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { QuizQuestion } from '../types';
import { playSuccessChime, playErrorBoing, speakWord, playPop } from '../utils/audio';

interface QuizGameProps {
  soundEnabled: boolean;
  onAwardStars: (stars: number, coins: number) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ soundEnabled, onAwardStars }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Shuffle questions on start
  useEffect(() => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedChoiceIdx(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  }, []);

  const currentQ = questions[currentIndex];

  useEffect(() => {
    if (currentQ && !isAnswered) {
      speakWord(currentQ.spokenPrompt || currentQ.question);
    }
  }, [currentIndex, currentQ, isAnswered]);

  const handleSelectChoice = (idx: number) => {
    if (isAnswered || !currentQ) return;

    setSelectedChoiceIdx(idx);
    setIsAnswered(true);

    const isCorrect = currentQ.choices[idx].isCorrect;
    if (isCorrect) {
      setScore(prev => prev + 10);
      onAwardStars(1, 5);
      playSuccessChime(soundEnabled);
      speakWord(`That's right! ${currentQ.explanation}`);
    } else {
      playErrorBoing(soundEnabled);
      speakWord(`Good try! ${currentQ.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    playPop(soundEnabled);
    if (currentIndex + 1 >= questions.length) {
      setIsFinished(true);
      if (score >= 40) {
        try {
          confetti({
            particleCount: 70,
            spread: 90,
            origin: { y: 0.6 }
          });
        } catch {
          // confetti fallback
        }
      }
      speakWord(`Quiz complete! You earned ${score} points!`);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedChoiceIdx(null);
      setIsAnswered(false);
    }
  };

  const handleRestart = () => {
    playPop(soundEnabled);
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 8);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setSelectedChoiceIdx(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
  };

  if (!currentQ && !isFinished) {
    return null;
  }

  if (isFinished) {
    const perfectScore = score === questions.length * 10;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center select-none" data-testid="quiz-gameover">
        <div className="w-full bg-white rounded-3xl border-4 border-amber-400 p-6 sm:p-8 text-center shadow-lg flex flex-col items-center gap-5">
          <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center text-5xl animate-bounce">
            {perfectScore ? '👑' : '🏆'}
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            {perfectScore ? 'Flawless Champion!' : 'Awesome Quiz Job!'}
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg">
            You answered {score / 10} out of {questions.length} questions correctly!
          </p>

          <div className="flex items-center justify-center gap-6 bg-amber-50 px-8 py-4 rounded-2xl border-2 border-amber-200">
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-amber-800">Score</span>
              <p className="text-4xl font-black text-amber-900">{score}</p>
            </div>
            <div className="w-px h-10 bg-amber-200" />
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-amber-800">Stars Earned</span>
              <p className="text-4xl font-black text-amber-900">⭐ {score / 10}</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-lg flex items-center justify-center gap-2 border-2 border-amber-500 shadow-md cursor-pointer transition-transform"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Try Another Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 select-none" data-testid="quiz-screen">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between bg-white/90 p-4 rounded-3xl border-3 border-amber-200 shadow-xs">
        <span className="text-xs sm:text-sm font-extrabold text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
          Question {currentIndex + 1} of {questions.length}
        </span>

        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="font-black text-slate-800 text-sm sm:text-base">Score: {score}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/95 rounded-3xl border-4 border-amber-300 p-6 sm:p-8 shadow-md flex flex-col items-center text-center gap-4">
        <div className="w-full flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            {currentQ.category === 'alphabet' ? 'Alphabet Quiz' : 'Shapes Quiz'}
          </span>

          <button
            onClick={() => speakWord(currentQ.spokenPrompt || currentQ.question)}
            className="px-3 py-1.5 rounded-2xl bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            aria-label="Repeat Question Out Loud"
          >
            <Volume2 className="w-4 h-4 text-amber-700" />
            <span>Read to Me</span>
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 max-w-xl leading-snug">
          {currentQ.question}
        </h2>
      </div>

      {/* 3 Answer Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {currentQ.choices.map((choice, idx) => {
          const isSelected = selectedChoiceIdx === idx;
          const showCorrect = isAnswered && choice.isCorrect;
          const showWrong = isAnswered && isSelected && !choice.isCorrect;

          return (
            <button
              key={idx}
              onClick={() => handleSelectChoice(idx)}
              disabled={isAnswered}
              className={`p-5 rounded-3xl border-4 font-black text-lg sm:text-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 disabled:cursor-default ${
                showCorrect
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-950 ring-4 ring-emerald-300 scale-102'
                  : showWrong
                  ? 'bg-rose-100 border-rose-400 text-rose-950'
                  : 'bg-white hover:bg-amber-50/80 border-slate-200 hover:border-amber-300 text-slate-800'
              }`}
              aria-label={`Choice ${choice.text}`}
            >
              {choice.emoji && (
                <span className="text-5xl p-2 bg-slate-50 rounded-2xl shadow-inner">
                  {choice.emoji}
                </span>
              )}

              <span className="text-center">{choice.text}</span>

              {showCorrect && (
                <div className="flex items-center gap-1 text-emerald-700 text-xs font-black mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct!</span>
                </div>
              )}
              {showWrong && (
                <div className="flex items-center gap-1 text-rose-700 text-xs font-black mt-1">
                  <XCircle className="w-4 h-4" />
                  <span>Try next time!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Next Button */}
      {isAnswered && (
        <div className="bg-white/95 rounded-3xl border-3 border-amber-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2 text-slate-700 font-bold text-sm sm:text-base">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
            <span>{currentQ.explanation}</span>
          </div>

          <button
            onClick={handleNextQuestion}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-95 text-amber-950 font-black text-base flex items-center justify-center gap-2 border-2 border-amber-500 shadow-sm cursor-pointer transition-transform"
            aria-label="Next Question"
          >
            <span>{currentIndex + 1 >= questions.length ? 'See Results' : 'Next Question'}</span>
            <ArrowRight className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
};

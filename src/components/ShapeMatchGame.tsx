import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, Volume2, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SHAPES_DATA } from '../data/shapesData';
import { ShapeItem } from '../types';
import { validateShapeMatch, calculateMatchScore } from '../game/rules';
import { playSuccessChime, playErrorBoing, speakWord, playPop, playClick } from '../utils/audio';

interface ShapeMatchGameProps {
  soundEnabled: boolean;
  onAwardStars: (stars: number, coins: number) => void;
  onUpdateStreak: (streak: number) => void;
}

export const ShapeMatchGame: React.FC<ShapeMatchGameProps> = ({
  soundEnabled,
  onAwardStars,
  onUpdateStreak
}) => {
  const [roundNumber, setRoundNumber] = useState(1);
  const totalRounds = 6;
  const [targetShapes, setTargetShapes] = useState<ShapeItem[]>([]);
  const [poolShapes, setPoolShapes] = useState<ShapeItem[]>([]);
  const [matchedShapeIds, setMatchedShapeIds] = useState<string[]>([]);
  const [selectedShape, setSelectedShape] = useState<ShapeItem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize round with 3-4 target shapes
  const initRound = (round: number) => {
    const shapeCount = round <= 3 ? 3 : 4;
    // Shuffle and pick shapes
    const shuffled = [...SHAPES_DATA].sort(() => Math.random() - 0.5);
    const chosenTargets = shuffled.slice(0, shapeCount);
    
    // Pool has targets + 1 or 2 distractors, shuffled
    const pool = [...chosenTargets, ...shuffled.slice(shapeCount, shapeCount + 1)].sort(() => Math.random() - 0.5);

    setTargetShapes(chosenTargets);
    setPoolShapes(pool);
    setMatchedShapeIds([]);
    setSelectedShape(null);
    setIsRoundComplete(false);

    speakWord(`Drag or tap the shapes to fit their matching outlines!`);
  };

  useEffect(() => {
    initRound(roundNumber);
  }, [roundNumber]);

  // Handle Match verification (used by drag drop or click match)
  const processMatch = (targetId: string, droppedId: string) => {
    const isCorrect = validateShapeMatch(targetId, droppedId);

    if (isCorrect) {
      if (matchedShapeIds.includes(targetId)) return;

      const newMatched = [...matchedShapeIds, targetId];
      setMatchedShapeIds(newMatched);
      setSelectedShape(null);

      const newStreak = streak + 1;
      setStreak(newStreak);
      onUpdateStreak(newStreak);

      const { newScore, starsEarned, bonusCoins } = calculateMatchScore(score, newStreak);
      setScore(newScore);
      onAwardStars(starsEarned, bonusCoins);

      const matchedShapeObj = SHAPES_DATA.find(s => s.id === targetId);
      playSuccessChime(soundEnabled);
      speakWord(`Matched ${matchedShapeObj ? matchedShapeObj.name : 'shape'}! Great job!`);

      // Check if all targets are matched
      if (newMatched.length === targetShapes.length) {
        setIsRoundComplete(true);
        try {
          confetti({
            particleCount: 60,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch {
          // confetti fallback
        }
      }
    } else {
      setStreak(0);
      playErrorBoing(soundEnabled);
      speakWord('Not a match! Look closely at the outline shape!');
    }
  };

  // HTML5 Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, shape: ShapeItem) => {
    e.dataTransfer.setData('text/plain', shape.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetShape: ShapeItem) => {
    e.preventDefault();
    const droppedShapeId = e.dataTransfer.getData('text/plain');
    processMatch(targetShape.id, droppedShapeId);
  };

  // Click / Tap-to-match for mobile / touch
  const handleSelectPoolShape = (shape: ShapeItem) => {
    playPop(soundEnabled);
    if (selectedShape?.id === shape.id) {
      setSelectedShape(null);
    } else {
      setSelectedShape(shape);
      speakWord(`Selected ${shape.name}. Now tap its outline slot!`);
    }
  };

  const handleTargetSlotClick = (targetShape: ShapeItem) => {
    if (matchedShapeIds.includes(targetShape.id)) return;
    if (selectedShape) {
      processMatch(targetShape.id, selectedShape.id);
    } else {
      playClick(soundEnabled);
      speakWord(`This outline is a ${targetShape.name}. Find and tap the matching ${targetShape.name}!`);
    }
  };

  const handleNextRound = () => {
    playPop(soundEnabled);
    if (roundNumber >= totalRounds) {
      setIsGameOver(true);
      speakWord(`Incredible! You completed all shape matching challenges!`);
    } else {
      setRoundNumber(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    playPop(soundEnabled);
    setRoundNumber(1);
    setScore(0);
    setStreak(0);
    setIsGameOver(false);
  };

  if (isGameOver) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col items-center select-none" data-testid="shape-match-gameover">
        <div className="w-full bg-white rounded-3xl border-4 border-purple-400 p-6 sm:p-8 text-center shadow-lg flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-purple-100 border-4 border-purple-400 flex items-center justify-center text-4xl animate-bounce">
            🧩
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
            Shape Master Extraordinaire!
          </h2>
          <p className="text-slate-600 font-bold text-base sm:text-lg">
            You matched all the shapes into their proper slots!
          </p>

          <div className="flex items-center justify-center gap-6 bg-purple-50 px-6 py-4 rounded-2xl border-2 border-purple-200">
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-purple-800">Final Score</span>
              <p className="text-3xl font-black text-purple-900">{score}</p>
            </div>
            <div className="w-px h-10 bg-purple-200" />
            <div className="text-center">
              <span className="text-xs uppercase font-extrabold text-purple-800">Completed</span>
              <p className="text-3xl font-black text-purple-900">100%</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black text-lg flex items-center justify-center gap-2 border-2 border-purple-700 shadow-md cursor-pointer transition-transform"
          >
            <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            <span>Play Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 select-none" data-testid="shape-match-screen">
      {/* Game HUD */}
      <div className="flex items-center justify-between bg-white/90 p-4 rounded-3xl border-3 border-purple-200 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
            Round {roundNumber} of {totalRounds}
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-600 hidden sm:inline">
            Drag or tap to slot shapes!
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Trophy className="w-4 h-4 text-purple-500" />
            <span className="font-black text-slate-800 text-sm sm:text-base">Score: {score}</span>
          </div>
        </div>
      </div>

      {/* Target Outlines Area */}
      <div className="bg-white/95 rounded-3xl border-4 border-purple-300 p-6 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>Target Outlines (Drop or Tap Here)</span>
          </span>
          <span className="text-xs font-bold text-slate-500">
            {matchedShapeIds.length} of {targetShapes.length} Matched
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {targetShapes.map(target => {
            const isMatched = matchedShapeIds.includes(target.id);

            return (
              <div
                key={target.id}
                onDragOver={handleDragOver}
                onDrop={e => handleDrop(e, target)}
                onClick={() => handleTargetSlotClick(target)}
                className={`min-h-[160px] rounded-3xl border-4 flex flex-col items-center justify-center p-4 text-center transition-all cursor-pointer relative ${
                  isMatched
                    ? 'border-emerald-400 bg-emerald-50/80 shadow-md'
                    : selectedShape
                    ? 'border-dashed border-purple-400 bg-purple-50/40 hover:bg-purple-100/60 ring-2 ring-purple-300'
                    : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100'
                }`}
                aria-label={`Target outline for ${target.name}`}
              >
                {isMatched ? (
                  <>
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <span className="text-6xl animate-bounce">{target.examples[0]?.emoji || '🌟'}</span>
                    <span className="text-lg font-black text-slate-800 mt-2">{target.name}</span>
                    <span className="text-xs font-bold text-emerald-600">Matched!</span>
                  </>
                ) : (
                  <>
                    <div
                      className="w-16 h-16 rounded-2xl border-3 border-dashed border-slate-400 flex items-center justify-center text-slate-300 font-black text-2xl"
                      style={{ opacity: 0.6 }}
                    >
                      ?
                    </div>
                    <span className="text-sm font-black text-slate-600 mt-3">{target.name}</span>
                    <span className="text-xs font-bold text-slate-400">
                      {target.type === '3d' ? '3D Solid' : '2D Flat'}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Shapes Pool */}
      <div className="bg-white/95 rounded-3xl border-4 border-sky-300 p-5 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-sky-900">
            Shapes to Match (Drag or Tap to Select)
          </span>
          {selectedShape && (
            <span className="text-xs font-black text-sky-600 animate-pulse bg-sky-100 px-2.5 py-0.5 rounded-full border border-sky-300">
              Selected: {selectedShape.name} — now tap its outline!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {poolShapes.map(shape => {
            const isAlreadyMatched = matchedShapeIds.includes(shape.id);
            const isSelected = selectedShape?.id === shape.id;

            return (
              <div
                key={shape.id}
                draggable={!isAlreadyMatched}
                onDragStart={e => handleDragStart(e, shape)}
                onClick={() => !isAlreadyMatched && handleSelectPoolShape(shape)}
                className={`p-4 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 text-center transition-all ${
                  isAlreadyMatched
                    ? 'opacity-30 pointer-events-none border-slate-200 bg-slate-100'
                    : isSelected
                    ? 'border-purple-600 bg-purple-100 scale-105 shadow-md ring-4 ring-purple-300 cursor-pointer'
                    : 'bg-white hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-xs cursor-grab active:cursor-grabbing hover:scale-102'
                }`}
                aria-label={`Shape ${shape.name}`}
              >
                <span className="text-4xl sm:text-5xl">{shape.examples[0]?.emoji || '🔷'}</span>
                <span className="text-sm font-black text-slate-800">{shape.name}</span>
                <span
                  className="px-2 py-0.5 rounded-full text-white text-[10px] font-black"
                  style={{ backgroundColor: shape.color }}
                >
                  {shape.type.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Round Finished Button */}
      {isRoundComplete && (
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

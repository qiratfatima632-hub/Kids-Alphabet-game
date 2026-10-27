import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Sparkles } from 'lucide-react';
import { SHAPES_DATA } from '../data/shapesData';
import { ShapeItem } from '../types';
import { ThreeShapeViewer } from './ThreeShapeViewer';
import { speakWord, playPop, playClick } from '../utils/audio';

interface ShapesLearnViewProps {
  soundEnabled: boolean;
  onRecordExploredShape: (shapeId: string) => void;
  initialShapeId?: string;
}

export const ShapesLearnView: React.FC<ShapesLearnViewProps> = ({
  soundEnabled,
  onRecordExploredShape,
  initialShapeId = 'sphere'
}) => {
  const [filterType, setFilterType] = useState<'all' | '2d' | '3d'>('all');
  
  const filteredShapes = SHAPES_DATA.filter(s => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  });

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = SHAPES_DATA.findIndex(s => s.id === initialShapeId);
    return idx >= 0 ? idx : 0;
  });

  const currentShape = SHAPES_DATA[currentIndex] || SHAPES_DATA[0];

  useEffect(() => {
    if (currentShape) {
      onRecordExploredShape(currentShape.id);
      speakWord(`${currentShape.name}. It is a ${currentShape.type === '3d' ? 'three dimensional solid shape' : 'two dimensional flat shape'}.`);
    }
  }, [currentIndex, currentShape, onRecordExploredShape]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToPrevious = () => {
    playClick(soundEnabled);
    setCurrentIndex(prev => (prev === 0 ? SHAPES_DATA.length - 1 : prev - 1));
  };

  const goToNext = () => {
    playClick(soundEnabled);
    setCurrentIndex(prev => (prev === SHAPES_DATA.length - 1 ? 0 : prev + 1));
  };

  const selectShape = (shape: ShapeItem) => {
    playPop(soundEnabled);
    const idx = SHAPES_DATA.findIndex(s => s.id === shape.id);
    if (idx >= 0) setCurrentIndex(idx);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6 flex flex-col gap-5 select-none" data-testid="shapes-learn-screen">
      {/* Top Banner & Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 p-4 rounded-3xl border-3 border-purple-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>🔷</span> Learn 2D &amp; 3D Shapes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-bold">
            Rotate shapes in 3D, inspect angles, and discover real-world examples!
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-300">
          <button
            onClick={() => {
              playClick(soundEnabled);
              setFilterType('all');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-purple-600 text-white shadow-xs scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Show All Shapes"
          >
            All (16)
          </button>
          <button
            onClick={() => {
              playClick(soundEnabled);
              setFilterType('2d');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              filterType === '2d' ? 'bg-purple-600 text-white shadow-xs scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Show 2D Shapes"
          >
            2D Flat (10)
          </button>
          <button
            onClick={() => {
              playClick(soundEnabled);
              setFilterType('3d');
            }}
            className={`px-3 py-1.5 rounded-xl font-black text-sm transition-all cursor-pointer ${
              filterType === '3d' ? 'bg-purple-600 text-white shadow-xs scale-105' : 'text-slate-600 hover:text-slate-900'
            }`}
            aria-label="Show 3D Shapes"
          >
            3D Solids (6)
          </button>
        </div>
      </div>

      {/* Main 3D Shape Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 3D Shape Interactive Model */}
        <div className="lg:col-span-7 bg-white/95 rounded-3xl border-4 border-purple-300 shadow-md p-4 sm:p-6 flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden">
          {/* Badge & Voice button */}
          <div className="w-full flex items-center justify-between z-10">
            <span
              className="px-3.5 py-1 rounded-full text-white font-black text-sm shadow-xs"
              style={{ backgroundColor: currentShape.color }}
            >
              {currentShape.type === '3d' ? '3D Solid Shape' : '2D Flat Shape'}
            </span>

            <button
              onClick={() => {
                playClick(soundEnabled);
                speakWord(`${currentShape.name}. ${currentShape.description}`);
              }}
              className="px-3 py-1.5 rounded-2xl bg-purple-100 hover:bg-purple-200 border-2 border-purple-300 text-purple-800 font-black text-sm flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-transform"
              aria-label={`Pronounce shape name ${currentShape.name}`}
            >
              <Volume2 className="w-4 h-4 text-purple-600" />
              <span>Say Name</span>
            </button>
          </div>

          {/* 3D Canvas */}
          <div className="w-full my-2 flex items-center justify-center">
            <ThreeShapeViewer shape={currentShape} soundEnabled={soundEnabled} />
          </div>

          {/* Previous / Next buttons */}
          <div className="w-full flex items-center justify-between gap-3 pt-2 border-t-2 border-slate-100 z-10">
            <button
              onClick={goToPrevious}
              className="flex-1 py-3 px-4 rounded-2xl bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black text-base flex items-center justify-center gap-2 border-2 border-purple-700 shadow-xs cursor-pointer transition-transform"
              aria-label="Previous Shape"
            >
              <ChevronLeft className="w-6 h-6 stroke-[3]" />
              <span>Previous</span>
            </button>

            <button
              onClick={goToNext}
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white font-black text-base flex items-center justify-center gap-2 border-2 border-sky-700 shadow-xs cursor-pointer transition-transform"
              aria-label="Next Shape"
            >
              <span>Next</span>
              <ChevronRight className="w-6 h-6 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Right: Shape Details & Real-World Examples */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white/95 rounded-3xl border-4 border-sky-300 shadow-md p-5 sm:p-6 flex flex-col gap-4">
            {/* Shape Name */}
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                  {currentShape.type.toUpperCase()} Shape
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-1">
                  {currentShape.name}
                </h2>
              </div>
              <div
                className="w-12 h-12 rounded-2xl shadow-inner flex items-center justify-center text-white font-black text-lg border-2 border-white/50"
                style={{ backgroundColor: currentShape.color }}
              >
                {currentShape.type === '3d' ? '3D' : '2D'}
              </div>
            </div>

            {/* Shape Properties Badges */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  {currentShape.type === '3d' ? 'Edges / Sides' : 'Sides'}
                </p>
                <p className="text-xl font-black text-slate-800">{currentShape.sides}</p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase">
                  {currentShape.type === '3d' ? 'Flat Faces' : 'Corners'}
                </p>
                <p className="text-xl font-black text-slate-800">
                  {currentShape.type === '3d' ? (currentShape.faces ?? 'Curved') : currentShape.sides}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-semibold text-slate-700 bg-purple-50/60 p-3.5 rounded-2xl border border-purple-200">
              {currentShape.description}
            </p>

            {/* Real World Examples (Interactive Tap to Speak) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Real-World Examples (Tap to Listen)</span>
              </span>

              <div className="flex flex-col gap-2">
                {currentShape.examples.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      playClick(soundEnabled);
                      speakWord(`${ex.name}. ${ex.description}`);
                    }}
                    className="p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-200 text-left flex items-center gap-3 transition-all cursor-pointer active:scale-98 shadow-xs"
                    aria-label={`Example: ${ex.name}`}
                  >
                    <span className="text-3xl shrink-0 p-1.5 bg-white rounded-xl shadow-xs">{ex.emoji}</span>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900">{ex.name}</p>
                      <p className="text-xs font-medium text-slate-600 line-clamp-1">{ex.description}</p>
                    </div>
                    <Volume2 className="w-4 h-4 text-amber-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shapes Tray */}
      <div className="bg-white/95 rounded-3xl border-4 border-purple-300 shadow-md p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-slate-700 uppercase tracking-wide">
            Select a Shape to Explore ({filteredShapes.length} Shapes)
          </span>
          <span className="text-xs font-bold text-slate-500">
            Selected: <span className="text-purple-600 font-black">{currentShape.name}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {filteredShapes.map(shape => {
            const isSelected = shape.id === currentShape.id;
            return (
              <button
                key={shape.id}
                onClick={() => selectShape(shape)}
                className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'text-white border-slate-800 scale-105 shadow-md ring-3 ring-purple-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: isSelected ? shape.color : undefined
                }}
                aria-label={`Select Shape ${shape.name}`}
                aria-pressed={isSelected}
              >
                <span className="text-lg">{shape.examples[0]?.emoji || '🔷'}</span>
                <span className="truncate max-w-[80px]">{shape.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

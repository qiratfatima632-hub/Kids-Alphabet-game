/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { PlayerProgress } from './types';
import { checkBadgeUnlocks } from './game/rules';
import { HeaderNav } from './components/HeaderNav';
import { MainMenu } from './components/MainMenu';
import { AlphabetLearnView } from './components/AlphabetLearnView';
import { ShapesLearnView } from './components/ShapesLearnView';
import { AlphabetMatchGame } from './components/AlphabetMatchGame';
import { ShapeMatchGame } from './components/ShapeMatchGame';
import { QuizGame } from './components/QuizGame';
import { AdventureLevelsView } from './components/AdventureLevelsView';
import { SettingsModal } from './components/SettingsModal';
import { toggleBgm } from './utils/audio';

const STORAGE_KEY = 'alphashapes_3d_player_progress_v1';

const DEFAULT_PROGRESS: PlayerProgress = {
  stars: 0,
  coins: 0,
  unlockedLevel: 1,
  completedLevels: [],
  highestStreak: 0,
  lettersLearned: [],
  shapesExplored: [],
  badges: [],
  activeTheme: 'sunny',
  soundEnabled: true,
  musicEnabled: false,
  speechRate: 0.9
};

export default function App() {
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {
      // localStorage catch
    }
    return DEFAULT_PROGRESS;
  });

  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('autostart') === 'true') {
        return 'levels';
      }
    }
    return 'menu';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [initialAlphabetLetter, setInitialAlphabetLetter] = useState('A');
  const [initialShapeId, setInitialShapeId] = useState('sphere');

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // ignore
    }
  }, [progress]);

  // Handle BGM state change
  useEffect(() => {
    toggleBgm(progress.musicEnabled);
    return () => {
      toggleBgm(false);
    };
  }, [progress.musicEnabled]);

  // Evaluate badge unlocks
  const evaluateBadges = useCallback((updatedProgress: PlayerProgress) => {
    const newBadges = checkBadgeUnlocks({
      stars: updatedProgress.stars,
      lettersLearnedCount: updatedProgress.lettersLearned.length,
      shapesExploredCount: updatedProgress.shapesExplored.length,
      highestStreak: updatedProgress.highestStreak,
      completedLevelsCount: updatedProgress.completedLevels.length
    });

    const uniqueBadges = Array.from(new Set([...updatedProgress.badges, ...newBadges]));
    if (uniqueBadges.length !== updatedProgress.badges.length) {
      return { ...updatedProgress, badges: uniqueBadges };
    }
    return updatedProgress;
  }, []);

  // Update progress helper
  const handleUpdateProgress = useCallback((updates: Partial<PlayerProgress>) => {
    setProgress(prev => {
      const merged = { ...prev, ...updates };
      return evaluateBadges(merged);
    });
  }, [evaluateBadges]);

  const handleAwardStars = useCallback((stars: number, coins: number) => {
    setProgress(prev => {
      const updated = {
        ...prev,
        stars: prev.stars + stars,
        coins: prev.coins + coins
      };
      return evaluateBadges(updated);
    });
  }, [evaluateBadges]);

  const handleUpdateStreak = useCallback((streak: number) => {
    setProgress(prev => {
      if (streak > prev.highestStreak) {
        const updated = { ...prev, highestStreak: streak };
        return evaluateBadges(updated);
      }
      return prev;
    });
  }, [evaluateBadges]);

  const handleRecordLearnedLetter = useCallback((letter: string) => {
    setProgress(prev => {
      if (!prev.lettersLearned.includes(letter)) {
        const updated = {
          ...prev,
          lettersLearned: [...prev.lettersLearned, letter]
        };
        return evaluateBadges(updated);
      }
      return prev;
    });
  }, [evaluateBadges]);

  const handleRecordExploredShape = useCallback((shapeId: string) => {
    setProgress(prev => {
      if (!prev.shapesExplored.includes(shapeId)) {
        const updated = {
          ...prev,
          shapesExplored: [...prev.shapesExplored, shapeId]
        };
        return evaluateBadges(updated);
      }
      return prev;
    });
  }, [evaluateBadges]);

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // Adventure level task launcher
  const handleSelectLevelTask = (
    _levelNum: number,
    taskType: 'learn_abc' | 'learn_shapes' | 'match_abc' | 'match_shapes' | 'quiz',
    initialParam?: string
  ) => {
    if (taskType === 'learn_abc' && initialParam) {
      setInitialAlphabetLetter(initialParam);
    }
    if (taskType === 'learn_shapes' && initialParam) {
      setInitialShapeId(initialParam);
    }
    setCurrentView(taskType);
  };

  // Theme styling classes
  const getThemeBackgroundClass = () => {
    switch (progress.activeTheme) {
      case 'candy':
        return 'bg-gradient-to-b from-pink-100 via-rose-50 to-amber-100';
      case 'cosmic':
        return 'bg-gradient-to-b from-indigo-950 via-slate-900 to-purple-950 text-white';
      case 'ocean':
        return 'bg-gradient-to-b from-cyan-100 via-sky-50 to-teal-100';
      case 'sunny':
      default:
        return 'bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100';
    }
  };

  // View title helper
  const getViewTitle = () => {
    switch (currentView) {
      case 'learn_abc':
        return '🔤 Alphabets';
      case 'learn_shapes':
        return '🔷 Shapes';
      case 'match_abc':
        return '🎯 Alphabet Match';
      case 'match_shapes':
        return '🧩 Shape Match';
      case 'quiz':
        return '❓ Quiz';
      case 'levels':
        return '🗺️ Adventure';
      default:
        return '';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${getThemeBackgroundClass()}`}
      data-testid="app-container"
      data-current-view={currentView}
    >
      {/* Top Header */}
      <HeaderNav
        currentView={currentView}
        onNavigate={setCurrentView}
        progress={progress}
        onToggleSound={() => handleUpdateProgress({ soundEnabled: !progress.soundEnabled })}
        onToggleMusic={() => handleUpdateProgress({ musicEnabled: !progress.musicEnabled })}
        onOpenSettings={() => setIsSettingsOpen(true)}
        title={getViewTitle()}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-start pt-3 sm:pt-5 pb-8">
        {currentView === 'menu' && (
          <MainMenu
            onSelectMode={setCurrentView}
            onOpenSettings={() => setIsSettingsOpen(true)}
            progress={progress}
          />
        )}

        {currentView === 'levels' && (
          <AdventureLevelsView
            progress={progress}
            soundEnabled={progress.soundEnabled}
            onSelectLevelTask={handleSelectLevelTask}
          />
        )}

        {currentView === 'learn_abc' && (
          <AlphabetLearnView
            soundEnabled={progress.soundEnabled}
            onRecordLearnedLetter={handleRecordLearnedLetter}
            initialLetter={initialAlphabetLetter}
          />
        )}

        {currentView === 'learn_shapes' && (
          <ShapesLearnView
            soundEnabled={progress.soundEnabled}
            onRecordExploredShape={handleRecordExploredShape}
            initialShapeId={initialShapeId}
          />
        )}

        {currentView === 'match_abc' && (
          <AlphabetMatchGame
            soundEnabled={progress.soundEnabled}
            onAwardStars={handleAwardStars}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {currentView === 'match_shapes' && (
          <ShapeMatchGame
            soundEnabled={progress.soundEnabled}
            onAwardStars={handleAwardStars}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {currentView === 'quiz' && (
          <QuizGame
            soundEnabled={progress.soundEnabled}
            onAwardStars={handleAwardStars}
          />
        )}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        progress={progress}
        onUpdateProgress={handleUpdateProgress}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}

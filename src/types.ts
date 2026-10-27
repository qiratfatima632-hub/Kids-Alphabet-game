export type ShapeType = '2d' | '3d';

export interface AlphabetItem {
  letter: string;
  lowercase: string;
  word: string;
  phonetic: string;
  color: string;
  emoji: string;
  secondaryEmoji: string;
  hint: string;
  funFact: string;
}

export interface ShapeItem {
  id: string;
  name: string;
  type: ShapeType;
  sides: number;
  faces?: number;
  color: string;
  description: string;
  examples: { name: string; emoji: string; description: string }[];
  geometryType: 'circle' | 'square' | 'triangle' | 'rectangle' | 'oval' | 'diamond' | 'star' | 'heart' | 'pentagon' | 'hexagon' | 'sphere' | 'cube' | 'cone' | 'cylinder' | 'pyramid' | 'cuboid';
}

export interface QuizQuestion {
  id: number;
  question: string;
  spokenPrompt?: string;
  category: 'alphabet' | 'shape';
  choices: { text: string; emoji?: string; isCorrect: boolean }[];
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface LevelConfig {
  level: number;
  title: string;
  subtitle: string;
  requiredStars: number;
  alphabetRange: [string, string];
  shapesIncluded: string[];
  theme: string;
  color: string;
}

export interface PlayerProgress {
  stars: number;
  coins: number;
  unlockedLevel: number;
  completedLevels: number[];
  highestStreak: number;
  lettersLearned: string[];
  shapesExplored: string[];
  badges: string[];
  activeTheme: 'sunny' | 'candy' | 'cosmic' | 'ocean';
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechRate: number;
}

import { AlphabetItem, ShapeItem } from '../types';
import { LEVELS_CONFIG } from '../data/levelsData';

/**
 * Validates whether the chosen word matches the prompt letter
 */
export function validateLetterMatch(promptLetter: string, selectedWord: string, alphabetList: AlphabetItem[]): boolean {
  const target = alphabetList.find(a => a.letter.toUpperCase() === promptLetter.toUpperCase());
  if (!target) return false;
  return target.word.toLowerCase() === selectedWord.toLowerCase();
}

/**
 * Validates whether a dropped shape matches the target slot
 */
export function validateShapeMatch(targetShapeId: string, droppedShapeId: string): boolean {
  if (!targetShapeId || !droppedShapeId) return false;
  return targetShapeId.trim().toLowerCase() === droppedShapeId.trim().toLowerCase();
}

/**
 * Calculates score and bonus stars based on streak
 */
export function calculateMatchScore(currentScore: number, streak: number): { newScore: number; starsEarned: number; bonusCoins: number } {
  const basePoints = 10;
  const streakBonus = Math.min(streak * 2, 10);
  const points = basePoints + streakBonus;
  
  // Award 1 star per correct answer, plus bonus star every 3 streak
  const starsEarned = (streak > 0 && streak % 3 === 0) ? 2 : 1;
  const bonusCoins = 5 + Math.floor(streak / 2);

  return {
    newScore: currentScore + points,
    starsEarned,
    bonusCoins
  };
}

/**
 * Evaluates player unlocked level from star count
 */
export function evaluateLevelProgress(totalStars: number): { unlockedLevel: number; nextLevelStars: number; progressPercent: number } {
  let highestUnlocked = 1;
  
  for (let i = 0; i < LEVELS_CONFIG.length; i++) {
    const lvl = LEVELS_CONFIG[i];
    if (totalStars >= lvl.requiredStars) {
      highestUnlocked = lvl.level;
    }
  }

  const nextLvlConfig = LEVELS_CONFIG.find(l => l.level === highestUnlocked + 1);
  const currentLvlConfig = LEVELS_CONFIG.find(l => l.level === highestUnlocked) || LEVELS_CONFIG[0];
  
  if (!nextLvlConfig) {
    return {
      unlockedLevel: 5,
      nextLevelStars: LEVELS_CONFIG[LEVELS_CONFIG.length - 1].requiredStars,
      progressPercent: 100
    };
  }

  const span = nextLvlConfig.requiredStars - currentLvlConfig.requiredStars;
  const currentProgress = totalStars - currentLvlConfig.requiredStars;
  const progressPercent = Math.min(100, Math.max(0, Math.round((currentProgress / span) * 100)));

  return {
    unlockedLevel: highestUnlocked,
    nextLevelStars: nextLvlConfig.requiredStars,
    progressPercent
  };
}

/**
 * Filters letters within an alphabetical range [from, to] inclusive
 */
export function filterLettersByRange(fromLetter: string, toLetter: string, allLetters: AlphabetItem[]): AlphabetItem[] {
  const fromCode = fromLetter.toUpperCase().charCodeAt(0);
  const toCode = toLetter.toUpperCase().charCodeAt(0);
  return allLetters.filter(item => {
    const code = item.letter.toUpperCase().charCodeAt(0);
    return code >= fromCode && code <= toCode;
  });
}

/**
 * Checks which badges should be unlocked
 */
export function checkBadgeUnlocks(stats: {
  stars: number;
  lettersLearnedCount: number;
  shapesExploredCount: number;
  highestStreak: number;
  completedLevelsCount: number;
}): string[] {
  const unlockedBadges: string[] = [];

  if (stats.lettersLearnedCount >= 10) {
    unlockedBadges.push('badge_abc');
  }
  if (stats.shapesExploredCount >= 16) {
    unlockedBadges.push('badge_shapes');
  }
  if (stats.highestStreak >= 5) {
    unlockedBadges.push('badge_match');
  }
  if (stats.stars >= 15) {
    unlockedBadges.push('badge_quiz');
  }
  if (stats.completedLevelsCount >= 5) {
    unlockedBadges.push('badge_champion');
  }

  return unlockedBadges;
}

/**
 * Generates options for alphabet matching (1 correct, 2 distractors, randomly ordered)
 */
export function generateMatchingOptions(targetLetter: string, allLetters: AlphabetItem[]): AlphabetItem[] {
  const target = allLetters.find(a => a.letter.toUpperCase() === targetLetter.toUpperCase()) || allLetters[0];
  const others = allLetters.filter(a => a.letter.toUpperCase() !== target.letter.toUpperCase());
  
  // Pick 2 random distractors
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  const distractors = shuffledOthers.slice(0, 2);

  const combined = [target, ...distractors];
  return combined.sort(() => Math.random() - 0.5);
}

/**
 * Generates options for shape matching
 */
export function generateShapeMatchingRound(allShapes: ShapeItem[], targetShapeId?: string): { target: ShapeItem; choices: ShapeItem[] } {
  let target: ShapeItem;
  if (targetShapeId) {
    target = allShapes.find(s => s.id === targetShapeId) || allShapes[0];
  } else {
    target = allShapes[Math.floor(Math.random() * allShapes.length)];
  }

  const others = allShapes.filter(s => s.id !== target.id);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
  const distractors = shuffledOthers.slice(0, 2);

  const choices = [target, ...distractors].sort(() => Math.random() - 0.5);
  return { target, choices };
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLetterMatch,
  validateShapeMatch,
  calculateMatchScore,
  evaluateLevelProgress,
  filterLettersByRange,
  checkBadgeUnlocks,
  generateMatchingOptions
} from './rules';
import { ALPHABET_DATA } from '../data/alphabetData';

test('validateLetterMatch checks correct word match', () => {
  assert.equal(validateLetterMatch('A', 'Apple', ALPHABET_DATA), true);
  assert.equal(validateLetterMatch('a', 'apple', ALPHABET_DATA), true);
  assert.equal(validateLetterMatch('B', 'Apple', ALPHABET_DATA), false);
  assert.equal(validateLetterMatch('Z', 'Zebra', ALPHABET_DATA), true);
});

test('validateShapeMatch checks matching shape IDs', () => {
  assert.equal(validateShapeMatch('circle', 'circle'), true);
  assert.equal(validateShapeMatch('sphere', 'cube'), false);
  assert.equal(validateShapeMatch('PYRAMID', 'pyramid'), true);
});

test('calculateMatchScore awards streak bonus and stars', () => {
  const result1 = calculateMatchScore(0, 1);
  assert.equal(result1.newScore, 12); // 10 base + 2 streak
  assert.equal(result1.starsEarned, 1);

  const resultStreak3 = calculateMatchScore(50, 3);
  assert.equal(resultStreak3.newScore, 66); // 50 + 10 + 6
  assert.equal(resultStreak3.starsEarned, 2); // bonus star for 3 streak
});

test('evaluateLevelProgress calculates unlock progression based on stars', () => {
  const progress0 = evaluateLevelProgress(0);
  assert.equal(progress0.unlockedLevel, 1);

  const progress4 = evaluateLevelProgress(4);
  assert.equal(progress4.unlockedLevel, 2);

  const progress25 = evaluateLevelProgress(25);
  assert.equal(progress25.unlockedLevel, 5);
  assert.equal(progress25.progressPercent, 100);
});

test('filterLettersByRange filters A to F', () => {
  const filtered = filterLettersByRange('A', 'F', ALPHABET_DATA);
  assert.equal(filtered.length, 6);
  assert.equal(filtered[0].letter, 'A');
  assert.equal(filtered[filtered.length - 1].letter, 'F');
});

test('checkBadgeUnlocks evaluates milestones', () => {
  const stats = {
    stars: 20,
    lettersLearnedCount: 12,
    shapesExploredCount: 16,
    highestStreak: 6,
    completedLevelsCount: 5
  };
  const badges = checkBadgeUnlocks(stats);
  assert.ok(badges.includes('badge_abc'));
  assert.ok(badges.includes('badge_shapes'));
  assert.ok(badges.includes('badge_match'));
  assert.ok(badges.includes('badge_quiz'));
  assert.ok(badges.includes('badge_champion'));
});

test('generateMatchingOptions provides 3 options including target', () => {
  const options = generateMatchingOptions('C', ALPHABET_DATA);
  assert.equal(options.length, 3);
  const hasTarget = options.some(o => o.letter === 'C');
  assert.equal(hasTarget, true);
});

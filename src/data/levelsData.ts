import { LevelConfig, Badge } from '../types';

export const LEVELS_CONFIG: LevelConfig[] = [
  {
    level: 1,
    title: 'Level 1: Sunny Meadow',
    subtitle: 'Learn Letters A–F & Basic Shapes',
    requiredStars: 0,
    alphabetRange: ['A', 'F'],
    shapesIncluded: ['circle', 'square', 'triangle', 'sphere', 'cube'],
    theme: 'sunny',
    color: '#10B981'
  },
  {
    level: 2,
    title: 'Level 2: Candy Forest',
    subtitle: 'Learn Letters G–M & Cones and Rectangles',
    requiredStars: 4,
    alphabetRange: ['G', 'M'],
    shapesIncluded: ['rectangle', 'oval', 'diamond', 'cone', 'cylinder'],
    theme: 'candy',
    color: '#EC4899'
  },
  {
    level: 3,
    title: 'Level 3: Cosmic Sky',
    subtitle: 'Learn Letters N–S & Stars, Hearts, Pyramids',
    requiredStars: 9,
    alphabetRange: ['N', 'S'],
    shapesIncluded: ['star', 'heart', 'pentagon', 'pyramid', 'cuboid'],
    theme: 'cosmic',
    color: '#8B5CF6'
  },
  {
    level: 4,
    title: 'Level 4: Ocean Wonderland',
    subtitle: 'Learn Letters T–Z & Hexagons & Mixed Challenges',
    requiredStars: 15,
    alphabetRange: ['T', 'Z'],
    shapesIncluded: ['hexagon', 'circle', 'sphere', 'cube', 'cone'],
    theme: 'ocean',
    color: '#06B6D4'
  },
  {
    level: 5,
    title: 'Level 5: Grand Championship',
    subtitle: 'Alphabet & Shapes Master Challenge',
    requiredStars: 22,
    alphabetRange: ['A', 'Z'],
    shapesIncluded: ['circle', 'square', 'triangle', 'sphere', 'cube', 'cone', 'cylinder', 'pyramid', 'cuboid'],
    theme: 'sunny',
    color: '#F59E0B'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_abc',
    title: 'Alphabet Explorer',
    description: 'Explored 10 or more letters in the alphabet!',
    icon: '🔤',
    unlocked: false
  },
  {
    id: 'badge_shapes',
    title: 'Shape Master',
    description: 'Explored all 16 2D and 3D shapes!',
    icon: '🔷',
    unlocked: false
  },
  {
    id: 'badge_match',
    title: 'Super Matcher',
    description: 'Got a streak of 5 correct matches!',
    icon: '🎯',
    unlocked: false
  },
  {
    id: 'badge_quiz',
    title: 'Quiz Whiz',
    description: 'Completed a quiz with top marks!',
    icon: '🏆',
    unlocked: false
  },
  {
    id: 'badge_champion',
    title: 'Grand Champion',
    description: 'Unlocked all 5 educational adventure levels!',
    icon: '👑',
    unlocked: false
  }
];

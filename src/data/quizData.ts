import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which letter does Apple start with?',
    spokenPrompt: 'Which letter does Apple start with?',
    category: 'alphabet',
    choices: [
      { text: 'A', emoji: '🍎', isCorrect: true },
      { text: 'B', emoji: '⚽', isCorrect: false },
      { text: 'C', emoji: '🐱', isCorrect: false }
    ],
    explanation: 'Awesome! A is for Apple!'
  },
  {
    id: 2,
    question: 'Which letter comes right after B in the alphabet?',
    spokenPrompt: 'Which letter comes right after B?',
    category: 'alphabet',
    choices: [
      { text: 'A', isCorrect: false },
      { text: 'C', emoji: '🐱', isCorrect: true },
      { text: 'D', isCorrect: false }
    ],
    explanation: 'You got it! A, B, C!'
  },
  {
    id: 3,
    question: 'Which shape has exactly 3 sides and 3 corners?',
    spokenPrompt: 'Which shape has three sides?',
    category: 'shape',
    choices: [
      { text: 'Circle', emoji: '⭕', isCorrect: false },
      { text: 'Triangle', emoji: '🔺', isCorrect: true },
      { text: 'Square', emoji: '🟦', isCorrect: false }
    ],
    explanation: 'Super! A Triangle has 3 sides and 3 corners, like a pizza slice!'
  },
  {
    id: 4,
    question: 'Which shape is completely round with zero straight sides?',
    spokenPrompt: 'Which shape is round?',
    category: 'shape',
    choices: [
      { text: 'Circle', emoji: '⭕', isCorrect: true },
      { text: 'Square', emoji: '🟦', isCorrect: false },
      { text: 'Diamond', emoji: '♦️', isCorrect: false }
    ],
    explanation: 'Great job! A Circle is perfectly round like a coin or clock!'
  },
  {
    id: 5,
    question: 'Which everyday object is shaped like a 3D Sphere?',
    spokenPrompt: 'Which object looks like a sphere?',
    category: 'shape',
    choices: [
      { text: 'Soccer Ball', emoji: '⚽', isCorrect: true },
      { text: 'Cereal Box', emoji: '🥣', isCorrect: false },
      { text: 'Party Hat', emoji: '🎉', isCorrect: false }
    ],
    explanation: 'Brilliant! A soccer ball is a 3D sphere that rolls smoothly!'
  },
  {
    id: 6,
    question: 'Which 3D shape has 6 flat square faces like a game dice?',
    spokenPrompt: 'Which 3D shape looks like a dice?',
    category: 'shape',
    choices: [
      { text: 'Cylinder', emoji: '🥫', isCorrect: false },
      { text: 'Cube', emoji: '🎲', isCorrect: true },
      { text: 'Sphere', emoji: '⚽', isCorrect: false }
    ],
    explanation: 'Awesome! A cube has 6 identical square faces!'
  },
  {
    id: 7,
    question: 'Which letter does Sun start with?',
    spokenPrompt: 'Which letter does Sun start with?',
    category: 'alphabet',
    choices: [
      { text: 'S', emoji: '☀️', isCorrect: true },
      { text: 'T', emoji: '🐯', isCorrect: false },
      { text: 'M', emoji: '🥭', isCorrect: false }
    ],
    explanation: 'Sunny day! S is for Sun!'
  },
  {
    id: 8,
    question: 'What shape looks like an ice cream cone turned upside down?',
    spokenPrompt: 'What shape looks like an ice cream cone?',
    category: 'shape',
    choices: [
      { text: 'Cone', emoji: '🍦', isCorrect: true },
      { text: 'Cylinder', emoji: '🥤', isCorrect: false },
      { text: 'Cuboid', emoji: '🧱', isCorrect: false }
    ],
    explanation: 'Yum! A cone tapers up to a pointed tip!'
  },
  {
    id: 9,
    question: 'Which letter comes right before Z at the end of the alphabet?',
    spokenPrompt: 'Which letter comes right before Z?',
    category: 'alphabet',
    choices: [
      { text: 'X', isCorrect: false },
      { text: 'Y', emoji: '🪀', isCorrect: true },
      { text: 'W', isCorrect: false }
    ],
    explanation: 'Fantastic! X, Y, Z!'
  },
  {
    id: 10,
    question: 'Which shape has 6 sides like a sweet bee honeycomb cell?',
    spokenPrompt: 'Which shape has six sides?',
    category: 'shape',
    choices: [
      { text: 'Pentagon', emoji: '⬟', isCorrect: false },
      { text: 'Hexagon', emoji: '⬡', isCorrect: true },
      { text: 'Triangle', emoji: '🔺', isCorrect: false }
    ],
    explanation: 'Sweet! Hexagons have 6 sides and bees love them!'
  },
  {
    id: 11,
    question: 'Which letter makes the bouncy /b/ sound for Ball and Bunny?',
    spokenPrompt: 'Which letter makes the /b/ sound?',
    category: 'alphabet',
    choices: [
      { text: 'B', emoji: '⚽', isCorrect: true },
      { text: 'D', emoji: '🐶', isCorrect: false },
      { text: 'P', emoji: '🦜', isCorrect: false }
    ],
    explanation: 'Correct! B says /b/ like Ball!'
  },
  {
    id: 12,
    question: 'Which 3D shape has two flat circular circles connected together?',
    spokenPrompt: 'Which shape has two circular ends like a soda can?',
    category: 'shape',
    choices: [
      { text: 'Cone', emoji: '🍦', isCorrect: false },
      { text: 'Cylinder', emoji: '🥤', isCorrect: true },
      { text: 'Pyramid', emoji: '⛺', isCorrect: false }
    ],
    explanation: 'Super! A Cylinder is shaped like a soda can or drum!'
  }
];

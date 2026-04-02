import { CardType, DifficultyLevel } from '../types/game';

const cardIcons = [
  '🎮', '🎯', '🎨', '🎭', '🎪', '🎸', '🎹', '🎺',
  '🏀', '⚽', '🏈', '🎾', '🏐', '🏓', '🏸', '🥊',
  '🚀', '✈️', '🚁', '⛵', '🚂', '🚗', '🏎️', '🚲'
];

export const getDifficultyConfig = (difficulty: DifficultyLevel) => {
  switch (difficulty) {
    case 'easy':
      return { pairs: 6, timeBonus: 100 };
    case 'medium':
      return { pairs: 10, timeBonus: 150 };
    case 'hard':
      return { pairs: 12, timeBonus: 200 };
  }
};

export const generateCards = (difficulty: DifficultyLevel): CardType[] => {
  const { pairs } = getDifficultyConfig(difficulty);
  const selectedIcons = cardIcons.slice(0, pairs);

  const cards = selectedIcons.flatMap((icon, index) => [
    { id: index * 2, icon, isFlipped: false, isMatched: false },
    { id: index * 2 + 1, icon, isFlipped: false, isMatched: false }
  ]);

  return shuffleArray(cards);
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const calculateScore = (moves: number, time: number, difficulty: DifficultyLevel): number => {
  const { timeBonus } = getDifficultyConfig(difficulty);
  const baseScore = 1000;
  const movesPenalty = moves * 5;
  const timePenalty = Math.floor(time / 2);
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;

  return Math.max(0, Math.floor((baseScore - movesPenalty - timePenalty + timeBonus) * difficultyMultiplier));
};

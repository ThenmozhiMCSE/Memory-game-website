export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface CardType {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameStats {
  moves: number;
  score: number;
  time: number;
  difficulty: DifficultyLevel;
}

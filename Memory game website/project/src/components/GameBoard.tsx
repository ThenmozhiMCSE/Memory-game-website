import { useState, useEffect, useCallback } from 'react';
import { Card } from './Card';
import { CardType, DifficultyLevel } from '../types/game';
import { generateCards, calculateScore } from '../utils/gameUtils';

interface GameBoardProps {
  difficulty: DifficultyLevel;
  onGameComplete: (score: number, moves: number, time: number) => void;
}

export const GameBoard = ({ difficulty, onGameComplete }: GameBoardProps) => {
  const [cards, setCards] = useState<CardType[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  useEffect(() => {
    let interval: number | undefined;
    if (isGameActive) {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive]);

  const initializeGame = () => {
    const newCards = generateCards(difficulty);
    setCards(newCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTime(0);
    setMatchedPairs(0);
    setIsGameActive(false);
  };

  const handleCardClick = useCallback((id: number) => {
    if (!isGameActive) {
      setIsGameActive(true);
    }

    if (flippedCards.length === 0) {
      setFlippedCards([id]);
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
    } else if (flippedCards.length === 1) {
      if (flippedCards[0] === id) return;

      setFlippedCards([...flippedCards, id]);
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, isFlipped: true } : card
        )
      );
      setMoves((prev) => prev + 1);

      const firstCard = cards.find((card) => card.id === flippedCards[0]);
      const secondCard = cards.find((card) => card.id === id);

      if (firstCard && secondCard && firstCard.icon === secondCard.icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === flippedCards[0] || card.id === id
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          setMatchedPairs((prev) => prev + 1);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) =>
              card.id === flippedCards[0] || card.id === id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, isGameActive]);

  useEffect(() => {
    const totalPairs = cards.length / 2;
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setIsGameActive(false);
      const finalScore = calculateScore(moves, time, difficulty);
      setScore(finalScore);
      setTimeout(() => {
        onGameComplete(finalScore, moves, time);
      }, 500);
    }
  }, [matchedPairs, cards.length, moves, time, difficulty, onGameComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-3' : difficulty === 'medium' ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="game-board">
      <div className="stats-container mb-4">
        <div className="row text-center g-3">
          <div className="col-4">
            <div className="stat-card p-3 bg-light rounded">
              <div className="stat-label text-muted small">MOVES</div>
              <div className="stat-value h4 mb-0 fw-bold">{moves}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card p-3 bg-light rounded">
              <div className="stat-label text-muted small">TIME</div>
              <div className="stat-value h4 mb-0 fw-bold">{formatTime(time)}</div>
            </div>
          </div>
          <div className="col-4">
            <div className="stat-card p-3 bg-light rounded">
              <div className="stat-label text-muted small">SCORE</div>
              <div className="stat-value h4 mb-0 fw-bold">{score}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={`cards-grid grid ${gridCols} gap-3`}>
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={flippedCards.length >= 2}
          />
        ))}
      </div>
    </div>
  );
};

import { CardType } from '../types/game';

interface CardProps {
  card: CardType;
  onClick: (id: number) => void;
  disabled: boolean;
}

export const Card = ({ card, onClick, disabled }: CardProps) => {
  const handleClick = () => {
    if (!disabled && !card.isFlipped && !card.isMatched) {
      onClick(card.id);
    }
  };

  return (
    <div
      className={`card-container ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
      onClick={handleClick}
      style={{ cursor: disabled || card.isMatched ? 'default' : 'pointer' }}
    >
      <div className="card-inner">
        <div className="card-front">
          <div className="card-content">?</div>
        </div>
        <div className="card-back">
          <div className="card-content">{card.icon}</div>
        </div>
      </div>
    </div>
  );
};

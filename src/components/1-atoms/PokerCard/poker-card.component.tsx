// src/components/1-atoms/PokerCard/poker-card.component.tsx
// src/components/1-atoms/PokerCard/poker-card.component.tsx
import React from 'react';
import './poker-card.component.scss';

// Add new props for interactivity
interface PokerCardProps {
  value: string;
  isSelected: boolean;
  onClick: (value: string) => void;
}

const PokerCard: React.FC<PokerCardProps> = ({ value, isSelected, onClick }) => {
  // Conditionally add the 'selected' class
  const cardClassName = `poker-card ${isSelected ? 'poker-card--selected' : ''}`;

  return (
    <button className={cardClassName} onClick={() => onClick(value)}>
      {value}
    </button>
  );
};

export default PokerCard;
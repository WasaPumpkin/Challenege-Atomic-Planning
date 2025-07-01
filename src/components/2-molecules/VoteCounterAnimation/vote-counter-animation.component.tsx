// src/components/2-molecules/VoteCounterAnimation/vote-counter-animation.component.tsx
// src/components/2-molecules/VoteCounterAnimation/vote-counter-animation.component.tsx
import React from 'react';
import './vote-counter-animation.component.scss';

const VoteCounterAnimation: React.FC = () => {
  return (
    <div 
      className="vote-counter-animation-container"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="dots-container">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <span className="counting-text">Contando Votos...</span>
    </div>
  );
};

// Keeping export default as is
export default VoteCounterAnimation;
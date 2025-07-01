// src/components/1-atoms/Card/card.component.tsx
import React from 'react';
import './card.component.scss';

interface CardProps {
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className="glowing-card">{children}</div>;
};

export default Card;
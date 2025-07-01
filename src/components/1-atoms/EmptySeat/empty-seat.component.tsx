// src/components/1-atoms/EmptySeat/empty-seat.component.tsx
// src/components/1-atoms/EmptySeat/empty-seat.component.tsx
import React from 'react';
import './empty-seat.component.scss';

const EmptySeat: React.FC = () => {
  return <div className="empty-seat" data-testid="empty-seat" />;
};

export default EmptySeat;

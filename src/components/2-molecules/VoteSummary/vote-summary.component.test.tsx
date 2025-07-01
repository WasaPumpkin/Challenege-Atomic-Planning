// src/components/2-molecules/VoteSummary/vote-summary.component.test.tsx
// src/components/2-molecules/VoteSummary/vote-summary.component.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import VoteSummary from './vote-summary.component';
import type { Player } from '../../../store/slices/gameSlice';

describe('VoteSummary Component', () => {
  const mockPlayers: Player[] = [
    { id: '1', name: 'Alice', role: 'player', vote: '5' },
    { id: '2', name: 'Bob', role: 'player', vote: '5' },
    { id: '3', name: 'Charlie', role: 'player', vote: '8' },
    { id: '4', name: 'Dana', role: 'player', vote: '☕️' },
    { id: '5', name: 'Eve', role: 'spectator', vote: undefined },
  ];

  it('renders grouped votes correctly', () => {
    render(<VoteSummary players={mockPlayers} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('☕️')).toBeInTheDocument();
    expect(screen.getByText('2 Votos')).toBeInTheDocument();
    expect(screen.getAllByText('1 Voto')).toHaveLength(2);
  });

  it('calculates average with correct formatting', () => {
    render(<VoteSummary players={mockPlayers} />);
    expect(screen.getByText('Promedio:')).toBeInTheDocument();
    expect(screen.getByText('6,0')).toBeInTheDocument(); // locale-aware
  });

  it('sorts votes with numbers first', () => {
    const mixedPlayers: Player[] = [
      { id: '1', name: 'Alice', role: 'player', vote: '☕️' },
      { id: '2', name: 'Bob', role: 'player', vote: '5' },
      { id: '3', name: 'Charlie', role: 'player', vote: '3' },
    ];

    render(<VoteSummary players={mixedPlayers} />);
    const values = screen.getAllByTestId('vote-value');
    expect(values[0].textContent).toBe('3');
    expect(values[1].textContent).toBe('5');
    expect(values[2].textContent).toBe('☕️');
  });

  it('handles no numeric votes', () => {
    const specialPlayers: Player[] = [
      { id: '1', name: 'Alice', role: 'player', vote: '☕️' },
      { id: '2', name: 'Bob', role: 'player', vote: '?' },
    ];

    render(<VoteSummary players={specialPlayers} />);
    expect(screen.queryByText('Promedio:')).toBeNull();
  });
});

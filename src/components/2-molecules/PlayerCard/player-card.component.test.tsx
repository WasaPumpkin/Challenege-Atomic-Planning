// // // src/components/2-molecules/PlayerCard/player-card.component.tsx
// src/components/2-molecules/PlayerCard/player-card.component.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PlayerCard from './player-card.component';
import type { Player } from '../../../store/slices/gameSlice';

const createMockPlayer = (overrides: Partial<Player> = {}): Player => ({
  id: `player-${Math.random().toString(36).substring(2, 9)}`,
  name: 'Test Player',
  role: 'player',
  vote: '5',
  ...overrides,
});

const createMockStore = (hostId: string | null) => configureStore({
  reducer: {
    game: () => ({
      hostId,
      phase: 'GAME_ROOM',
      gameName: 'Test Game',
      players: [],
      currentUser: null,
      isCounting: false,
      votesRevealed: false,
      cardValues: []
    })
  }
});

describe('PlayerCard Component', () => {
  describe('Basic Rendering', () => {
    it('renders player name', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerCard player={createMockPlayer()} votesRevealed={false} />
        </Provider>
      );
      expect(screen.getByText('Test Player')).toBeInTheDocument();
    });
  });

  describe('Host Identification', () => {
    it('shows crown when player is host', () => {
      const player = createMockPlayer();
      const store = createMockStore(player.id);
      render(
        <Provider store={store}>
          <PlayerCard player={player} votesRevealed={false} />
        </Provider>
      );
      expect(screen.getByText('👑')).toBeInTheDocument();
    });

    it('does not show crown when player is not host', () => {
      const store = createMockStore('other-player');
      render(
        <Provider store={store}>
          <PlayerCard player={createMockPlayer()} votesRevealed={false} />
        </Provider>
      );
      expect(screen.queryByText('👑')).toBeNull();
    });
  });

  describe('Voting States', () => {
    it('shows vote when revealed', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerCard 
            player={createMockPlayer({ vote: '8' })} 
            votesRevealed={true} 
          />
        </Provider>
      );
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('hides vote when not revealed', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerCard 
            player={createMockPlayer({ vote: '8' })} 
            votesRevealed={false} 
          />
        </Provider>
      );
      expect(screen.queryByText('8')).toBeNull();
    });

    it('handles null vote value', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerCard 
            player={createMockPlayer({ vote: null })} 
            votesRevealed={true} 
          />
        </Provider>
      );
      
      // Check against all possible vote values
      const possibleVotes = ['0', '1', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕️'];
      possibleVotes.forEach(vote => {
        expect(screen.queryByText(vote)).toBeNull();
      });
    });
  });

  describe('CSS Classes', () => {
    it('applies voted class when player has voted', () => {
      const store = createMockStore(null);
      const { container } = render(
        <Provider store={store}>
          <PlayerCard 
            player={createMockPlayer({ vote: '5' })} 
            votesRevealed={false} 
          />
        </Provider>
      );
      expect(container.firstChild).toHaveClass('player-card-container--voted');
    });

    it('applies revealed class when votes are revealed', () => {
      const store = createMockStore(null);
      const { container } = render(
        <Provider store={store}>
          <PlayerCard 
            player={createMockPlayer({ vote: '5' })} 
            votesRevealed={true} 
          />
        </Provider>
      );
      expect(container.firstChild).toHaveClass('player-card-container--revealed');
    });
  });
});



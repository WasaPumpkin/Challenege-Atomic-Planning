// src/components/2-molecules/PlayerSeat/player-seat.component.test.tsx
// src/components/2-molecules/PlayerSeat/player-seat.component.test.tsx
import { render, screen, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PlayerSeat from './player-seat.component';
import type { Player } from '../../../store/slices/gameSlice';

afterEach(cleanup);

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

describe('PlayerSeat Component', () => {
  describe('Basic Rendering', () => {
    test('renders player name and avatar', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer()} votesRevealed={false} />
        </Provider>
      );

      expect(screen.getByText('Test Player')).toBeInTheDocument();
      expect(screen.getByText('TE')).toBeInTheDocument();
    });

    test('handles empty player name', () => {
      const store = createMockStore(null);
      const { container } = render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ name: '' })} votesRevealed={false} />
        </Provider>
      );

      const initialsElement = container.querySelector('.player-seat__initials');
      expect(initialsElement?.textContent).toBe('');
    });
  });

  describe('Initials Generation', () => {
    const testCases = [
      { name: 'Alice', expected: 'AL' },
      { name: 'bob smith', expected: 'BO' },
      { name: 'Z', expected: 'Z' },
      { name: '', expected: '' }
    ];

    testCases.forEach(({ name, expected }) => {
      test(`generates "${expected}" for name "${name}"`, () => {
        const store = createMockStore(null);
        render(
          <Provider store={store}>
            <PlayerSeat player={createMockPlayer({ name })} votesRevealed={false} />
          </Provider>
        );

        const initialsElement = screen.getByTestId('player-initials');
        expect(initialsElement.textContent).toBe(expected);
      });
    });
  });

  describe('Host Identification', () => {
    test('shows crown when player is host', () => {
      const player = createMockPlayer();
      const store = createMockStore(player.id);
      render(
        <Provider store={store}>
          <PlayerSeat player={player} votesRevealed={false} />
        </Provider>
      );

      expect(screen.getByText('👑')).toBeInTheDocument();
    });

    test('does not show crown when player is not host', () => {
      const store = createMockStore('other-player-id');
      render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer()} votesRevealed={false} />
        </Provider>
      );

      expect(screen.queryByText('👑')).toBeNull();
    });
  });

  describe('Voting States', () => {
    test('shows vote when revealed', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ vote: '8' })} votesRevealed={true} />
        </Provider>
      );

      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.queryByText('TE')).toBeNull();
    });

    test('shows initials when vote not revealed', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ vote: '8' })} votesRevealed={false} />
        </Provider>
      );

      expect(screen.getByText('TE')).toBeInTheDocument();
      expect(screen.queryByText('8')).toBeNull();
    });

    test('handles null vote value', () => {
      const store = createMockStore(null);
      render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ vote: null })} votesRevealed={true} />
        </Provider>
      );

      expect(screen.getByText('TE')).toBeInTheDocument();
      expect(screen.queryByText(/\d+|☕️/)).toBeNull();
    });
  });

  describe('CSS Classes', () => {
    test('applies voted class when player has voted', () => {
      const store = createMockStore(null);
      const { container } = render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ vote: '5' })} votesRevealed={false} />
        </Provider>
      );

      expect(container.firstChild).toHaveClass('player-seat--voted');
    });

    test('applies revealed class when votes are revealed', () => {
      const store = createMockStore(null);
      const { container } = render(
        <Provider store={store}>
          <PlayerSeat player={createMockPlayer({ vote: '5' })} votesRevealed={true} />
        </Provider>
      );

      expect(container.firstChild).toHaveClass('player-seat--revealed');
    });
  });
});

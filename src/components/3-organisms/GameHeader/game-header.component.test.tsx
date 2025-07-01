// // // src/components/3-organisms/GameHeader/game-header.component.test.tsx
// src/components/3-organisms/GameHeader/game-header.component.test.tsx
// src/components/3-organisms/GameHeader/game-header.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { UnknownAction, Reducer } from 'redux';
import GameHeader from './game-header.component';
import gameReducer from '../../../store/slices/gameSlice';
import type { GameState, Player } from '../../../store/slices/gameSlice';

// Mock child components
jest.mock('../InviteModal/invite-modal.component', () => () => <div>InviteModal</div>);
jest.mock('../HostPrivilegesModal/host-privileges-modal.component', () => () => <div>HostPrivilegesModal</div>);
jest.mock('../RoleChangeModal/role-change-modal.component', () => () => <div>RoleChangeModal</div>);

jest.mock('../../1-atoms/Button/button.component', () => {
  const Button: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick}>{children}</button>
  );
  return Button;
});

describe('GameHeader Component', () => {
  const createStore = (state: GameState) => configureStore({
    reducer: { 
      game: gameReducer as Reducer<GameState, UnknownAction, GameState>
    },
    preloadedState: { game: state }
  });

  const mockPlayer: Player = {
    id: 'user-123',
    name: 'Test User',
    role: 'player',
    vote: null
  };

  const mockState: GameState = {
    gameName: 'Test Game',
    currentUser: mockPlayer,
    hostId: 'user-123',
    players: [],
    phase: 'GAME_ROOM',
    isCounting: false,
    votesRevealed: false,
    cardValues: []
  };

  it('renders game name and user info', () => {
    const store = createStore(mockState);
    render(
      <Provider store={store}>
        <GameHeader />
      </Provider>
    );

    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('TE')).toBeInTheDocument();
    expect(screen.getByText('Invitar jugadores')).toBeInTheDocument();
  });

  it('shows invite modal when invite button is clicked', () => {
    const store = createStore(mockState);
    render(
      <Provider store={store}>
        <GameHeader />
      </Provider>
    );

    fireEvent.click(screen.getByText('Invitar jugadores'));
    expect(screen.getByText('InviteModal')).toBeInTheDocument();
  });

  describe('when current user is host', () => {
    it('opens host privileges modal when avatar is clicked', () => {
      const store = createStore(mockState);
      render(
        <Provider store={store}>
          <GameHeader />
        </Provider>
      );

      fireEvent.click(screen.getByText('TE'));
      expect(screen.getByText('HostPrivilegesModal')).toBeInTheDocument();
    });

    it('shows host tooltip on avatar hover', () => {
      const store = createStore(mockState);
      render(
        <Provider store={store}>
          <GameHeader />
        </Provider>
      );

      const avatarButton = screen.getByText('TE').parentElement;
      expect(avatarButton).toHaveAttribute('title', 'Administrar partida');
    });
  });

  describe('when current user is not host', () => {
    const nonHostState: GameState = {
      ...mockState,
      hostId: 'other-user'
    };

    it('opens role change modal when avatar is clicked', () => {
      const store = createStore(nonHostState);
      render(
        <Provider store={store}>
          <GameHeader />
        </Provider>
      );

      fireEvent.click(screen.getByText('TE'));
      expect(screen.getByText('RoleChangeModal')).toBeInTheDocument();
    });

    it('shows role tooltip on avatar hover', () => {
      const store = createStore(nonHostState);
      render(
        <Provider store={store}>
          <GameHeader />
        </Provider>
      );

      const avatarButton = screen.getByText('TE').parentElement;
      expect(avatarButton).toHaveAttribute('title', 'Tu rol es Jugador. Haz clic para cambiar.');
    });
  });

  it('does not render modals initially', () => {
    const store = createStore(mockState);
    render(
      <Provider store={store}>
        <GameHeader />
      </Provider>
    );

    expect(screen.queryByText('InviteModal')).not.toBeInTheDocument();
    expect(screen.queryByText('HostPrivilegesModal')).not.toBeInTheDocument();
    expect(screen.queryByText('RoleChangeModal')).not.toBeInTheDocument();
  });

  it('handles empty user name - Solution 1: Using DOM query', () => {
    const emptyNameState: GameState = {
      ...mockState,
      currentUser: {
        ...mockPlayer,
        name: ''
      }
    };
    
    const store = createStore(emptyNameState);
    const { container } = render(
      <Provider store={store}>
        <GameHeader />
      </Provider>
    );

    const initialsElement = container.querySelector('.user-avatar');
    expect(initialsElement?.textContent).toBe('');
  });

  it('handles empty user name - Solution 2: Using test ID (requires component modification)', () => {
    // This solution requires adding data-testid="user-avatar" to the component
    const emptyNameState: GameState = {
      ...mockState,
      currentUser: {
        ...mockPlayer,
        name: ''
      }
    };
    
    const store = createStore(emptyNameState);
    render(
      <Provider store={store}>
        <GameHeader />
      </Provider>
    );

    // Only use this if you add data-testid to your component
    // expect(screen.getByTestId('user-avatar').textContent).toBe('');
  });
});
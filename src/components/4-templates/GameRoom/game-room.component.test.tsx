
// src/components/4-templates/GameRoom/game-room.component.test.tsx
// src/components/4-templates/GameRoom/game-room.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import GameRoom from './game-room.component';
import gameReducer, {
  playerVote,
  revealVotes,
  startNewRound,
} from '../../../store/slices/gameSlice';
import type { GameState } from '../../../store/slices/gameSlice';

// Mocks de componentes hijos
jest.mock('../../3-organisms/GameHeader/game-header.component', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-header">MockHeader</div>,
}));
jest.mock(
  '../../2-molecules/VoteCounterAnimation/vote-counter-animation.component',
  () => ({
    __esModule: true,
    default: () => <div data-testid="mock-animation">Vote Animation</div>,
  })
);
jest.mock('../../2-molecules/VoteSummary/vote-summary.component', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-summary">Vote Summary</div>,
}));
jest.mock('../../1-atoms/PokerCard/poker-card.component', () => ({
  __esModule: true,
  default: ({ value, onClick }: { value: string; onClick: () => void }) => (
    <button onClick={onClick}>{value}</button>
  ),
}));

// Función para crear el estado inicial personalizado
const setupStore = (customState: Partial<GameState> = {}) => {
  const defaultState: GameState = {
    phase: 'GAME_ROOM',
    gameName: 'DEVTEAM',
    players: [
      { id: '1', name: 'Antonio', role: 'player', vote: null },
      { id: '2', name: 'Maria', role: 'player', vote: null },
    ],
    currentUser: { id: '1', name: 'Antonio', role: 'player', vote: null },
    hostId: '1',
    isCounting: false,
    votesRevealed: false,
    cardValues: ['1', '3', '5'],
  };

  return configureStore({
    reducer: { game: gameReducer },
    preloadedState: { game: { ...defaultState, ...customState } },
  });
};

const renderWithStore = (store: EnhancedStore) =>
  render(
    <Provider store={store}>
      <GameRoom />
    </Provider>
  );

describe('<GameRoom />', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    store = setupStore();
    jest.spyOn(store, 'dispatch');
  });

  it('renderiza correctamente el encabezado, las cartas y asientos vacíos', () => {
    renderWithStore(store);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByText(/elige una carta/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByTestId('empty-seat')).toHaveLength(6);
  });

  it('despacha una acción cuando se hace clic en una carta', () => {
    renderWithStore(store);
    fireEvent.click(screen.getByText('3'));
    expect(store.dispatch).toHaveBeenCalledWith(
      playerVote({ playerId: '1', voteValue: '3' })
    );
  });

  it('muestra el botón "Revelar Votos" y despacha la acción', () => {
    store = setupStore({
      players: [
        { id: '1', name: 'Antonio', role: 'player', vote: '5' },
        { id: '2', name: 'Maria', role: 'player', vote: null },
      ],
    });
    jest.spyOn(store, 'dispatch');
    renderWithStore(store);
    const button = screen.getByRole('button', { name: /revelar votos/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(store.dispatch).toHaveBeenCalledWith(revealVotes());
  });

  it('renderiza el resumen de votos y despacha nueva ronda al hacer clic', () => {
    store = setupStore({ votesRevealed: true, isCounting: false });
    jest.spyOn(store, 'dispatch');
    renderWithStore(store);
    const newVoteBtn = screen.getByRole('button', { name: /nueva votación/i });
    expect(newVoteBtn).toBeInTheDocument();
    fireEvent.click(newVoteBtn);
    expect(store.dispatch).toHaveBeenCalledWith(startNewRound());
  });

  it('muestra animación de conteo si isCounting es true', () => {
    store = setupStore({ isCounting: true });
    renderWithStore(store);
    expect(screen.getByTestId('mock-animation')).toBeInTheDocument();
  });
});

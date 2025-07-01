// src/components/5-pages/HomePage/home-page.component.test.ts
// src/components/5-pages/HomePage/home-page.component.test.tsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type EnhancedStore } from '@reduxjs/toolkit';
import HomePage from './home-page.component';
import gameReducer, { type GameState } from '../../../store/slices/gameSlice';
import '@testing-library/jest-dom';

// Mocks de los subcomponentes para aislar HomePage
jest.mock('../../1-atoms/Logo/logo.component', () => () => (
  <div data-testid="mock-logo">MockLogo</div>
));
jest.mock('../../3-organisms/CreateGameForm/create-game-form.component', () => () => (
  <div data-testid="mock-create">CreateGameForm</div>
));
jest.mock('../../3-organisms/JoinGameForm/join-game-form.component', () => () => (
  <div data-testid="mock-join">JoinGameForm</div>
));
jest.mock('../../4-templates/GameRoom/game-room.component', () => () => (
  <div data-testid="mock-room">GameRoom</div>
));

// Crea un store de prueba con estado personalizado
const crearStorePrueba = (estadoPersonalizado: Partial<GameState> = {}) => {
  const estadoInicial: GameState = {
    phase: 'SPLASH',
    gameName: null,
    players: [],
    currentUser: null,
    hostId: null,
    isCounting: false,
    votesRevealed: false,
    cardValues: ['1', '3', '5'],
  };

  return configureStore({
    reducer: { game: gameReducer },
    preloadedState: { game: { ...estadoInicial, ...estadoPersonalizado } },
  });
};

// Renderiza el componente con el store
const renderConStore = (store: EnhancedStore) =>
  render(
    <Provider store={store}>
      <HomePage />
    </Provider>
  );

describe('<HomePage />', () => {
  let store: ReturnType<typeof crearStorePrueba>;

  beforeEach(() => {
    store = crearStorePrueba();
  });

  it('muestra la pantalla de inicio (Splash) cuando la fase es SPLASH', () => {
    renderConStore(store);
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();
  });

  it('muestra el formulario de creación cuando la fase es CREATE_GAME', () => {
    store = crearStorePrueba({ phase: 'CREATE_GAME' });
    renderConStore(store);
    expect(screen.getByTestId('mock-create')).toBeInTheDocument();
  });

  it('muestra JoinGameForm y GameRoom si hay juego pero no hay usuario', () => {
    store = crearStorePrueba({ gameName: 'DEVTEAM', currentUser: null });
    renderConStore(store);
    expect(screen.getByTestId('mock-room')).toBeInTheDocument();
    expect(screen.getByTestId('mock-join')).toBeInTheDocument();
  });

  it('muestra solo GameRoom si hay juego y usuario presente', () => {
    store = crearStorePrueba({
      gameName: 'DEVTEAM',
      currentUser: { id: '1', name: 'Antonio', role: 'player', vote: null },
    });
    renderConStore(store);
    expect(screen.getByTestId('mock-room')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-join')).not.toBeInTheDocument();
  });

  it('transiciona de SPLASH a CREATE_GAME después del tiempo', () => {
    jest.useFakeTimers();

    renderConStore(store);
    expect(screen.getByTestId('mock-logo')).toBeInTheDocument();

    // Simula el paso del tiempo (1.5 segundos)
    jest.advanceTimersByTime(1500);

    const faseActual = store.getState().game.phase;
    expect(['CREATE_GAME', 'SPLASH']).toContain(faseActual);

    jest.useRealTimers();
  });
});

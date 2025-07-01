// src/components/3-organisms/JoinGameForm/join-game-form.component.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { type GameState } from '../../../store/slices/gameSlice';
import JoinGameForm from './join-game-form.component';

const mockInitialState: GameState = {
  phase: 'JOIN_GAME',
  gameName: 'DEVTEAM',
  players: [
    {
      id: '1',
      name: 'Maria',
      role: 'player',
      vote: null,
    },
  ],
  currentUser: null,
  hostId: '1',
  isCounting: false,
  votesRevealed: false,
  cardValues: ['0', '1', '3', '5', '8'],
};

const renderWithStore = () => {
  const store = configureStore({
    reducer: { game: gameReducer },
    preloadedState: { game: mockInitialState },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <JoinGameForm />
      </Provider>
    ),
  };
};

describe('<JoinGameForm />', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Equivalente a vi.clearAllMocks()
  });

  it('renderiza el formulario correctamente', () => {
    renderWithStore();
    expect(screen.getByLabelText(/tu nombre/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continuar/i })).toBeDisabled();
  });

  it('muestra error si el nombre es muy corto', () => {
    renderWithStore();
    const input = screen.getByLabelText(/tu nombre/i);
    fireEvent.change(input, { target: { value: 'Ana' } });
    expect(screen.getByText(/entre 5 y 20 caracteres/i)).toBeInTheDocument();
  });

  it('muestra error si el nombre ya existe', () => {
    renderWithStore();
    const input = screen.getByLabelText(/tu nombre/i);
    fireEvent.change(input, { target: { value: 'Maria' } });
    expect(screen.getByText(/ya está en uso/i)).toBeInTheDocument();
  });

  it('habilita el botón si el nombre es válido', () => {
    renderWithStore();
    const input = screen.getByLabelText(/tu nombre/i);
    fireEvent.change(input, { target: { value: 'Antonio12' } });
    expect(screen.getByRole('button', { name: /continuar/i })).toBeEnabled();
  });

  it('despacha joinGame si el nombre es válido al hacer submit', () => {
    const storeSpy = jest.fn();

    const store = configureStore({
      reducer: { game: gameReducer },
      preloadedState: { game: mockInitialState },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }).concat(() => (next) => (action) => {
          storeSpy(action);
          return next(action);
        }),
    });

    render(
      <Provider store={store}>
        <JoinGameForm />
      </Provider>
    );

    const input = screen.getByLabelText(/tu nombre/i);
    fireEvent.change(input, { target: { value: 'Antonio12' } });

    const button = screen.getByRole('button', { name: /continuar/i });
    fireEvent.click(button);

    expect(storeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'game/joinGame',
        payload: { name: 'Antonio12', role: 'player' },
      })
    );
  });
});

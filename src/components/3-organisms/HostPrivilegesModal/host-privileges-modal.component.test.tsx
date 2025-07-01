// src/components/3-organisms/HostPrivilegesModal/host-privileges-modal.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import HostPrivilegesModal from './host-privileges-modal.component';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../../../store/slices/gameSlice';
import type { GameState } from '../../../store/slices/gameSlice';

// Mock onClose with jest
const onCloseMock = jest.fn();

const initialState: GameState = {
  phase: 'GAME_ROOM',
  gameName: 'Test Game',
  players: [
    { id: 'p1', name: 'Alice', role: 'player' },
    { id: 'p2', name: 'Bob', role: 'player' },
  ],
  currentUser: { id: 'p1', name: 'Alice', role: 'player' },
  hostId: 'p1',
  isCounting: false,
  votesRevealed: false,
  cardValues: [
    '0',
    '1',
    '3',
    '5',
    '8',
    '13',
    '20',
    '21',
    '34',
    '40',
    '55',
    '☕️',
  ],
};

const renderWithStore = (
  stateOverrides?: Partial<GameState>,
  onClose = onCloseMock
) => {
  const store = configureStore({
    reducer: { game: gameReducer },
    preloadedState: {
      game: { ...initialState, ...stateOverrides },
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <HostPrivilegesModal onClose={onClose} />
      </Provider>
    ),
    store,
    onClose,
  };
};

describe('<HostPrivilegesModal />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with card inputs and host promotion section (if user is host)', () => {
    renderWithStore();

    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
      /opciones de la sala/i
    );
    expect(screen.getAllByRole('textbox')).toHaveLength(12);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /usar cartas aleatorias/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /guardar cambios/i })
    ).toBeInTheDocument();
  });

  it('does NOT show host select if user is NOT host', () => {
    renderWithStore({ currentUser: { id: 'p2', name: 'Bob', role: 'player' } });
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('allows changing input values', () => {
    renderWithStore();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '42' } });
    expect(inputs[0]).toHaveValue('42');
  });

  it('randomizes card values when clicking "Usar Cartas Aleatorias"', () => {
    renderWithStore();
    const inputsBefore = screen
      .getAllByRole('textbox')
      .map((input) => input.getAttribute('value'));

    fireEvent.click(
      screen.getByRole('button', { name: /usar cartas aleatorias/i })
    );

    const inputsAfter = screen
      .getAllByRole('textbox')
      .map((input) => input.getAttribute('value'));

    expect(inputsAfter).not.toEqual(inputsBefore);
    expect(inputsAfter).toHaveLength(12);
  });

  it('dispatches actions and closes modal on "Guardar Cambios"', () => {
    const { store, onClose } = renderWithStore();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p2' } });
    fireEvent.change(screen.getAllByRole('textbox')[0], {
      target: { value: '99' },
    });

    fireEvent.click(screen.getByRole('button', { name: /guardar cambios/i }));

    const state = store.getState().game;
    expect(state.hostId).toBe('p2');
    expect(state.cardValues[0]).toBe('99');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when clicking × button', () => {
    renderWithStore(undefined, onCloseMock);
    fireEvent.click(screen.getByRole('button', { name: /×/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});

// src/components/3-organisms/InviteModal/invite-modal.component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import InviteModal from './invite-modal.component';
import gameReducer, { type GameState } from '../../../store/slices/gameSlice';

// Usamos jest.fn() en lugar de vi.fn()
const mockInitialState: GameState = {
  phase: 'JOIN_GAME',
  gameName: 'DEVTEAM',
  players: [],
  currentUser: {
    id: 'user-1',
    name: 'Antonio',
    role: 'player',
    vote: null,
  },
  hostId: 'user-1',
  isCounting: false,
  votesRevealed: false,
  cardValues: ['0', '1', '3', '5', '8'],
};

const renderWithStore = (onClose = jest.fn()) => {
  const store = configureStore({
    reducer: { game: gameReducer },
    preloadedState: { game: mockInitialState },
  });

  return {
    ...render(
      <Provider store={store}>
        <InviteModal onClose={onClose} />
      </Provider>
    ),
    onClose,
  };
};

describe('<InviteModal />', () => {
  beforeEach(() => {
    // Mock del portapapeles (clipboard API)
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('muestra el campo de enlace y botón copiar', () => {
    renderWithStore();
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value.startsWith('http')).toBe(true);
    expect(screen.getByRole('button', { name: /copiar/i })).toBeInTheDocument();
  });

  it('cierra el modal al hacer clic en el botón ×', () => {
    const handleClose = jest.fn();
    renderWithStore(handleClose);

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('copia al portapapeles al hacer clic en el botón copiar', async () => {
    renderWithStore();

    const copyButton = screen.getByRole('button', { name: /copiar/i });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('http')
    );
  });
});

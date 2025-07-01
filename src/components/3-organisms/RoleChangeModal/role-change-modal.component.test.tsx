// // src/components/3-organisms/RoleChangeModal/role-change-modal.component.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
// --- FIX: Import the reducer and types, but NOT initialState ---
import gameReducer, {
  type GameState,
  type Player,
} from '../../../store/slices/gameSlice';
import RoleChangeModal from './role-change-modal.component';

// --- Simular solo el hook useAppDispatch ---
const mockDispatch = jest.fn();
jest.mock('../../../hooks/redux-hooks', () => ({
  ...jest.requireActual('../../../hooks/redux-hooks'),
  useAppDispatch: () => mockDispatch,
}));

// --- FIX: Get the initial state directly from the reducer ---
// This works without needing to export `initialState` from the slice.
const gameInitialState = gameReducer(undefined, { type: '@@INIT' });

// --- La función de renderizado corregida y robusta ---
const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState }: { preloadedState?: { game: Partial<GameState> } } = {}
) => {
  // Fusionamos el estado parcial con el estado inicial completo
  const finalPreloadedState = preloadedState
    ? {
        game: { ...gameInitialState, ...preloadedState.game },
      }
    : undefined;

  const store = configureStore({
    reducer: { game: gameReducer },
    preloadedState: finalPreloadedState,
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

// --- Datos de prueba reutilizables ---
const mockPlayer: Player = { id: 'player-1', name: 'Andrey', role: 'player' };
const mockSpectator: Player = {
  id: 'spectator-2',
  name: 'Carla',
  role: 'spectator',
};

describe('Componente RoleChangeModal', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  describe('Renderizado de Texto', () => {
    it('debería mostrar el texto correcto cuando el rol actual es "Jugador"', () => {
      const mockOnClose = jest.fn();
      renderWithProviders(<RoleChangeModal onClose={mockOnClose} />, {
        preloadedState: { game: { currentUser: mockPlayer } },
      });

      expect(screen.getByText(/Tu rol actual es/)).toHaveTextContent('Jugador');
      expect(screen.getByText(/quieres cambiar tu rol a/)).toHaveTextContent(
        'Espectador'
      );
    });

    it('debería mostrar el texto correcto cuando el rol actual es "Espectador"', () => {
      const mockOnClose = jest.fn();
      renderWithProviders(<RoleChangeModal onClose={mockOnClose} />, {
        preloadedState: { game: { currentUser: mockSpectator } },
      });

      expect(screen.getByText(/Tu rol actual es/)).toHaveTextContent(
        'Espectador'
      );
      expect(screen.getByText(/quieres cambiar tu rol a/)).toHaveTextContent(
        'Jugador'
      );
    });

    it('no debería renderizar nada si no hay un usuario actual', () => {
      const mockOnClose = jest.fn();
      const { container } = renderWithProviders(
        <RoleChangeModal onClose={mockOnClose} />,
        {
          preloadedState: { game: { currentUser: null } },
        }
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Interacciones del Usuario', () => {
    it('debería llamar a onClose cuando se hace clic en el botón "Cancelar"', () => {
      const mockOnClose = jest.fn();
      renderWithProviders(<RoleChangeModal onClose={mockOnClose} />, {
        preloadedState: { game: { currentUser: mockPlayer } },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('debería despachar la acción togglePlayerRole y llamar a onClose al hacer clic en "Confirmar Cambio"', () => {
      const mockOnClose = jest.fn();
      renderWithProviders(<RoleChangeModal onClose={mockOnClose} />, {
        preloadedState: { game: { currentUser: mockPlayer } },
      });

      fireEvent.click(screen.getByRole('button', { name: 'Confirmar Cambio' }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      const dispatchedAction = mockDispatch.mock.calls[0][0];
      expect(dispatchedAction.type).toBe('game/togglePlayerRole');
      expect(dispatchedAction.payload).toBe(mockPlayer.id);
    });
  });
});
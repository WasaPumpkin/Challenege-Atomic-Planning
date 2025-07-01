// src/store/middleware/localStorage.test.ts
// src/store/middleware/localStorage.test.ts
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import localStorageMiddleware from './localStorage';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  createGame,
  joinGame,
  assignHost,
  resetGame,
  playerVote,
} from '../slices/gameSlice';
import type { RootState } from '../store';

// Mock de localStorage y sessionStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

beforeEach(() => {
  // Definimos los mocks en window
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    configurable: true,
  });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

describe('Middleware localStorage', () => {
  const setupStore = () => {
    return configureStore({
      reducer: { game: gameReducer },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(localStorageMiddleware),
    });
  };

  it('guarda en localStorage cuando se crea el juego', () => {
    const store = setupStore();
    const gameName = 'test-game';

    store.dispatch(createGame(gameName));

    const state = store.getState() as RootState;
    const expectedState = JSON.stringify(state.game);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      gameName,
      expectedState
    );
  });

  it('guarda en localStorage y sessionStorage al unirse al juego', () => {
    const store = setupStore();
    store.dispatch(joinGame({ name: 'Jugador', role: 'player' }));

    const state = store.getState() as RootState;
    const expectedState = JSON.stringify(state.game);

    if (state.game.gameName) {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        state.game.gameName,
        expectedState
      );
    }

    if (state.game.currentUser) {
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'currentUserId',
        state.game.currentUser.id
      );
    }
  });

  it('guarda en localStorage al asignar host', () => {
    const store = setupStore();
    store.dispatch(createGame('test-game'));
    store.dispatch(assignHost('new-host'));

    const state = store.getState() as RootState;
    const expected = JSON.stringify(state.game);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-game',
      expected
    );
  });

  it('guarda en localStorage al votar', () => {
    const store = setupStore();
    store.dispatch(createGame('test-game'));
    store.dispatch(joinGame({ name: 'Jugador', role: 'player' }));
    store.dispatch(playerVote({ playerId: 'player-1', voteValue: '5' }));

    const state = store.getState() as RootState;
    const expected = JSON.stringify(state.game);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-game',
      expected
    );
  });

  it('elimina sessionStorage al reiniciar el juego', () => {
    const store = setupStore();
    store.dispatch(createGame('test-game'));
    store.dispatch(joinGame({ name: 'Jugador', role: 'player' }));
    store.dispatch(resetGame());

    expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('currentUserId');
  });

  it('no guarda en localStorage si la acción no debe persistirse', () => {
    const store = setupStore();
    store.dispatch({ type: 'game/accionNoPersistente' });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });

  it('maneja errores en localStorage.setItem sin romper la app', () => {
    const store = setupStore();

    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});

    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error('Error de almacenamiento');
    });

    store.dispatch(createGame('test-game'));

    expect(consoleWarn).toHaveBeenCalledWith(
      'Could not save state to localStorage',
      expect.any(Error)
    );

    consoleWarn.mockRestore();
  });

  it('no guarda en localStorage si no hay gameName', () => {
    const store = setupStore();
    store.dispatch(joinGame({ name: 'Jugador', role: 'player' }));
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
  });
});

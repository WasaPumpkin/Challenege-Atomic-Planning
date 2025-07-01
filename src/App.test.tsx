// src/App.test.tsx
// src/App.test.tsx
// src/App.test.tsx
import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './store/slices/gameSlice';
import type { GameState, Player } from './store/slices/gameSlice';

import { useAppDispatch, useAppSelector } from './hooks/redux-hooks';

// Mock HomePage component
jest.mock('./components/5-pages/HomePage/home-page.component', () => ({
  __esModule: true,
  default: () => <div>HomePage</div>,
}));

// Mock redux hooks
jest.mock('./hooks/redux-hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

describe('App Component', () => {
  let mockDispatch: jest.Mock;
  let store: ReturnType<typeof configureStore>;
  let mockGameState: GameState;
  let mockPlayer: Player;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        game: gameReducer,
      },
    });

    mockPlayer = {
      id: 'player-1',
      name: 'Test Player',
      role: 'player',
      vote: null,
    };

    mockGameState = {
      phase: 'SPLASH',
      gameName: 'test-game',
      players: [mockPlayer],
      currentUser: mockPlayer,
      hostId: 'player-1',
      isCounting: false,
      votesRevealed: false,
      cardValues: ['0', '1', '3', '5', '8', '13', '21', '34', '55', '89', '?', '☕️'],
    };

    mockDispatch = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ game: mockGameState })
    );

    // Mock window event listeners
    jest.spyOn(window, 'addEventListener');
    jest.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the HomePage component', () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  it('sets up and cleans up storage event listener', () => {
    const { unmount } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(window.addEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('storage', expect.any(Function));
  });

  describe('storage event handling', () => {
    it('dispatches syncState when storage event matches gameName', () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const storageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
        (call) => call[0] === 'storage'
      )?.[1] as (event: StorageEvent) => void;

      const updatedState: GameState = {
        ...mockGameState,
        phase: 'GAME_ROOM',
        players: [...mockGameState.players, {
          id: 'player-2',
          name: 'New Player',
          role: 'player',
          vote: null,
        }],
      };

      const mockEvent = {
        key: 'test-game',
        newValue: JSON.stringify(updatedState),
        storageArea: localStorage,
      } as StorageEvent;

      storageHandler(mockEvent);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'game/syncState',
        payload: updatedState,
      });
    });

    it('ignores storage events for other games', () => {
      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const storageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
        (call) => call[0] === 'storage'
      )?.[1] as (event: StorageEvent) => void;

      const mockEvent = {
        key: 'other-game',
        newValue: JSON.stringify(mockGameState),
        storageArea: localStorage,
      } as StorageEvent;

      storageHandler(mockEvent);

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('logs error when storage event contains invalid JSON', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <Provider store={store}>
          <App />
        </Provider>
      );

      const storageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
        (call) => call[0] === 'storage'
      )?.[1] as (event: StorageEvent) => void;

      const mockEvent = {
        key: 'test-game',
        newValue: '{invalid-json}',
        storageArea: localStorage,
      } as StorageEvent;

      storageHandler(mockEvent);

      expect(consoleError).toHaveBeenCalledWith(
        'Failed to parse state from storage event',
        expect.any(Error)
      );

      consoleError.mockRestore();
    });
  });
});

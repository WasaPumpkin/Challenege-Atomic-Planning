// src/store/store.test.ts
// src/store/store.test.ts
import type { GameState } from './slices/gameSlice';


describe('Redux Store', () => {
  const mockGameName = 'TESTGAME';
  const mockUserId = 'user-123';
  const mockGameState: GameState = {
    phase: 'GAME_ROOM',
    gameName: mockGameName,
    players: [
      { id: mockUserId, name: 'Test User', role: 'player', vote: null },
    ],
    currentUser: null,
    hostId: mockUserId,
    isCounting: false,
    votesRevealed: false,
    cardValues: ['1', '2', '3'],
  };

  beforeEach(() => {
    // Clear all modules from the require cache
    jest.resetModules();

    // Mock localStorage
    const localStorageMock = {
      getItem: jest.fn((key: string) =>
        key === mockGameName ? JSON.stringify(mockGameState) : null
      ),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: jest.fn((key: string) =>
        key === 'currentUserId' ? mockUserId : null
      ),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0,
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
    
    // Use history.pushState to change the URL
    window.history.pushState({}, '', '/' + mockGameName);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('should load preloadedState from localStorage and sessionStorage', async () => {
    // Import the store AFTER setting up mocks
    const { store } = await import('./store');

    const state = store.getState();
    expect(state.game.gameName).toBe(mockGameName);
    expect(state.game.currentUser?.id).toBe(mockUserId);
    expect(state.game.players).toHaveLength(1);
  });
});
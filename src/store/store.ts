// src/store/store.ts
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import localStorageMiddleware from './middleware/localStorage';
import type { Middleware } from '@reduxjs/toolkit';
import type { GameState } from './slices/gameSlice';

const loadState = (): GameState | undefined => {
  try {
    const gameName = window.location.pathname.substring(1).trim();
    if (!gameName) return undefined;

    const serializedGameState = localStorage.getItem(gameName);
    if (!serializedGameState) return undefined;

    const gameState = JSON.parse(serializedGameState) as GameState;

    // IMPORTANT: We find our own identity based on sessionStorage,
    // but we let HomePage decide which phase is correct.
    const currentUserId = sessionStorage.getItem('currentUserId');
    if (currentUserId) {
      const user = gameState.players.find(p => p.id === currentUserId);
      gameState.currentUser = user || null;
    } else {
      gameState.currentUser = null;
    }
    
    return gameState;

  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: { 
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(localStorageMiddleware as Middleware),
  
  preloadedState: preloadedState ? { game: preloadedState } : undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
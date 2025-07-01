// src/store/middleware/localStorage.ts
// src/store/middleware/localStorage.ts
import { isAction, type Middleware } from '@reduxjs/toolkit';
import type { RootState } from '../store';

const localStorageMiddleware: Middleware = store => next => action => {
  const result = next(action);

  const actionsToPersist = [
    'game/createGame',
    'game/joinGame',
    'game/assignHost',
    'game/resetGame',
    'game/playerVote',
    'game/togglePlayerRole',
  ];

  if (isAction(action)) {
    if (actionsToPersist.includes(action.type)) {
      const state: RootState = store.getState();
      
      // --- LOGIC TO SAVE TO localStorage (SHARED STATE) ---
      try {
        const serializedState = JSON.stringify(state.game);
        if (state.game.gameName) {
          localStorage.setItem(state.game.gameName, serializedState);
        }
      } catch (e) {
        console.warn('Could not save state to localStorage', e);
      }

      // --- NEW LOGIC TO SAVE TO sessionStorage (TAB-SPECIFIC STATE) ---
      if (action.type === 'game/joinGame' && state.game.currentUser) {
        // When a user joins, save THEIR ID to their tab's session storage.
        sessionStorage.setItem('currentUserId', state.game.currentUser.id);
      }
      
      if (action.type === 'game/resetGame') {
        // If the game is reset, clear the session ID.
        sessionStorage.removeItem('currentUserId');
      }
    }
  }

  return result;
};

export default localStorageMiddleware;
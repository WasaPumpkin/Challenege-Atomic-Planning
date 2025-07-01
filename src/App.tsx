// src/App.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/redux-hooks';
import { syncState } from './store/slices/gameSlice';
import type { GameState } from './store/slices/gameSlice';
import HomePage from './components/5-pages/HomePage/home-page.component';

function App() {
  const dispatch = useAppDispatch();

  const gameName = useAppSelector((state) => state.game.gameName);

  useEffect(() => { 
    const handleStorageChange = (event: StorageEvent) => {
   
      if (gameName && event.key === gameName && event.newValue) {
        console.log(`Syncing state for game: ${gameName}`);
        
        try {
          const newState: GameState = JSON.parse(event.newValue);     
          dispatch(syncState(newState));
        } catch (error) {
          console.error("Failed to parse state from storage event", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  
  }, [dispatch, gameName]);

  return <HomePage />;
}

export default App;